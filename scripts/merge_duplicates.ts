import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log("Starting safe duplicate cleanup process...");

  // Fetch all products
  const products = await prisma.product.findMany({
    include: {
      variations: true,
      comboProducts: true,
      cartItems: true,
      orderItems: true
    },
    orderBy: { createdAt: 'asc' }
  });

  // Fetch all journeys
  const journeys = await prisma.journey.findMany();

  const nameToDbProducts = new Map<string, any[]>();
  products.forEach(p => {
    const normName = p.name.trim().toLowerCase();
    if (!nameToDbProducts.has(normName)) nameToDbProducts.set(normName, []);
    nameToDbProducts.get(normName)!.push(p);
  });

  let duplicateGroups = 0;
  let fixedPairs = 0;

  for (const [name, prods] of nameToDbProducts.entries()) {
    if (prods.length <= 1) continue;
    duplicateGroups++;

    // The oldest product with a UUID is usually the Original
    // The semantic ID product is the Duplicate
    let original = prods.find(p => p.id.includes('-') && p.id.length === 36); 
    if (!original) original = prods[0]; // fallback
    
    const duplicates = prods.filter(p => p.id !== original.id);

    console.log(`\n--- Merging ${duplicates.length} duplicate(s) into Original: ${original.name} (${original.id}) ---`);

    for (const dup of duplicates) {
      console.log(`Processing Duplicate: ${dup.id}`);

      // 1. Move ComboProducts
      for (const cp of dup.comboProducts) {
        // Check if original already has it in this combo to avoid unique constraint errors if any
        const existing = await prisma.comboProduct.findFirst({
          where: { comboId: cp.comboId, productId: original.id }
        });
        if (existing) {
          console.log(`  ComboProduct in combo ${cp.comboId} already exists for original. Deleting duplicate's relation.`);
          await prisma.comboProduct.delete({ where: { id: cp.id } });
        } else {
          console.log(`  Moving ComboProduct ${cp.id} to original.`);
          await prisma.comboProduct.update({
            where: { id: cp.id },
            data: { productId: original.id }
          });
        }
      }

      // 2. Move CartItems
      for (const ci of dup.cartItems) {
        const existing = await prisma.cartItem.findFirst({
          where: { userId: ci.userId, productId: original.id }
        });
        if (existing) {
          console.log(`  CartItem for user ${ci.userId} already exists. Deleting duplicate's relation.`);
          await prisma.cartItem.delete({ where: { id: ci.id } });
        } else {
          console.log(`  Moving CartItem ${ci.id} to original.`);
          try {
            await prisma.cartItem.update({
              where: { id: ci.id },
              data: { productId: original.id }
            });
          } catch (e) {
            console.error(`  Warning: Could not move CartItem, likely unique constraint issue. Deleting.`, e.message);
            await prisma.cartItem.delete({ where: { id: ci.id } });
          }
        }
      }

      // 3. Move OrderItems
      for (const oi of dup.orderItems) {
        console.log(`  Moving OrderItem ${oi.id} to original.`);
        await prisma.orderItem.update({
          where: { id: oi.id },
          data: { productId: original.id }
        });
      }

      // 4. Update WaitlistItems (if any attached to product ID)
      const waitlistItems = await prisma.waitlistItem.findMany({ where: { productId: dup.id } });
      for (const wi of waitlistItems) {
         try {
           await prisma.waitlistItem.update({
             where: { id: wi.id },
             data: { productId: original.id }
           });
         } catch(e) {
           console.error(`  Warning: WaitlistItem unique constraint issue.`);
           await prisma.waitlistItem.delete({ where: { id: wi.id } });
         }
      }

      // 5. Update ALL Journeys Content JSON
      for (const j of journeys) {
        let contentModified = false;
        const currentContent = j.content as any;
        if (!currentContent) continue;

        const clientTypes = ['soul-luxury', 'energy-curious'];
        for (const type of clientTypes) {
          if (Array.isArray(currentContent[type])) {
            const arr = currentContent[type];
            for (let i = 0; i < arr.length; i++) {
              if (arr[i].id === dup.id) {
                console.log(`  Fixing Journey '${j.name}' (${type}) - replacing ID ${dup.id} -> ${original.id}`);
                arr[i].id = original.id;
                contentModified = true;
              }
            }
          }
        }
        
        let settingsModified = false;
        let pSettings = j.productSettings as any;
        if (pSettings && pSettings[dup.id]) {
           pSettings[original.id] = pSettings[dup.id];
           delete pSettings[dup.id];
           settingsModified = true;
           console.log(`  Fixing Journey '${j.name}' productSettings ID ${dup.id} -> ${original.id}`);
        }

        if (contentModified || settingsModified) {
          await prisma.journey.update({
            where: { id: j.id },
            data: { 
              content: contentModified ? currentContent : undefined,
              productSettings: settingsModified ? pSettings : undefined
            }
          });
        }
      }

      // 6. Delete Duplicate Product!
      console.log(`  🗑️ DELETING Duplicate Product ${dup.id}`);
      await prisma.product.delete({ where: { id: dup.id } });
      fixedPairs++;
    }
  }

  console.log(`\n🎉 Process Complete! Cleaned up ${fixedPairs} duplicate products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

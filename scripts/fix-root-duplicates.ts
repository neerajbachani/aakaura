/**
 * fix-root-duplicates.ts
 *
 * The root/grounding chakra products exist twice in the products table:
 * - Old UUID rows (e.g. "3a3225ba-...") — likely linked to combos, but have stale images
 * - New slug-ID rows (e.g. "root-wall-hanging-sl") — current journey content IDs, correct images
 *
 * This script:
 * 1. Finds all duplicates (same name, different IDs)
 * 2. For each pair, determines which ID the combo uses (the "canonical" one)
 * 3. Updates the stale row's images to match the journey content images
 * 4. Optionally re-points ComboProduct rows from the old ID to the journey-content ID
 *
 * Run: npx tsx scripts/fix-root-duplicates.ts
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function parsePrice(priceStr: any): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.toString().replace(/[₹,\s]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

async function main() {
  console.log("🔍 Inspecting all journeys for duplicate products in DB...\n");

  const journeys = await (prisma as any).journey.findMany();

  // Collect all journey products (id + images)
  const journeyProductMap = new Map<string, any>(); // id → journey product
  for (const journey of journeys) {
    const content = journey.content as any;
    for (const ct of ["soul-luxury", "energy-curious"]) {
      for (const p of content[ct] || []) {
        if (p.id) journeyProductMap.set(p.id, { ...p, _journeyName: journey.name, _ct: ct });
      }
    }
  }

  console.log(`Total journey products with IDs: ${journeyProductMap.size}\n`);

  // Find name-based duplicates in the products table
  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, images: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by name
  const byName = new Map<string, typeof allProducts>();
  for (const p of allProducts) {
    const key = p.name.toLowerCase().trim();
    if (!byName.has(key)) byName.set(key, []);
    byName.get(key)!.push(p);
  }

  const duplicateGroups = [...byName.values()].filter((g) => g.length > 1);
  console.log(`Found ${duplicateGroups.length} product name(s) with duplicates in DB:\n`);

  let fixed = 0;
  let alreadyOk = 0;

  for (const group of duplicateGroups) {
    console.log(`📦 "${group[0].name}" has ${group.length} rows:`);
    group.forEach((p) =>
      console.log(`   id=${p.id}, images=${p.images.length} images`)
    );

    // Find which IDs exist in journey content
    const journeyRow = group.find((p) => journeyProductMap.has(p.id));
    const nonJourneyRows = group.filter((p) => !journeyProductMap.has(p.id));

    if (!journeyRow) {
      console.log(`   ⚠️  None of these IDs found in journey content — skipping\n`);
      continue;
    }

    const journeyImages: string[] = (journeyProductMap.get(journeyRow.id)?.images || []).filter(
      (img: any) => typeof img === "string" && img.trim() !== ""
    );

    // For each non-journey (UUID) row, check if combos reference it
    for (const oldRow of nonJourneyRows) {
      const combosUsingOld = await (prisma as any).comboProduct.findMany({
        where: { productId: oldRow.id },
        include: { combo: { select: { name: true } } },
      });

      if (combosUsingOld.length > 0) {
        console.log(
          `   🔗 Old UUID row (${oldRow.id}) is used by ${combosUsingOld.length} combo(s):`,
          combosUsingOld.map((cp: any) => cp.combo.name).join(", ")
        );
        // Update the old row's images to match journey content
        const imagesMatch =
          JSON.stringify(oldRow.images) === JSON.stringify(journeyImages);
        if (!imagesMatch && journeyImages.length > 0) {
          await prisma.product.update({
            where: { id: oldRow.id },
            data: { images: journeyImages },
          });
          console.log(
            `   ✅ Updated old UUID row images (${oldRow.images.length} → ${journeyImages.length} images)`
          );
          fixed++;
        } else {
          console.log(`   ✅ Old UUID row images already match — no update needed`);
          alreadyOk++;
        }
      } else {
        console.log(
          `   ℹ️  Old UUID row (${oldRow.id}) is NOT used by any combo, just a stale duplicate`
        );
        // Safe to delete since no combo or cart items reference it?
        const cartItems = await prisma.cartItem.findMany({
          where: { productId: oldRow.id },
        });
        const orderItems = await prisma.orderItem.findMany({
          where: { productId: oldRow.id },
        });
        if (cartItems.length === 0 && orderItems.length === 0) {
          await prisma.product.delete({ where: { id: oldRow.id } });
          console.log(`   🗑️  Deleted stale duplicate (not referenced by any combo/cart/order)`);
          fixed++;
        } else {
          console.log(
            `   ⚠️  Stale duplicate has ${cartItems.length} cart items, ${orderItems.length} order items — not deleting`
          );
        }
      }
    }
    console.log("");
  }

  if (duplicateGroups.length === 0) {
    console.log("✅ No duplicates found!");
  }

  console.log("─────────────────────────────────────");
  console.log(`✅ Fixed/cleaned : ${fixed}`);
  console.log(`ℹ️  Already OK   : ${alreadyOk}`);
  console.log("─────────────────────────────────────");
  console.log("\n🎉 Done! Run the sync script again to confirm everything is in order.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Starting Image and Description Sync from Journey Content to Products Table...");

  const journeys = await prisma.journey.findMany();
  let updatedCount = 0;

  for (const j of journeys) {
    const content = j.content as any;
    if (!content) continue;
    
    const allJourneyProducts = [
      ...(content['soul-luxury'] || []),
      ...(content['energy-curious'] || [])
    ];

    for (const jp of allJourneyProducts) {
      if (!jp.id) continue;
      
      // Since we just merged duplicate products into their original UUIDs, 
      // the `jp.id` here is NOW the correct original UUID in the Product table.
      
      const dbProd = await prisma.product.findUnique({ where: { id: jp.id } });
      
      if (dbProd) {
        let needsUpdate = false;
        const updateData: any = {};

        // 1. Sync Images
        const jpImages = JSON.stringify(jp.images || []);
        const dbImages = JSON.stringify(dbProd.images || []);
        
        if (jpImages !== dbImages && jp.images && jp.images.length > 0) {
          updateData.images = jp.images;
          needsUpdate = true;
          console.log(`[Images] Syncing ${jp.name} - Found ${jp.images.length} real images.`);
        }

        // 2. Sync Descriptions (Just in case they were updated in Journey and not synced)
        if (jp.description && jp.description !== dbProd.description) {
           updateData.description = jp.description;
           needsUpdate = true;
           console.log(`[Description] Syncing ${jp.name}`);
        }

        // Execute Update
        if (needsUpdate) {
            await prisma.product.update({
                where: { id: jp.id },
                data: updateData
            });
            updatedCount++;
        }
      } else {
         console.log(`Warning: Product ID ${jp.id} (${jp.name}) not found in Product table!`);
      }
    }
  }

  console.log(`\n🎉 Image Sync Complete! Successfully updated ${updatedCount} products.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
const prisma = new PrismaClient()

async function main() {
  const log: string[] = ["Analyzing current Products vs Journey Content images..."];

  const journeys = await prisma.journey.findMany();
  const dbProducts = await prisma.product.findMany();

  for (const j of journeys) {
    const content = j.content as any;
    if (!content) continue;
    
    const allJourneyProducts = [
      ...(content['soul-luxury'] || []),
      ...(content['energy-curious'] || [])
    ];

    for (const jp of allJourneyProducts) {
      if (!jp.id) continue;
      
      const dbProd = dbProducts.find(p => p.id === jp.id);
      
      if (dbProd) {
        // Compare images
        const jpImages = JSON.stringify(jp.images || []);
        const dbImages = JSON.stringify(dbProd.images || []);
        
        if (jpImages !== dbImages) {
          log.push(`Mismatch for ${jp.name} (ID: ${jp.id})`);
          log.push(`  Journey Images: ${jpImages}`);
          log.push(`  Product Table Images: ${dbImages}`);
        }
      } else {
         // Product doesn't exist in DB anymore? (Wait, we merged them, so JP ID is now the UUID, and dbProd should be found)
         log.push(`Warning: Journey Product ${jp.name} (ID: ${jp.id}) not found in DB at all!`);
      }
    }
  }
  
  fs.writeFileSync('image_comparison.txt', log.join('\n'));
}

main().catch(console.error).finally(() => prisma.$disconnect());

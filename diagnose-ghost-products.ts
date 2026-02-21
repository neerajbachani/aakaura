
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const searchTerms = ['test throat', 'neck warmer'];
  
  console.log("--- 1. Search in Product Table ---");
  const dbProducts = await prisma.product.findMany({
    where: {
      OR: searchTerms.map(term => ({
        name: { contains: term, mode: 'insensitive' }
      }))
    }
  });
  
  if (dbProducts.length === 0) {
    console.log("No matching products found in the Product table.");
  } else {
    dbProducts.forEach(p => console.log(`Found in DB: "${p.name}" (ID: ${p.id})`));
  }

  console.log("\n--- 2. Search in Journey Content ---");
  const journeys = await prisma.journey.findMany();
  
  journeys.forEach(j => {
    const content = j.content as any;
    if (!content) return;

    ['soul-luxury', 'energy-curious'].forEach(type => {
      const items = content[type] || [];
      items.forEach((item: any) => {
        const itemName = item.name || '';
        const match = searchTerms.some(term => itemName.toLowerCase().includes(term));
        
        if (match) {
          console.log(`Found in Journey "${j.name}" (${type}):`);
          console.log(`  Name: "${item.name}"`);
          console.log(`  Description: "${item.description}"`);
          console.log(`  Images: ${JSON.stringify(item.images)}`);
          console.log('---');
        }
      });
    });
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

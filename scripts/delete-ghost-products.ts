import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Fetching all journeys and products...');
  
  const journeys = await prisma.journey.findMany();
  const allProducts = await prisma.product.findMany({ select: { id: true, name: true, category: { select: { name: true } } }});
  
  // Collect all valid product IDs from all journeys
  const validProductIds = new Set<string>();
  
  for (const journey of journeys) {
     const content: any = journey.content;
     const clientTypes = ['soul-luxury', 'energy-curious'];
     
     for (const clientType of clientTypes) {
         if (!content[clientType]) continue;
         for (const product of content[clientType]) {
             if (product.id) {
                 validProductIds.add(product.id);
             }
         }
     }
  }

  console.log(`Found ${validProductIds.size} valid products in Journey DB.`);
  console.log(`Found ${allProducts.length} total products in Product DB.`);
  
  // Find products that exist in Product DB but NOT in Journey DB
  const ghostProducts = allProducts.filter(p => !validProductIds.has(p.id));
  
  console.log(`Found ${ghostProducts.length} ghost products to delete:`);
  ghostProducts.forEach(p => console.log(`- ${p.name} (Category: ${p.category?.name})`));
  
  if (ghostProducts.length > 0) {
      console.log('Deleting ghost products...');
      const ghostIds = ghostProducts.map(p => p.id);
      const result = await prisma.product.deleteMany({
          where: { id: { in: ghostIds } }
      });
      console.log(`✅ Deleted ${result.count} ghost products from the database!`);
  } else {
      console.log('No ghost products found. Database is clean!');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

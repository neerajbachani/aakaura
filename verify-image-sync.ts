
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const journeys = await prisma.journey.findMany();
  const dbProducts = await prisma.product.findMany();

  console.log(`Found ${journeys.length} journeys and ${dbProducts.length} DB products.`);

  const updates: any[] = [];

  for (const journey of journeys) {
    const content = journey.content as any;
    if (!content) continue;

    const allJourneyProducts = [
      ...(content['soul-luxury'] || []),
      ...(content['energy-curious'] || [])
    ];

    for (const jProduct of allJourneyProducts) {
      if (!jProduct.images || jProduct.images.length === 0) continue;

      // Check if this journey product has Cloudinary images
      const hasCloudinary = jProduct.images.some((img: string) => img.startsWith('http'));
      if (!hasCloudinary) continue;

      // Find matching DB product by Name
      const matchingDbProduct = dbProducts.find(p => 
        p.name.toLowerCase().trim() === jProduct.name.toLowerCase().trim()
      );

      if (matchingDbProduct) {
        // Check if DB product has local images
        const hasLocal = matchingDbProduct.images.some(img => !img.startsWith('http'));
        
        if (hasLocal) {
          updates.push({
            name: matchingDbProduct.name,
            dbId: matchingDbProduct.id,
            currentImages: matchingDbProduct.images,
            newImages: jProduct.images
          });
        }
      }
    }
  }

  if (updates.length === 0) {
    console.log("No partial matches found where Journey has Cloudinary URL and DB has local URL.");
  } else {
    console.log(`Found ${updates.length} products that can be updated:`);
    updates.forEach(u => {
      console.log(`\nProduct: ${u.name}`);
      console.log(`  Current (DB): ${JSON.stringify(u.currentImages)}`);
      console.log(`  New (Journey): ${JSON.stringify(u.newImages)}`);
    });
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

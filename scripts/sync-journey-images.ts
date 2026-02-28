
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const journeys = await prisma.journey.findMany();
  const dbProducts = await prisma.product.findMany();

  console.log(`Scanning ${journeys.length} journeys for image updates...`);

  let updateCount = 0;

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
          console.log(`Updating ${matchingDbProduct.name}...`);
          console.log(`  Old: ${matchingDbProduct.images[0]}`);
          console.log(`  New: ${jProduct.images[0]}`);
          
          await prisma.product.update({
            where: { id: matchingDbProduct.id },
            data: {
              images: jProduct.images
            }
          });
          updateCount++;
        }
      }
    }
  }

  console.log(`\nSuccessfully updated ${updateCount} products with Cloudinary URLs.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

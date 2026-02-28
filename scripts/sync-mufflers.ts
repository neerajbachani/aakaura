
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MUFFLER_MAPPING: Record<string, string> = {
  // DB Name : Journey Name
  "Aamvaraah Muffler: Green": "Aamvaraah Muffler: Green & White",
  "Aamvaraah Muffler: Orange": "Aamvaraah Muffler: Tangerine",
  "Aamvaraah Muffler: Violet / White": "Aamvaraah Muffler: Cream"
};

async function main() {
  const journeys = await prisma.journey.findMany();
  const dbProducts = await prisma.product.findMany({
    where: { name: { contains: 'Muffler' } }
  });

  console.log("Starting Targeted Muffler Sync...");

  for (const dbProduct of dbProducts) {
    const targetJourneyName = MUFFLER_MAPPING[dbProduct.name];
    if (!targetJourneyName) continue;

    console.log(`Looking for match for DB Product: "${dbProduct.name}" (Target Journey Name: "${targetJourneyName}")`);

    let foundMatch = false;

    // Search in all journeys
    for (const journey of journeys) {
      const content = journey.content as any;
      if (!content) continue;

      const allItems = [
        ...(content['soul-luxury'] || []),
        ...(content['energy-curious'] || [])
      ];

      const match = allItems.find((item: any) => 
        item.name && item.name.toLowerCase().trim() === targetJourneyName.toLowerCase().trim()
      );

      if (match) {
        if (match.images && match.images.length > 0 && match.images[0].startsWith('http')) {
          console.log(`  Found match in Journey "${journey.name}"!`);
          console.log(`  Updating images for ${dbProduct.name}...`);
          
          await prisma.product.update({
            where: { id: dbProduct.id },
            data: { images: match.images }
          });
          
          foundMatch = true;
          break; // Stop searching journeys for this product
        } else {
          console.log(`  Found match in ${journey.name} but images are local/empty: ${JSON.stringify(match.images)}`);
        }
      }
    }

    if (!foundMatch) {
      console.log(`  No valid match found for ${dbProduct.name}`);
    }
  }

  console.log("Sync complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

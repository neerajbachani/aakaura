
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const journey = await prisma.journey.findUnique({
    where: { slug: 'grounding' }, // Checking the 'grounding' journey as an example
  });

  if (journey) {
    console.log("Journey Content for 'grounding':");
    // @ts-ignore
    console.log(JSON.stringify(journey.content, null, 2));
  } else {
    console.log("Journey 'grounding' not found.");
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

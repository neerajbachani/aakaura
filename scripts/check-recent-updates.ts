
import { prisma } from "../src/config/prisma";

async function main() {
  const journey = await prisma.journey.findUnique({
    where: { slug: 'love' },
  });

  const soulLuxury = (journey?.content as any)?.['soul-luxury'];
  console.log("First Item:", JSON.stringify(soulLuxury[0], null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const targetNames = [
    "Wall Hanging", 
    "Bonsai", 
    "Muffler", 
    "Neck Warmer", 
    "Wind Chime", 
    "Wind Chimes"
  ];

  console.log("Searching for products...");

  const products = await prisma.product.findMany({
    where: {
      OR: targetNames.map(name => ({
        name: { contains: name, mode: 'insensitive' }
      }))
    },
    select: {
      id: true,
      name: true
    }
  });

  console.log("Found products:");
  products.forEach(p => {
    console.log(`- ${p.name}: ${p.id}`);
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

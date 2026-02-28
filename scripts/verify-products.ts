
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'test throat', mode: 'insensitive' } },
        { name: { contains: 'neck warmer', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Found ${products.length} products:`);
  products.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

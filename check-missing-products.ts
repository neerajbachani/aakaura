
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: 'test', mode: 'insensitive' } },
        { name: { contains: 'throat', mode: 'insensitive' } },
        { name: { contains: 'neck', mode: 'insensitive' } },
        { name: { contains: 'warmer', mode: 'insensitive' } }
      ]
    }
  });

  console.log(`Found ${products.length} matching products:`);
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

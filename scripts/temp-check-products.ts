import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const prods = await prisma.product.findMany({ 
    select: { 
      name: true, 
      category: { select: { name: true } }, 
      images: true 
    } 
  });
  console.log(JSON.stringify(prods, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());

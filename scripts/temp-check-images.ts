import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const categories = ['Anchor', 'Jewellery', 'Neck Warmer', 'Bonsai', 'Wall Hanging', 'Muffler'];
  for (const name of categories) {
    const cat = await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      include: {
        products: {
          select: { name: true, images: true }
        }
      }
    });

    console.log(`\nCategory: ${name}`);
    if (cat) {
      console.log(` Found category ID: ${cat.id} (name: ${cat.name})`);
      console.log(` Products count: ${cat.products.length}`);
      if (cat.products.length > 0) {
        console.log(` First product images:`, cat.products[0].images);
      }
    } else {
      console.log(` Category NOT FOUND in DB`);
      const prods = await prisma.product.findMany({
        where: { category: { name: { equals: name, mode: 'insensitive' } } },
        select: { name: true, images: true }
      });
      console.log(` Fallback product count: ${prods.length}`);
    }
  }
}

check().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const journeys = await prisma.journey.findMany({ take: 1 });
  
  if (journeys.length > 0) {
    fs.writeFileSync('journey-sample.json', JSON.stringify(journeys[0].content, null, 2));
    console.log("Wrote journey sample to journey-sample.json");
  }

  const products = await prisma.product.findMany({ take: 5, select: { name: true, category: { select: { name: true } }, images: true }});
  fs.writeFileSync('products-sample.json', JSON.stringify(products, null, 2));

  const categories = await prisma.category.findMany({ include: { products: { take: 1, select: { name: true } } }});
  fs.writeFileSync('categories-sample.json', JSON.stringify(categories, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());


import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const stream = fs.createWriteStream('muffler-report-full.txt');

  const log = (msg: string) => {
    stream.write(msg + '\n');
    console.log(msg);
  };

  log("--- DB PRODUCTS (Mufflers) ---");
  const products = await prisma.product.findMany({
    where: { name: { contains: 'Muffler', mode: 'insensitive' } },
    include: { variations: true }
  });
  
  products.forEach(p => {
    log(`ID: ${p.id}`);
    log(`Name: "${p.name}"`);
    log(`Images: ${JSON.stringify(p.images)}`);
    if (p.variations.length > 0) {
      log(`Variations: ${JSON.stringify(p.variations.map(v => ({ name: v.name, id: v.id })))}`);
    }
    log('---');
  });

  log("\n--- JOURNEY CONTENT (Mufflers) ---");
  const journeys = await prisma.journey.findMany();
  
  journeys.forEach(j => {
    const content = j.content as any;
    if (!content) return;

    ['soul-luxury', 'energy-curious'].forEach(type => {
      const items = content[type] || [];
      items.forEach((item: any) => {
        if (item.name && item.name.toLowerCase().includes('muffler')) {
          log(`Journey: ${j.name} (${type})`);
          log(`Name: "${item.name}"`);
          log(`Images: ${JSON.stringify(item.images)}`);
          if (item.variants) {
             log(`Variants: ${JSON.stringify(item.variants.map((v:any) => ({ name: v.name, image: v.image })) )}`);
          }
          log('---');
        }
      });
    });
  });
  
  stream.end();
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

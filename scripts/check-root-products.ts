import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  const journey = await prisma.journey.findUnique({
    where: { slug: 'grounding' }
  });

  if (!journey) {
    console.log('Journey not found');
    return;
  }

  const content = journey.content as any;
  fs.writeFileSync('root-products-dump.json', JSON.stringify(content, null, 2));
  console.log('Dumped to root-products-dump.json');

  // Quick summary
  console.log('\n=== SOUL-LUXURY ===');
  for (const p of content['soul-luxury'] || []) {
    console.log(`  ${p.id} | ${p.name} | desc:${(p.description||'').length}ch | specs:${p.specifications ? Object.keys(p.specifications).length : 0} | imgs:${p.images?.length||0}`);
  }
  console.log('\n=== ENERGY-CURIOUS ===');
  for (const p of content['energy-curious'] || []) {
    console.log(`  ${p.id} | ${p.name} | desc:${(p.description||'').length}ch | specs:${p.specifications ? Object.keys(p.specifications).length : 0} | imgs:${p.images?.length||0}`);
  }

  await prisma.$disconnect();
}

main();

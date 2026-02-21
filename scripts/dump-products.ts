
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      variations: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  const lines = products.map(p => {
    let line = `Product: ${p.name} (ID: ${p.id})`;
    if (p.variations.length > 0) {
      line += '\n  Variations:\n' + p.variations.map(v => `    - ${v.name} (ID: ${v.id})`).join('\n');
    }
    return line;
  });

  fs.writeFileSync(path.join(process.cwd(), 'all_products.txt'), lines.join('\n\n'));
  console.log('Products dumped to all_products.txt');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

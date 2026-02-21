
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.combo.count();
  console.log(`Total Combos: ${count}`);
  const combos = await prisma.combo.findMany({ select: { name: true, chakras: true } });
  combos.forEach(c => console.log(`${c.name}: [${c.chakras.join(', ')}]`));


}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


import { prisma } from "./src/lib/prisma";
import fs from 'fs';

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, name: true } });
  const journeys = await prisma.journey.findMany();

  let report = "--- PRODUCT TABLE IDs ---\n";
  products.forEach(p => {
      report += `[${p.id}] ${p.name}\n`;
  });

  report += "\n--- JOURNEY CONTENT IDs ---\n";
  journeys.forEach(j => {
      const content = j.content as any;
      const sl = content["soul-luxury"] || [];
      const ec = content["energy-curious"] || [];
      
      [...sl, ...ec].forEach((p: any) => {
          report += `[${p.id}] ${p.name} (Journey: ${j.slug})\n`;
      });
  });

  fs.writeFileSync('id-check.txt', report);
  console.log("Report written to id-check.txt");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

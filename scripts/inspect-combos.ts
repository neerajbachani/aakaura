
import { prisma } from "./src/lib/prisma";
import fs from 'fs';

async function main() {
  const combos = await prisma.combo.findMany({
    include: {
      products: {
        include: {
          product: true,
        }
      }
    }
  });

  let report = "--- COMBOS INSPECTION ---\n";
  combos.forEach(c => {
      report += `Combo: ${c.name} (Slug: ${c.slug})\n`;
      c.products.forEach(cp => {
          report += `  - Product Name: "${cp.product.name}"\n`;
          report += `  - Product ID: ${cp.product.id}\n`;
          report += `  - Detail: ${cp.detail}\n`;
      });
      report += "\n";
  });

  fs.writeFileSync('combo-inspection.txt', report);
  console.log("Report written to combo-inspection.txt");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    try {
        await prisma.$disconnect(); 
    } catch {}
  });


import { prisma } from "./src/lib/prisma";
import fs from 'fs';

async function main() {
  const journeys = await prisma.journey.findMany();
  
  let report = "--- JOURNEY CONTENT CHECK ---\n";
  for (const journey of journeys) {
    const content = journey.content as any;
    const slProducts = content["soul-luxury"] || [];
    const ecProducts = content["energy-curious"] || [];
    report += `Journey: ${journey.name} (${journey.slug})\n`;
    report += `  SL Count: ${slProducts.length}\n`;
    report += `  EC Count: ${ecProducts.length}\n`;
    if (slProducts.length > 0) report += `  First SL: ${slProducts[0].name}\n`;
    report += "\n";
  }
  report += "--- END CHECK ---";
  
  fs.writeFileSync('journey-report.txt', report);
  console.log("Report written to journey-report.txt");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

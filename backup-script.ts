
import { prisma } from "./src/lib/prisma";
import fs from "fs";
import path from "path";

const backupDir = path.join(process.cwd(), "backup-" + new Date().toISOString().replace(/[:.]/g, "-"));

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

async function backup() {
  console.log(`Starting backup to ${backupDir}...`);

  const models = [
    "user",
    "product",
    "category",
    "productVariation",
    "order",
    "orderItem",
    "journey",
    "combo",
    "comboProduct",
    "blog",
    "series",
    "waitlistItem",
    "address",
    "cartItem"
  ];

  for (const model of models) {
    try {
      console.log(`Backing up ${model}...`);
      // @ts-ignore
      const data = await prisma[model].findMany();
      fs.writeFileSync(
        path.join(backupDir, `${model}.json`),
        JSON.stringify(data, null, 2)
      );
      console.log(`✓ ${model}: ${data.length} records`);
    } catch (e) {
      console.error(`❌ Failed to backup ${model}:`, e);
    }
  }

  console.log("Backup complete!");
}

backup()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

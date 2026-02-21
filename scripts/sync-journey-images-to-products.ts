/**
 * sync-journey-images-to-products.ts
 *
 * One-time (and safe-to-re-run) script that reads every journey's content
 * field and syncs product images + metadata into the `products` table.
 *
 * This fixes the gap where journey product images were edited via the admin
 * journey page but were never propagated to the products table, causing
 * combos to show stale images.
 *
 * Run with:
 *   npx ts-node -r tsconfig-paths/register --project tsconfig.json scripts/sync-journey-images-to-products.ts
 *
 * or (if ts-node is not installed globally):
 *   npx tsx scripts/sync-journey-images-to-products.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function parsePrice(priceStr: any): number {
  if (!priceStr) return 0;
  const cleaned = priceStr.toString().replace(/[₹,\s]/g, "");
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
}

async function main() {
  console.log("🔄 Syncing journey product images → products table...\n");

  const journeys = await prisma.journey.findMany();
  const defaultCategory = await prisma.category.findFirst();

  if (!defaultCategory) {
    console.error("❌ No category found in DB. Create at least one category first.");
    process.exit(1);
  }

  let updated = 0;
  let created = 0;
  let skipped = 0;

  for (const journey of journeys) {
    const content = journey.content as any;
    const clientTypes: Array<"soul-luxury" | "energy-curious"> = [
      "soul-luxury",
      "energy-curious",
    ];

    for (const clientType of clientTypes) {
      const products: any[] = content[clientType] || [];

      for (const p of products) {
        if (!p.id) {
          console.log(`  ⚠️  Skipping product without ID in ${journey.name} (${clientType})`);
          skipped++;
          continue;
        }

        const images: string[] = (p.images || []).filter(
          (img: any) => typeof img === "string" && img.trim() !== ""
        );

        if (images.length === 0) {
          console.log(
            `  ⚠️  ${journey.name} → ${p.name || p.id}: no images, skipping`
          );
          skipped++;
          continue;
        }

        const price = parsePrice(p.price);

        // Check if product exists to give better logging
        const existing = await prisma.product.findUnique({
          where: { id: p.id },
          select: { id: true, images: true },
        });

        await prisma.product.upsert({
          where: { id: p.id },
          update: {
            name: p.name,
            description: p.description || "",
            images,
            price,
          },
          create: {
            id: p.id,
            name: p.name,
            description:
              p.description || `Imported from ${journey.name} Journey`,
            images,
            price,
            categoryId: defaultCategory.id,
            isFeatured: false,
          },
        });

        if (existing) {
          const oldImages = existing.images;
          const changed =
            JSON.stringify(oldImages) !== JSON.stringify(images);
          console.log(
            `  ✅ [${journey.name}/${clientType}] ${p.name}` +
              (changed
                ? ` → images updated (${oldImages.length} → ${images.length})`
                : ` → no image change (${images.length} images)`)
          );
          updated++;
        } else {
          console.log(
            `  ✨ [${journey.name}/${clientType}] ${p.name} → created with ${images.length} images`
          );
          created++;
        }
      }
    }
  }

  console.log("\n─────────────────────────────────────");
  console.log(`✅ Updated : ${updated} products`);
  console.log(`✨ Created : ${created} products`);
  console.log(`⚠️  Skipped : ${skipped} products (no ID or no images)`);
  console.log("─────────────────────────────────────");
  console.log("\n🎉 Sync complete! Combo image pickers will now show the latest images.");
}

main()
  .catch((e) => {
    console.error("❌ Fatal error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * inspect-root-products.ts
 * Inspects root/grounding journey products vs what's in the products table.
 * Run: npx tsx scripts/inspect-root-products.ts
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Find the root/grounding journey (try common slugs)
  const rootSlugs = ["grounding", "root", "root-chakra", "muladhara"];
  let journey: any = null;

  for (const slug of rootSlugs) {
    journey = await prisma.journey.findUnique({ where: { slug } });
    if (journey) {
      console.log(`✅ Found journey: "${journey.name}" (slug: ${slug})\n`);
      break;
    }
  }

  if (!journey) {
    console.log("❌ Root journey not found. Listing all journeys:");
    const all = await prisma.journey.findMany({ select: { slug: true, name: true } });
    all.forEach((j: any) => console.log(`  - ${j.slug} → ${j.name}`));
    return;
  }

  const content = journey.content as any;
  const clientTypes = ["soul-luxury", "energy-curious"] as const;

  const allJourneyProducts: any[] = [];

  for (const ct of clientTypes) {
    const products: any[] = content[ct] || [];
    console.log(`\n=== ${ct.toUpperCase()} (${products.length} products) ===`);
    for (const p of products) {
      allJourneyProducts.push({ ...p, _clientType: ct });
      console.log(`  id     : ${p.id || "⚠️  MISSING"}`);
      console.log(`  name   : ${p.name}`);
      console.log(`  images : ${JSON.stringify(p.images || [])}`);
      console.log("");
    }
  }

  // Check for duplicate IDs in journey content
  const ids = allJourneyProducts.map((p) => p.id).filter(Boolean);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    const dupeIds = ids.filter((id, i) => ids.indexOf(id) !== i);
    console.log("⚠️  DUPLICATE IDs in journey content:", dupeIds);
  } else {
    console.log("✅ No duplicate IDs in journey content");
  }

  // Check for duplicate names
  const names = allJourneyProducts.map((p) => p.name);
  const dupeNames = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupeNames.length) {
    console.log("⚠️  DUPLICATE names in journey content:", dupeNames);
  } else {
    console.log("✅ No duplicate names in journey content");
  }

  // Now check products table
  console.log("\n=== PRODUCTS TABLE (by journey product IDs) ===");
  if (ids.length === 0) {
    console.log("  No valid IDs found in journey content.");
  } else {
    const dbProducts = await prisma.product.findMany({
      where: { id: { in: ids } },
      select: { id: true, name: true, images: true },
    });

    for (const dbP of dbProducts) {
      const journeyP = allJourneyProducts.find((p) => p.id === dbP.id);
      const journeyImages: string[] = journeyP?.images || [];
      const inSync = JSON.stringify(dbP.images) === JSON.stringify(journeyImages);
      console.log(`  [${inSync ? "✅ IN SYNC" : "❌ OUT OF SYNC"}] ${dbP.name}`);
      if (!inSync) {
        console.log(`    Journey images : ${JSON.stringify(journeyImages)}`);
        console.log(`    DB images      : ${JSON.stringify(dbP.images)}`);
      }
    }

    const missingIds = ids.filter((id) => !dbProducts.find((p: any) => p.id === id));
    if (missingIds.length) {
      console.log("\n❌ Products in journey but MISSING from products table:");
      missingIds.forEach((id) => {
        const p = allJourneyProducts.find((x) => x.id === id);
        console.log(`  id=${id}, name=${p?.name}`);
      });
    }
  }

  // Also check if there are products in the DB with same name but different IDs (duplicates)
  console.log("\n=== CHECKING FOR NAME-BASED DUPLICATES IN DB ===");
  const productNames = allJourneyProducts.map((p) => p.name).filter(Boolean);
  for (const name of productNames) {
    const matches = await prisma.product.findMany({
      where: { name: { equals: name, mode: "insensitive" } },
      select: { id: true, name: true, images: true },
    });
    if (matches.length > 1) {
      console.log(`\n  ⚠️  DUPLICATE in DB for "${name}" (${matches.length} rows):`);
      matches.forEach((m: any) => console.log(`    id=${m.id}, images=${JSON.stringify(m.images)}`));
    }
  }
  console.log("\nInspection done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

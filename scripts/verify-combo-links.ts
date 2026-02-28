
import { prisma } from "./src/lib/prisma";
import fs from 'fs';
import { getAllCombos } from "./src/lib/api";

// Mocking getAllCombos since it fetches from API which might not work in this script environment if server is not running or env vars are missing
// Instead, let's fetch combos from DB directly if possible or mock the data structure based on what we know
// Actually, getAllCombos fetches from API. If the dev server is running, it should work.
// But valid verification is to fetch combos and see if products match.
// Let's rely on prisma to fetch all journeys and then manually check a few known product names from combos.

async function main() {
  console.log("Fetching journeys...");
  const journeys = await prisma.journey.findMany();
  
  const productLookup = new Map<string, { slug: string; id: string }>();

  journeys.forEach((journey) => {
    const content = journey.content as any;
    const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    const slProducts = content["soul-luxury"] || [];
    slProducts.forEach((p: any) => {
        if (p.name) productLookup.set(normalize(p.name), { slug: journey.slug, id: p.id });
    });

    const ecProducts = content["energy-curious"] || [];
    ecProducts.forEach((p: any) => {
        if (p.name) productLookup.set(normalize(p.name), { slug: journey.slug, id: p.id });
    });
  });

  console.log(`Loaded ${productLookup.size} products into lookup map.`);

  // Test cases based on user report
  const testProducts = [
    "Muffler", 
    "Prithvi Aayam Wall Hanging",
    "Handcrafted Winter Muffler", // Likely the actual name
    "Energy Shield Muffler" 
  ];

  fs.writeFileSync('product-keys.txt', Array.from(productLookup.keys()).sort().join('\n'));
  console.log("Product keys written to product-keys.txt");

  console.log("\n--- TEST RESULTS ---");
  testProducts.forEach(name => {
      const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
      const lookup = productLookup.get(normalize(name));
      const status = lookup ? "FOUND" : "NOT FOUND";
      const url = lookup ? `/journey/${lookup.slug}?product=${lookup.id}&autoOpen=false` : "#";
      console.log(`Product: "${name}" -> ${status}`);
      if (lookup) {
          console.log(`  URL: ${url}`);
      }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

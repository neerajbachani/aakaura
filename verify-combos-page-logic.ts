
import { prisma } from "./src/lib/prisma";
import fs from 'fs';

async function main() {
  const journeys = await prisma.journey.findMany();
  const combos = await prisma.combo.findMany({
    include: {
      products: {
        include: {
          product: true
        }
      }
    }
  });

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

  console.log("--- VERIFYING COMBO LINKS ---");

  combos.forEach(combo => {
      // Only check the relevant combo
      if (combo.slug !== 'the-grounded-flow') {
          // return; // Check all is fine, but focus on output
      }

      console.log(`Combo: ${combo.name}`);
      combo.products.forEach(cp => {
          const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');
          const productName = cp.product.name;
          const normalizedName = normalize(productName);
          
          let lookup = productLookup.get(normalizedName);
          let method = "EXACT";

          if (!lookup) {
               method = "FUZZY";
               // Strategy 1: Use 'detail' field
               if (cp.detail) {
                   const detailLower = cp.detail.toLowerCase();
                   const targetJourney = journeys.find(j => 
                       j.name.toLowerCase().includes(detailLower) || 
                       j.slug.toLowerCase().includes(detailLower) ||
                       (j.content as any)?.sanskritName?.toLowerCase().includes(detailLower)
                   );

                   if (targetJourney) {
                       const content = targetJourney.content as any;
                       const allJourneyProducts = [
                           ...(content["soul-luxury"] || []),
                           ...(content["energy-curious"] || [])
                       ];
                       
                       const keywords = productName.split(/[\s:-]+/).filter((w: string) => w.length > 3).map((w: string) => w.toLowerCase());
                       
                       const bestMatch = allJourneyProducts.find((p: any) => {
                            const pNameLower = p.name.toLowerCase();
                            return keywords.some((k: string) => pNameLower.includes(k));
                       });

                       if (bestMatch) {
                           lookup = { slug: targetJourney.slug, id: bestMatch.id };
                           method = "FUZZY (DETAIL)";
                       }
                   }
               }

               // Strategy 2: Global fuzzy match
               if (!lookup) {
                   const keywords = productName.split(/[\s:-]+/).filter((w: string) => w.length > 4).map((w: string) => w.toLowerCase());
                   for (const journey of journeys) {
                        const content = journey.content as any;
                        const allJourneyProducts = [...(content["soul-luxury"] || []), ...(content["energy-curious"] || [])];
                         const potentialMatch = allJourneyProducts.find((p: any) => {
                            const pNameLower = p.name.toLowerCase();
                            const matches = keywords.filter((k: string) => pNameLower.includes(k));
                            return matches.length >= Math.min(keywords.length, 2);
                        });
                        if (potentialMatch) {
                             lookup = { slug: journey.slug, id: potentialMatch.id };
                             method = "FUZZY (GLOBAL)";
                             break;
                        }
                   }
               }
          }

          const url = lookup 
            ? `/journey/${lookup.slug}?product=${lookup.id}&autoOpen=false` 
            : "#";
          
          console.log(`  Product: "${productName}" -> ${lookup ? "FOUND" : "NOT FOUND"} (${method})`);
          if (lookup) {
            console.log(`    URL: ${url}`);
          } else {
             console.log(`    FAILED to match.`);
          }
      });
      console.log("");
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

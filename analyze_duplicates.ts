import { PrismaClient } from '@prisma/client'
import fs from 'fs'
const prisma = new PrismaClient()

async function main() {
  const journeys = await prisma.journey.findMany();
  const dbProducts = await prisma.product.findMany({
    include: {
      variations: true,
      comboProducts: true,
      cartItems: true,
      orderItems: true
    }
  });

  const journeyProducts = new Map<string, any>(); // Map ID -> product data

  for (const j of journeys) {
    const content = j.content as any;
    if (!content) continue;
    
    const sl = content['soul-luxury'] || [];
    const ec = content['energy-curious'] || [];
    
    for (const p of sl) journeyProducts.set(p.id, { ...p, journeySlug: j.slug, clientType: 'soul-luxury' });
    for (const p of ec) journeyProducts.set(p.id, { ...p, journeySlug: j.slug, clientType: 'energy-curious' });
  }

  // Name map from DB
  const nameToDbProducts = new Map<string, any[]>();
  for (const p of dbProducts) {
    const normName = p.name.trim().toLowerCase();
    if (!nameToDbProducts.has(normName)) nameToDbProducts.set(normName, []);
    nameToDbProducts.get(normName)!.push(p);
  }

  let lines: string[] = [];
  lines.push(`--- DUPLICATE ANALYSIS ---`);

  let duplicateGroups = 0;

  for (const [normName, prods] of nameToDbProducts.entries()) {
    if (prods.length > 1) {
      duplicateGroups++;
      lines.push(`\nProduct Name: "${prods[0].name}" (${prods.length} copies)`);
      
      for (const p of prods) {
        // Check if this DB product ID is used in ANY journey
        const isLinkedToJourney = journeyProducts.has(p.id);
        const journeyContext = isLinkedToJourney ? journeyProducts.get(p.id) : null;
        
        let relStr = `Variations: ${p.variations.length}, Combos: ${p.comboProducts.length}, Cart: ${p.cartItems.length}, Orders: ${p.orderItems.length}`;
        
        lines.push(`  - ID: ${p.id} [CreatedAt: ${p.createdAt.toISOString()}] | LinkedToJourney: ${isLinkedToJourney ? `YES (${journeyContext.journeySlug})` : 'NO'} | ${relStr}`);
      }
    }
  }

  fs.writeFileSync('analysis.log', lines.join('\n'));
  console.log(`Analysis complete. Found ${duplicateGroups} duplicated products. See analysis.log for details.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Fix all products across all journeys:
 * 1. Move premiumDetailing → designBreakdown (for products that have premiumDetailing but no designBreakdown)
 * 2. Add symbolism + languageEngraving to mufflers
 * 3. Delete premiumDetailing from all products
 */

// Muffler symbolism/engraving by chakra
const MUFFLER_CHAKRA_DATA: Record<string, { symbolism: string; languageEngraving: string }> = {
  'grounding': {
    symbolism: 'Stability, security, warmth, and connection to the physical world. The muffler anchors the wearer in earth energy through material and intention.',
    languageEngraving: 'Sanskrit — "Muladhara" (Root support)',
  },
  'compassion': {
    symbolism: 'Love, compassion, emotional warmth, and heart-centered connection. The muffler wraps the wearer in the energy of unconditional care.',
    languageEngraving: 'Sanskrit — "Anahata" (Unstruck sound)',
  },
  'clarity': {
    symbolism: 'Intuition, inner clarity, perception, and higher awareness. The muffler supports the energy of insight and deep knowing.',
    languageEngraving: 'Sanskrit — "Ajna" (Command center)',
  },
};

async function main() {
  try {
    console.log('🔧 Fixing product data across all journeys...\n');

    const journeys = await prisma.journey.findMany();
    let totalFixed = 0;

    for (const journey of journeys) {
      const content = journey.content as any;
      if (!content) continue;

      let changed = false;
      const chakraData = MUFFLER_CHAKRA_DATA[journey.slug];

      for (const clientType of ['soul-luxury', 'energy-curious']) {
        const products = content[clientType];
        if (!Array.isArray(products)) continue;

        for (let i = 0; i < products.length; i++) {
          const product = products[i];

          // 1. Move premiumDetailing → designBreakdown if design is missing
          if (product.premiumDetailing && !product.designBreakdown) {
            product.designBreakdown = product.premiumDetailing;
            console.log(`  ↗️  ${journey.slug}/${clientType}/${product.id}: premiumDetailing → designBreakdown`);
            changed = true;
          }

          // 2. Delete premiumDetailing field
          if (product.premiumDetailing) {
            delete product.premiumDetailing;
            console.log(`  🗑️  ${journey.slug}/${clientType}/${product.id}: removed premiumDetailing`);
            changed = true;
          }

          // 3. Add symbolism/languageEngraving to mufflers
          if (product.id?.includes('muffler') && chakraData) {
            if (!product.symbolism) {
              product.symbolism = chakraData.symbolism;
              console.log(`  ✨ ${journey.slug}/${clientType}/${product.id}: added symbolism`);
              changed = true;
            }
            if (!product.languageEngraving) {
              product.languageEngraving = chakraData.languageEngraving;
              console.log(`  ✨ ${journey.slug}/${clientType}/${product.id}: added languageEngraving`);
              changed = true;
            }
          }
        }
      }

      if (changed) {
        await prisma.journey.update({
          where: { slug: journey.slug },
          data: { content },
        });
        totalFixed++;
        console.log(`✅ Updated ${journey.slug}\n`);
      }
    }

    // Summary
    console.log('='.repeat(50));
    console.log(`\n🎉 Fixed ${totalFixed} journeys total!\n`);

    // Verify Root chakra products
    const rootJourney = await prisma.journey.findUnique({ where: { slug: 'grounding' } });
    if (rootJourney) {
      const rootContent = rootJourney.content as any;
      console.log('📊 Root Chakra verification:');
      for (const ct of ['soul-luxury', 'energy-curious']) {
        for (const p of (rootContent[ct] || [])) {
          const fields = [
            `specs:${p.specifications ? Object.keys(p.specifications).length : 0}`,
            `design:${p.designBreakdown ? 'yes' : 'no'}`,
            `symbolism:${p.symbolism ? 'yes' : 'no'}`,
            `engraving:${p.languageEngraving ? 'yes' : 'no'}`,
            `premium:${p.premiumDetailing ? 'STILL EXISTS' : 'removed'}`,
          ].join(' | ');
          console.log(`  ${ct}/${p.id}: ${fields}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping of bonsai product IDs to their target journeys
const bonsaiJourneyMapping = {
  'bonsai-crown-chakra': 'clarity',      // Crown chakra → clarity journey
  'bonsai-root-chakra': 'grounding',     // Root chakra → grounding journey
  'bonsai-solar-plexus-chakra': 'confidence', // Solar Plexus → confidence journey
  'bonsai-throat-chakra': 'expression',  // Throat chakra → expression journey
};

async function main() {
  try {
    console.log('🌱 Reorganizing Bonsai products to their respective chakra journeys...\n');

    // Get all relevant journeys
    const journeys = await prisma.journey.findMany({
      where: {
        slug: {
          in: ['grounding', 'clarity', 'confidence', 'expression']
        }
      }
    });

    if (journeys.length === 0) {
      console.error('❌ No journeys found');
      process.exit(1);
    }

    console.log(`✓ Found ${journeys.length} journeys\n`);

    // First, collect all bonsai products from grounding journey
    const groundingJourney = journeys.find(j => j.slug === 'grounding');
    
    if (!groundingJourney) {
      console.error('❌ Grounding journey not found');
      process.exit(1);
    }

    const groundingContent = groundingJourney.content as any;
    const allBonsaiProducts: any = {
      'soul-luxury': {},
      'energy-curious': {}
    };

    // Extract all bonsai products from grounding
    for (const clientType of ['soul-luxury', 'energy-curious']) {
      const products = groundingContent[clientType] || [];
      
      products.forEach((product: any) => {
        // Check if this is a bonsai product
        const baseId = product.id.replace('-sl', '').replace('-ec', '');
        if (Object.keys(bonsaiJourneyMapping).includes(baseId)) {
          allBonsaiProducts[clientType][baseId] = product;
          console.log(`📦 Found ${product.name} in grounding (${clientType})`);
        }
      });
    }

    // Remove all bonsai products from grounding, keep only non-bonsai products
    for (const clientType of ['soul-luxury', 'energy-curious']) {
      groundingContent[clientType] = (groundingContent[clientType] || []).filter((product: any) => {
        const baseId = product.id.replace('-sl', '').replace('-ec', '');
        return !Object.keys(bonsaiJourneyMapping).includes(baseId);
      });
    }

    console.log('\n🗑️  Removed all bonsai products from grounding journey');

    // Now add each bonsai to its respective journey
    for (const [bonsaiId, targetSlug] of Object.entries(bonsaiJourneyMapping)) {
      const targetJourney = journeys.find(j => j.slug === targetSlug);
      
      if (!targetJourney) {
        console.warn(`⚠️  Journey "${targetSlug}" not found, skipping ${bonsaiId}`);
        continue;
      }

      const targetContent = targetJourney.content as any;
      
      // Ensure arrays exist
      if (!targetContent['soul-luxury']) targetContent['soul-luxury'] = [];
      if (!targetContent['energy-curious']) targetContent['energy-curious'] = [];

      // Add bonsai products to target journey
      for (const clientType of ['soul-luxury', 'energy-curious']) {
        const product = allBonsaiProducts[clientType][bonsaiId];
        
        if (product) {
          // Check if product already exists
          const existingIndex = targetContent[clientType].findIndex((p: any) => p.id === product.id);
          
          if (existingIndex >= 0) {
            // Update existing
            targetContent[clientType][existingIndex] = product;
            console.log(`✏️  Updated ${product.name} in ${targetSlug} (${clientType})`);
          } else {
            // Add new
            targetContent[clientType].push(product);
            console.log(`✅ Added ${product.name} to ${targetSlug} (${clientType})`);
          }
        }
      }

      // Update the target journey
      await prisma.journey.update({
        where: { slug: targetSlug },
        data: { content: targetContent },
      });
    }

    // Update grounding journey with bonsai products removed
    await prisma.journey.update({
      where: { slug: 'grounding' },
      data: { content: groundingContent },
    });

    console.log('\n🎉 Bonsai products successfully reorganized!');
    console.log('\n📊 Final distribution:');
    console.log('   • Crown Bonsai → clarity journey');
    console.log('   • Root Bonsai → grounding journey');
    console.log('   • Solar Plexus Bonsai → confidence journey');
    console.log('   • Throat Bonsai → expression journey\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Mapping of bonsai product IDs to their Cloudinary image URLs and journeys
const bonsaiImageUpdates = {
  'bonsai-crown-chakra': {
    image: 'https://res.cloudinary.com/dbpnjohhr/image/upload/v1770640190/IMG_20260209_175033_vbyxav.png',
    journey: 'clarity'
  },
  'bonsai-root-chakra': {
    image: 'https://res.cloudinary.com/dbpnjohhr/image/upload/v1770641329/IMG_20260209_175337.jpg_xlnu9a.jpg',
    journey: 'grounding'
  },
  'bonsai-solar-plexus-chakra': {
    image: 'https://res.cloudinary.com/dbpnjohhr/image/upload/v1770640188/IMG_20260209_175250_ofpnd7.png',
    journey: 'confidence'
  },
  'bonsai-throat-chakra': {
    image: 'https://res.cloudinary.com/dbpnjohhr/image/upload/v1770640184/IMG_20260209_175137_eavec7.png',
    journey: 'expression'
  },
};

async function main() {
  try {
    console.log('🖼️  Updating Bonsai product images with Cloudinary URLs...\n');

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

    let totalUpdates = 0;

    // Update each bonsai product
    for (const [bonsaiId, { image, journey: journeySlug }] of Object.entries(bonsaiImageUpdates)) {
      const journey = journeys.find(j => j.slug === journeySlug);
      
      if (!journey) {
        console.warn(`⚠️  Journey "${journeySlug}" not found, skipping ${bonsaiId}`);
        continue;
      }

      const content = journey.content as any;
      let updated = false;

      // Update both soul-luxury and energy-curious versions
      for (const clientType of ['soul-luxury', 'energy-curious']) {
        const products = content[clientType] || [];
        const variantSuffix = clientType === 'soul-luxury' ? '-sl' : '-ec';
        const productId = `${bonsaiId}${variantSuffix}`;
        
        const productIndex = products.findIndex((p: any) => p.id === productId);
        
        if (productIndex >= 0) {
          // Update the image URL
          products[productIndex].images = [image];
          console.log(`✅ Updated ${products[productIndex].name} (${clientType})`);
          console.log(`   📸 Image: ${image.substring(0, 50)}...`);
          updated = true;
          totalUpdates++;
        }
      }

      if (updated) {
        // Save the updated journey
        await prisma.journey.update({
          where: { slug: journeySlug },
          data: { content },
        });
      }
    }

    console.log(`\n🎉 Successfully updated ${totalUpdates} bonsai product images!`);
    console.log('\n📊 Updated products:');
    console.log('   ✓ Crown Bonsai in clarity journey');
    console.log('   ✓ Root Bonsai in grounding journey');
    console.log('   ✓ Solar Plexus Bonsai in confidence journey');
    console.log('   ✓ Throat Bonsai in expression journey');
    console.log('\n🌐 View the updated products on their respective journey pages!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

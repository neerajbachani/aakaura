import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Checking bonsai product distribution across journeys...\n');

    // Get all journeys
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

    console.log(`Found ${journeys.length} journeys\n`);

    // Check each journey for bonsai products
    for (const journey of journeys) {
      console.log(`\n📁 Journey: ${journey.slug.toUpperCase()}`);
      console.log('─'.repeat(50));
      
      const content = journey.content as any;
      
      for (const clientType of ['soul-luxury', 'energy-curious']) {
        const products = content[clientType] || [];
        const bonsaiProducts = products.filter((p: any) => p.id.includes('bonsai'));
        
        console.log(`\n  ${clientType}:`);
        if (bonsaiProducts.length > 0) {
          bonsaiProducts.forEach((p: any) => {
            console.log(`    ✓ ${p.name} (${p.id})`);
          });
        } else {
          console.log(`    ❌ No bonsai products found`);
        }
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('Summary:');
    console.log('─'.repeat(50));
    console.log('Expected distribution:');
    console.log('  • clarity → Crown Bonsai');
    console.log('  • grounding → Root Bonsai');
    console.log('  • confidence → Solar Plexus Bonsai');
    console.log('  • expression → Throat Bonsai\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

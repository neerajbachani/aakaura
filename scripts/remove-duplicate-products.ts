import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔍 Checking for duplicate products...\n');

    // Get the grounding journey
    const journey = await prisma.journey.findUnique({
      where: { slug: 'grounding' },
    });

    if (!journey) {
      console.error('❌ Journey "grounding" not found');
      process.exit(1);
    }

    const currentContent = journey.content as any;
    let updated = false;

    // Function to remove duplicates from an array based on id
    const removeDuplicates = (products: any[]) => {
      const seen = new Set();
      return products.filter((product: any) => {
        if (seen.has(product.id)) {
          console.log(`  🗑️  Removing duplicate: ${product.name} (${product.id})`);
          return false;
        }
        seen.add(product.id);
        return true;
      });
    };

    // Remove duplicates from Soul-Luxury
    if (currentContent['soul-luxury']) {
      const originalLength = currentContent['soul-luxury'].length;
      currentContent['soul-luxury'] = removeDuplicates(currentContent['soul-luxury']);
      const newLength = currentContent['soul-luxury'].length;
      
      if (originalLength !== newLength) {
        console.log(`✅ Soul-Luxury: Removed ${originalLength - newLength} duplicate(s)`);
        updated = true;
      } else {
        console.log('✓ Soul-Luxury: No duplicates found');
      }
    }

    // Remove duplicates from Energy-Curious
    if (currentContent['energy-curious']) {
      const originalLength = currentContent['energy-curious'].length;
      currentContent['energy-curious'] = removeDuplicates(currentContent['energy-curious']);
      const newLength = currentContent['energy-curious'].length;
      
      if (originalLength !== newLength) {
        console.log(`✅ Energy-Curious: Removed ${originalLength - newLength} duplicate(s)`);
        updated = true;
      } else {
        console.log('✓ Energy-Curious: No duplicates found');
      }
    }

    if (updated) {
      // Update the journey in database
      await prisma.journey.update({
        where: { slug: 'grounding' },
        data: {
          content: currentContent,
        },
      });

      console.log('\n🎉 Duplicates removed successfully!');
      console.log(`\n📊 Current product count:`);
      console.log(`   Soul-Luxury: ${currentContent['soul-luxury']?.length || 0} products`);
      console.log(`   Energy-Curious: ${currentContent['energy-curious']?.length || 0} products\n`);
    } else {
      console.log('\n✨ No duplicates found! Database is clean.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

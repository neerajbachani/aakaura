import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Premium detailing (narrative content only, NO specifications)
const bonsaiPremiumDetailing = `**About Aarohma Ekam**

Aarohma Ekam is a living bonsai collection designed to represent growth as a continuous ascent — not a destination.

Each piece features a resilient Adenium (Desert Rose) bonsai, chosen for its slow growth cycle and ability to thrive with minimal intervention. A natural symbol of patience and inner strength. The plant's vertical form mirrors ascension, while its rooted base keeps the design grounded in earth energy.

**Chakra-Aligned Design Language**

Every bonsai corresponds to a specific chakra frequency — expressed through aura-toned yarn work, color placement, and form. Acting as a visual and spatial reminder rather than a healing claim.

Colors are selected based on:
- Traditional chakra symbolism
- Psychological color associations
- Visual harmony within modern interiors

**Intentional Materials & Form**

- Hand-wrapped yarn spirals represent energy movement and continuity
- Suspended yarn elements add gentle motion, creating subtle visual rhythm
- Terracotta bases anchor the piece, reinforcing grounding and stability
- Minimal symbolic detailing keeps the design modern, uncluttered, and timeless

The spiral structure reflects growth that is non-linear — upward, adaptive, and alive.

**Energetic Preparation**

Each Aarohma Ekam bonsai is:
- Consciously nurtured
- Pranic-cleansed before dispatch
- Hand-finished to preserve individuality

No two pieces are identical. Variations are intentional and celebrated.

**Where It Belongs**

Aarohma Ekam is designed to sit where stillness and focus matter:
- Workspaces
- Meditation or altar areas
- Living spaces that invite pause

It does not demand attention… it earns it quietly.`;

// Care instructions as formatted list
const careInstructionsList = `• Place in bright, indirect sunlight
• Water sparingly; allow soil to dry between watering
• Avoid overwatering and prolonged damp conditions
• Protect from extreme cold`;

async function main() {
  try {
    console.log('📋 Updating ALL bonsai products with COMPLETE specifications...\n');

    const journeys = await prisma.journey.findMany({
      where: {
        slug: {
          in: ['grounding', 'expansion', 'power', 'expression']
        }
      }
    });

    if (journeys.length === 0) {
      console.error('❌ No journeys found');
      process.exit(1);
    }

    let totalUpdates = 0;

    for (const journey of journeys) {
      console.log(`\n📁 Processing ${journey.slug} journey...`);
      const content = journey.content as any;
      let updated = false;

      for (const clientType of ['soul-luxury', 'energy-curious']) {
        const products = content[clientType] || [];
        
        products.forEach((product: any, index: number) => {
          if (product.id && product.id.includes('bonsai')) {
            // Update designBreakdown (premium detailing) - NO specifications
            products[index].designBreakdown = bonsaiPremiumDetailing;
            
            // Set COMPLETE specifications with ALL required fields
            products[index].specifications = {
              'Product Name': product.name,
              'Product Type': 'Chakra-Inspired Living Bonsai',
              'Plant Type': 'Adenium (Desert Rose)',
              'Material': 'Live Adenium bonsai, terracotta pot, aura-toned yarn, minimal decorative elements',
              'Texture': 'Natural (plant & terracotta) with soft yarn detailing',
              'Dimensions': 'Approx. 8–12 inches in height (including pot and adornment)',
              'Weight': 'Lightweight to medium (varies slightly due to live plant and handcrafted elements)',
              'Packaging': 'Secure, protective packaging designed for live plants',
            };

            // Set care instructions
            products[index].careInstructions = careInstructionsList;

            // Set ideal for
            if (!products[index].idealFor) {
              products[index].idealFor = 'Meditation spaces, workspaces, living areas that invite pause and mindfulness';
            }

            console.log(`  ✅ Updated ${product.name} (${clientType})`);
            console.log(`     Specifications: Product Name, Product Type, Plant Type, Material, Texture, Dimensions, Weight, Packaging`);
            updated = true;
            totalUpdates++;
          }
        });
      }

      if (updated) {
        await prisma.journey.update({
          where: { slug: journey.slug },
          data: { content }
        });
        console.log(`  💾 Saved ${journey.slug}`);
      }
    }

    console.log(`\n✅ Successfully updated ${totalUpdates} bonsai products!`);
    console.log('\n📋 Each product now has EXACTLY these specifications:');
    console.log('   • Product Name');
    console.log('   • Product Type');
    console.log('   • Plant Type');
    console.log('   • Material');
    console.log('   • Texture');
    console.log('   • Dimensions');
    console.log('   • Weight');
    console.log('   • Packaging');
    console.log('   • Care Instructions (in separate field)\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

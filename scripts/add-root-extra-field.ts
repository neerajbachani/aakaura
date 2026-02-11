import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const EXTRA_SECTION_TITLE = "When to Work with the Root Chakra (Muladhara)";

const EXTRA_SECTION_CONTENT = `**Working on the Root Chakra (Muladhara)**
Recommended for individuals experiencing instability, anxiety, insecurity, or excessive scattered energy. As the foundation of the entire energy system, it governs survival, safety, physical grounding, and one’s relationship with the material world. It is located at the base of the spine and forms the energetic base for all higher functions.

**Who Should Work on the Root Chakra**
- **Individuals experiencing anxiety or fear**: Those who feel constantly in survival mode, experience panic, or carry deep fears about safety or the future.
- **People experiencing financial or career stress**: Anyone facing instability related to money, work, or material security.
- **Those feeling ungrounded or mentally scattered**: Individuals who feel detached, restless, unfocused, or unable to settle into routines.
- **People experiencing lower-body physical discomfort**: Issues related to the lower back, hips, knees, feet, sciatica, or digestion (such as constipation).
- **Individuals in major life transitions**: Moving homes, changing jobs, ending relationships, or any shift that disrupts stability.
- **Those with chronic insecurity or lack of belonging**: Feeling unsupported, unsafe, or disconnected from roots and structure.

**Best Spaces to Work on Root Chakra Energy**
Root chakra practices are most effective in environments that support grounding and physical presence.

*Outdoor Spaces*
- Grass, soil, or sand
- Sitting under a tree with back support
- Quiet forests or hills

*Indoor Spaces*
- A clean, organized corner that feels safe
- Seating closer to the floor
- A dedicated yoga or meditation area
- Gardening spaces or contact with soil

**Best Times to Work on the Root Chakra**
- Morning, to establish stability for the day
- During moments of stress or fear
- Consistent practice, ideally 1–2 times per week or more during unstable phases

**Supportive Practices**
- Grounding visualizations (energy flowing downward into the earth)
- Standing yoga postures such as Mountain, Tree, and Warrior poses
- Seed mantra chanting: “LAM”
- Warm oil self-massage on legs and feet to calm the nervous system`;

async function main() {
  try {
    console.log('🔧 Adding extra section to Root Wall Hanging products...\n');

    const journey = await prisma.journey.findUnique({
      where: { slug: 'grounding' }
    });

    if (!journey) {
      console.error('❌ Journey "grounding" not found');
      return;
    }

    const content = journey.content as any;
    let changed = false;

    // Target IDs to update
    const targetIds = ['root-wall-hanging-sl', 'root-wall-hanging-ec'];

    // Update Soul Luxury
    if (content['soul-luxury']) {
      for (const product of content['soul-luxury']) {
        if (targetIds.includes(product.id)) {
          product.additionalSection = {
            title: EXTRA_SECTION_TITLE,
            content: EXTRA_SECTION_CONTENT
          };
          // Remove old rigid whenToUse if it exists, to avoid confusion/duplication
          if (product.whenToUse) {
            delete product.whenToUse;
            console.log(`  🗑️  Removed rigid 'whenToUse' from ${product.id}`);
          }
          console.log(`  ✅ Added 'additionalSection' to ${product.id} (SL)`);
          changed = true;
        }
      }
    }

    // Update Energy Curious
    if (content['energy-curious']) {
      for (const product of content['energy-curious']) {
        if (targetIds.includes(product.id)) {
          product.additionalSection = {
            title: EXTRA_SECTION_TITLE,
            content: EXTRA_SECTION_CONTENT
          };
          if (product.whenToUse) {
            delete product.whenToUse;
            console.log(`  🗑️  Removed rigid 'whenToUse' from ${product.id}`);
          }
          console.log(`  ✅ Added 'additionalSection' to ${product.id} (EC)`);
          changed = true;
        }
      }
    }

    if (changed) {
      await prisma.journey.update({
        where: { slug: 'grounding' },
        data: { content }
      });
      console.log('\n🎉 Successfully updated Root Wall Hanging products!');
    } else {
      console.log('\n⚠️  No products found with matching IDs to update.');
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Short emotional description (visible)
const MUFFLER_DESCRIPTION = `Woven in the quiet strength of the Himalayas, the Aamvaraah Muffler carries the warmth of high-altitude winters and the patience of hands that know the land.

Made from a felt wool blend, it is created for real winters…dense, insulating, and deeply comforting. The kind of warmth that does not rush, but settles. The kind of warmth that feels steady, protective, and grounding.

Aamvaraah is made to endure…to wrap you in warmth while allowing you to remain inward, still, and aware.

Wear it as a layer of winter. Carry it as a layer of expression.`;

// Premium Detailing (accordion content)
const PREMIUM_DETAILING = `**Aamvaraah Muffler — Thoughtful Warmth, Designed with Intention**

**Why the neck matters:**
The neck is one of the most sensitive and functionally important areas of the body.
- It contains major blood vessels that regulate blood flow to the brain
- It is closely connected to the nervous system, including pathways that influence calm and stress response
- It is a key zone for heat regulation — the body loses warmth quickly when the neck is exposed

Covering the neck helps maintain thermal balance and overall comfort, especially in colder environments. This is why mufflers have traditionally been used as a protective layer, not just an accessory.

**Why Aakaura designed a muffler around this area:**
Aamvaraah is designed to sit comfortably around the neck, providing steady warmth without bulk. Its purpose is simple: to support the body where regulation and comfort meet.

The design prioritizes:
- Even insulation
- Soft contact with skin
- Ease of movement throughout the day

**The role of colour in daily wear:**
Colour isn't just visual — it subtly influences how we feel and experience our surroundings. From a scientific and psychological perspective:
- Colours affect mood and perception through visual processing in the brain
- Clothing colours remain in our peripheral vision, influencing comfort and focus throughout the day
- Certain colour tones are widely associated with calm, warmth, or stability across cultures

**Why Aakaura uses chakra-aligned colour palettes:**
Chakras are used here as symbolic frameworks, not medical claims. Each Aamvaraah colour is chosen because it:
- Aligns with widely understood emotional and psychological associations
- Reflects traditional colour symbolism rooted in Indian knowledge systems
- Allows customers to choose a tone that matches their personal preference or daily intention

For example:
- Cooler tones are often associated with calm and clarity
- Earthy shades are linked to grounding and stability
- Warm neutrals evoke comfort and softness

This approach keeps the design intentional, without overstating effects.

**Why Aamvaraah exists:**
Aamvaraah is made for people who value:
- Practical warmth
- Thoughtful design
- Subtle meaning integrated into everyday wear

It is not about fixing or changing anything — it is about comfort, awareness, and conscious choice.`;

// Energy-Curious specific premium detailing addition
const EC_PREMIUM_ADDITION = `

**Energetic Alignment:**
Each Aamvaraah Muffler is energetically cleansed and blessed before dispatch. The neck area houses the throat chakra — a vital energy center for expression and authentic communication. This muffler is designed to provide both physical warmth and energetic protection, creating a gentle boundary that supports clarity while maintaining comfort.`;

async function main() {
  try {
    console.log('🚀 Updating Aamvaraah Muffler products with premiumDetailing...\n');

    const journeySlugs = ['grounding', 'love', 'insight'] as const;
    const journeyNames: Record<typeof journeySlugs[number], string> = {
      'grounding': 'Root Chakra',
      'love': 'Heart Chakra',
      'insight': 'Third Eye Chakra'
    };

    for (const slug of journeySlugs) {
      console.log(`\n📍 Processing ${journeyNames[slug]} (${slug})...`);

      const journey = await prisma.journey.findUnique({
        where: { slug }
      });

      if (!journey) {
        console.warn(`⚠️  Journey "${slug}" not found, skipping`);
        continue;
      }

      const content = journey.content as any;

      // Ensure arrays exist
      if (!content['soul-luxury']) content['soul-luxury'] = [];
      if (!content['energy-curious']) content['energy-curious'] = [];

      // Soul-Luxury Product
      const soulLuxuryProduct = {
        id: `${slug}-muffler-sl`,
        name: "Aamvaraah Muffler",
        sanskritName: "Thoughtful Warmth",
        description: MUFFLER_DESCRIPTION,
        specificDescription: MUFFLER_DESCRIPTION,
        premiumDetailing: PREMIUM_DETAILING,
        price: "₹4,500",
        ethos: "Artisan-crafted in India using traditional techniques. Small-batch, slow-made, supporting traditional craftsmanship and conscious making.",
        whatItsFor: "For those who appreciate quality and intentional design. This muffler combines practical warmth with thoughtful craftsmanship — designed to endure seasons while allowing you to remain comfortable, still, and aware.",
        features: [
          "Premium wool blend for superior insulation",
          "Soft, dense texture suitable for cold winter weather",
          "Lightweight at 250 gms for all-day comfort",
          "Unisex design with elegant tassels",
          "Even insulation and ease of movement"
        ],
        images: ["/images/aamvaraah-muffler.jpeg"],
        step: 2,
        specifications: {
          "Product Name": "Aamvaraah Muffler",
          "Product Type": "Unisex Winter Muffler",
          "Material": "Premium wool blend",
          "Texture": "Soft, dense, and insulating",
          "Warmth Level": "High – suitable for cold winter weather",
          "Size": "One size",
          "Dimensions": "75 inches (& tassels) × 6 inches",
          "Weight": "250 gms (Light weight)",
          "Gender": "Unisex",
          "Packaging": "Secure packaging"
        },
        careInstructions: "Dry clean recommended. Do not machine wash or bleach."
      };

      // Energy-Curious Product
      const energyCuriousProduct = {
        id: `${slug}-muffler-ec`,
        name: "Aamvaraah Muffler",
        sanskritName: "Energetic Warmth Shield",
        description: MUFFLER_DESCRIPTION,
        specificDescription: MUFFLER_DESCRIPTION,
        premiumDetailing: PREMIUM_DETAILING + EC_PREMIUM_ADDITION,
        price: "₹5,500",
        ethos: "Consciously crafted and energetically aligned. Each piece is blessed by trained Pranic Healers before dispatch, ensuring it carries coherence and clarity rather than emotional residue from the making process.",
        whatItsFor: "For the energy-aware individual who understands that clothing carries vibration. This muffler serves as both physical warmth and energetic protection — supporting your throat chakra while creating a gentle boundary between you and the external environment.",
        features: [
          "Energetically cleansed and blessed before shipping",
          "Premium wool blend maintaining auric integrity",
          "Throat chakra alignment and support",
          "Soft, dense texture for physical and energetic warmth",
          "Lightweight design for meditation and daily practice"
        ],
        images: ["/images/aamvaraah-muffler.jpeg"],
        step: 2,
        specifications: {
          "Product Name": "Aamvaraah Muffler",
          "Product Type": "Unisex Winter Muffler (Energetically Aligned)",
          "Material": "Premium wool blend",
          "Texture": "Soft, dense, and insulating",
          "Warmth Level": "High – suitable for cold winter weather",
          "Size": "One size",
          "Dimensions": "75 inches (& tassels) × 6 inches",
          "Weight": "250 gms (Light weight)",
          "Gender": "Unisex",
          "Energetic Treatment": "Pranic blessed and energetically cleansed",
          "Packaging": "Secure packaging"
        },
        careInstructions: "Dry clean recommended. Do not machine wash or bleach. Periodically cleanse energetically using sage smoke or sound."
      };

      // Check if products already exist
      const slIndex = content['soul-luxury'].findIndex((p: any) => p.id === soulLuxuryProduct.id);
      const ecIndex = content['energy-curious'].findIndex((p: any) => p.id === energyCuriousProduct.id);

      if (slIndex >= 0) {
        content['soul-luxury'][slIndex] = soulLuxuryProduct;
        console.log(`  ✏️  Updated Muffler (soul-luxury)`);
      } else {
        content['soul-luxury'].push(soulLuxuryProduct);
        console.log(`  ✅ Added Muffler (soul-luxury)`);
      }

      if (ecIndex >= 0) {
        content['energy-curious'][ecIndex] = energyCuriousProduct;
        console.log(`  ✏️  Updated Muffler (energy-curious)`);
      } else {
        content['energy-curious'].push(energyCuriousProduct);
        console.log(`  ✅ Added Muffler (energy-curious)`);
      }

      // Update journey in database
      await prisma.journey.update({
        where: { slug },
        data: { content }
      });

      console.log(`  ✨ Completed ${journeyNames[slug]}`);
    }

    console.log('\n' + '='.repeat(50));
    console.log('\n🎉 Success! Muffler products updated with premiumDetailing!');
    console.log('\n📊 Distribution:');
    console.log('   ✓ Root Chakra (grounding) → 2 products');
    console.log('   ✓ Heart Chakra (love) → 2 products');
    console.log('   ✓ Third Eye Chakra (insight) → 2 products');
    console.log('\n💡 Total: 6 products (3 chakras × 2 client types)\n');

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

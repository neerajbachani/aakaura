import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Common premium detailing for all bonsai products
const commonPremiumDetail = `Aarohma Ekam is a bonsai collection designed to represent growth as a continuous ascent, not a destination.

Each piece features a living Adenium bonsai, chosen for its resilience, slow growth cycle, and ability to thrive with minimal intervention — a natural symbol of patience and inner strength. The plant's vertical form mirrors ascension, while its rooted base keeps the design grounded in earth energy.

**Chakra-aligned design language**
Every bonsai in the Aarohma Ekam collection corresponds to a specific chakra frequency — Root, Sacral, Solar, Heart, Throat, Third Eye, or Crown.

The chakra association is expressed through aura-toned yarn work, colour placement, and form, acting as a visual and spatial reminder rather than a healing claim.

These colours are selected based on:
- Traditional chakra symbolism
- Psychological colour associations
- Visual harmony within modern interiors

**Intentional materials & form**
- Hand-wrapped yarn spirals represent energy movement and continuity
- Suspended yarn elements add gentle motion, creating subtle visual rhythm
- Terracotta bases anchor the piece, reinforcing grounding and stability
- Minimal symbolic detailing keeps the design modern, uncluttered, and timeless

The spiral structure reflects growth that is non-linear — upward, adaptive, and alive.

**Energetic preparation**
Each Aarohma Ekam bonsai is:
- Consciously nurtured
- Pranic-cleansed before dispatch
- Hand-finished to preserve individuality

No two pieces are identical. Variations are intentional and celebrated.

**Where it belongs**
Aarohma Ekam is designed to sit where stillness and focus matter:
- Workspaces
- Meditation or altar areas
- Living spaces that invite pause

It does not demand attention… it earns it quietly.`;

// Common specifications
const commonSpecs = {
  'Product Type': 'Chakra-Inspired Living Bonsai',
  'Plant Type': 'Adenium (Desert Rose)',
  'Material': 'Live Adenium bonsai, terracotta pot, aura-toned yarn, minimal decorative elements',
  'Texture': 'Natural (plant & terracotta) with soft yarn detailing',
  'Dimensions': 'Approx. 8–12 inches in height (including pot and adornment)',
  'Weight': 'Lightweight to medium (varies slightly due to live plant and handcrafted elements)',
  'Packaging': 'Secure, protective packaging designed for live plants'
};

const commonCareInstructions = 'Place in bright, indirect sunlight. Water sparingly; allow soil to dry between watering. Avoid overwatering and prolonged damp conditions. Protect from extreme cold.';
const commonIdealFor = 'Meditation spaces, workspaces, living areas that invite pause and mindfulness';

async function main() {
  try {
    console.log('🌱 Adding missing Crown and Solar Plexus Bonsai products...\n');

    // Crown Bonsai for Clarity Journey
    const crownBonsai = {
      id: 'bonsai-crown-chakra',
      name: 'Aarohma Ekam Bonsai: Crown (Sahasrara) Chakra',
      description: `The Crown Chakra Aarohma Ekam Bonsai represents clarity, awareness, and connection beyond the material.

Designed around the crown chakra's symbolic language, this piece uses violet and soft white aura-toned yarns to reflect higher consciousness and mental stillness. The spiral form ascends gently around the living Adenium bonsai, visually echoing expansion, perspective, and upward movement.

The elevated circular halo element at the top signifies openness… a reminder of receptivity rather effort. Suspended yarn orbs introduce subtle motion, adding rhythm and softness without distraction.

Rooted in a handcrafted terracotta base, the bonsai remains grounded even as its form reaches upward - reinforcing balance between earth and awareness.

This piece is ideal for spaces where clarity and calm are valued: work desks, meditation corners, or personal sanctuaries.

Crown Chakra Aarohma Ekam is not about escape - it is about presence, perspective, and quiet alignment with the larger whole.`,
      image: 'https://res.cloudinary.com/dbpnjohhr/image/upload/v1770640190/IMG_20260209_175033_vbyxav.png',
      chakra: 'Crown (Sahasrara)',
      colors: 'Violet and soft white',
      symbolism: 'Clarity, awareness, higher consciousness, mental stillness, and connection beyond the material',
      languageEngraving: 'Sanskrit — "Sahasrara" (Thousand-petaled lotus)',
    };

    // Solar Plexus Bonsai for Confidence Journey
    const solarPlexusBonsai = {
      id: 'bonsai-solar-plexus-chakra',
      name: 'Aarohma Ekam Bonsai: Solar Plexus (Manipura) Chakra',
      description: `The Solar Plexus Chakra Aarohma Ekam Bonsai represents confidence, willpower, clarity of action, and inner strength.

This bonsai is wrapped in sun-yellow and warm golden tones, visually centered around the midsection- the same energetic zone associated with digestion, metabolism, and personal power in the human body. The spiral rises with intention, reflecting forward movement, decision-making, and self-belief.

The Adenium bonsai, with its thick caudex, mirrors the solar plexus function in biology- storage, regulation, and release of energy when needed. The elevated yarn halo and suspended orbs introduce controlled motion, symbolising momentum without chaos.

The handcrafted terracotta base grounds the piece, ensuring balance between drive and stability.

Ideal for workspaces, study areas, or anywhere focus and confidence are required.

Solar Plexus Aarohma Ekam represents grounded ambition- power that is calm, steady, and self-directed.`,
      image: 'https://res.cloudinary.com/dbpnjohhr/image/upload/v1770640188/IMG_20260209_175250_ofpnd7.png',
      chakra: 'Solar Plexus (Manipura)',
      colors: 'Sun-yellow and warm golden tones',
      symbolism: 'Confidence, willpower, clarity of action, inner strength, personal power, and self-belief',
      languageEngraving: 'Sanskrit — "Manipura" (Lustrous gem)',
    };

    const bonsais = [
      { data: crownBonsai, journey: 'clarity' },
      { data: solarPlexusBonsai, journey: 'confidence' }
    ];

    for (const { data: bonsai, journey: journeySlug } of bonsais) {
      const journey = await prisma.journey.findUnique({
        where: { slug: journeySlug }
      });

      if (!journey) {
        console.warn(`⚠️  Journey "${journeySlug}" not found, skipping ${bonsai.name}`);
        continue;
      }

      const content = journey.content as any;
      
      // Ensure arrays exist
      if (!content['soul-luxury']) content['soul-luxury'] = [];
      if (!content['energy-curious']) content['energy-curious'] = [];

      // Create products for both client types
      const soulLuxuryProduct = {
        id: `${bonsai.id}-sl`,
        name: bonsai.name,
        price: 3499,
        description: bonsai.description,
        specificDescription: bonsai.description,
        images: [bonsai.image],
        ethos: 'Each Aarohma Ekam bonsai is hand-finished with intention, pranic-cleansed, and consciously nurtured. No two pieces are identical — variations are celebrated as marks of authenticity.',
        features: [
          'Living Adenium (Desert Rose) bonsai',
          'Handcrafted terracotta pot',
          'Chakra-aligned yarn detailing',
          'Suspended orb elements for subtle motion',
          'Hand-wrapped spiral design',
          'Pranic-cleansed before dispatch'
        ],
        whatItsFor: `This isn't decorative art. It's a living reminder that growth is constant, non-linear, and rooted in patience. ${bonsai.name.split(':')[0]} speaks to the part of you that values presence over performance.`,
        specifications: {
          ...commonSpecs,
          'Product Name': bonsai.name,
          'Chakra': bonsai.chakra,
          'Color Palette': bonsai.colors,
        },
        careInstructions: commonCareInstructions,
        idealFor: commonIdealFor,
        symbolism: bonsai.symbolism,
        languageEngraving: bonsai.languageEngraving,
        designBreakdown: commonPremiumDetail,
      };

      const energyCuriousProduct = {
        ...soulLuxuryProduct,
        id: `${bonsai.id}-ec`,
        ethos: 'A living bonsai designed with chakra-inspired colour language and mindful craftsmanship. Each piece is unique, pranic-cleansed, and finished by hand.',
        whatItsFor: `A living symbol of patience and natural growth. ${bonsai.name.split(':')[0]} brings grounded energy and visual rhythm to spaces where focus and stillness matter.`,
      };

      // Check if products already exist, if so update them, otherwise add
      const slIndex = content['soul-luxury'].findIndex((p: any) => p.id === soulLuxuryProduct.id);
      const ecIndex = content['energy-curious'].findIndex((p: any) => p.id === energyCuriousProduct.id);

      if (slIndex >= 0) {
        content['soul-luxury'][slIndex] = soulLuxuryProduct;
        console.log(`✏️  Updated ${bonsai.name} in ${journeySlug} (soul-luxury)`);
      } else {
        content['soul-luxury'].push(soulLuxuryProduct);
        console.log(`✅ Added ${bonsai.name} to ${journeySlug} (soul-luxury)`);
      }

      if (ecIndex >= 0) {
        content['energy-curious'][ecIndex] = energyCuriousProduct;
        console.log(`✏️  Updated ${bonsai.name} in ${journeySlug} (energy-curious)`);
      } else {
        content['energy-curious'].push(energyCuriousProduct);
        console.log(`✅ Added ${bonsai.name} to ${journeySlug} (energy-curious)`);
      }

      // Update journey
      await prisma.journey.update({
        where: { slug: journeySlug },
        data: { content }
      });
    }

    console.log('\n🎉 Success! Bonsai products added to their journeys!');
    console.log('\n📊 Distribution:');
    console.log('   ✓ Crown Bonsai → /journey/clarity');
    console.log('   ✓ Solar Plexus Bonsai → /journey/confidence\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

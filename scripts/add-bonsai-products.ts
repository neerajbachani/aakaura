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

// Product definitions
const bonsaiProducts = [
  {
    id: 'bonsai-crown-chakra',
    name: 'Aarohma Ekam Bonsai: Crown (Sahasrara) Chakra',
    description: `The Crown Chakra Aarohma Ekam Bonsai represents clarity, awareness, and connection beyond the material.

Designed around the crown chakra's symbolic language, this piece uses violet and soft white aura-toned yarns to reflect higher consciousness and mental stillness. The spiral form ascends gently around the living Adenium bonsai, visually echoing expansion, perspective, and upward movement.

The elevated circular halo element at the top signifies openness… a reminder of receptivity rather than effort. Suspended yarn orbs introduce subtle motion, adding rhythm and softness without distraction.

Rooted in a handcrafted terracotta base, the bonsai remains grounded even as its form reaches upward - reinforcing balance between earth and awareness.

This piece is ideal for spaces where clarity and calm are valued: work desks, meditation corners, or personal sanctuaries.

Crown Chakra Aarohma Ekam is not about escape - it is about presence, perspective, and quiet alignment with the larger whole.`,
    image: '/images/products/bonsai-crown-chakra.jpg',
    chakra: 'Crown (Sahasrara)',
    colors: 'Violet and soft white',
    symbolism: 'Clarity, awareness, higher consciousness, mental stillness, and connection beyond the material',
    languageEngraving: 'Sanskrit — "Sahasrara" (Thousand-petaled lotus)',
  },
  {
    id: 'bonsai-root-chakra',
    name: 'Aarohma Ekam Bonsai: Root (Muladhara) Chakra',
    description: `The Root Chakra Aarohma Ekam Bonsai represents stability, grounding, and a sense of inner security.

Designed around the root chakra's symbolic language, this piece uses deep red and earthy tones to reflect strength, survival, and connection to the physical world. The form begins close to the base, emphasizing grounding before growth. The spiral detailing rises slowly, reinforcing the idea that stability comes first.

The Adenium bonsai, known for its strong caudex and resilience, naturally supports this theme- storing water, growing patiently, and thriving with minimal excess.

Suspended yarn elements introduce gentle movement, reminding us that even grounded energy is alive and responsive. The terracotta pot anchors the piece, reinforcing a sense of weight, presence, and earth connection.

Ideal for entryways, workspaces, or areas where you seek steadiness and focus.

Root Chakra Aarohma Ekam is a reminder that growth is strongest when the foundation is secure.`,
    image: '/images/products/bonsai-root-chakra.jpg',
    chakra: 'Root (Muladhara)',
    colors: 'Deep red and earthy tones',
    symbolism: 'Stability, grounding, inner security, strength, survival, and connection to the physical world',
    languageEngraving: 'Sanskrit — "Muladhara" (Root foundation)',
  },
  {
    id: 'bonsai-solar-plexus-chakra',
    name: 'Aarohma Ekam Bonsai: Solar Plexus (Manipura) Chakra',
    description: `The Solar Plexus Chakra Aarohma Ekam Bonsai represents confidence, willpower, clarity of action, and inner strength.

This bonsai is wrapped in sun-yellow and warm golden tones, visually centered around the midsection- the same energetic zone associated with digestion, metabolism, and personal power in the human body. The spiral rises with intention, reflecting forward movement, decision-making, and self-belief.

The Adenium bonsai, with its thick caudex, mirrors the solar plexus function in biology- storage, regulation, and release of energy when needed. The elevated yarn halo and suspended orbs introduce controlled motion, symbolising momentum without chaos.

The handcrafted terracotta base grounds the piece, ensuring balance between drive and stability.

Ideal for workspaces, study areas, or anywhere focus and confidence are required.

Solar Plexus Aarohma Ekam represents grounded ambition- power that is calm, steady, and self-directed.`,
    image: '/images/products/bonsai-solar-plexus-chakra.jpg',
    chakra: 'Solar Plexus (Manipura)',
    colors: 'Sun-yellow and warm golden tones',
    symbolism: 'Confidence, willpower, clarity of action, inner strength, personal power, and self-belief',
    languageEngraving: 'Sanskrit — "Manipura" (Lustrous gem)',
  },
  {
    id: 'bonsai-throat-chakra',
    name: 'Aarohma Ekam Bonsai: Throat (Vishuddha) Chakra',
    description: `The Throat Chakra Aarohma Ekam Bonsai represents expression, truth, clarity, and the courage to be heard.

This bonsai is dressed in cool blues and soft whites, echoing the qualities of clear communication and mental spaciousness. The upward spiral flows gently around the plant, symbolising thoughts rising from the heart and finding an honest voice. Nothing is forced here- expression unfolds naturally. The white ball represents purity of intent and clarity before expression. In short, blue carries the vibration of communication; white makes sure that communication is clean.

The blue-wrapped trunk represents alignment between inner knowing and spoken word. Suspended yarn orbs move subtly with air, reminding us that words carry vibration- once released, they travel.

Set in a handcrafted terracotta pot, the piece balances ether with earth: truth that is grounded, not reactive. It's designed for spaces where conversations happen- work desks, creative corners, studios, or meditation zones.

Throat Chakra Aarohma Ekam is for those who are learning to speak without fear, listen without judgment, and express without dilution.

Say less. Mean more. Let your energy speak first. 🌀`,
    image: '/images/products/bonsai-throat-chakra.jpg',
    chakra: 'Throat (Vishuddha)',
    colors: 'Cool blues and soft whites',
    symbolism: 'Expression, truth, clarity, clear communication, courage to be heard, and alignment between inner knowing and spoken word',
    languageEngraving: 'Sanskrit — "Vishuddha" (Especially pure)',
  },
];

async function main() {
  try {
    console.log('🌱 Adding Aarohma Ekam Bonsai products...\n');

    // Find the journeys we'll add products to
    // These bonsai products can go in multiple journeys based on their chakra alignment
    const journeys = await prisma.journey.findMany({
      where: {
        slug: {
          in: ['grounding', 'expression', 'clarity', 'confidence']
        }
      }
    });

    if (journeys.length === 0) {
      console.error('❌ No suitable journeys found');
      process.exit(1);
    }

    // We'll add all products to the grounding journey as the main collection
    const groundingJourney = journeys.find(j => j.slug === 'grounding');
    
    if (!groundingJourney) {
      console.error('❌ Grounding journey not found');
      process.exit(1);
    }

    const currentContent = groundingJourney.content as any;
    
    // Ensure both client type arrays exist
    if (!currentContent['soul-luxury']) {
      currentContent['soul-luxury'] = [];
    }
    if (!currentContent['energy-curious']) {
      currentContent['energy-curious'] = [];
    }

    // Add products to both client types
    for (const bonsai of bonsaiProducts) {
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

      currentContent['soul-luxury'].push(soulLuxuryProduct);
      currentContent['energy-curious'].push(energyCuriousProduct);

      console.log(`✅ Added ${bonsai.name}`);
    }

    // Update the journey in database
    await prisma.journey.update({
      where: { slug: 'grounding' },
      data: {
        content: currentContent,
      },
    });

    console.log('\n🎉 All 4 Aarohma Ekam Bonsai products successfully added!');
    console.log('\n🌱 Products added:');
    bonsaiProducts.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.name}`);
    });
    console.log('\n🌐 View at: http://localhost:3000/journey/grounding\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

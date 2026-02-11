import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ========== BONSAI DATA ==========
const bonsaiPremiumDetail = `**About Aarohma Ekam**

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

const bonsaiSpecs = {
  'Product Name': 'Aarohma Ekam Bonsai: Root (Muladhara) Chakra',
  'Product Type': 'Chakra-Inspired Living Bonsai',
  'Plant Type': 'Adenium (Desert Rose)',
  'Material': 'Live Adenium bonsai, terracotta pot, aura-toned yarn, minimal decorative elements',
  'Texture': 'Natural (plant & terracotta) with soft yarn detailing',
  'Dimensions': 'Approx. 8–12 inches in height (including pot and adornment)',
  'Weight': 'Lightweight to medium (varies slightly due to live plant and handcrafted elements)',
  'Packaging': 'Secure, protective packaging designed for live plants',
};

// ========== WALL HANGING DATA ==========
const wallHangingDesignBreakdown = [
  {
    title: 'Four-Petaled Lotus (Muladhara Symbol)',
    description: 'Represents the four fundamental psychic functions of the human mind: Manas (Mind), Buddhi (Intellect), Chitta (Conscious Awareness), and Ahamkara (Sense of Self)'
  },
  {
    title: 'Square Mandala',
    description: 'Symbol of the Earth element (Prithvi) — solidity, structure, stability, and physical existence'
  },
  {
    title: 'Downward-Pointing Triangle',
    description: 'Represents the downward flow of energy, grounding consciousness into the body and material reality'
  },
  {
    title: 'Brass Ghungroo Clusters',
    description: 'Three anchoring points, each adorned with three traditional brass ghungroo bells. Designed to create subtle vibrational awareness rather than loud sound'
  },
  {
    title: 'Wooden Inscription Element',
    description: 'A solid wooden log plaque, engraved with "Grounded." (English) and "स्थिर (Sthir)" — meaning steady, stable, unmoving'
  }
];

const wallHangingSpecs = {
  'Product Name': 'Prithvi Aayam Wall Hanging',
  'Product Type': 'Handcrafted Terracotta Wall Art',
  'Material': 'Hand-moulded terracotta base, solid wood inscription element, and brass ghungroo bells',
  'Texture': 'Natural terracotta with handcrafted surface texture',
  'Dimensions': 'Approx. 33 × 19 × 1 cm (Length × Width × Depth)',
  'Weight': 'Approx. 450 grams',
  'Finish': 'Acrylic matte finish (Uniform, non-glossy surface designed for visual calm and longevity)',
  'Color': 'Unified Aakaura colour tone with natural wood accents and brass detailing (Consistent across all chakra wall hangings)',
  'Crafting': 'Hand-crafted — Each piece is hand-moulded, hand-painted, and hand-assembled',
  'Durability': 'Long-lasting for indoor use — Stable structure with age-resistant brass elements',
  'Packaging': 'Secure packaging'
};

const wallHangingWhenToUse = {
  introduction: 'Working on the Root Chakra (Muladhara) is recommended for individuals experiencing instability, anxiety, insecurity, or excessive scattered energy. As the foundation of the entire energy system, it governs survival, safety, physical grounding, and one\'s relationship with the material world. It is located at the base of the spine and forms the energetic base for all higher functions.',
  whoShouldWork: [
    {
      title: 'Individuals experiencing anxiety or fear',
      description: 'Those who feel constantly in survival mode, experience panic, or carry deep fears about safety or the future'
    },
    {
      title: 'People experiencing financial or career stress',
      description: 'Anyone facing instability related to money, work, or material security'
    },
    {
      title: 'Those feeling ungrounded or mentally scattered',
      description: 'Individuals who feel detached, restless, unfocused, or unable to settle into routines'
    },
    {
      title: 'People experiencing lower-body physical discomfort',
      description: 'Issues related to the lower back, hips, knees, feet, sciatica, or digestion (such as constipation)'
    },
    {
      title: 'Individuals in major life transitions',
      description: 'Moving homes, changing jobs, ending relationships, or any shift that disrupts stability'
    },
    {
      title: 'Those with chronic insecurity or lack of belonging',
      description: 'Feeling unsupported, unsafe, or disconnected from roots and structure'
    }
  ],
  bestSpaces: [
    {
      category: 'Outdoor Spaces',
      items: [
        'Grass, soil, or sand',
        'Sitting under a tree with back support',
        'Quiet forests or hills'
      ]
    },
    {
      category: 'Indoor Spaces',
      items: [
        'A clean, organized corner that feels safe',
        'Seating closer to the floor',
        'A dedicated yoga or meditation area',
        'Gardening spaces or contact with soil'
      ]
    }
  ],
  bestTimes: [
    'Morning, to establish stability for the day',
    'During moments of stress or fear',
    'Consistent practice, ideally 1–2 times per week or more during unstable phases'
  ],
  supportivePractices: [
    'Grounding visualizations (energy flowing downward into the earth)',
    'Standing yoga postures such as Mountain, Tree, and Warrior poses',
    'Seed mantra chanting: "LAM"',
    'Warm oil self-massage on legs and feet to calm the nervous system'
  ]
};

async function main() {
  try {
    console.log('🔧 Fixing Root Chakra (grounding) product data...\n');

    const journey = await prisma.journey.findUnique({
      where: { slug: 'grounding' }
    });

    if (!journey) {
      console.error('❌ Journey "grounding" not found');
      return;
    }

    const content = journey.content as any;

    // ==========================================
    // FIX SOUL-LUXURY WALL HANGING
    // ==========================================
    const slWallIdx = content['soul-luxury'].findIndex((p: any) => p.id === 'root-wall-hanging-sl');
    if (slWallIdx >= 0) {
      const existing = content['soul-luxury'][slWallIdx];
      content['soul-luxury'][slWallIdx] = {
        ...existing,
        sanskritName: 'Muladhara Energy Anchor',
        specificDescription: 'A handcrafted terracotta wall hanging designed to bring grounding energy, stability, and the essence of earth element into your space. Features solid wood inscription elements and traditional brass ghungroo bells.',
        specifications: wallHangingSpecs,
        designBreakdown: wallHangingDesignBreakdown,
        careInstructions: 'Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes.',
        symbolism: 'Represents grounding, stability, continuity, and the infinite foundation of existence. Acts as a physical reminder of your connection to Earth energy.',
        idealFor: 'Entrances, meditation spaces, workspaces, living areas, and intentional gifting',
        languageEngraving: 'English & Sanskrit — "Grounded." and "स्थिर (Sthir)"',
        whenToUse: wallHangingWhenToUse,
      };
      console.log('✅ Fixed SL Wall Hanging — added specs, designBreakdown, careInstructions, symbolism, idealFor, languageEngraving, whenToUse');
    } else {
      console.warn('⚠️  SL Wall Hanging not found (root-wall-hanging-sl)');
    }

    // ==========================================
    // FIX SOUL-LUXURY BONSAI
    // ==========================================
    const slBonsaiIdx = content['soul-luxury'].findIndex((p: any) => p.id === 'bonsai-root-chakra-sl');
    if (slBonsaiIdx >= 0) {
      const existing = content['soul-luxury'][slBonsaiIdx];

      // Short description for visible area, move detailed to premiumDetailing
      const shortDescription = `The Root Chakra Aarohma Ekam Bonsai represents stability, grounding, and a sense of inner security.

Designed around the root chakra's symbolic language, this piece uses deep red and earthy tones to reflect strength, survival, and connection to the physical world.

Root Chakra Aarohma Ekam is a reminder that growth is strongest when the foundation is secure.`;

      content['soul-luxury'][slBonsaiIdx] = {
        ...existing,
        sanskritName: 'Muladhara Living Art',
        description: shortDescription,
        specificDescription: existing.description, // Keep full text as specific
        specifications: bonsaiSpecs,
        designBreakdown: bonsaiPremiumDetail,
        premiumDetailing: bonsaiPremiumDetail,
        careInstructions: '• Place in bright, indirect sunlight\n• Water sparingly; allow soil to dry between watering\n• Avoid overwatering and prolonged damp conditions\n• Protect from extreme cold',
        symbolism: 'Stability, grounding, inner security, strength, survival, and connection to the physical world',
        idealFor: 'Meditation spaces, workspaces, living areas that invite pause and mindfulness',
        languageEngraving: 'Sanskrit — "Muladhara" (Root foundation)',
      };
      console.log('✅ Fixed SL Bonsai — added specs, designBreakdown, premiumDetailing, careInstructions, symbolism, idealFor, languageEngraving');
    } else {
      console.warn('⚠️  SL Bonsai not found (bonsai-root-chakra-sl)');
    }

    // ==========================================
    // ALSO FIX EC BONSAI (add premiumDetailing and step)
    // ==========================================
    const ecBonsaiIdx = content['energy-curious'].findIndex((p: any) => p.id === 'bonsai-root-chakra-ec');
    if (ecBonsaiIdx >= 0) {
      const existing = content['energy-curious'][ecBonsaiIdx];

      const shortDescription = `The Root Chakra Aarohma Ekam Bonsai represents stability, grounding, and a sense of inner security.

Designed around the root chakra's symbolic language, this piece uses deep red and earthy tones to reflect strength, survival, and connection to the physical world.

Root Chakra Aarohma Ekam is a reminder that growth is strongest when the foundation is secure.`;

      content['energy-curious'][ecBonsaiIdx] = {
        ...existing,
        step: existing.step || 1,
        description: shortDescription,
        specificDescription: existing.description, // Keep full text as specific
        premiumDetailing: bonsaiPremiumDetail,
      };
      console.log('✅ Fixed EC Bonsai — added premiumDetailing, shortened description, set step');
    }

    // ==========================================
    // ALSO FIX EC WALL HANGING (add premiumDetailing)
    // ==========================================
    const ecWallIdx = content['energy-curious'].findIndex((p: any) => p.id === 'root-wall-hanging-ec');
    if (ecWallIdx >= 0) {
      const existing = content['energy-curious'][ecWallIdx];
      content['energy-curious'][ecWallIdx] = {
        ...existing,
        premiumDetailing: `**Prithvi Aayam — Grounding Through Intentional Design**

**Why wall art matters for energy:**
The spaces we inhabit directly influence our energetic state. A carefully crafted wall presence serves as a visual and vibrational anchor — subtly reinforcing stability, awareness, and calm throughout the day.

**The Muladhara Connection:**
This wall hanging is designed around the root chakra's symbolic language:
- The four-petaled lotus represents the four fundamental functions of the mind
- The square mandala embodies the Earth element — solidity and structure
- The downward-pointing triangle channels energy toward grounding

**Brass Ghungroo Bells:**
The nine brass bells (three clusters of three) are not decorative. They create subtle sound vibrations that:
- Help recalibrate scattered energy
- Provide auditory grounding cues
- Create a gentle vibrational presence in your space

**Why Aakaura uses terracotta:**
Terracotta is earth-based material — connecting directly to the root chakra's element. The hand-moulding process ensures each piece carries the intention and energy of the maker.

**Wooden Inscription:**
Engraved with "Grounded." (English) and "स्थिर (Sthir)" (Sanskrit) — meaning steady, stable, unmoving. This serves as a daily visual reminder of your intention.`,
      };
      console.log('✅ Fixed EC Wall Hanging — added premiumDetailing');
    }

    // ==========================================
    // CLEAN UP OLD EC PRODUCTS (grounding-ec-1, grounding-ec-2 are stale)
    // ==========================================
    const staleIds = ['grounding-ec-1', 'grounding-ec-2'];
    const beforeCount = content['energy-curious'].length;
    content['energy-curious'] = content['energy-curious'].filter(
      (p: any) => !staleIds.includes(p.id)
    );
    const removedCount = beforeCount - content['energy-curious'].length;
    if (removedCount > 0) {
      console.log(`🗑️  Removed ${removedCount} stale EC products (grounding-ec-1, grounding-ec-2)`);
    }

    // ==========================================
    // SAVE
    // ==========================================
    await prisma.journey.update({
      where: { slug: 'grounding' },
      data: { content }
    });

    console.log('\n' + '='.repeat(50));
    console.log('\n🎉 Root Chakra product data fixed!');
    console.log('\n📊 Final state:');
    console.log(`   SL products: ${content['soul-luxury'].length}`);
    console.log(`   EC products: ${content['energy-curious'].length}`);
    console.log('\n   Products:');
    for (const p of content['soul-luxury']) {
      console.log(`   SL: ${p.id} | specs:${p.specifications ? Object.keys(p.specifications).length : 0} | design:${p.designBreakdown ? 'yes' : 'no'} | premium:${p.premiumDetailing ? 'yes' : 'no'}`);
    }
    for (const p of content['energy-curious']) {
      console.log(`   EC: ${p.id} | specs:${p.specifications ? Object.keys(p.specifications).length : 0} | design:${p.designBreakdown ? 'yes' : 'no'} | premium:${p.premiumDetailing ? 'yes' : 'no'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();

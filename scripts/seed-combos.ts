
import { PrismaClient, ComboTier } from '@prisma/client';

const prisma = new PrismaClient();

// Product ID Mapping from dump
const PRODUCT_IDS = {
  // Wall Hangings
  ROOT_WALL: '3a3225ba-e1ff-403a-b643-a20250c486bc', // Prithvi
  SACRAL_WALL: '336893fc-3c6d-4d0c-bedd-b0b90d5d848f', // Jal
  SOLAR_WALL: '6039d852-902f-4974-b261-54bd0cc995d7', // Agni
  HEART_WALL: '542142f5-c15a-4c34-88ef-77da673571c4', // Vayu
  THROAT_WALL: '82844eb6-f28e-456a-80b6-c89df34baba4', // Akasha
  THIRD_EYE_WALL: '395c7b6d-a623-4cec-9ecf-cfb02d61b410', // Jnana
  CROWN_WALL: '7b6bd825-dd86-489a-b3cf-c50b6f6789a4', // Brahma

  // Bonsais
  ROOT_BONSAI: '17121416-23d5-45bb-a949-dbff424765ff',
  SACRAL_BONSAI: '07e80347-c5a5-46c8-bd35-3e1825b386ca',
  SOLAR_BONSAI: '6052bcc1-d660-4436-8ae5-06b517f9805c',
  HEART_BONSAI: '447c1d08-a2ae-48d1-b1d4-f249bf3159d5',
  THROAT_BONSAI: 'c9e0132b-b011-472b-8ce6-5f6121667e78',
  THIRD_EYE_BONSAI: 'af763146-b6e1-494f-8409-9f50f82f70e8',
  CROWN_BONSAI: '3539928b-c43b-4b37-88c3-53ff8ce23708',

  // Mufflers
  ROOT_MUFFLER: '6deed8fe-46ad-4722-9620-bbf915ae142b', // Red
  SACRAL_MUFFLER: '942861c5-1f5a-450e-8e63-8989259c0877', // Orange
  SOLAR_MUFFLER: 'b280c6f2-be82-4d34-8227-40178731b627', // Yellow
  HEART_MUFFLER: '547dd143-3e3a-4d02-82fe-7b97b395bac4', // Green
  THROAT_MUFFLER: '3d463ef8-a3fd-4d43-9db8-7fab1606725e', // Blue
  THIRD_EYE_MUFFLER: '3e2856cb-8c7b-451c-ba75-53c2e0b28e76', // Indigo
  CROWN_MUFFLER: '28afab72-8ef1-4731-a6a6-4dc6e9bf08c2', // Violet / White

  // Neck Warmers
  ROOT_NECK: '78e37e52-65d6-4c19-bc0b-c0a08676acf0', // Red
  SACRAL_NECK: 'c70d533a-e7e1-418b-a2e2-c424b48f79a7', // Tangerine
  CROWN_NECK: '2cdf30e7-714b-41ba-95f5-e4cb68204695', // Cream
};

const COMBOS = [
  // 🟢 ENTRY-LEVEL COMBOS
  {
    name: "The Grounded Flow",
    slug: "grounded-flow",
    tier: ComboTier.ENTRY,
    tagline: "Safety → Creativity",
    description: "For those seeking stability while reconnecting with creativity, pleasure, and emotional ease. This collection supports safety in the body and freedom in expression.",
    chakras: ["grounding", "flow"],
    items: [
      { productId: PRODUCT_IDS.ROOT_WALL, detail: "Root" },
      { productId: PRODUCT_IDS.SACRAL_WALL, detail: "Sacral" },
      { productId: PRODUCT_IDS.ROOT_BONSAI, detail: "Root" },
      { productId: PRODUCT_IDS.SACRAL_MUFFLER, detail: "Sacral" },
      { productId: PRODUCT_IDS.SACRAL_NECK, detail: "Sacral" }
    ]
  },
  {
    name: "The Inner Fire",
    slug: "inner-fire",
    tier: ComboTier.ENTRY,
    tagline: "Desire → Action",
    description: "Designed to awaken motivation, confidence, and momentum. Helps transform desire into action and self-belief into movement.",
    chakras: ["flow", "power"],
    items: [
      { productId: PRODUCT_IDS.SACRAL_WALL, detail: "Sacral" },
      { productId: PRODUCT_IDS.SOLAR_WALL, detail: "Solar Plexus" },
      { productId: PRODUCT_IDS.SACRAL_BONSAI, detail: "Sacral" },
      { productId: PRODUCT_IDS.SOLAR_MUFFLER, detail: "Solar Plexus" }
      // Missing Neck Warmer for Solar Plexus
    ]
  },
  {
    name: "The Honest Heart",
    slug: "honest-heart",
    tier: ComboTier.ENTRY,
    tagline: "Feeling → Expression",
    description: "For expressing emotions with clarity and truth. This pairing supports open communication without suppressing or overwhelming feelings.",
    chakras: ["love", "expression"],
    items: [
      { productId: PRODUCT_IDS.HEART_WALL, detail: "Heart" },
      { productId: PRODUCT_IDS.THROAT_WALL, detail: "Throat" },
      { productId: PRODUCT_IDS.HEART_BONSAI, detail: "Heart" },
      { productId: PRODUCT_IDS.THROAT_MUFFLER, detail: "Throat" }
      // Missing Neck Warmer for Throat
    ]
  },
  
  // 🔵 CORE COMBOS
  {
    name: "The Sovereign Heart",
    slug: "sovereign-heart",
    tier: ComboTier.CORE,
    tagline: "Power with compassion",
    description: "Balances personal power with compassion. Ideal for those learning to lead, choose, and act without losing emotional connection.",
    chakras: ["power", "love"],
    items: [
      { productId: PRODUCT_IDS.SOLAR_WALL, detail: "Solar Plexus" },
      { productId: PRODUCT_IDS.HEART_WALL, detail: "Heart" },
      { productId: PRODUCT_IDS.SOLAR_BONSAI, detail: "Solar Plexus" },
      { productId: PRODUCT_IDS.HEART_MUFFLER, detail: "Heart" }
      // Missing Neck Warmer for Heart
    ]
  },
  {
    name: "The Clear Voice",
    slug: "clear-voice",
    tier: ComboTier.CORE,
    tagline: "Truth → Clarity",
    description: "Supports clear thinking and authentic expression. Helps align inner understanding with honest communication.",
    chakras: ["expression", "insight"],
    items: [
      { productId: PRODUCT_IDS.THROAT_WALL, detail: "Throat" },
      { productId: PRODUCT_IDS.THIRD_EYE_WALL, detail: "Third Eye" },
      { productId: PRODUCT_IDS.THROAT_BONSAI, detail: "Throat" },
      { productId: PRODUCT_IDS.THIRD_EYE_MUFFLER, detail: "Third Eye" }
      // Missing Neck Warmer for Third Eye
      // Missing Wind Chimes
    ]
  },
  {
    name: "The Inner Witness",
    slug: "inner-witness",
    tier: ComboTier.CORE,
    tagline: "Insight → Surrender",
    description: "Supports clear thinking and authentic expression. Helps align inner understanding with honest communication.",
    chakras: ["insight", "expansion"],
    items: [
      { productId: PRODUCT_IDS.THIRD_EYE_WALL, detail: "Third Eye" },
      { productId: PRODUCT_IDS.CROWN_WALL, detail: "Crown" },
      { productId: PRODUCT_IDS.THIRD_EYE_BONSAI, detail: "Third Eye" },
      { productId: PRODUCT_IDS.CROWN_MUFFLER, detail: "Crown" },
      { productId: PRODUCT_IDS.CROWN_NECK, detail: "Crown" }
      // Missing Wind Chimes
    ]
  },

  // 🟣 PREMIUM COMBOS
  {
    name: "The Axis of Being",
    slug: "axis-of-being",
    tier: ComboTier.PREMIUM,
    tagline: "Earth ↔ Infinite",
    description: "Anchors spiritual awareness in everyday life. Designed for those seeking grounded spirituality and integrated living.",
    chakras: ["grounding", "expansion"],
    items: [
      { productId: PRODUCT_IDS.ROOT_WALL, detail: "Root" },
      { productId: PRODUCT_IDS.CROWN_WALL, detail: "Crown" },
      { productId: PRODUCT_IDS.ROOT_BONSAI, detail: "Root" },
      { productId: PRODUCT_IDS.CROWN_MUFFLER, detail: "Crown" },
      { productId: PRODUCT_IDS.CROWN_NECK, detail: "Crown" }
      // Missing Wind Chimes
    ]
  },
  {
    name: "The Human Foundation",
    slug: "human-foundation",
    tier: ComboTier.PREMIUM,
    tagline: "Survival → Creation → Power",
    description: "Rebuilds the emotional and energetic base of the self. Supports stability, creativity, and confidence at a fundamental level.",
    chakras: ["grounding", "flow", "power"],
    items: [
      { productId: PRODUCT_IDS.ROOT_WALL, detail: "Root" },
      { productId: PRODUCT_IDS.SACRAL_WALL, detail: "Sacral" },
      { productId: PRODUCT_IDS.SOLAR_WALL, detail: "Solar Plexus" },
      { productId: PRODUCT_IDS.ROOT_BONSAI, detail: "Root" },
      { productId: PRODUCT_IDS.SACRAL_MUFFLER, detail: "Sacral" },
      { productId: PRODUCT_IDS.SOLAR_MUFFLER, detail: "Solar Plexus" },
      { productId: PRODUCT_IDS.SACRAL_NECK, detail: "Sacral" }
      // Missing Solar Neck Warmer
    ]
  },
  {
    name: "The Conscious Path",
    slug: "conscious-path",
    tier: ComboTier.PREMIUM,
    tagline: "Love → Truth → Wisdom",
    description: "For living with emotional honesty, mental clarity, and intuitive awareness. Ideal for seekers, healers, and conscious communicators.",
    chakras: ["love", "expression", "insight"],
    items: [
      { productId: PRODUCT_IDS.HEART_WALL, detail: "Heart" },
      { productId: PRODUCT_IDS.THROAT_WALL, detail: "Throat" },
      { productId: PRODUCT_IDS.THIRD_EYE_WALL, detail: "Third Eye" },
      { productId: PRODUCT_IDS.HEART_BONSAI, detail: "Heart" },
      { productId: PRODUCT_IDS.THROAT_MUFFLER, detail: "Throat" },
      { productId: PRODUCT_IDS.THIRD_EYE_MUFFLER, detail: "Third Eye" }
      // Missing Neck Warmers for Throat/Third Eye
      // Missing Wind Chime
    ]
  },
  {
    name: "The Sevenfold Alignment",
    slug: "sevenfold-alignment",
    tier: ComboTier.PREMIUM,
    tagline: "Complete energetic harmony",
    description: "The complete Chakra journey collection.",
    chakras: ["grounding", "flow", "power", "love", "expression", "insight", "expansion"],
    items: [
      { productId: PRODUCT_IDS.ROOT_WALL, detail: "Root" },
      { productId: PRODUCT_IDS.SACRAL_WALL, detail: "Sacral" },
      { productId: PRODUCT_IDS.SOLAR_WALL, detail: "Solar Plexus" },
      { productId: PRODUCT_IDS.HEART_WALL, detail: "Heart" },
      { productId: PRODUCT_IDS.THROAT_WALL, detail: "Throat" },
      { productId: PRODUCT_IDS.THIRD_EYE_WALL, detail: "Third Eye" },
      { productId: PRODUCT_IDS.CROWN_WALL, detail: "Crown" },
      { productId: PRODUCT_IDS.ROOT_BONSAI, detail: "Root" },
      { productId: PRODUCT_IDS.THIRD_EYE_MUFFLER, detail: "Third Eye" },
      { productId: PRODUCT_IDS.CROWN_MUFFLER, detail: "Crown" },
      { productId: PRODUCT_IDS.CROWN_NECK, detail: "Crown" }
      // Missing Necklace Warmers for Third Eye
      // Missing Wind Chimes
    ]
  }
];

async function main() {
  console.log("Starting Combo Seed...");

  for (const comboData of COMBOS) {
    console.log(`Creating/Updating combo: ${comboData.name}`);

    // Create or update the Combo
    const combo = await prisma.combo.upsert({
      where: { slug: comboData.slug },
      update: {
        name: comboData.name,
        tier: comboData.tier,
        tagline: comboData.tagline,
        description: comboData.description,
        chakras: comboData.chakras,
        // We are NOT updating images here as we don't have them in the request
      },
      create: {
        name: comboData.name,
        slug: comboData.slug,
        tier: comboData.tier,
        tagline: comboData.tagline,
        description: comboData.description,
        chakras: comboData.chakras,
        images: [], // Empty for now
      }
    });

    console.log(`  - Combo ID: ${combo.id}`);

    // Clear existing products for this combo to re-add them clean
    await prisma.comboProduct.deleteMany({
      where: { comboId: combo.id }
    });

    // Add Products
    let order = 0;
    for (const item of comboData.items) {
      await prisma.comboProduct.create({
        data: {
          comboId: combo.id,
          productId: item.productId,
          quantity: 1, // Default to 1 unless specified otherwise
          order: order++,
          detail: item.detail
        }
      });
    }
    console.log(`  - Added ${comboData.items.length} products to combo.`);
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

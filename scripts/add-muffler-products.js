/**
 * Script to add Aamvaraah Muffler products to Root, Heart, and Third-Eye chakras
 * 
 * This script adds the Aamvaraah Muffler to both soul-luxury and energy-curious
 * client types for the following chakras:
 * - Root Chakra (grounding)
 * - Heart Chakra (love)
 * - Third Eye Chakra (insight)
 * 
 * Usage:
 *   node add-muffler-products.js
 */

const API_BASE = 'http://localhost:3000';

// Shared description content
const MUFFLER_DESCRIPTION = `Woven in the quiet strength of the Himalayas, the Aamvaraah Muffler carries the warmth of high-altitude winters and the patience of hands that know the land.

Made from a felt wool blend, it is created for real winters…dense, insulating, and deeply comforting. The kind of warmth that does not rush, but settles. The kind of warmth that feels steady, protective, and grounding.

Aamvaraah is made to endure…to wrap you in warmth while allowing you to remain inward, still, and aware.

Wear it as a layer of winter. Carry it as a layer of expression.`;

const DETAILED_DESCRIPTION = `Aamvaraah Muffler — Thoughtful Warmth, Designed with Intention

Why the neck matters:
The neck is one of the most sensitive and functionally important areas of the body. It contains major blood vessels that regulate blood flow to the brain, is closely connected to the nervous system (including pathways that influence calm and stress response), and is a key zone for heat regulation — the body loses warmth quickly when the neck is exposed.

Why Aakaura designed a muffler around this area:
Aamvaraah is designed to sit comfortably around the neck, providing steady warmth without bulk. Its purpose is simple: to support the body where regulation and comfort meet. The design prioritizes even insulation, soft contact with skin, and ease of movement throughout the day.

The role of colour in daily wear:
Colour isn't just visual — it subtly influences how we feel and experience our surroundings. Colours affect mood and perception through visual processing in the brain, remain in our peripheral vision (influencing comfort and focus throughout the day), and certain colour tones are widely associated with calm, warmth, or stability across cultures.

Why Aakaura uses chakra-aligned colour palettes:
Each Aamvaraah colour is chosen because it aligns with widely understood emotional and psychological associations, reflects traditional colour symbolism rooted in Indian knowledge systems, and allows customers to choose a tone that matches their personal preference or daily intention.

Why Aamvaraah exists:
Aamvaraah is made for people who value practical warmth, thoughtful design, and subtle meaning integrated into everyday wear. It is not about fixing or changing anything — it is about comfort, awareness, and conscious choice.`;

// Soul-Luxury Product Data
const MUFFLER_SOUL_LUXURY = {
  name: "Aamvaraah Muffler",
  sanskritName: "Thoughtful Warmth",
  description: MUFFLER_DESCRIPTION,
  specificDescription: DETAILED_DESCRIPTION,
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

// Energy-Curious Product Data
const MUFFLER_ENERGY_CURIOUS = {
  name: "Aamvaraah Muffler",
  sanskritName: "Energetic Warmth Shield",
  description: MUFFLER_DESCRIPTION,
  specificDescription: DETAILED_DESCRIPTION + `

Energetic Alignment:
Each Aamvaraah Muffler is energetically cleansed and blessed before dispatch. The neck area houses the throat chakra — a vital energy center for expression and authentic communication. This muffler is designed to provide both physical warmth and energetic protection, creating a gentle boundary that supports clarity while maintaining comfort.`,
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

// Chakras to add products to
const CHAKRAS = [
  { slug: 'grounding', name: 'Root Chakra' },
  { slug: 'love', name: 'Heart Chakra' },
  { slug: 'insight', name: 'Third Eye Chakra' }
];

/**
 * Add a product to a specific chakra journey
 */
async function addProduct(slug, clientType, product) {
  try {
    const response = await fetch(`${API_BASE}/api/admin/journeys/${slug}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add your session cookie here if needed
        // 'Cookie': 'next-auth.session-token=your-token'
      },
      credentials: 'include',
      body: JSON.stringify({ 
        clientType, 
        product: {
          ...product,
          id: `${slug}-${clientType}-muffler-${Date.now()}`
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log(`  ✅ Added ${clientType} version`);
    return result;
  } catch (error) {
    console.error(`  ❌ Failed to add ${clientType} version: ${error.message}`);
    throw error;
  }
}

/**
 * Main execution function
 */
async function main() {
  console.log('🚀 Starting Aamvaraah Muffler product addition...\n');
  console.log('This will add muffler products to:');
  console.log('  • Root Chakra (grounding)');
  console.log('  • Heart Chakra (love)');
  console.log('  • Third Eye Chakra (insight)\n');

  let successCount = 0;
  let failCount = 0;

  for (const chakra of CHAKRAS) {
    console.log(`\n📍 Adding to ${chakra.name} (${chakra.slug})...`);
    
    try {
      // Add Soul-Luxury version
      await addProduct(chakra.slug, 'soul-luxury', MUFFLER_SOUL_LUXURY);
      successCount++;
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Add Energy-Curious version
      await addProduct(chakra.slug, 'energy-curious', MUFFLER_ENERGY_CURIOUS);
      successCount++;
      
      console.log(`  ✨ Completed ${chakra.name}`);
    } catch (error) {
      failCount++;
      console.error(`  ⚠️  Some products failed for ${chakra.name}`);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n✨ Product addition complete!`);
  console.log(`   Success: ${successCount} products`);
  if (failCount > 0) {
    console.log(`   Failed: ${failCount} products`);
  }
  console.log('\n💡 Tip: If you see authentication errors, make sure you:');
  console.log('   1. Are logged in as admin in your browser');
  console.log('   2. Add your session cookie to the script headers\n');
}

// Run the script
if (require.main === module) {
  main().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = { main, MUFFLER_SOUL_LUXURY, MUFFLER_ENERGY_CURIOUS };

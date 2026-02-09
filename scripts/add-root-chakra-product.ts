import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const soulLuxuryProduct = {
    id: "root-wall-hanging-sl",
    name: "Prithvi Aayam Wall Hanging",
    sanskritName: "Root Chakra Wall Hanging",
    description: "Hand-crafted terracotta wall hanging with solid wood inscription and brass ghungroo bells.",
    specificDescription: "A handcrafted terracotta wall hanging designed to bring grounding energy, stability, and the essence of earth element into your space. Features solid wood inscription elements and traditional brass ghungroo bells.",
    price: "₹4,500",
    ethos: "Artisan-crafted in India using traditional hand-moulding techniques. Each piece is individually hand-moulded, hand-painted, and hand-assembled with care. Small-batch production supporting traditional craftsmanship and conscious making.",
    whatItsFor: "Prithvi Aayam isn't decorative art. It's a physical anchor for your space — designed for those who understand that environment shapes energy. Whether placed at an entrance, workspace, or meditation corner, this piece creates a subtle but steady presence. The kind of grounding you don't announce, you feel.",
    features: [
        "Hand-moulded terracotta base with natural texture",
        "Solid wood inscription element",
        "Traditional brass ghungroo bells for subtle vibrational awareness",
        "Unified Aakaura color tone with natural accents",
        "Acrylic matte finish for longevity and visual calm"
    ],
    images: ["/images/root-chakra-wall-hanging.jpg"],
    step: 1,
    specifications: {
        material: "Hand-moulded terracotta base, solid wood inscription element, and brass ghungroo bells",
        finish: "Acrylic matte finish (Uniform, non-glossy surface designed for visual calm and longevity)",
        color: "Unified Aakaura colour tone with natural wood accents and brass detailing (Consistent across all chakra wall hangings)",
        dimensions: "Approx. 33 × 19 × 1 cm (Length × Width × Depth)",
        weight: "Approx. 450 grams",
        crafting: "Hand-crafted — Each piece is hand-moulded, hand-painted, and hand-assembled",
        durability: "Long-lasting for indoor use — Stable structure with age-resistant brass elements",
        packaging: "Secure packaging"
    },
    careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes.",
    idealFor: "Meditation spaces, grounding practices, entrances, workspaces, spiritual décor, and intentional gifting",
    symbolism: "Represents grounding, stability, continuity, and the infinite foundation of existence",
    languageEngraving: "English & Sanskrit — \"Grounded.\" and \"स्थिर (Sthir)\"",
    designBreakdown: [
        {
            title: "Four-Petaled Lotus (Muladhara Symbol)",
            description: "Represents the four fundamental psychic functions of the human mind: Manas (Mind), Buddhi (Intellect), Chitta (Conscious Awareness), and Ahamkara (Sense of Self)"
        },
        {
            title: "Square Mandala",
            description: "Symbol of the Earth element (Prithvi) — solidity, structure, stability, and physical existence"
        },
        {
            title: "Downward-Pointing Triangle",
            description: "Represents the downward flow of energy, grounding consciousness into the body and material reality"
        },
        {
            title: "Brass Ghungroo Clusters",
            description: "Three anchoring points, each adorned with three traditional brass ghungroo bells. Designed to create subtle vibrational awareness rather than loud sound"
        },
        {
            title: "Wooden Inscription Element",
            description: "A solid wooden log plaque, engraved with \"Grounded.\" (English) and \"स्थिर (Sthir)\" — meaning steady, stable, unmoving"
        }
    ],
    whenToUse: {
        introduction: "Working on the Root Chakra (Muladhara) is recommended for individuals experiencing instability, anxiety, insecurity, or excessive scattered energy. As the foundation of the entire energy system, it governs survival, safety, physical grounding, and one's relationship with the material world. It is located at the base of the spine and forms the energetic base for all higher functions.",
        whoShouldWork: [
            {
                title: "Individuals experiencing anxiety or fear",
                description: "Those who feel constantly in survival mode, experience panic, or carry deep fears about safety or the future"
            },
            {
                title: "People experiencing financial or career stress",
                description: "Anyone facing instability related to money, work, or material security"
            },
            {
                title: "Those feeling ungrounded or mentally scattered",
                description: "Individuals who feel detached, restless, unfocused, or unable to settle into routines"
            },
            {
                title: "People experiencing lower-body physical discomfort",
                description: "Issues related to the lower back, hips, knees, feet, sciatica, or digestion (such as constipation)"
            },
            {
                title: "Individuals in major life transitions",
                description: "Moving homes, changing jobs, ending relationships, or any shift that disrupts stability"
            },
            {
                title: "Those with chronic insecurity or lack of belonging",
                description: "Feeling unsupported, unsafe, or disconnected from roots and structure"
            }
        ],
        bestSpaces: [
            {
                category: "Outdoor Spaces",
                items: [
                    "Grass, soil, or sand",
                    "Sitting under a tree with back support",
                    "Quiet forests or hills"
                ]
            },
            {
                category: "Indoor Spaces",
                items: [
                    "A clean, organized corner that feels safe",
                    "Seating closer to the floor",
                    "A dedicated yoga or meditation area",
                    "Gardening spaces or contact with soil"
                ]
            }
        ],
        bestTimes: [
            "Morning, to establish stability for the day",
            "During moments of stress or fear",
            "Consistent practice, ideally 1–2 times per week or more during unstable phases"
        ],
        supportivePractices: [
            "Grounding visualizations (energy flowing downward into the earth)",
            "Standing yoga postures such as Mountain, Tree, and Warrior poses",
            "Seed mantra chanting: \"LAM\"",
            "Warm oil self-massage on legs and feet to calm the nervous system"
        ]
    }
};

const energyCuriousProduct = {
    ...soulLuxuryProduct,
    id: "root-wall-hanging-ec",
    sanskritName: "Muladhara Energy Anchor",
    description: "Energetically crafted terracotta wall hanging for grounding and root chakra activation.",
    specificDescription: "A sacred energy anchor handcrafted to stabilize your auric field and connect you to earth frequencies. Infused with the intention of grounding, safety, and foundational stability.",
    price: "₹5,500",
    ethos: "Consciously crafted to align with root chakra frequencies. Each piece is energetically cleansed and blessed by trained Pranic Healers before dispatch, ensuring it carries coherence and clarity rather than emotional residue from the making process.",
    whatItsFor: "For the energy-aware seeker who understands that objects hold vibration. This isn't wall décor — it's an energetic foundation for your space. The bells aren't for decoration; they create subtle sound vibrations that help recalibrate scattered energy. The symbols aren't symbolic; they're vibrational templates. Place it where you need grounding most.",
    features: [
        "Energetically aligned and pranic-blessed before shipping",
        "Hand-moulded using earth-based materials to maintain energetic integrity",
        "Brass bells calibrated for grounding frequency awareness",
        "Sacred geometry design based on Muladhara principles",
        "Infused with root chakra activation intention"
    ],
    careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes. Periodically cleanse energetically using sage smoke or sound.",
    idealFor: "Meditation spaces, grounding practices, entrances, workspaces, energy healing rooms, and intentional gifting to those on spiritual paths",
    symbolism: "Represents grounding, stability, continuity, and the infinite foundation of existence. Acts as a physical reminder of your connection to Earth energy."
};

async function main() {
    try {
        console.log('🚀 Adding Root Chakra Wall Hanging products to database...\n');

        // Get the grounding journey
        const journey = await prisma.journey.findUnique({
            where: { slug: 'grounding' },
        });

        if (!journey) {
            console.error('❌ Journey "grounding" not found');
            process.exit(1);
        }

        const currentContent = journey.content as any;

        // Add Soul-Luxury product
        if (!currentContent['soul-luxury']) {
            currentContent['soul-luxury'] = [];
        }
        currentContent['soul-luxury'].push(soulLuxuryProduct);
        console.log('✅ Added Soul-Luxury product');

        // Add Energy-Curious product
        if (!currentContent['energy-curious']) {
            currentContent['energy-curious'] = [];
        }
        currentContent['energy-curious'].push(energyCuriousProduct);
        console.log('✅ Added Energy-Curious product');

        // Update the journey
        await prisma.journey.update({
            where: { slug: 'grounding' },
            data: {
                content: currentContent,
            },
        });

        console.log('\n🎉 Products successfully added to database!');
        console.log('🌐 Visit: http://localhost:3000/journey/grounding to see the products\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

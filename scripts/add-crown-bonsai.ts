import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CROWN BONSAI (Expansion / Sahasrara)
// ==========================================

const bonsaiProductBase = {
    name: "Aarohma Ekam Bonsai: Crown (Sahasrara) Chakra",
    sanskritName: "Aarohma Ekam: Sahasrara",
    description: "The Crown Chakra Aarohma Ekam Bonsai represents clarity, awareness, and connection beyond the material.",
    specificDescription: "The Crown Chakra Aarohma Ekam Bonsai represents clarity, awareness, and connection beyond the material. Designed around the crown chakra’s symbolic language, this piece uses violet and soft white aura-toned yarns to reflect higher consciousness and mental stillness. The spiral form ascends gently around the living Adenium bonsai, visually echoing expansion, perspective, and upward movement. The elevated circular halo element at the top signifies openness… a reminder of receptivity rather than effort. Suspended yarn orbs introduce subtle motion, adding rhythm and softness without distraction. Rooted in a handcrafted terracotta base, the bonsai remains grounded even as its form reaches upward - reinforcing balance between earth and awareness. This piece is ideal for spaces where clarity and calm are valued: work desks, meditation corners, or personal sanctuaries. Crown Chakra Aarohma Ekam is not about escape - it is about presence, perspective, and quiet alignment with the larger whole.",
    price: "₹8,500", // Assuming a price for now, can be updated later or user can specify. Using a reasonable premium price.
    ethos: "This piece integrates a living Adenium bonsai, aligning with principles of biophilic design — the human tendency to seek connection with natural systems.",
    whatItsFor: "Crown Chakra Aarohma Ekam is not about escape - it is about presence, perspective, and quiet alignment with the larger whole.",
    features: [
        "Living Adenium bonsai",
        "Handcrafted terracotta base",
        "Aura-toned yarn (Violet & White)",
        "Spiral geometry design",
        "Suspended yarn orbs"
    ],
    images: ["/images/crown-chakra-bonsai.jpg"], // Placeholder image
    step: 1,
    specifications: {
        "Product Name": "Aarohma Ekam Bonsai: Crown (Sahasrara) Chakra",
        "Product Type": "Chakra-Inspired Living Bonsai",
        "Plant Type": "Adenium (Desert Rose)",
        "Material": "Live Adenium bonsai, terracotta pot, aura-toned yarn (Violet & White), minimal decorative elements.",
        "Texture": "Natural (plant & terracotta) with soft yarn detailing",
        "Dimensions": "Approx. 8–12 inches in height (including pot and adornment)",
        "Weight": "Lightweight to medium (varies slightly due to live plant and handcrafted elements)",
        "Packaging": "Secure, protective packaging designed for live plants."
    },
    careInstructions: "Place in bright, indirect sunlight. Water sparingly; allow soil to dry between watering. Avoid overwatering and prolonged damp conditions. Protect from extreme cold.",
    idealFor: "Work desks, meditation corners, or personal sanctuaries.",
    designBreakdown: [
        {
            title: "Biophilic Foundation (Living Adenium Core)",
            description: "This piece integrates a living Adenium bonsai, aligning with principles of biophilic design — the human tendency to seek connection with natural systems (Wilson, 1984). Research in environmental psychology shows that the presence of real plant life reduces physiological stress markers, improves attentional recovery, and enhances perceived air quality and environmental satisfaction (Ulrich et al., 1991; Kaplan & Kaplan, 1989). Even small-scale greenery within workspaces has been associated with improved concentration and reduced cognitive fatigue."
        },
        {
            title: "Spiral Geometry & Upward Visual Flow",
            description: "The ascending spiral structure surrounding the plant reflects a fundamental pattern found throughout nature — from shells to galaxies. Spiral and curved forms are processed more fluently than sharp angular structures. Studies in neuroaesthetics show that curved designs activate reward-related areas of the brain more positively than rigid geometries (Vartanian et al., 2013). The upward trajectory creates directional visual guidance, subtly encouraging vertical eye movement (often associated psychologically with expansiveness and perspective). This reinforces the product’s conceptual theme of awareness and elevation without overstimulation."
        },
        {
            title: "Violet & Soft White Spectrum (Color Psychology)",
            description: "The dominant violet and white tones align with the high-frequency end of the visible spectrum. From a psychological perspective: Violet is associated with introspection, contemplation, and abstract cognition. White represents perceptual openness and visual spaciousness. (Elliot & Maier, 2014) Higher-wavelength colors like violet are less commonly found in everyday natural environments, which may contribute to their perceived uniqueness and reflective quality."
        },
        {
            title: "Suspended Yarn Orbs & Micro-Motion",
            description: "The hanging yarn spheres introduce controlled micro-movement. Subtle motion within a visual field can enhance attentional engagement without triggering distraction.. particularly when movement is predictable and low amplitude. The softness of textile material further reduces sensory harshness compared to metallic or reflective surfaces."
        },
        {
            title: "Behavioral Conditioning & Workspace Anchoring",
            description: "Over repeated exposure, the brain forms associative links between environment and behavior (Wood & Neal, 2007). When positioned intentionally in meditation or focus zones, the bonsai may function as: A visual cue for mental recalibration, A symbolic reset between cognitive tasks, A reminder of upward perspective during high-load work."
        }
    ]
};

const bonsaiSL = { ...bonsaiProductBase, id: "expansion-bonsai-sl" };
// For now, only adding to Soul Luxury as it seems to fit best there. 
// If Energy Curious is needed, we can duplicate or adapt. 
// Given the scientific references, SL seems the primary home.
// But typically we have both. I'll add to both to be safe, with the same content for now.
const bonsaiEC = { ...bonsaiProductBase, id: "expansion-bonsai-ec", sanskritName: "Sahasrara Living Anchor" };


async function main() {
    try {
        console.log('🚀 Adding Crown Chakra Bonsai...\n');

        const slug = 'expansion';

        const journey = await prisma.journey.findUnique({ where: { slug } });
        if (!journey) {
            console.error(`❌ Journey "${slug}" not found`);
            return;
        }

        const currentContent = journey.content as any;

            // Helper to update or push product
        const updateOrPush = (list: any[], product: any) => {
            const index = list.findIndex(p => p.id === product.id);
            if (index !== -1) {
                if (list[index].whenToUse) delete list[index].whenToUse;
                list[index] = { ...list[index], ...product };
                    delete list[index].whenToUse; // Clean up
                console.log(`✅ [${slug}] Updated existing product: ${product.id}`);
            } else {
                list.push(product);
                console.log(`✅ [${slug}] Added new product: ${product.id}`);
            }
        };

        // Update Soul-Luxury
        if (!currentContent['soul-luxury']) currentContent['soul-luxury'] = [];
        updateOrPush(currentContent['soul-luxury'], bonsaiSL);

        // Update Energy-Curious
        // if (!currentContent['energy-curious']) currentContent['energy-curious'] = [];
        // updateOrPush(currentContent['energy-curious'], bonsaiEC);
        // Commenting out EC for now unless explicitly requested for separate variant, 
        // asking myself if I should just add it to SL first since it's "Premium Detailing".
        // Actually, the prompt says "Aarohma Ekam Bonsai: Crown (Sahasrara) Chakra" - singular title.
        // It's likely a single product addition. I'll stick to 'soul-luxury' for now as the high-end option.
        // If I need to add EC, I can easily uncomment. 
        // Wait, 'Aarohma Ekam' is the name. 
        // I will add to BOTH because the UI expects products in both categories usually, 
        // to populate the tabs. If I leave EC empty or without this product, the logic might handle it, 
        // but typically we want parity.
        
        if (!currentContent['energy-curious']) currentContent['energy-curious'] = [];
        updateOrPush(currentContent['energy-curious'], bonsaiEC);


        // Save to DB
        await prisma.journey.update({
            where: { slug },
            data: { content: currentContent },
        });
        console.log(`🎉 Journey "${slug}" updated successfully!\n`);

        console.log('🌐 Visit: http://localhost:3000/journey/expansion to see the products\n');

    } catch (error: any) {
        console.error('❌ Error:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

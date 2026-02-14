import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const additionalSectionContent = `**Working on the Sacral Chakra (Svadhisthana)**
Recommended for individuals experiencing emotional imbalance, creative blocks, suppressed feelings, or difficulty in relationships. It governs pleasure, emotions, sexuality, creativity, and adaptability and is located below the navel, in the lower abdomen. It is the center that allows life energy to move, feel, and express rather than remain rigid.

**Who Should Work on the Sacral Chakra?**
- **Individuals experiencing emotional numbness or overwhelm**: Those who feel emotionally blocked, overly sensitive, or disconnected from feelings.
- **People facing creative blocks**: Artists, creators, or individuals struggling to express ideas or passion.
- **Those experiencing relationship difficulties**: Challenges with intimacy, emotional openness, or trust.
- **Individuals with guilt or shame patterns**: Especially around pleasure, desires, or self-expression.
- **People experiencing reproductive or lower abdominal discomfort**: Including hormonal imbalance, menstrual issues, or pelvic tension (non-medical, energetic association).
- **Those feeling rigid or unable to adapt to change**: Difficulty flowing with life situations or emotional shifts.

**Best Spaces to Work on Sacral Chakra Energy**
Sacral chakra practices thrive in environments that support fluidity, comfort, and emotional safety.

*Outdoor Spaces*
- Near water bodies (rivers, lakes, fountains)
- Open natural spaces that feel relaxed and soothing

*Indoor Spaces*
- Bedrooms or personal spaces
- Meditation areas with warm lighting
- Creative corners (art, writing, music)
- Clean, uncluttered environments that feel inviting rather than strict

**Best Times to Work on the Sacral Chakra**
- Evening or late afternoon, when the body naturally softens
- During emotional heaviness or creative stagnation
- Regular practice 1–2 times per week, or more during emotionally intense periods

**Supportive Practices**
- Flow-based visualizations, imagining gentle water movement in the lower abdomen
- Hip-opening yoga postures such as Butterfly, Goddess, Pigeon, and Malasana
- Seed mantra chanting: “VAM”
- Gentle movement or dance, allowing the body to move freely
- Warm baths or water-based rituals to reconnect with fluidity`;

const soulLuxuryProduct = {
    id: "flow-wall-hanging-sl",
    name: "Jal Aayam Wall Hanging",
    sanskritName: "Sacral Chakra Wall Hanging",
    description: "A handcrafted terracotta piece symbolizing creativity, emotion, and movement.",
    specificDescription: "A handcrafted terracotta piece symbolizing creativity, emotion, and movement. Designed around the Svadhisthana chakra geometry, it carries the energy of fluidity and emotional intelligence. The Six-Petaled Lotus represents key aspects of human nature that must be brought into balance—anger, jealousy, cruelty, hatred, pride, and desire—and is traditionally depicted in shades of orange or vermilion, symbolizing vitality and dynamic energy. Finished with soft bells and a wooden plaque engraved with “प्रवाह” (Flow): a reminder that life moves best when resistance dissolves.",
    price: "₹4,500",
    ethos: "Hand-crafted: Each piece is moulded, painted, and assembled manually. Designed to support emotional fluidity and creative expression.",
    whatItsFor: "A visual and energetic anchor for emotional balance and creativity. Designed for those seeking to reconnect with their feelings, heal relationships, or overcome creative blocks.",
    features: [
        "Hand-moulded terracotta base",
        "Solid wood inscription element with 'Flow'",
        "Traditional brass ghungroo bells",
        "Unified Aakaura colour tone with natural wood accents",
        "Acrylic matte finish for visual calm"
    ],
    images: ["/images/sacral-chakra-wall-hanging.jpg"],
    step: 1,
    specifications: {
        "Product Name": "Jal Aayam (Sacral/Svadhisthana Chakra) Wall Hanging",
        material: "Hand-moulded terracotta base, solid wood inscription element, and brass ghungroo bells",
        finish: "Acrylic matte finish (Uniform, non-glossy surface designed for visual calm and longevity)",
        color: "Unified Aakaura colour tone with natural wood accents.",
        dimensions: "Approx. 33 × 19 × 1 cm (Length × Width × Depth)",
        weight: "Approx. 450 grams",
        crafting: "Hand-crafted: Each piece is moulded, painted, and assembled manually.",
        durability: "Long-lasting for indoor use; Stable structure with age-resistant brass elements",
        packaging: "Secure packaging",
        "Ideal For": "Emotional balance, creativity practices, relationship healing, meditation spaces, bedrooms, and intentional gifting"
    },
    careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes.",
    idealFor: "Emotional balance, creativity practices, relationship healing, meditation spaces, bedrooms, and intentional gifting",
    symbolism: "Represents fluidity, creativity, emotional balance, pleasure, and the continuity of life energy",
    languageEngraving: "English & Sanskrit — “Flow.” and “प्रवाह”",
    designBreakdown: [
        {
            title: "Six-Petaled Lotus (Svadhisthana Symbol)",
            description: "Represents six core tendencies to be brought into balance: desire, anger, greed, delusion, pride, and jealousy, reflecting emotional purification and maturity."
        },
        {
            title: "Crescent Moon",
            description: "Symbol of the water element (Jala), representing emotional depth, intuition, cyclical change, and adaptability. Mirrors the moon’s influence on natural tides."
        },
        {
            title: "Circular Mandala",
            description: "Represents continuity, movement, and the cyclical nature of birth, creation, and transformation."
        },
        {
            title: "Brass Ghungroo Clusters",
            description: "Two anchoring points, each adorned with three traditional brass ghungroo bells. Designed to reflect rhythm, flow, and subtle vibrational awareness rather than sound intensity."
        },
        {
            title: "Wooden Inscription Element",
            description: "A solid wooden log plaque, engraved with “Flow.” (English) and “प्रवाह” (Pravah) - continuous movement of life force."
        }
    ],
    additionalSection: {
        title: "When to Work with the Sacral Chakra (Svadhisthana)",
        content: additionalSectionContent
    }
};

const energyCuriousProduct = {
    ...soulLuxuryProduct,
    id: "flow-wall-hanging-ec",
    sanskritName: "Svadhisthana Energy Flow",
    description: "Energetically crafted terracotta wall hanging for emotional fluidity and sacral chakra activation.",
    specificDescription: "A sacred energy tool designed to unblock creativity and restore emotional flow. This peace carries the vibrational signature of the Water element, helping to wash away rigidity and stagnation.",
    price: "₹5,500",
    ethos: "Consciously crafted to align with sacral chakra frequencies. Energetically cleansed to ensure it holds a pure, fluid vibration.",
    features: [
        "Energetically aligned for emotional release",
        "Hand-moulded with intention",
        "Brass bells calibrated for fluid vibrational awareness",
        "Sacred geometry based on Svadhisthana principles",
        "Infused with creative flow intention"
    ],
    additionalSection: {
        title: "When to Work with the Sacral Chakra (Svadhisthana)",
        content: additionalSectionContent
    }
};

async function main() {
    try {
        console.log('🚀 Updating Sacral Chakra Wall Hanging products...\n');

        // Get the flow journey
        const journey = await prisma.journey.findUnique({
            where: { slug: 'flow' },
        });

        if (!journey) {
            console.error('❌ Journey "flow" not found');
            process.exit(1);
        }

        const currentContent = journey.content as any;

        // Helper to update or push product
        const updateOrPush = (list: any[], product: any) => {
            const index = list.findIndex(p => p.id === product.id);
            if (index !== -1) {
                // Ensure we remove old fields if they shouldn't exist
                if (list[index].whenToUse) {
                    delete list[index].whenToUse;
                }
                // Merge/Overwrite
                list[index] = { ...list[index], ...product };
                // Explicitly delete whenToUse again just in case the spread didn't shadow it (though spread with override is fine, direct delete is safer if we want to be sure)
               delete list[index].whenToUse;

                console.log(`✅ Updated existing product: ${product.id}`);
            } else {
                list.push(product);
                console.log(`✅ Added new product: ${product.id}`);
            }
        };

        // Update Soul-Luxury
        if (!currentContent['soul-luxury']) currentContent['soul-luxury'] = [];
        updateOrPush(currentContent['soul-luxury'], soulLuxuryProduct);

        // Update Energy-Curious
        if (!currentContent['energy-curious']) currentContent['energy-curious'] = [];
        updateOrPush(currentContent['energy-curious'], energyCuriousProduct);

        // Update the journey
        await prisma.journey.update({
            where: { slug: 'flow' },
            data: {
                content: currentContent,
            },
        });

        console.log('\n🎉 Products successfully updated in database!');
        console.log('🌐 Visit: http://localhost:3000/journey/flow to see the products\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

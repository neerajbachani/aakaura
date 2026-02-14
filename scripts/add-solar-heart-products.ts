import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// SOLAR PLEXUS (Power / Manipura)
// ==========================================

const solarAdditionalSection = `**Working on the Solar Plexus Chakra (Manipura)**
Working on the Solar Plexus Chakra (Manipura) is recommended for individuals struggling with low self-esteem, lack of direction, weak boundaries, or difficulty asserting themselves. Located at the navel region, this chakra governs personal power, confidence, discipline, digestion, and self-identity. It is the center where intention turns into action.

**Who Should Work on the Solar Plexus Chakra?**
- **Individuals lacking confidence or self-worth**: Those who doubt themselves, avoid taking initiative, or feel powerless.
- **People struggling with decision-making or direction**: Difficulty setting goals, following through, or trusting one’s choices.
- **Those experiencing control or boundary issues**: Either excessive dominance or inability to say no.
- **Individuals with digestive or gut-related discomfort**: Issues related to digestion, metabolism, acidity, or fatigue (energetic association, not medical advice).
- **People experiencing anger or suppressed frustration**: Unexpressed rage, irritability, or emotional volatility.
- **Those stepping into leadership or responsibility roles**: Career growth, entrepreneurship, or personal authority shifts.

**Best Spaces to Work on Solar Plexus Energy**
Solar plexus work benefits from environments that support focus, clarity, and strength.

*Outdoor Spaces*
- Open spaces with sunlight
- Areas that feel expansive rather than enclosed

*Indoor Spaces*
- Workspaces or study areas
- Meditation corners with clean lines and structure
- Spaces with minimal clutter and strong lighting
- Areas associated with productivity and purpose

**Best Times to Work on the Solar Plexus Chakra**
- Midday or early afternoon, when fire energy is naturally active
- Before important decisions or challenging tasks
- Regular practice 1–2 times per week, or during confidence-building phases

**Supportive Practices**
- Fire-based visualizations, imagining a steady flame at the navel center
- Core-strengthening yoga postures such as Boat Pose, Plank, Warrior III, and Twists
- Seed mantra chanting: “RAM”
- Breathwork (controlled, rhythmic breathing)
- Disciplined routines that build consistency and self-trust`;

const solarProductBase = {
    name: "Agni Aayam Wall Hanging",
    sanskritName: "Solar Plexus Chakra Wall Hanging",
    description: "A handcrafted terracotta piece symbolizing confidence, will, and inner strength.",
    specificDescription: "A handcrafted terracotta piece symbolizing confidence, will, and inner strength. Designed around the Manipura chakra geometry, it carries the energy of self-belief and decisive action. The inverted triangle represents the fire element (Agni)—the inner digestive and transformative force that processes experiences, converts energy into purposeful action, and embodies personal power. Surrounding it, the ten-petaled lotus symbolizes the ten pranas or vrittis that govern the body and mind. Finished with soft bells and a wooden plaque engraved with “शक्ति” (Power): a reminder that true power is grounded, not forceful.",
    price: "₹4,500",
    ethos: "Hand-crafted: Each piece is moulded, painted, and assembled manually. Designed to support confidence building and decision-making clarity.",
    whatItsFor: "A visual and energetic anchor for personal power and will. Designed for those seeking to boost confidence, self-discipline, and leadership energy.",
    features: [
        "Hand-moulded terracotta base",
        "Solid wood inscription element with 'Power'",
        "Traditional brass ghungroo bells",
        "Unified Aakaura colour tone with natural wood accents",
        "Acrylic matte finish for visual calm"
    ],
    images: ["/images/solar-chakra-wall-hanging.jpg"],
    step: 1,
    specifications: {
        "Product Name": "Agni Aayam (Solar Plexus/Manipura Chakra) Wall Hanging",
        material: "Hand-moulded terracotta base, solid wood inscription element, and brass ghungroo bells",
        finish: "Acrylic matte finish (Uniform, non-glossy surface designed for visual calm and longevity)",
        color: "Unified Aakaura colour tone with natural wood accents and brass detailing",
        dimensions: "Approx. 33 × 19 × 1 cm (Length × Width × Depth)",
        weight: "Approx. 450 grams",
        crafting: "Hand-crafted: Each piece is moulded, painted, and assembled manually.",
        durability: "Long-lasting for indoor use; Stable structure with age-resistant brass elements",
        packaging: "Secure packaging",
        "Ideal For": "Confidence building, decision-making clarity, leadership energy, self-discipline practices, workspaces, meditation areas, and intentional gifting"
    },
    careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes.",
    idealFor: "Confidence building, decision-making clarity, leadership energy, self-discipline practices, workspaces, meditation areas, and intentional gifting",
    symbolism: "Represents personal power, transformation, willpower, self-confidence, and purposeful action",
    languageEngraving: "English & Sanskrit — “Power.” and “शक्ति”",
    designBreakdown: [
        {
            title: "Ten-Petaled Lotus (Manipura Symbol)",
            description: "Represents the ten vrittis (mental tendencies or vital forces) that govern the body and mind, including tendencies such as ignorance, thirst, jealousy, treachery, shame, fear, disgust, delusion, sadness, and anger, symbolizing the refinement of ego and personal power."
        },
        {
            title: "Inverted (Downward-Pointing) Triangle",
            description: "Symbol of the fire element (Agni), representing digestion, transformation, and the ability to convert experience into action and purpose."
        },
        {
            title: "Circular Mandala",
            description: "Represents contained power, focus, and the balanced channeling of energy rather than scattered force."
        },
        {
            title: "Brass Ghungroo Clusters",
            description: "Five anchoring points, each adorned with three traditional brass ghungroo bells. Designed to create subtle vibrational awareness, reflecting rhythm, confidence, and controlled movement."
        },
        {
            title: "Wooden Inscription Element",
            description: "A solid wooden log plaque, engraved with “Power.” (English) and “शक्ति” (Shakti) - representing dynamic energy, strength, capacity, and the divine feminine creative force."
        }
    ],
    additionalSection: {
        title: "When to Work with the Solar Plexus Chakra (Manipura)",
        content: solarAdditionalSection
    }
};

const solarSL = { ...solarProductBase, id: "power-wall-hanging-sl" };
const solarEC = { 
    ...solarProductBase, 
    id: "power-wall-hanging-ec",
    sanskritName: "Manipura Power Core",
    price: "₹5,500",
    description: "Energetically crafted terracotta wall hanging for personal power and solar plexus activation.",
    specificDescription: "A sacred energy tool designed to ignite willpower and transformative fire. This piece carries the vibrational signature of the Fire element, aiding in digestion of experiences and asserting personal boundaries."
};


// ==========================================
// HEART (Love / Anahata)
// ==========================================

const heartAdditionalSection = `**Working on the Heart Chakra (Anahata)**
Working on the Heart Chakra (Anahata) is recommended for individuals experiencing emotional imbalance, difficulty giving or receiving love, unresolved grief, or disconnection from compassion. Positioned at the center of the chest, Anahata serves as the bridge between the lower (physical) and upper (spiritual) chakras, integrating body, mind, and spirit.

**Who Should Work on the Heart Chakra?**
- **Individuals experiencing emotional heaviness or grief**: Unresolved sadness, loss, or emotional closure issues.
- **People facing relationship challenges**: Difficulty trusting, opening up, or maintaining emotional balance.
- **Those struggling with self-love or compassion**: Harsh self-judgment, guilt, or emotional withdrawal.
- **Individuals experiencing chest or breath-related discomfort**: Tightness, shallow breathing, or emotional heaviness (energetic association, not medical advice).
- **People feeling disconnected or isolated**: A sense of emotional numbness or lack of belonging.
- **Those seeking balance between ambition and empathy**: Especially during leadership or caregiving phases.

**Best Spaces to Work on Heart Chakra Energy**
Heart chakra practices thrive in spaces that feel safe, calm, and emotionally open.

*Outdoor Spaces*
- Quiet natural environments
- Open areas that allow relaxed breathing
- Places associated with stillness rather than stimulation

*Indoor Spaces*
- Bedrooms or personal sanctuaries
- Meditation areas with soft lighting
- Clean, uncluttered spaces that feel emotionally comforting
- Areas where you rest, reflect, or connect

**Best Times to Work on the Heart Chakra**
- Early morning or evening, when emotions are naturally softer
- During emotional healing or relationship work
- Regular practice 1–2 times per week, or during emotionally intense phases

**Supportive Practices**
- Heart-centered visualizations, focusing on expansion in the chest area
- Chest-opening yoga postures such as Cobra, Camel, Bridge, and Fish Pose
- Seed mantra chanting: “YAM”
- Conscious breathing practices
- Gratitude and forgiveness reflections`;

const heartProductBase = {
    name: "Vayu Aayam Wall Hanging",
    sanskritName: "Heart Chakra Wall Hanging",
    description: "A handcrafted terracotta piece symbolizing emotional balance and inner openness.",
    specificDescription: "A handcrafted terracotta piece symbolizing emotional balance and inner openness. Designed around the Anahata chakra geometry, it carries the energy of compassion, harmony, and quiet strength. The twelve-petaled lotus represents the twelve virtues of the heart. At its core lies the Shatkona, formed by intersecting upward- and downward-pointing triangles, symbolizing the union of masculine and feminine energies. The green color signifies healing, compassion, and emotional equilibrium. Finished with soft bells and a wooden plaque engraved with “प्रेम” (Love).",
    price: "₹4,500",
    ethos: "Hand-crafted: Each piece is moulded, painted, and assembled manually. Designed to support emotional balance and relationship harmony.",
    whatItsFor: "A visual and energetic anchor for love and compassion. Designed for those seeking emotional healing, relationship harmony, and inner peace.",
    features: [
        "Hand-moulded terracotta base",
        "Solid wood inscription element with 'Love'",
        "Traditional brass ghungroo bells",
        "Unified Aakaura colour tone with natural wood accents",
        "Acrylic matte finish for visual calm"
    ],
    images: ["/images/heart-chakra-wall-hanging.jpg"],
    step: 1,
    specifications: {
        "Product Name": "Vayu Aayam (Heart/Anahata Chakra) Wall Hanging",
        material: "Hand-moulded terracotta base, solid wood inscription element, and brass ghungroo bells",
        finish: "Acrylic matte finish (Uniform, non-glossy surface designed for visual calm and longevity)",
        color: "Unified Aakaura colour tone with natural wood accents.",
        dimensions: "Approx. 33 × 19 × 1 cm (Length × Width × Depth)",
        weight: "Approx. 450 grams",
        crafting: "Hand-crafted: Each piece is moulded, painted, and assembled manually.",
        durability: "Long-lasting for indoor use; Stable structure with age-resistant brass elements",
        packaging: "Secure packaging",
        "Ideal For": "Emotional balance, relationship harmony, inner healing practices, meditation spaces, bedrooms, spiritual décor, and intentional gifting"
    },
    careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes.",
    idealFor: "Emotional balance, relationship harmony, inner healing practices, meditation spaces, bedrooms, spiritual décor, and intentional gifting",
    symbolism: "Represents love, compassion, balance, emotional intelligence, and integration of inner and outer worlds",
    languageEngraving: "English & Sanskrit — “love.” and “प्रेम”",
    designBreakdown: [
        {
            title: "Twelve-Petaled Lotus (Anahata Symbol)",
            description: "Represents the twelve virtues of the heart, or vrittis: love, harmony, empathy, understanding, purity, clarity, compassion, unity, forgiveness, kindness, peace, and bliss, reflecting emotional refinement and maturity."
        },
        {
            title: "Intersecting Triangles (Shatkona)",
            description: "Two interlaced triangles forming a six-pointed star symbolize the union of masculine and feminine energies, representing balance between earthly life and spiritual aspiration."
        },
        {
            title: "Circular Mandala",
            description: "Represents wholeness, integration, and continuity, where opposing forces coexist in harmony."
        },
        {
            title: "Brass Ghungroo Clusters",
            description: "Seven anchoring points, each adorned with three traditional brass ghungroo bells. Designed to create gentle vibrational awareness, symbolizing rhythm, resonance, and emotional attunement."
        },
        {
            title: "Wooden Inscription Element",
            description: "A solid wooden log plaque, engraved with “love.” (English) and “प्रेम” (Prem) - meaning unconditional love."
        }
    ],
    additionalSection: {
        title: "When to Work with the Heart Chakra (Anahata)",
        content: heartAdditionalSection
    }
};

const heartSL = { ...heartProductBase, id: "love-wall-hanging-sl" };
const heartEC = { 
    ...heartProductBase, 
    id: "love-wall-hanging-ec",
    sanskritName: "Anahata Love Resonance",
    price: "₹5,500",
    description: "Energetically crafted terracotta wall hanging for open-heartedness and emotional healing.",
    specificDescription: "A sacred energy tool designed to open the heart center and foster unconditional love. This piece carries the vibrational signature of the Air element, facilitating expansiveness and connection."
};

async function main() {
    try {
        console.log('🚀 Adding Solar Plexus and Heart Chakra products...\n');

        // Helper to update journey
        const updateJourney = async (slug: string, slProduct: any, ecProduct: any) => {
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
                    delete list[index].whenToUse; // Clean up just in case
                    console.log(`✅ [${slug}] Updated existing product: ${product.id}`);
                } else {
                    list.push(product);
                    console.log(`✅ [${slug}] Added new product: ${product.id}`);
                }
            };

            // Update Soul-Luxury
            if (!currentContent['soul-luxury']) currentContent['soul-luxury'] = [];
            updateOrPush(currentContent['soul-luxury'], slProduct);

            // Update Energy-Curious
            if (!currentContent['energy-curious']) currentContent['energy-curious'] = [];
            updateOrPush(currentContent['energy-curious'], ecProduct);

            // Save to DB
            await prisma.journey.update({
                where: { slug },
                data: { content: currentContent },
            });
            console.log(`🎉 Journey "${slug}" updated successfully!\n`);
        };

        // Add Solar Plexus
        await updateJourney('power', solarSL, solarEC);

        // Add Heart
        await updateJourney('love', heartSL, heartEC);

        console.log('🌐 Visit: http://localhost:3000/journey/power and /journey/love to see the products\n');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

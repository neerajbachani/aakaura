import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// THROAT (Expression / Vishuddha)
// ==========================================

const throatAdditionalSection = `**Working on the Throat Chakra (Vishuddha)**
Working on the Throat Chakra (Vishuddha) is recommended when communication feels blocked, suppressed, or distorted. Located at the throat center, Vishuddha governs speech, listening, truthfulness, and the ability to express inner reality without fear or excess.

**Who Should Work on the Throat Chakra**
- **Individuals struggling with self-expression**: Difficulty speaking honestly, fear of judgment, or habitual silence.
- **People experiencing communication imbalance**: Over-talking, under-speaking, or miscommunication in personal or professional life.
- **Creative individuals facing blocks**: Writers, artists, teachers, or speakers experiencing expressive stagnation.
- **Those experiencing throat or neck tension**: Tightness, stiffness, or habitual jaw clenching (energetic association, not medical advice).
- **Individuals suppressing emotions or truth**: Holding back thoughts, feelings, or opinions out of fear or conditioning.

**Best Spaces to Work on Throat Chakra Energy**
Vishuddha practices thrive in spaces that encourage clarity, openness, and sound awareness.

*Outdoor Spaces*
- Quiet open areas with natural acoustics
- Early morning stillness
- Spaces with flowing air

*Indoor Spaces*
- Meditation or chanting areas
- Workspaces dedicated to communication or creativity
- Clean, uncluttered environments that support focus
- Areas where sound practices can be done without disturbance

**Best Times to Work on the Throat Chakra**
- Early morning, before speech accumulates
- Before important conversations or creative work
- During phases of self-reflection or truth-seeking
- Consistent practice 1–2 times per week, or during expressive blocks

**Supportive Practices**
- Conscious vocalization and chanting
- Seed mantra chanting: “HAM”
- Neck and shoulder-opening yoga postures
- Listening meditations (sound → silence)
- Journaling or spoken affirmations`;

const throatProductBase = {
    name: "Akasha Aayam Wall Hanging",
    sanskritName: "Throat Chakra Wall Hanging",
    description: "A handcrafted terracotta piece symbolizing clarity, expression, and authenticity.",
    specificDescription: "A handcrafted terracotta piece symbolizing clarity, expression, and authenticity. Designed around the Vishuddha chakra geometry, it carries the energy of honest communication and inner alignment. The sixteen-petaled lotus represents the sixteen vowels of the Sanskrit language, symbolizing refined expression, creativity, and harmonious sound. At its center, the inverted triangle signifies the upward movement of energy from the lower chakras toward higher states of spiritual awareness. Enclosing this form, the white circle or full moon represents the element of ether (Akasha). Finished with soft bells and a wooden plaque engraved with “सत्य” (Truth) — a reminder that expression is most powerful when it is pure.",
    price: "₹4,500",
    ethos: "Hand-crafted: Each piece is moulded, painted, and assembled manually. Designed to support clear communication and self-expression.",
    whatItsFor: "A visual and energetic anchor for truth and authenticity. Designed for those seeking to unblock communication, enhance creativity, and express their inner reality.",
    features: [
        "Hand-moulded terracotta base",
        "Solid wood inscription element with 'Truth'",
        "Traditional brass ghungroo bells",
        "Unified Aakaura colour tone with natural wood accents",
        "Acrylic matte finish for visual calm"
    ],
    images: ["/images/throat-chakra-wall-hanging.jpg"],
    step: 1,
    specifications: {
        "Product Name": "Akasha Aayam (Throat/Vishuddha Chakra) Wall Hanging",
        material: "Hand-moulded terracotta base, solid wood inscription element, and brass ghungroo bells.",
        finish: "Acrylic matte finish (Uniform, non-glossy surface designed for visual calm and longevity)",
        color: "Unified Aakaura colour tone with natural wood accents.",
        dimensions: "Approx. 33 × 19 × 1 cm (Length × Width × Depth)",
        weight: "Approx. 450 grams",
        crafting: "Hand-crafted: Each piece is moulded, painted, and assembled manually.",
        durability: "Long-lasting for indoor use.",
        packaging: "Secure packaging",
        "Ideal For": "Clear communication, self-expression practices, sound meditation, creative spaces, workspaces, spiritual décor, and intentional gifting"
    },
    careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes.",
    idealFor: "Clear communication, self-expression practices, sound meditation, creative spaces, workspaces, spiritual décor, and intentional gifting",
    symbolism: "Represents purification, truthful expression, clarity of thought, and the refinement of sound and communication",
    languageEngraving: "English & Sanskrit — “truth.” and “सत्य”",
    designBreakdown: [
        {
            title: "Sixteen-Petaled Lotus (Vishuddha Symbol)",
            description: "Represents the sixteen Sanskrit vowels, symbolizing refined sound, articulation, creativity, and pure communication. The petals signify mastery over speech, listening, and expression."
        },
        {
            title: "Inverted Triangle",
            description: "Symbolizes the upward movement of energy from the lower chakras toward higher awareness, refined through conscious speech and inner truth."
        },
        {
            title: "Circular Mandala / White Disc",
            description: "Represents Akasha (ether/space) — the subtle element associated with sound, openness, clarity, and expansive awareness."
        },
        {
            title: "Brass Ghungroo Clusters",
            description: "Seven anchoring points, each adorned with three traditional brass ghungroo bells. Designed to create subtle vibrational resonance, reflecting the relationship between sound, silence, and awareness."
        },
        {
            title: "Wooden Inscription Element",
            description: "A solid wooden log plaque, engraved with “truth.” (English) and “सत्य” (Satya) - derived from sat (being), meaning 'that which exists' or 'truth'."
        }
    ],
    additionalSection: {
        title: "When to Work with the Throat Chakra (Vishuddha)",
        content: throatAdditionalSection
    }
};

const throatSL = { ...throatProductBase, id: "expression-wall-hanging-sl" };
const throatEC = { 
    ...throatProductBase, 
    id: "expression-wall-hanging-ec",
    sanskritName: "Vishuddha Truth Resonance",
    price: "₹5,500",
    description: "Energetically crafted terracotta wall hanging for authentic expression and throat chakra activation.",
    specificDescription: "A sacred energy tool designed to clear communicative blockages and amplify truth. This piece carries the vibrational signature of the Ether element, creating space for authentic expression."
};


// ==========================================
// THIRD EYE (Insight / Ajna)
// ==========================================

const thirdEyeAdditionalSection = `**Working on the Third Eye Chakra (Ajna)**
Working on the Third Eye Chakra is recommended when clarity, focus, and inner guidance feel clouded. Ajna governs perception, insight, mental coherence, memory, and the ability to see patterns beyond surface-level information. It is located between the eyebrows, serving as the bridge between intellect and intuition.

**Who Should Work on the Third Eye Chakra**
- **Individuals experiencing confusion or mental fog**: Difficulty making decisions, overthinking, or lack of clarity.
- **People disconnected from intuition**: Ignoring inner signals, second-guessing themselves constantly.
- **Those struggling with focus or memory**: Inability to sustain attention or integrate information meaningfully.
- **Individuals overly dominated by logic or emotion**: Imbalance between rational thought and intuitive understanding.
- **People seeking deeper self-awareness**: Those on a path of inner inquiry, learning, or introspection.

**Best Spaces to Work on Third Eye Energy**

*Indoor Spaces*
- Quiet, low-stimulation environments
- Study or reading corners
- Meditation areas with minimal visual clutter

*Outdoor Spaces*
- Still environments with open sky visibility
- Quiet terraces or balconies
- Early morning or twilight settings

**Best Times to Work on the Third Eye Chakra**
- Early morning (pre-sunrise)
- Late evening when sensory input reduces
- During periods of decision-making or self-inquiry
- Consistency matters more than duration.

**Supportive Practices**
- Trataka (gentle candle gazing)
- Silent observation of thoughts without engagement
- Breath awareness between the eyebrows
- Seed mantra chanting: “OM”
- Reducing sensory overload (screens, noise, multitasking)`;

const thirdEyeProductBase = {
    name: "Jnana Aayam Wall Hanging",
    sanskritName: "Third Eye Chakra Wall Hanging",
    description: "A handcrafted terracotta piece symbolizing perception, insight, and inner knowing.",
    specificDescription: "A handcrafted terracotta piece symbolizing perception, insight, and inner knowing. Designed around the Ajna chakra geometry, it carries the energy of clarity, focus, and intuitive intelligence. The two-petaled lotus represents the fundamental duality of existence (Ida and Pingala) converging at the center, symbolizing the transition from dualistic perception to non-dual awareness. The downward-pointing triangle signifies the descent and integration of higher consciousness. The inner circle marks the subtle void—the seat of the inner Guru. Finished with soft bells and a wooden plaque engraved with “दृष्टि” (Vision): a reminder that true sight comes from within.",
    price: "₹4,500",
    ethos: "Hand-crafted: Each piece is moulded, painted, and assembled manually. Designed to support clarity, focus, and intuitive intelligence.",
    whatItsFor: "A visual and energetic anchor for insight and inner vision. Designed for those seeking to enhance intuition, mental clarity, and focus.",
    features: [
        "Hand-moulded terracotta base",
        "Solid wood inscription element with 'Clear'",
        "Traditional brass ghungroo bells",
        "Unified Aakaura colour tone with natural wood accents",
        "Acrylic matte finish for visual calm"
    ],
    images: ["/images/thirdeye-chakra-wall-hanging.jpg"],
    step: 1,
    specifications: {
        "Product Name": "Jnana Aayam (Third Eye/Ajna Chakra) Wall Hanging",
        material: "Hand-moulded terracotta base, solid wood inscription element, and brass ghungroo bells",
        finish: "Acrylic matte finish (Uniform, non-glossy surface designed for visual calm, focus, and longevity)",
        color: "Unified Aakaura colour tone with natural wood accents.",
        dimensions: "Approx. 33 × 19 × 1 cm (Length × Width × Depth)",
        weight: "Approx. 450 grams",
        crafting: "Hand-crafted: Each piece is moulded, painted, and assembled manually.",
        durability: "Long-lasting for indoor use; Stable structure with age-resistant brass elements",
        packaging: "Secure packaging",
        "Ideal For": "Meditation spaces, intuitive practices, study areas, workspaces, spiritual décor, and intentional gifting"
    },
    careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes.",
    idealFor: "Meditation spaces, intuitive practices, study areas, workspaces, spiritual décor, and intentional gifting",
    symbolism: "Represents perception, insight, awareness beyond sensory input, and integration of intellect with intuition",
    languageEngraving: "English & Sanskrit — “vision.” and “दृष्टि (Drishti)”",
    designBreakdown: [
        {
            title: "Two-Petaled Lotus (Ajna Symbol)",
            description: "Represents the dual forces of perception: Ida and Pingala nadis (lunar and solar currents), Intuition and intellect, Inner seeing and outer knowing. Together, they converge into unified awareness."
        },
        {
            title: "Inverted Triangle",
            description: "Represents upward-moving energy, guiding consciousness from instinct and emotion toward clarity, discernment, and higher cognition."
        },
        {
            title: "Central Bindhu / Circle",
            description: "Symbolizes the point of awareness, the seat of observation beyond thought — where perception occurs without distortion."
        },
        {
            title: "Brass Ghungroo Clusters",
            description: "Three anchoring points, each adorned with three traditional brass ghungroo bells designed to create subtle vibrational awareness rather than sound (Symbolic of attentiveness rather than stimulation)."
        },
        {
            title: "Wooden Inscription Element",
            description: "A solid wooden log plaque, engraved with “Clear.” (English) and “दृष्टि (Drishti)” — meaning vision, perception, insight."
        }
    ],
    additionalSection: {
        title: "When to Work with the Third Eye Chakra (Ajna)",
        content: thirdEyeAdditionalSection
    }
};

const thirdEyeSL = { ...thirdEyeProductBase, id: "insight-wall-hanging-sl" };
const thirdEyeEC = { 
    ...thirdEyeProductBase, 
    id: "insight-wall-hanging-ec",
    sanskritName: "Ajna Insight Portal",
    price: "₹5,500",
    description: "Energetically crafted terracotta wall hanging for deep insight and third eye activation.",
    specificDescription: "A sacred energy tool designed to sharpen intuition and mental clarity. This piece carries the vibrational signature of Light, illuminating the path from confusion to inner knowing."
};


async function main() {
    try {
        console.log('🚀 Adding Throat and Third Eye Chakra products...\n');

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
                     delete list[index].whenToUse; // Clean up
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

        // Add Throat
        await updateJourney('expression', throatSL, throatEC);

        // Add Third Eye
        await updateJourney('insight', thirdEyeSL, thirdEyeEC);

        console.log('🌐 Visit: http://localhost:3000/journey/expression and /journey/insight to see the products\n');

    } catch (error: any) {
        console.error('❌ Error:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

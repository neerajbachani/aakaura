import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// CROWN (Transcendence / Sahasrara) -> Journey Slug: expansion
// ==========================================

const crownAdditionalSection = `**Working on the Crown Chakra (Sahasrara)**
Working with the Crown Chakra is recommended only after cultivating grounding, emotional balance, clarity, and expression. This chakra governs transcendence, existential understanding, and the experience of unity. It is located at the crown of the head, serving as the interface between individual awareness and universal consciousness.

**Who Should Work on the Crown Chakra**
- **Individuals seeking deeper meaning beyond achievement**: Those questioning identity, purpose, and existence itself.
- **People feeling spiritually disconnected despite external success**: Material stability without inner fulfillment.
- **Those drawn toward silence, contemplation, or surrender**: A natural pull toward stillness rather than stimulation.
- **Individuals overwhelmed by identity, labels, and roles**: Difficulty separating self from profession, relationships, or social conditioning.
- **Advanced practitioners**: Those who already maintain grounding, emotional regulation, and mental clarity.

**Best Spaces to Work on Crown Chakra Energy**

*Indoor Spaces*
- Minimalist, quiet rooms
- Meditation spaces with very low sensory input
- Areas free from visual clutter

*Outdoor Spaces*
- Open sky environments
- Hilltops, terraces, or open fields
- Spaces that evoke vastness and perspective

**Best Times to Work on the Crown Chakra**
- Early dawn (Brahma Muhurta)
- Late night stillness
- Periods of introspection rather than emotional turbulence
- Short, intentional sessions are more effective than prolonged effort.

**Supportive Practices**
- Silent sitting (without mantra or visualization)
- Awareness of breath without control
- Observing thoughts without engagement
- Letting attention rest at the crown without expectation
- Reducing identification with thought patterns`;

const crownProductBase = {
    name: "Brahma Aayam Wall Hanging",
    sanskritName: "Crown Chakra Wall Hanging",
    description: "A handcrafted terracotta piece symbolizing awareness, stillness, and higher understanding.",
    specificDescription: "A handcrafted terracotta piece symbolizing awareness, stillness, and higher understanding. Designed around the Sahasrara chakra geometry, it carries the energy of clarity, surrender, and inner silence. The sacred thousand-petaled lotus symbolizes the infinite and expansive nature of consciousness. Rendered in violet or white, it reflects purity, transcendence, and high-frequency spiritual energy. The enclosing circle represents wholeness, completion, and the boundless, uncontained nature of energy. Finished with soft bells and a wooden plaque engraved with “अनन्त” (Infinite) — a reminder that awareness is not something to seek, but to remember.",
    price: "₹4,500",
    ethos: "Hand-crafted: Each piece is moulded, painted, and assembled manually. Designed to support spiritual study, contemplation, and inner silence.",
    whatItsFor: "A visual and energetic anchor for transcendence and unity consciousness. Designed for those seeking to dissolve separation and realize oneness.",
    features: [
        "Hand-moulded terracotta base",
        "Solid wood inscription element with 'Infinite'",
        "Traditional brass ghungroo bells",
        "Unified Aakaura colour tone with natural wood accents",
        "Acrylic matte finish for visual stillness"
    ],
    images: ["/images/crown-chakra-wall-hanging.jpg"],
    step: 1,
    specifications: {
        "Product Name": "Brahma Aayam (Crown/Sahasrara Chakra) Wall Hanging",
        material: "Hand-moulded terracotta base, solid wood inscription element, and brass ghungroo bells",
        finish: "Acrylic matte finish (Uniform, non-glossy surface designed for visual stillness, neutrality, and longevity)",
        color: "Same signature earthy base tone across all wall hangings with natural wood accents and brass detailing",
        dimensions: "Approx. 33 × 19 × 1 cm (Length × Width × Depth)",
        weight: "Approx. 450 grams",
        crafting: "Hand-crafted: Each piece is moulded, painted, and assembled manually.",
        durability: "Long-lasting for indoor use; Stable structure with age-resistant brass elements",
        packaging: "Secure packaging",
        "Ideal For": "Meditation spaces, contemplative areas, spiritual study rooms, quiet corners, and intentional gifting"
    },
    careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes.",
    idealFor: "Meditation spaces, contemplative areas, spiritual study rooms, quiet corners, and intentional gifting",
    symbolism: "Represents awareness beyond identity, unity consciousness, stillness, and dissolution of separation",
    languageEngraving: "English & Sanskrit — “infinite.” and “अनन्त”",
    designBreakdown: [
        {
            title: "Thousand-Petaled Lotus (Sahasrara Symbol)",
            description: "Represents the total expansion of consciousness. The petals symbolize infinite possibilities of awareness rather than literal count… completeness rather than quantity."
        },
        {
            title: "Circular Mandala / Full Disc",
            description: "Symbolizes wholeness, infinity, and non-duality. Unlike lower chakras, Sahasrara has no directional movement; it is not rising or grounding. It simply is."
        },
        {
            title: "Central Bindhu (Point)",
            description: "Represents the collapse of the ‘observer’ and the ‘observed’. The point where individuality dissolves into awareness itself."
        },
        {
            title: "Absence of Geometric Direction",
            description: "Unlike other chakras, no triangle or square dominates. This absence is intentional—the Crown Chakra transcends structure, form, and polarity."
        },
        {
            title: "Brass Ghungroo Clusters",
            description: "Three anchoring points, each adorned with three traditional brass ghungroo bells. Designed to create subtle vibrational presence, not sound (Symbolic of awareness without stimulation)."
        },
        {
            title: "Wooden Inscription Element",
            description: "A solid wooden log plaque, engraved with “infinite.” (English) and “अनन्त” (Ananta) - meaning 'endless' or 'limitless'. Refers to the infinite nature of absolute reality."
        }
    ],
    additionalSection: {
        title: "When to Work with the Crown Chakra (Sahasrara)",
        content: crownAdditionalSection
    }
};

const crownSL = { ...crownProductBase, id: "expansion-wall-hanging-sl" };
const crownEC = { 
    ...crownProductBase, 
    id: "expansion-wall-hanging-ec",
    sanskritName: "Sahasrara Infinity Portal",
    price: "₹5,500",
    description: "Energetically crafted terracotta wall hanging for transcendence and crown chakra activation.",
    specificDescription: "A sacred energy tool designed to dissolve the ego and reveal infinite awareness. This piece carries the vibrational signature of Consciousness, facilitating the realization of Oneness."
};

async function main() {
    try {
        console.log('🚀 Adding Crown Chakra products...\n');

        const slug = 'expansion'; // Confirmed via src/data/chakras.ts

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
        updateOrPush(currentContent['soul-luxury'], crownSL);

        // Update Energy-Curious
        if (!currentContent['energy-curious']) currentContent['energy-curious'] = [];
        updateOrPush(currentContent['energy-curious'], crownEC);

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

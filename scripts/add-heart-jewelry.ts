
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const earrings = {
    // Base Identity
    id_sl: "aamoria-earrings-sl",
    id_ec: "aamoria-earrings-ec",
    name: "Aamoria Earrings",
    productType: "Earrings",
    description: "Aamoria is designed around the heart chakra geometric pattern, traditionally associated with balance, connection, and emotional openness in Indian symbolic systems.",
    specificDescription: "The circular motif is paired with ghungroo detailing, chosen intentionally. In energetic traditions, gentle vibrations around the ear and jaw region are considered significant, as this area is believed to host minor energy centres linked to expression, awareness, and sensory balance. The soft movement of the ghungroos creates subtle vibration as you move — never loud, never overwhelming.",
    price: "₹2,500", // Placeholder if not provided, assuming similar range.
    ethos: "Rooted in traditional symbolism and craft. Aamoria brings together form, movement, and meaning.",
    whatItsFor: "Designed to be worn, felt, and lived in. Supports expression, awareness, and sensory balance.",
    features: [
        "Heart chakra–inspired geometric artwork",
        "Ghungroos designed for gentle vibrational movement",
        "Lightweight and comfortable for extended wear",
        "Oxidised silver-toned frame",
        "Hand-painted mandala detailing"
    ],
    images: ["/images/aamoria-earrings.jpg"], // Placeholder
    step: 2, // Assuming standard ordering
    specifications: {
        "Product Name": "Aamoria Earrings",
        "Product Type": "Earrings",
        "Material": "Zinc Alloy",
        "Texture": "Acrylic",
        "Dimensions": "6 cms",
        "Weight": "20 gms (Light weight)",
        "Care Instructions": "Dry clean recommended. Keep away from chemicals.",
        "Packaging": "Secure packaging"
    },
    designBreakdown: [
        { title: "Symbolism", description: "Represents love, compassion, balance, emotional harmony, and the unstruck cosmic sound (Anahata) — the vibration that exists without collision." },
        { title: "Language Engraving", description: "English & Sanskrit: \"Open.\" and \"अनाहत (Anāhata)\" — meaning unstruck, unbeaten, eternally resonant" },
        { title: "Twelve-Petaled Lotus (Anahata Symbol)", description: "Represents the 12 refined emotional qualities of elevated consciousness:\n◦ Prema (Love)\n◦ Karuna (Compassion)\n◦ Shanti (Peace)\n◦ Shraddha (Trust)\n◦ Maitri (Friendliness)\n◦ Dhairya (Patience)\n◦ Kshama (Forgiveness)\n◦ Santosha (Contentment)\n◦ Vairagya (Balanced Detachment)\n◦ Ananda (Joy)\n◦ Samata (Equanimity)\n◦ Hridaya Shuddhi (Purity of Heart)" },
        { title: "Shatkona (Six-Pointed Star)", description: "Symbol of union between:\n◦ Upward triangle — Shiva (Consciousness)\n◦ Downward triangle — Shakti (Energy)\nTogether, they represent integration of masculine and feminine forces within the heart center." },
        { title: "Circular Mandala Frame", description: "Represents wholeness, cyclical balance, and continuity of emotional flow. The circular form symbolizes infinite compassion without edges or boundaries." },
        { title: "Brass Ghungroo Ring (12 Bells)", description: "Twelve traditional brass ghungroos aligned with the 12 petals of Anahata.\nDesigned to create subtle rhythmic resonance rather than loud sound.\nIn Sanatan philosophy:\n◦ Sound (Nada) is considered the foundation of creation.\n◦ The heart chakra is associated with the air element (Vayu) — movement and rhythm.\n◦ Gentle metallic vibration creates micro-frequency stimulation around the jawline and throat region.\n◦ Subtle rhythmic sound may regulate emotional states and enhance awareness of movement.\nThe 12 ghungroos represent sonic activation of each heart quality through movement." },
        { title: "Ear Adornment in Traditional Science", description: "Ear piercing and ornamentation in Bharatiya tradition were never purely aesthetic.\n◦ The earlobe contains marma (vital energy) points.\n◦ These points are connected to emotional regulation and nervous pathways.\n◦ Gentle weighted stimulation supports grounding of emotional energy.\n◦ Metallic vibration was traditionally believed to cleanse subtle energetic fields.\nWearing earrings near the jaw and throat region symbolically supports the alignment between Anahata (Heart) and Vishuddha (Throat) — Speaking truth with compassion." },
        { title: "Material & Craft", description: "◦ Hand-assembled structure\n◦ Antique silver-toned alloy frame\n◦ Hand-painted mandala detailing\n◦ Balanced weight to maintain gentle acoustic presence\n◦ 12 individually secured brass ghungroos" },
        { title: "What Minor Chakras Does This Influence?", description: "**Karna Chakra (Ear Minor Chakra)**\nLocated at the center of each ear. Associated with inner listening, intuition through sound, perception, and receptivity. In yogic philosophy, the ear is considered a gateway for Nada (sacred sound).\n\n**Jaw Marma Points**\nLocated around the earlobe and jaw hinge. Gentle weighted stimulation may influence nervous system regulation and enhance sensory grounding.\n\n**Vishuddha Support**\nInfluence on the energetic field of the Throat Chakra. Supports authentic expression and emotional articulation.\n\n**Temporal Minor Chakras**\nLocated at the temples. Movement creates slight kinetic stimulation, symbolically reinforcing emotional balance.\n\n**Auric Field Stimulation**\nMetallic vibration produces micro-frequency sound waves believed to cleanse peripheral energetic fields and enhance presence." },
        { title: "When to Work with the Heart Chakra (Anahata)?", description: "Recommended for individuals experiencing emotional imbalance, grief, resentment, difficulty in relationships, or emotional numbness. It governs love, compassion, empathy, breath, and emotional equilibrium." },
        { title: "Who Should Work on the Heart Chakra?", description: "◦ Individuals experiencing heartbreak or emotional loss\n◦ People struggling with resentment or forgiveness\n◦ Those feeling emotionally closed or detached\n◦ Individuals experiencing relationship imbalance\n◦ People experiencing chest tightness or shallow breathing\n◦ Those seeking deeper emotional maturity" },
        { title: "Best Spaces to Work on Heart Chakra Energy", description: "**Outdoor Spaces:** Open fields or gardens, sitting under open sky, breezy natural environments.\n**Indoor Spaces:** Well-ventilated rooms, spaces with plants, areas with soft natural lighting." },
        { title: "Best Times to Work on the Heart Chakra", description: "◦ Early morning (calm breath cycles)\n◦ Sunset (natural transition of light)\n◦ During emotional overwhelm\n◦ Consistent practice 1–2 times per week" },
        { title: "Supportive Practices", description: "◦ Breathwork (Anulom Vilom or slow diaphragmatic breathing)\n◦ Gentle chest-opening yoga postures (Cobra, Camel, Bridge)\n◦ Seed mantra chanting: 'YAM'\n◦ Journaling emotional release practices\n◦ Acts of conscious kindness" }
    ],
    idealFor: "Daily wear, meditation, enhancing awareness, balancing emotional energy",
    careInstructions: "Dry clean recommended. Keep away from chemicals."
};


const necklace = {
     // Base Identity
     id_sl: "aamoria-necklace-sl",
     id_ec: "aamoria-necklace-ec",
     name: "Aamoria Necklace",
     productType: "Necklace",
     description: "The Aamoria Necklace is designed to complement the Aamoria Earrings, carrying the same heart chakra–inspired geometric pattern at its centre.",
     specificDescription: "Worn close to the chest, the placement is intentional. In traditional energetic systems, the heart region is associated with balance, connection, and emotional steadiness. The geometry reflects symmetry and cohesion — forms long used in Indian art to represent wholeness. The design remains clean and lightweight, allowing the piece to rest comfortably for extended wear.",
     price: "₹3,500", // Placeholder
     ethos: "Aamoria is about balance you can wear — thoughtfully designed, easy to live in.",
     whatItsFor: "Designed to sit close to the heart region, supporting balance and emotional steadiness.",
     features: [
        "Heart chakra–inspired geometric motif",
        "Designed to sit close to the heart region",
        "Lightweight and comfortable",
        "Complements the Aamoria Earrings seamlessly",
        "Ball chain structure for energetic flow"
     ],
     images: ["/images/aamoria-necklace.jpg"], // Placeholder
     step: 3,
     specifications: {
         "Product Name": "Aamoria Necklace",
         "Product Type": "Necklace",
         "Material": "Zinc Alloy",
         "Texture": "Acrylic",
         "Dimensions": "11.5 inches (with 6 cms pendant)",
         "Weight": "20 gms (Light weight)",
         "Care Instructions": "Dry clean recommended. Keep away from chemicals.",
         "Packaging": "Secure packaging"
     },
     designBreakdown: [
         { title: "Symbolism", description: "Represents love, equilibrium, compassion, emotional intelligence, and the 'unstruck sound' — Anahata — the vibration that exists without external impact.\nThe pendant rests directly at the center of the chest, aligning physically with the energetic heart center." },
         { title: "Language Engraving", description: "English & Sanskrit: \"Open.\" and \"अनाहत (Anāhata)\" — meaning unstruck, eternally resonant, self-arising vibration." },
         { title: "Twelve-Petaled Lotus (Anahata Mandala)", description: "Represents the 12 elevated emotional qualities of awakened heart consciousness: Prema (Love), Karuna (Compassion), Maitri (Friendliness), Kshama (Forgiveness), Shraddha (Trust), Dhairya (Patience), Santosha (Contentment), Samata (Balance), Vairagya (Healthy Detachment), Ananda (Joy), Hridaya Shuddhi (Purity of Heart), Sahanshilta (Emotional Endurance)." },
         { title: "Shatkona (Six-Pointed Star)", description: "Symbol of integration between Shiva (Pure Consciousness) and Shakti (Creative Energy). Represents harmony between logic and emotion, strength and softness, giving and receiving." },
         { title: "Circular Mandala Frame", description: "Symbol of completeness and continuity. The circular form reflects cyclical breath patterns and the rhythmic expansion and contraction of the heart." },
         { title: "Brass Ghungroo Cluster (12 Bells)", description: "Twelve traditional brass ghungroos suspended at the base of the pendant. Designed to create subtle vibrational resonance with body movement.\nIn Sanatan tradition: Sound (Nada) is considered primordial energy. Gentle metallic vibration creates micro-frequency stimulation across the sternum region. The chest cavity acts as a natural acoustic chamber. The 12 ghungroos correspond to the 12 petals of Anahata." },
         { title: "Ball Chain Structure", description: "The metallic bead chain represents continuity and energetic flow. Each bead signifies a rhythmic unit — similar to a mala — reinforcing steady emotional awareness. The chain length is intentionally designed so that the pendant rests at the mid-sternum." },
         { title: "Material & Craft", description: "◦ Antique silver-toned alloy frame\n◦ Hand-painted Anahata mandala detailing\n◦ 12 individually secured brass ghungroos\n◦ Balanced weight for gentle acoustic presence\n◦ Designed for sternum-level alignment" },
         { title: "What Minor Chakras Does This Influence?", description: "**Hridaya Minor Chakra**\nLocated slightly to the right of the physical heart. Associated with deeper spiritual devotion and unconditional love.\n\n**Thymus Chakra (Higher Heart)**\nLocated above the heart center. Linked to compassion, immunity, and energetic resilience. Gentle vibration near the sternum may symbolically support emotional release and breath awareness in this region." },
         { title: "When to Work with the Heart Chakra (Anahata)?", description: "Recommended for individuals experiencing grief, emotional imbalance, resentment, emotional numbness, or relationship instability. It governs love, empathy, breath rhythm, and relational harmony." },
         { title: "Who Should Work with This Pendant?", description: "◦ Individuals healing from heartbreak or emotional loss\n◦ Those working on forgiveness and emotional release\n◦ People seeking balance between independence and intimacy\n◦ Individuals experiencing shallow breathing due to stress\n◦ Those desiring emotional maturity and regulated compassion" },
         { title: "Best Spaces to Work on Heart Chakra Energy", description: "**Outdoor Spaces:** Gardens or open-air environments, under open sky, breezy natural surroundings.\n**Indoor Spaces:** Plant-filled rooms, calm ventilated areas, meditation corners." },
         { title: "Best Times to Work with the Pendant", description: "◦ During breathwork or meditation\n◦ During journaling or emotional processing\n◦ Sunset hours (air element dominance)\n◦ Social gatherings where emotional grounding is needed" },
         { title: "Supportive Practices", description: "◦ Slow diaphragmatic breathing\n◦ Anulom Vilom pranayama\n◦ Seed mantra chanting: 'YAM'\n◦ Chest-opening yoga postures (Cobra, Bridge, Camel)\n◦ Gratitude reflection practices" }
     ],
     idealFor: "Meditation, emotional healing, daily wear, connecting to heart energy",
     careInstructions: "Dry clean recommended. Keep away from chemicals."
};

async function main() {
    try {
        console.log('🚀 Adding Aamoria Heart Jewelry...\n');
        const slug = 'love';
        const journey = await prisma.journey.findUnique({ where: { slug } });

        if (!journey) {
            console.error(`❌ Journey "${slug}" not found`);
            return;
        }

        const currentContent = journey.content as any;

        const updateOrPush = (listKey: 'soul-luxury' | 'energy-curious', productData: any, id: string) => {
            const list = currentContent[listKey] || [];
            const index = list.findIndex((p: any) => p.id === id);
            
            const product = { ...productData, id };
            // Clean up ID props from object provided to function
            delete (product as any).id_sl;
            delete (product as any).id_ec;

            if (index !== -1) {
                list[index] = { ...list[index], ...product };
                console.log(`✅ [${slug}] Updated existing ${listKey}: ${id}`);
            } else {
                list.push(product);
                console.log(`✅ [${slug}] Added new ${listKey}: ${id}`);
            }
            currentContent[listKey] = list;
        };

        // Add Earrings
        updateOrPush('soul-luxury', earrings, earrings.id_sl);
        updateOrPush('energy-curious', earrings, earrings.id_ec);

        // Add Necklace
        updateOrPush('soul-luxury', necklace, necklace.id_sl);
        updateOrPush('energy-curious', necklace, necklace.id_ec);

        await prisma.journey.update({
            where: { slug },
            data: { content: currentContent },
        });

        console.log('\n🎉 Heart jewelry added successfully!');

    } catch (error: any) {
        console.error('❌ Error:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ajnaDrishti = {
    // Base Identity
    id_sl: "ajna-drishti-sl",
    id_ec: "ajna-drishti-ec",
    name: "Aakaura’s Ajna Drishti",
    productType: "Wall Hanging", // Inferred
    description: "Designed around the Ajna symbol of balanced perception, this serene meditative figure serves as a visual cue for mental steadiness.",
    specificDescription: "Hang it where you make decisions. Where stress tends to rise. Where clarity matters. Research shows that focused visualization and calm visual anchors help regulate the nervous system and reduce stress responses over time. When you look at her composed posture, your brain mirrors it. When the bells move gently, rhythmic sound supports relaxation and attentional reset. This is not about mysticism; it’s about training your mind. In moments of pressure, let this piece remind you to pause, observe, and return to clarity.",
    price: "₹3,500", // Placeholder
    ethos: "This is not about mysticism; it’s about training your mind.",
    whatItsFor: "A visual cue for mental steadiness, supporting relaxation and attentional reset.",
    features: [
        "Hand-moulded meditative figure",
        "Solid natural wood structural frame",
        "Authentic brass ghungroo bells",
        "Matte acrylic surface finish",
        "Braided jute rope suspension"
    ],
    images: ["/images/ajna-drishti.jpg"], // Placeholder
    step: 2,
    specifications: {
        "Product Name": "Aakaura’s Ajna Drishti",
        "Material": "Hand-moulded terracotta meditative figure, solid natural wood structural frame, braided jute rope suspension, and authentic brass ghungroo bells.",
        "Finish": "Matte acrylic surface finish designed to minimize light reflection and visual overstimulation. Natural wood elements are retained in their organic texture to preserve tactile authenticity.",
        "Color": "Earth-toned terracotta with warm wooden accents and muted brass highlights — a composition intended to visually anchor attention without sensory distraction.",
        "Dimensions": "13 × 7 × 3 inches (Height × Width × Depth)",
        "Weight": "Approx. 850–950 grams (handcrafted variation possible)",
        "Craftsmanship": "Individually handcrafted. Each piece is manually moulded, kiln-dried, hand-painted, assembled, and quality-checked. Minor textural and tonal variations are inherent to the artisanal process.",
        "Structural Integrity": "The wooden back frame provides load distribution and long-term stability. Brass elements are mechanically fastened for secure suspension. Designed for indoor use in controlled environments.",
        "Care Instructions": "Wipe with a soft, dry microfiber cloth. Avoid water exposure and high humidity. Do not use chemical cleaners or abrasive materials. Keep away from direct rain or prolonged sunlight."
    },
    designBreakdown: [
        { title: "Inspired by the Ajna Symbol", description: "Inspired by the Ajna symbol of balanced awareness, this meditative form is more than décor… it functions as a cognitive anchor." },
        { title: "Neuroscience of Mental Imagery", description: "Research in neuroscience shows that mental imagery activates overlapping neural networks involved in real perception and action. When you repeatedly observe and visualize a calm, upright posture, the brain engages sensorimotor circuits and strengthens associated neural pathways through experience-dependent neuroplasticity. In simple terms: what you repeatedly focus on becomes easier for your nervous system to access." },
        { title: "Visual Regulation Cue", description: "The composed seated figure acts as a visual regulation cue. Studies on embodied cognition demonstrate that posture influences emotional state; upright, open positioning is associated with increased emotional stability and reduced stress reactivity. Through mirror neuron system activation, observing calm can subtly prime calm." },
        { title: "Metacognitive Awareness", description: "The Ajna symbol- traditionally representing perceptual balance, aligns with what psychology calls metacognitive awareness: the ability to observe thoughts without becoming overwhelmed by them. This shift from reactive processing (amygdala-driven) to reflective processing (prefrontal cortex engagement) is central to emotional resilience." },
        { title: "Wind Chime Element", description: "The wind chime element adds another layer. Gentle, rhythmic auditory input has been shown to:\n◦ Support parasympathetic nervous system activation\n◦ Encourage slower breathing patterns\n◦ Reduce sympathetic stress arousal\nPredictable soft sound functions as a sensory grounding mechanism, helping interrupt stress loops and restore attentional control." },
        { title: "Neural Associations & Habit Formation", description: "Repeated exposure to visual calm, upright symmetry, and gentle sound strengthens neural associations linked to steadiness, cognitive clarity, and emotional regulation. Over time, the brain becomes more efficient at returning to that state under pressure." },
        { title: "Ideal Placement", description: "• Meditation corners\n• Study or work desks\n• Therapy rooms\n• Entryway focal points\n• Reflective or contemplative interior settings" }
    ],
    idealFor: "Meditation corners, study/work desks, therapy rooms",
    careInstructions: "Wipe with a soft, dry microfiber cloth. Avoid water exposure."
};


const ajnaAnchor = {
     // Base Identity
     id_sl: "ajna-anchor-sl",
     id_ec: "ajna-anchor-ec",
     name: "Ajna Sthiti | The Vision Anchor",
     productType: "Desk Decoration", // Inferred
     description: "Designed as a stationary desk anchor, this handcrafted Ajna sculpture serves as a visual stabilizer for workspaces, studios, and reflective corners.",
     specificDescription: "Research in environmental psychology shows that intentional visual focal points help reduce cognitive overload and support attentional control. A calm, symmetrical object placed within your field of vision can gently guide the brain toward parasympathetic regulation — lowering stress reactivity and improving sustained focus. The seated meditative posture acts as a non-verbal cue for embodied calm. When the body sees stillness, the nervous system often mirrors it. Over time, repeated exposure to such cues strengthens neural associations between your workspace and mental clarity. No sound. No distraction. Just a physical reminder to return to the center. Ideal for desks, studios, therapy rooms, and spaces where clarity matters more than noise.",
     price: "₹3,500", // Placeholder
     ethos: "No sound. No distraction. Just a physical reminder to return to the center.",
     whatItsFor: "A visual stabilizer to reduce cognitive overload and support attentional control.",
     features: [
        "Stationary desk anchor",
        "Hand-moulded terracotta figure",
        "Solid natural wood base",
        "Braided jute detailing",
        "Matte acrylic finish"
     ],
     images: ["/images/ajna-anchor.jpg"], // Placeholder
     step: 3,
     specifications: {
         "Product Name": "Ajna Sthiti | The Vision Anchor",
         "Material": "Hand-moulded terracotta meditative figure mounted on a solid natural wood base with braided jute detailing.",
         "Finish": "Matte acrylic surface finish to reduce glare and visual overstimulation. The wooden base retains its natural texture to preserve warmth and material authenticity.",
         "Color": "Soft earth-toned terracotta paired with deep brown wood and subtle purple accent detailing — a grounded composition designed to visually stabilize and anchor a workspace.",
         "Dimensions": "6 × 4 × 3 inches (Height × Width × Depth)",
         "Weight": "Approx. 800–950 grams (handcrafted variation possible)",
         "Craftsmanship": "Individually handcrafted. Each piece is manually moulded, kiln-dried, hand-painted, mounted, and quality-checked. Minor variations in texture and tone are natural characteristics of artisanal production.",
         "Structural Integrity": "The solid wooden base ensures balance and stability for desk or tabletop placement. Designed as a stationary anchor piece for indoor environments.",
         "Care Instructions": "Wipe gently with a soft, dry microfiber cloth. Avoid exposure to water or high humidity. Do not use chemical cleaners or abrasive materials. Keep away from direct rain or prolonged sunlight."
     },
     designBreakdown: [
         { title: "Conceptual Foundation", description: "This desk anchor is designed around principles of environmental psychology, attentional science, and sensory regulation. Research in cognitive neuroscience shows that the human brain continuously scans its environment for stimuli. Cluttered or visually noisy spaces increase cognitive load, forcing the prefrontal cortex to work harder to maintain focus. Introducing a single, stable visual focal point reduces environmental unpredictability and supports attentional anchoring — the brain’s ability to return to one consistent object, lowering mental drift." },
         { title: "Neuroaesthetic Principles", description: "The symmetrical seated posture and centered composition activate what is known as perceptual fluency — the brain’s preference for balanced, predictable visual patterns. Symmetry is processed more efficiently in the visual cortex, reducing subtle cognitive strain. Calm, human-like forms also activate mirror neuron networks associated with embodied perception. When we observe stillness, the nervous system often mirrors it, encouraging parasympathetic regulation (the 'rest and restore' response). This does not 'open chakras.' It provides a consistent visual cue for calm." },
         { title: "Color Psychology & Sensory Modulation", description: "The muted terracotta and deep brown tones fall within low-arousal color ranges. Earth tones are associated in environmental studies with feelings of stability, groundedness, and reduced overstimulation compared to high-saturation hues. Matte finishes reduce light reflection, preventing micro-glare that can subtly increase visual fatigue during prolonged desk work." },
         { title: "Material Science & Structural Stability", description: "• Terracotta: Kiln-fired clay known for durability and tactile warmth.\n• Solid Wood Base: Provides structural weight distribution and physical stability.\n• Jute Detailing: Natural fiber texture adds subtle sensory contrast without visual noise.\nThe object’s physical weight contributes to perceived permanence — and environmental stability increases psychological grounding." },
         { title: "Cognitive Anchoring in Workspaces", description: "In productivity research, visual anchors help reinforce contextual cues. When repeatedly associated with focused work, the object becomes part of a behavioral conditioning loop, strengthening neural pathways tied to attention and discipline. Over time, the brain associates the workspace — and this object within it — with clarity and intention." },
         { title: "Intended Function", description: "• Stabilize visual field\n• Reduce environmental distraction\n• Support attentional control\n• Reinforce calm work rituals\n• Serve as a symbolic reminder of mental alignment" },
         { title: "Ideal Placement", description: "• Work desks and studio tables\n• Meditation or journaling corners\n• Therapy and consultation rooms\n• Bedside tables\n• Focused creative environments" }
     ],
     idealFor: "Work desks, meditation corners, therapy rooms",
     careInstructions: "Wipe gently with a soft, dry microfiber cloth."
};

async function main() {
    try {
        console.log('🚀 Adding Ajna Products...\n');
        const slug = 'insight'; // Third Eye Journey

        console.log(`[DEBUG] Finding journey with slug: '${slug}'`);
        const journey = await prisma.journey.findUnique({ where: { slug } });

        if (!journey) {
            console.error(`❌ Journey "${slug}" not found`);
            return;
        }
        console.log(`[DEBUG] Found journey: ${journey.slug} (ID: ${journey.id})`);


        const currentContent = journey.content as any;

        const updateOrPush = (listKey: 'soul-luxury' | 'energy-curious', productData: any, id: string) => {
            const list = currentContent[listKey] || [];
            const index = list.findIndex((p: any) => p.id === id);
            
            const product = { ...productData, id };
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


        // Add Drishti
        console.log('[DEBUG] Processing Ajna Drishti...');
        updateOrPush('soul-luxury', ajnaDrishti, ajnaDrishti.id_sl);
        updateOrPush('energy-curious', ajnaDrishti, ajnaDrishti.id_ec);

        // Add Anchor
        console.log('[DEBUG] Processing Ajna Anchor...');
        updateOrPush('soul-luxury', ajnaAnchor, ajnaAnchor.id_sl);
        updateOrPush('energy-curious', ajnaAnchor, ajnaAnchor.id_ec);

        console.log('[DEBUG] Updating database...');
        try {
            await prisma.journey.update({
                where: { slug },
                data: { content: currentContent },
            });
            console.log('\n🎉 Ajna products added successfully!');
        } catch (dbError: any) {
             console.error('[DEBUG] Database Update Failed:', dbError.message);
             // console.error(JSON.stringify(dbError, null, 2));
             throw dbError;
        }

    } catch (error: any) {
        console.error('❌ Error:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

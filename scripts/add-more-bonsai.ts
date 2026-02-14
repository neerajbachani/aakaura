import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ==========================================
// THIRD EYE BONSAI (Insight / Ajna)
// ==========================================

const thirdEyeBonsai = {
    id: "insight-bonsai-ec", // Using EC naming/id convention
    name: "Aarohma Ekam Bonsai: Third Eye (Ajna) Chakra",
    sanskritName: "Aarohma Ekam: Ajna", 
    description: "Inspired by the Ajna (Third Eye) Chakra, this bonsai represents perception beyond surface information- clarity, awareness, and inner alignment.",
    specificDescription: "Inspired by the Ajna (Third Eye) Chakra, this bonsai represents perception beyond surface information- clarity, awareness, and inner alignment. The indigo and violet tones are central to this piece. Indigo is associated with cognitive depth, focus, and pattern recognition, while violet reflects higher-order thinking and perspective. Psychologically, these colours are linked to introspection and reduced mental noise, making them ideal for spaces meant for thinking and reflection. The eye motif is symbolic of observation rather than judgment. It represents awareness - the ability to see situations as they are, without distortion from impulse or emotion. The white spiral surrounding the structure signifies mental order. White is neutral and grounding, visually reinforcing balance and coherence when thoughts feel scattered. The two yarn balls represent the dual nature of the Third Eye (Ajna) Chakra, which is traditionally associated with the number 2. They symbolise balance between two modes of perception: Logic and intuition, rational thinking and inner knowing, left brain and right brain processing. In practical terms, the Third Eye isn’t about “seeing visions.” It’s about integrating information- what you observe externally and what you sense internally- and then arriving at clarity. Ideal for workspaces and study areas, creative thinking zones, environments requiring focus and calm decision-making. Think of them as two inputs, one understanding. That’s Ajna done properly- grounded, not dramatic.",
    price: "₹8,500",
    ethos: "This piece integrates a living Adenium bonsai, aligning with principles of biophilic design — the human tendency to seek connection with natural systems.",
    whatItsFor: "Think of them as two inputs, one understanding. That’s Ajna done properly- grounded, not dramatic. Ideal for workspaces and study areas, creative thinking zones, environments requiring focus and calm decision-making.",
    features: [
        "Living Adenium bonsai",
        "Handcrafted terracotta pot",
        "Aura-toned yarn (Indigo)",
        "Spiral geometry design",
        "Dual yarn spheres"
    ],
    images: ["/images/thirdeye-chakra-bonsai.jpg"], // Placeholder
    step: 1,
    specifications: {
        "Product Name": "Aarohma Ekam Bonsai: Third Eye (Ajna) Chakra",
        "Product Type": "Chakra-Inspired Living Bonsai",
        "Plant Type": "Adenium (Desert Rose)",
        "Material": "Live Adenium bonsai, terracotta pot, aura-toned yarn (Indigo), minimal decorative elements",
        "Texture": "Natural (plant & terracotta) with soft yarn detailing",
        "Dimensions": "Approx. 8–12 inches in height (including pot and adornment)",
        "Weight": "Lightweight to medium (varies slightly due to live plant and handcrafted elements)",
        "Packaging": "Secure, protective packaging designed for live plants"
    },
    careInstructions: "Place in bright, indirect sunlight. Water sparingly; allow soil to dry between watering. Avoid overwatering and prolonged damp conditions. Protect from extreme cold.",
    idealFor: "Workspaces and study areas, creative thinking zones, environments requiring focus and calm decision-making",
    designBreakdown: [
        {
            title: "Biophilic Integration (Living Adenium Core)",
            description: "At its center is a living Adenium bonsai, grounding the piece in biophilic design principles; the scientifically supported idea that humans experience measurable cognitive and emotional benefits from interaction with living systems (Wilson, 1984). Studies in environmental psychology demonstrate that exposure to plant life Improves attentional restoration, Reduces stress reactivity, Enhances perceived environmental coherence (Ulrich et al., 1991; Kaplan & Kaplan, 1989). The living core ensures this is not symbolic abstraction — it is biologically present."
        },
        {
            title: "Indigo & Violet Spectrum (Cognitive Color Psychology)",
            description: "The dominant indigo and violet tones sit at the higher-frequency end of the visible spectrum. Research in color psychology suggests: Blue–indigo tones are associated with sustained focus, cognitive stability, and reduced physiological arousal. Violet hues are linked to abstract reasoning and introspective thought due to their rarity in natural large-scale environments (Elliot & Maier, 2014). Cool-spectrum colors are generally correlated with calmer autonomic responses compared to high-arousal warm colors."
        },
        {
            title: "The Eye Motif & Directed Attention",
            description: "The central eye element functions as a visual focal point. From a cognitive science perspective: Humans are neurologically wired to detect and prioritize eye-like stimuli. The fusiform face area and related visual processing regions show heightened sensitivity to eye patterns. This creates: Immediate attentional anchoring, Heightened perceptual awareness, Directed focus within the visual field. The eye here symbolizes observation.. and neurologically, it triggers it."
        },
        {
            title: "Spiral Geometry & Cognitive Flow",
            description: "The white ascending spiral introduces controlled directional movement. Curvilinear forms are associated with positive aesthetic processing and reduced threat perception compared to angular forms (Vartanian et al., 2013). The spiral guides the eye upward in a continuous loop, promoting: Visual continuity, Perceptual fluency, Reduced fragmentation in spatial processing. This mirrors the conceptual function of integration; multiple inputs forming one coherent pathway."
        },
        {
            title: "Dual Yarn Spheres & Bilateral Symbolism",
            description: "The two suspended yarn spheres visually represent dual processing streams. While the popular “left brain vs right brain” simplification is overstated in neuroscience, it is accurate that: The brain processes information through distributed but functionally specialized networks. Effective cognition requires integration across hemispheres via the corpus callosum. The dual elements symbolize cognitive balance; not hemispheric mysticism, but integrated processing. Two inputs. One understanding."
        },
        {
            title: "White Structural Elements & Visual Coherence",
            description: "White is a low-complexity visual field color that enhances spatial clarity. In interior perception research, white increases perceived openness and reduces visual congestion. Within this piece, the white spiral functions as a structural organizer; reinforcing order against the organic irregularity of the plant. It visually “holds” the composition together."
        },
        {
            title: "Workspace Conditioning & Cognitive Association",
            description: "Repeated exposure to a consistent visual anchor in a workspace can contribute to contextual behavioral conditioning (Wood & Neal, 2007). When paired with focused activity, the object may become associated with: Analytical thinking, Reflective decision-making, Reduced impulsive response."
        }
    ]
};

// ==========================================
// THROAT BONSAI (Expression / Vishuddha)
// ==========================================

const throatBonsai = {
    id: "expression-bonsai-ec",
    name: "Aarohma Ekam Bonsai: Throat (Vishuddha) Chakra",
    sanskritName: "Aarohma Ekam: Vishuddha",
    description: "The Throat Chakra Aarohma Ekam Bonsai represents expression, truth, clarity, and the courage to be heard.",
    specificDescription: "The Throat Chakra Aarohma Ekam Bonsai represents expression, truth, clarity, and the courage to be heard. This bonsai is dressed in cool blues and soft whites, echoing the qualities of clear communication and mental spaciousness. The upward spiral flows gently around the plant, symbolising thoughts rising from the heart and finding an honest voice. Nothing is forced here- expression unfolds naturally. The white ball represents purity of intent and clarity before expression. In short, blue carries the vibration of communication; white makes sure that communication is clean. The blue-wrapped trunk represents alignment between inner knowing and spoken word. Suspended yarn orbs move subtly with air, reminding us that words carry vibration- once released, they travel. Set in a handcrafted terracotta pot, the piece balances ether with earth: truth that is grounded, not reactive. It’s designed for spaces where conversations happen- work desks, creative corners, studios, or meditation zones. Throat Chakra Aarohma Ekam is for those who are learning to speak without fear, listen without judgment, and express without dilution. Say less. Mean more. Let your energy speak first.",
    price: "₹8,500",
    ethos: "This piece integrates a living Adenium bonsai, aligning with principles of biophilic design.",
    whatItsFor: "Throat Chakra Aarohma Ekam is for those who are learning to speak without fear, listen without judgment, and express without dilution. Say less. Mean more. Let your energy speak first.",
    features: [
        "Living Adenium bonsai",
        "Handcrafted terracotta pot",
        "Aura-toned yarn (Cool Blue)",
        "Upward spiral design",
        "Suspended yarn orbs"
    ],
    images: ["/images/throat-chakra-bonsai.jpg"], // Placeholder
    step: 1,
    specifications: {
        "Product Name": "Aarohma Ekam Bonsai: Throat (Vishuddha) Chakra",
        "Product Type": "Chakra-Inspired Living Bonsai",
        "Plant Type": "Adenium (Desert Rose)",
        "Material": "Live Adenium bonsai, terracotta pot, aura-toned yarn (Cool Blue), minimal decorative elements",
        "Texture": "Natural (plant & terracotta) with soft yarn detailing",
        "Dimensions": "Approx. 8–12 inches in height (including pot and adornment)",
        "Weight": "Lightweight to medium (varies slightly due to live plant and handcrafted elements)",
        "Packaging": "Secure, protective packaging designed for live plants"
    },
    careInstructions: "Place in bright, indirect sunlight. Water sparingly; allow soil to dry between watering. Avoid overwatering and prolonged damp conditions. Protect from extreme cold.",
    idealFor: "Work desks, creative corners, studios, or meditation zones",
    designBreakdown: [
        {
            title: "Living Core & Environmental Regulation",
            description: "At the center is a living Adenium bonsai, anchoring the piece in biophilic design principles. Environmental psychology research shows that the presence of living plants: Reduces cortisol response, Enhances cognitive restoration, Improves perceived air and spatial quality (Ulrich et al., 1991; Kaplan & Kaplan, 1989). Communication improves when stress reduces. Calm physiology supports clearer expression. This is biological, not symbolic."
        },
        {
            title: "Blue Spectrum & Communication Psychology",
            description: "Blue dominates this piece for a reason. In color psychology research: Blue tones are associated with trust, stability, and cognitive clarity. Exposure to blue environments has been linked to improved creative output and mental openness. Cooler hues generally reduce physiological arousal compared to warm tones (Elliot & Maier, 2014). Blue does not “activate a chakra.” It creates a perceptual atmosphere associated with credibility and calm articulation. In negotiation rooms, corporate branding, and professional environments… blue is historically used to signal reliability. Tradition supports psychology."
        },
        {
            title: "White Accents & Cognitive Cleanliness",
            description: "White serves as a perceptual reset. Research in environmental perception shows white surfaces: Increase perceived spaciousness, Reduce visual noise, Improve object separation and clarity. In this composition, white symbolizes clarity before speech; structurally reinforcing the idea of filtered, intentional communication."
        },
        {
            title: "Upward Spiral & Thought-to-Voice Mapping",
            description: "The ascending spiral functions as directional guidance. Curvilinear forms are processed more positively by the visual cortex than sharp angular forms (Vartanian et al., 2013). The upward movement mirrors the cognitive process of expression: Internal processing, Emotional filtering, Verbal articulation. The spiral subtly guides the eye upward; simulating conceptual elevation from thought to voice. Expression here is progressive, not explosive."
        },
        {
            title: "Suspended Yarn Orbs & Acoustic Symbolism",
            description: "The suspended yarn spheres move gently with airflow. This movement introduces a kinetic element, a physical metaphor for how spoken words behave: Words create vibration. Vibration moves through air. Sound carries beyond the source. From a physics standpoint, speech is mechanical vibration traveling through air molecules. The mobile elements visually echo that principle."
        },
        {
            title: "Trunk Wrapping & Alignment Symbolism",
            description: "The blue-wrapped trunk represents continuity. Structurally, it creates visual cohesion between base and crown. Conceptually, it reflects alignment between internal cognition and external articulation. Neuroscience shows that effective communication requires integration between: Emotional regulation centers (limbic system), Executive language regions (prefrontal cortex, Broca’s area). Alignment produces clarity. Misalignment produces contradiction."
        },
        {
            title: "Spatial Conditioning & Behavioral Anchoring",
            description: "Objects placed consistently in communication spaces can become environmental cues. Behavioral psychology suggests that repeated pairing of environment and behavior strengthens associative conditioning (Wood & Neal, 2007). Placed in: Workspaces, Therapy rooms, Creative studios, Study areas. The piece can become a contextual anchor for intentional speech and mindful listening."
        }
    ]
};

// ==========================================
// HEART BONSAI (Love / Anahata)
// ==========================================

const heartBonsai = {
    id: "love-bonsai-ec",
    name: "Aarohma Ekam Bonsai: Heart (Anahata) Chakra",
    sanskritName: "Aarohma Ekam: Anahata",
    description: "Designed around the Anahata Chakra, this bonsai represents balance between strength and softness- the space where emotion and stability meet.",
    specificDescription: "Designed around the Anahata Chakra, this bonsai represents balance between strength and softness- the space where emotion and stability meet. The green wrapping follows the trunk to symbolise growth, healing, and continuity. Green is scientifically known to have a calming effect on the nervous system, often associated with balance and restoration- exactly what the heart centre governs. The pink elements represent emotional warmth, compassion, and connection. Pink is a softened form of red- carrying vitality without aggression. It visually anchors feelings of care, empathy, and openness without overwhelming the space. The spiral structure reflects circulation- emotional flow rather than emotional storage. It’s a reminder that feelings are meant to move, not get stuck. Placed in living or working spaces, this bonsai is ideal for creating emotional balance, softening high-stress environments, encouraging openness without vulnerability overload. This piece supports emotional equilibrium- subtly, aesthetically, and consistently. A reminder that strength doesn’t have to be loud, and softness doesn’t have to be weak.",
    price: "₹8,500",
    ethos: "This piece integrates a living Adenium bonsai, aligning with principles of biophilic design.",
    whatItsFor: "Placed in living or working spaces, this bonsai is ideal for creating emotional balance, softening high-stress environments, encouraging openness without vulnerability overload.",
    features: [
        "Living Adenium bonsai",
        "Handcrafted terracotta pot",
        "Aura-toned yarn (Green)",
        "Pink emotional warmth accents",
        "Spiral structure"
    ],
    images: ["/images/heart-chakra-bonsai.jpg"], // Placeholder
    step: 1,
    specifications: {
        "Product Name": "Aarohma Ekam Bonsai: Heart (Anahata) Chakra",
        "Product Type": "Chakra-Inspired Living Bonsai",
        "Plant Type": "Adenium (Desert Rose)",
        "Material": "Live Adenium bonsai, terracotta pot, aura-toned yarn (Green), minimal decorative elements",
        "Texture": "Natural (plant & terracotta) with soft yarn detailing",
        "Dimensions": "Approx. 8–12 inches in height (including pot and adornment)",
        "Weight": "Lightweight to medium (varies slightly due to live plant and handcrafted elements)",
        "Packaging": "Secure, protective packaging designed for live plants"
    },
    careInstructions: "Place in bright, indirect sunlight. Water sparingly; allow soil to dry between watering. Avoid overwatering and prolonged damp conditions. Protect from extreme cold.",
    idealFor: "Living spaces, therapy settings, relationship-focused environments, workspaces under emotional demand",
    designBreakdown: [
        {
            title: "Living Core & Biophilic Regulation",
            description: "At the center is a living Adenium bonsai, grounding the piece in biophilic design science. Research in environmental psychology shows that interaction with living plant systems can: Reduce sympathetic nervous system activation, Lower perceived stress levels, Improve emotional regulation and attentional recovery (Ulrich et al., 1991; Kaplan & Kaplan, 1989). Greenery exposure is consistently associated with parasympathetic activation; the “rest and regulate” state of the autonomic nervous system. Emotional balance begins with physiological balance. The living core supports that baseline."
        },
        {
            title: "Green Spectrum & Nervous System Response",
            description: "Green dominates this composition intentionally. From a visual processing standpoint: Green sits at the center of the visible light spectrum (~495–570 nm). The human eye is most sensitive to green wavelengths. Green environments are associated with reduced eye strain and perceptual comfort. Neurologically, exposure to natural green spaces has been correlated with: Lower cortisol levels, Reduced rumination, Improved mood stability (Berman et al., 2012)."
        },
        {
            title: "Pink Accents & Controlled Emotional Warmth",
            description: "Pink elements introduce calibrated warmth. Pink is essentially desaturated red. Red increases physiological arousal- higher heart rate, increased alertness. When softened into pink: Arousal impact reduces, Aggressive signaling decreases, Affiliative associations increase. Color studies link softer pink tones with: Nurturing perception, Emotional safety, Reduced hostility in controlled environments (Elliot & Maier, 2014). This allows vitality without aggression. Warmth without overwhelm."
        },
        {
            title: "Spiral Geometry & Emotional Flow",
            description: "In perceptual psychology: Curvilinear forms are processed more positively than angular forms. Curves are associated with safety and softness. Continuous shapes reduce cognitive friction in visual scanning (Vartanian et al., 2013). The spiral visually reinforces circulation- movement instead of stagnation. Emotion regulation research consistently shows that suppression increases physiological stress, while cognitive processing and expression improve regulation outcomes."
        },
        {
            title: "Bilateral Color Balance & Symmetry",
            description: "The interplay between green (cool equilibrium) and pink (warm empathy) creates chromatic balance. Balanced color contrast improves perceptual harmony. Too much cool becomes sterile. Too much warmth becomes overstimulating. The visual midpoint between these tones mirrors emotional regulation — integration of stability and compassion. Not dominance. Integration."
        },
        {
            title: "Environmental Conditioning & Emotional Context",
            description: "Objects repeatedly paired with certain environments can become contextual behavioral cues. Habit formation research (Wood & Neal, 2007) shows that environmental anchors influence behavioral consistency. Placed in: Living spaces, Therapy settings, Relationship-focused environments, Workspaces under emotional demand. The bonsai can become associated with: Paused reactions, Measured responses, Balanced expression."
        }
    ]
};


async function main() {
    try {
        console.log('🚀 Adding Third Eye, Throat, and Heart Bonsai Products...\n');

        // Helper to update journey
        const updateJourney = async (slug: string, ecProduct: any) => {
             // Create a SL copy if desired, but for now using EC as primary or adding to both.
             // Strategy: Add to BOTH lists to ensure visibility, similar to previous step.
             const slProduct = { ...ecProduct, id: ecProduct.id.replace('-ec', '-sl') };

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

        // Add Third Eye
        await updateJourney('insight', thirdEyeBonsai);

        // Add Throat
        await updateJourney('expression', throatBonsai);

        // Add Heart
        await updateJourney('love', heartBonsai);

        console.log('🌐 Visit:');
        console.log(' - http://localhost:3000/journey/insight');
        console.log(' - http://localhost:3000/journey/expression');
        console.log(' - http://localhost:3000/journey/love');

    } catch (error: any) {
        console.error('❌ Error:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

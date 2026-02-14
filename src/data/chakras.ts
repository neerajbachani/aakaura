export interface JourneyProduct {
  id: string;
  name: string;
  sanskritName: string;
  description: string;
  specificDescription: string;
  price: string;
  ethos: string;
  whatItsFor: string;
  features: string[];
  images: string[];
  variants?: {
    color: string; // Hex code
    name: string;
    image: string;
  }[];
  step: number;
  category?: string;

  // Extended fields for comprehensive product information
  specifications?: {
    material?: string;
    finish?: string;
    color?: string;
    dimensions?: string;
    weight?: string;
    crafting?: string;
    durability?: string;
    packaging?: string;
    // Allow additional string properties for bonsai-specific or other dynamic fields
    [key: string]: string | undefined;
  };
  careInstructions?: string;
  idealFor?: string;
  symbolism?: string;
  languageEngraving?: string;
  designBreakdown?: {
    title: string;
    description: string;
  }[] | string;
  additionalSection?: {
    title: string;
    content: string;
  };
  whenToUse?: {
    introduction?: string;
    whoShouldWork?: {
      title: string;
      description: string;
    }[];
    bestSpaces?: {
      category: string;
      items: string[];
    }[];
    bestTimes?: string[];
    supportivePractices?: string[];
  };
}

export interface ChakraData {
  slug: string;
  name: string;
  tagline: string;
  sanskritName: string;
  tone: string;
  colors: {
    primary: string;
    dark: string;
    light: string;
    gradient: string;
  };
  location: string;
  element: string;
  mantra: string;
  crystals: string[];
  description: string;
  benefits: string[];
  symbol: string;
  content: {
    'soul-luxury': JourneyProduct[];
    'energy-curious': JourneyProduct[];
  };
}

const TEMPLATE_SL_PRODUCT = {
  category: "Muffler",
  name: "Handcrafted Winter Muffler",
  sanskritName: "",
  description: "Handcrafted Winter Muffler. Premium wool-blend yarn.",
  specificDescription: "Handcrafted Winter Muffler. Premium wool-blend yarn (soft-touch, breathable & skin-friendly). Traditional handwoven flat knit.",
  price: "₹4,500",
  ethos: "Artisan-crafted in India. Small-batch, slow-made, supporting traditional craftsmanship.",
  whatItsFor: "Aamvaraah isn't made for fast fashion. It's made for those who appreciate things that last — warm, dependable, and rooted. The kind of muffler your grandfather would approve of… but your wardrobe desperately needed an upgrade. Classic sense, modern soul.",
  features: [
    "Retains warmth without trapping excess heat",
    "Breathable weave for all-day comfort",
    "Can be styled as muffler, stole or wrap"
  ],
  images: ["/images/aamvaraah-muffler2.png"],
  variants: [
    { color: '#8B4513', name: 'Saddle Brown', image: '/images/aamvaraah-muffler2.png' },
    { color: '#A0522D', name: 'Sienna', image: '/images/aamvaraah-muffler.jpeg' },
    { color: '#CD853F', name: 'Peru', image: '/images/aamvaraah-muffler2.png' }
  ],
  step: 1
};

const TEMPLATE_EC_PRODUCT = {
  category: "Muffler",
  name: "Energy Shield Muffler",
  sanskritName: "",
  description: "A sacred shield for your aura.",
  specificDescription: "A sacred shield for your aura. Woven with intention to ground your energy and protect your throat chakra during the colder transitions.",
  price: "₹5,500",
  ethos: "Consciously crafted to align with your energetic vibrations. Each thread holds the intention of warmth and protection.",
  whatItsFor: "For the seeker who knows that clothing is energy. This muffler isn't just fabric; it's a boundary, a warm embrace for your spirit, and a grounding tool for your daily practice. Wear it when you need to feel held by the universe.",
  features: [
    "Energetically cleansed before shipping",
    "Natural fibers to maintain auric integrity",
    "Mindfully woven to support grounding"
  ],
  images: ["/images/aamvaraah-muffler.jpeg"],
  variants: [
    { color: '#2F4F4F', name: 'Dark Slate Gray', image: '/images/aamvaraah-muffler.jpeg' },
    { color: '#556B2F', name: 'Dark Olive Green', image: '/images/aamvaraah-muffler.jpeg' },
    { color: '#808000', name: 'Olive', image: '/images/aamvaraah-muffler.jpeg' }
  ],
  step: 1
};


export const chakrasData: Record<string, ChakraData> = {
  grounding: {
    slug: "grounding",
    name: "Root Chakra",
    tagline: "Stillness & Coherence",
    sanskritName: "Muladhara",
    tone: "Grounding",
    colors: {
      primary: "#DC2626",
      dark: "#991B1B",
      light: "#FEE2E2",
      gradient: "from-red-600 via-red-500 to-red-400",
    },
    location: "Base of spine",
    element: "Earth",
    mantra: "LAM",
    crystals: ["Red Jasper", "Hematite", "Black Tourmaline", "Garnet"],
    description: "The Root Chakra is your foundation, connecting you to the earth and providing stability, security, and a sense of belonging.",
    benefits: ["Security", "Vitality", "Grounding", "Stability", "Fearlessness"],
    symbol: "🜃",
    content: {
      'soul-luxury': [
        {
          id: "grounding-sl-1",
          category: "Wall Hanging",
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
        },
        { ...TEMPLATE_SL_PRODUCT, id: "grounding-sl-2", name: "Grounding Muffler", description: "A warm muffler to keep you grounded." }
      ],
      'energy-curious': [
        {
          id: "grounding-ec-1",
          category: "Wall Hanging",
          name: "Prithvi Aayam Wall Hanging",
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
          careInstructions: "Clean gently with a soft, dry cloth. Avoid water, moisture, chemicals, and perfumes. Periodically cleanse energetically using sage smoke or sound.",
          idealFor: "Meditation spaces, grounding practices, entrances, workspaces, energy healing rooms, and intentional gifting to those on spiritual paths",
          symbolism: "Represents grounding, stability, continuity, and the infinite foundation of existence. Acts as a physical reminder of your connection to Earth energy.",
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
        },
        { ...TEMPLATE_EC_PRODUCT, id: "grounding-ec-2", name: "Grounding Shield Muffler", description: "A protective muffler for grounding." }
      ]
    }
  },
  flow: {
    slug: "flow",
    name: "Sacral Chakra",
    tagline: "Stillness & Coherence",
    sanskritName: "Svadhisthana",
    tone: "Flow",
    colors: {
      primary: "#EA580C",
      dark: "#9A3412",
      light: "#FFEDD5",
      gradient: "from-orange-600 via-orange-500 to-orange-400",
    },
    location: "Lower abdomen",
    element: "Water",
    mantra: "VAM",
    crystals: ["Carnelian", "Orange Calcite", "Sunstone", "Amber"],
    description: "The Sacral Chakra governs creativity, pleasure, and emotional flow.",
    benefits: ["Creativity", "Emotional intelligence", "Healthy sexuality", "Flexibility", "Joy"],
    symbol: "☽",
    content: {
      'soul-luxury': [
        { ...TEMPLATE_SL_PRODUCT, id: "flow-sl-1" },
        { ...TEMPLATE_SL_PRODUCT, id: "flow-sl-2", name: "Handcrafted Winter Muffler (Set of 2)", price: "₹8,500" }
      ],
      'energy-curious': [
        { ...TEMPLATE_EC_PRODUCT, id: "flow-ec-1" },
        { ...TEMPLATE_EC_PRODUCT, id: "flow-ec-2", name: "Energy Shield Muffler (Ritual Pack)", price: "₹10,500" }
      ]
    }
  },
  power: {
    slug: "power",
    name: "Solar Plexus Chakra",
    tagline: "Stillness & Coherence",
    sanskritName: "Manipura",
    tone: "Power",
    colors: {
      primary: "#EAB308",
      dark: "#854D0E",
      light: "#FEF9C3",
      gradient: "from-yellow-500 via-yellow-400 to-amber-400",
    },
    location: "Upper abdomen",
    element: "Fire",
    mantra: "RAM",
    crystals: ["Citrine", "Tiger's Eye", "Yellow Jasper", "Amber"],
    description: "The Solar Plexus Chakra is your power center.",
    benefits: ["Confidence", "Willpower", "Decision-making", "Digestion", "Personal power"],
    symbol: "☀",
    content: {
      'soul-luxury': [
        { ...TEMPLATE_SL_PRODUCT, id: "power-sl-1" },
        { ...TEMPLATE_SL_PRODUCT, id: "power-sl-2", name: "Handcrafted Winter Muffler (Set of 2)", price: "₹8,500" }
      ],
      'energy-curious': [
        { ...TEMPLATE_EC_PRODUCT, id: "power-ec-1" },
        { ...TEMPLATE_EC_PRODUCT, id: "power-ec-2", name: "Energy Shield Muffler (Ritual Pack)", price: "₹10,500" }
      ]
    }
  },
  love: {
    slug: "love",
    name: "Heart Chakra",
    tagline: "Stillness & Coherence",
    sanskritName: "Anahata",
    tone: "Love",
    colors: {
      primary: "#16A34A",
      dark: "#14532D",
      light: "#DCFCE7",
      gradient: "from-green-600 via-green-500 to-emerald-400",
    },
    location: "Center of chest",
    element: "Air",
    mantra: "YAM",
    crystals: ["Rose Quartz", "Green Aventurine", "Jade", "Emerald"],
    description: "The Heart Chakra is the bridge between physical and spiritual.",
    benefits: ["Love", "Compassion", "Empathy", "Healing", "Peace"],
    symbol: "♡",
    content: {
      'soul-luxury': [
        { ...TEMPLATE_SL_PRODUCT, id: "love-sl-1" },
        { ...TEMPLATE_SL_PRODUCT, id: "love-sl-2", name: "Handcrafted Winter Muffler (Set of 2)", price: "₹8,500" }
      ],
      'energy-curious': [
        { ...TEMPLATE_EC_PRODUCT, id: "love-ec-1" },
        { ...TEMPLATE_EC_PRODUCT, id: "love-ec-2", name: "Energy Shield Muffler (Ritual Pack)", price: "₹10,500" }
      ]
    }
  },
  expression: {
    slug: "expression",
    name: "Throat Chakra",
    tagline: "Stillness & Coherence",
    sanskritName: "Vishuddha",
    tone: "Expression",
    colors: {
      primary: "#2563EB",
      dark: "#1E3A8A",
      light: "#DBEAFE",
      gradient: "from-blue-600 via-blue-500 to-sky-400",
    },
    location: "Throat",
    element: "Ether",
    mantra: "HAM",
    crystals: ["Aquamarine", "Blue Lace Agate", "Turquoise", "Lapis Lazuli"],
    description: "The Throat Chakra governs communication.",
    benefits: ["Communication", "Expression", "Truth", "Listening", "Confidence"],
    symbol: "🗣",
    content: {
      'soul-luxury': [
        { ...TEMPLATE_SL_PRODUCT, id: "expression-sl-1" },
        { ...TEMPLATE_SL_PRODUCT, id: "expression-sl-2", name: "Handcrafted Winter Muffler (Set of 2)", price: "₹8,500" }
      ],
      'energy-curious': [
        { ...TEMPLATE_EC_PRODUCT, id: "expression-ec-1" },
        { ...TEMPLATE_EC_PRODUCT, id: "expression-ec-2", name: "Energy Shield Muffler (Ritual Pack)", price: "₹10,500" }
      ]
    }
  },
  insight: {
    slug: "insight",
    name: "Third Eye Chakra",
    tagline: "Stillness & Coherence",
    sanskritName: "Ajna",
    tone: "Insight",
    colors: {
      primary: "#4F46E5",
      dark: "#312E81",
      light: "#E0E7FF",
      gradient: "from-indigo-600 via-indigo-500 to-purple-500",
    },
    location: "Between eyebrows",
    element: "Light",
    mantra: "OM",
    crystals: ["Amethyst", "Lapis Lazuli", "Sodalite", "Fluorite"],
    description: "The Third Eye Chakra is your center of intuition.",
    benefits: ["Intuition", "Clarity", "Awareness", "Wisdom", "Dreams"],
    symbol: "👁",
    content: {
      'soul-luxury': [
        { ...TEMPLATE_SL_PRODUCT, id: "insight-sl-1" },
        { ...TEMPLATE_SL_PRODUCT, id: "insight-sl-2", name: "Handcrafted Winter Muffler (Set of 2)", price: "₹8,500" }
      ],
      'energy-curious': [
        { ...TEMPLATE_EC_PRODUCT, id: "insight-ec-1" },
        { ...TEMPLATE_EC_PRODUCT, id: "insight-ec-2", name: "Energy Shield Muffler (Ritual Pack)", price: "₹10,500" }
      ]
    }
  },
  expansion: {
    slug: "expansion",
    name: "Crown Chakra",
    tagline: "Stillness & Coherence",
    sanskritName: "Sahasrara",
    tone: "Expansion",
    colors: {
      primary: "#9333EA",
      dark: "#581C87",
      light: "#F3E8FF",
      gradient: "from-purple-600 via-violet-500 to-fuchsia-400",
    },
    location: "Top of head",
    element: "Consciousness",
    mantra: "AH",
    crystals: ["Clear Quartz", "Amethyst", "Selenite", "Diamond"],
    description: "The Crown Chakra is connection to divine.",
    benefits: ["Connection", "Unity", "Consciousness", "Peace", "Purpose"],
    symbol: "✧",
    content: {
      'soul-luxury': [
        { ...TEMPLATE_SL_PRODUCT, id: "expansion-sl-1" },
        { ...TEMPLATE_SL_PRODUCT, id: "expansion-sl-2", name: "Handcrafted Winter Muffler (Set of 2)", price: "₹8,500" }
      ],
      'energy-curious': [
        { ...TEMPLATE_EC_PRODUCT, id: "expansion-ec-1" },
        { ...TEMPLATE_EC_PRODUCT, id: "expansion-ec-2", name: "Energy Shield Muffler (Ritual Pack)", price: "₹10,500" }
      ]
    }
  }
};

export const getAllChakraSlugs = () => Object.keys(chakrasData);

export const getProductsByCategory = (category: string): { product: JourneyProduct; chakra: ChakraData }[] => {
  const allProducts: { product: JourneyProduct; chakra: ChakraData }[] = [];
  
  Object.values(chakrasData).forEach((chakra) => {
    // Check both client types
    (['soul-luxury', 'energy-curious'] as const).forEach((clientType) => {
      const products = chakra.content[clientType] || [];
      products.forEach((p) => {
        // Simple case-insensitive match (or exact match if consistent)
        // Ensure category exists and matches
        if (p.category && p.category.toLowerCase() === category.toLowerCase()) {
          // Avoid duplicates if same product ID exists in both lists (though they should be unique per client type usually)
           if (!allProducts.some(item => item.product.id === p.id)) {
             allProducts.push({ product: p, chakra });
           }
        }
      });
    });
  });

  return allProducts;
};

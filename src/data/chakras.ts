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
        { ...TEMPLATE_SL_PRODUCT, id: "grounding-sl-1" },
        { ...TEMPLATE_SL_PRODUCT, id: "grounding-sl-2", name: "Handcrafted Winter Muffler (Set of 2)", price: "₹8,500" }
      ],
      'energy-curious': [
        { ...TEMPLATE_EC_PRODUCT, id: "grounding-ec-1" },
        { ...TEMPLATE_EC_PRODUCT, id: "grounding-ec-2", name: "Energy Shield Muffler (Ritual Pack)", price: "₹10,500" }
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

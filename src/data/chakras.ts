export interface ChakraProduct {
  name: string;
  description: string;
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
  products: ChakraProduct[];
  symbol: string;
}

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
    description:
      "The Root Chakra is your foundation, connecting you to the earth and providing stability, security, and a sense of belonging. When balanced, you feel grounded, safe, and confident in your ability to meet life's challenges.",
    benefits: [
      "Enhanced sense of security and stability",
      "Improved physical vitality and energy",
      "Stronger connection to your body and earth",
      "Reduced anxiety and fear",
      "Better financial stability awareness",
    ],
    products: [
      {
        name: "Grounding Meditation Oil",
        description: "Earthy blend to anchor your energy",
        step: 1,
      },
      {
        name: "Root Chakra Crystal Set",
        description: "Curated stones for stability",
        step: 2,
      },
      {
        name: "Grounding Incense",
        description: "Sacred smoke for earthly connection",
        step: 3,
      },
      {
        name: "Root Chakra Journal",
        description: "Reflect on your foundation",
        step: 4,
      },
      {
        name: "Grounding Tea Blend",
        description: "Herbal support for stability",
        step: 5,
      },
    ],
    symbol: "🜃",
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
    description:
      "The Sacral Chakra governs creativity, pleasure, and emotional flow. It's the center of your passion, sensuality, and ability to embrace change with grace and fluidity.",
    benefits: [
      "Enhanced creativity and inspiration",
      "Improved emotional intelligence",
      "Healthy expression of sexuality",
      "Greater flexibility and adaptability",
      "Increased joy and pleasure in life",
    ],
    products: [
      {
        name: "Creative Flow Oil",
        description: "Awaken your creative essence",
        step: 1,
      },
      {
        name: "Sacral Chakra Crystal Set",
        description: "Stones for emotional balance",
        step: 2,
      },
      {
        name: "Sensual Incense",
        description: "Ignite passion and creativity",
        step: 3,
      },
      {
        name: "Flow Journal",
        description: "Express your creative truth",
        step: 4,
      },
      {
        name: "Passion Tea Blend",
        description: "Herbal support for vitality",
        step: 5,
      },
    ],
    symbol: "☽",
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
    description:
      "The Solar Plexus Chakra is your power center, governing self-esteem, willpower, and personal transformation. It's where you cultivate confidence and take action on your dreams.",
    benefits: [
      "Increased self-confidence and self-worth",
      "Enhanced willpower and determination",
      "Better decision-making abilities",
      "Improved digestion and metabolism",
      "Greater sense of personal power",
    ],
    products: [
      {
        name: "Empowerment Oil",
        description: "Ignite your inner fire",
        step: 1,
      },
      {
        name: "Solar Plexus Crystal Set",
        description: "Stones for personal power",
        step: 2,
      },
      {
        name: "Confidence Incense",
        description: "Strengthen your will",
        step: 3,
      },
      {
        name: "Power Journal",
        description: "Claim your authentic power",
        step: 4,
      },
      {
        name: "Vitality Tea Blend",
        description: "Herbal support for energy",
        step: 5,
      },
    ],
    symbol: "☀",
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
    description:
      "The Heart Chakra is the bridge between physical and spiritual, governing love, compassion, and connection. It's where you open to give and receive love unconditionally.",
    benefits: [
      "Deeper capacity for love and compassion",
      "Improved relationships and connections",
      "Enhanced empathy and understanding",
      "Emotional healing and forgiveness",
      "Greater sense of peace and harmony",
    ],
    products: [
      {
        name: "Heart Opening Oil",
        description: "Embrace unconditional love",
        step: 1,
      },
      {
        name: "Heart Chakra Crystal Set",
        description: "Stones for love and healing",
        step: 2,
      },
      {
        name: "Compassion Incense",
        description: "Open your heart space",
        step: 3,
      },
      {
        name: "Love Journal",
        description: "Cultivate self-love and compassion",
        step: 4,
      },
      {
        name: "Heart Tea Blend",
        description: "Herbal support for emotional balance",
        step: 5,
      },
    ],
    symbol: "♡",
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
    description:
      "The Throat Chakra governs communication, self-expression, and truth. It's where you find your authentic voice and speak your truth with clarity and confidence.",
    benefits: [
      "Clear and authentic communication",
      "Enhanced creative expression",
      "Ability to speak your truth",
      "Improved listening skills",
      "Greater confidence in self-expression",
    ],
    products: [
      {
        name: "Truth Speaking Oil",
        description: "Find your authentic voice",
        step: 1,
      },
      {
        name: "Throat Chakra Crystal Set",
        description: "Stones for clear communication",
        step: 2,
      },
      {
        name: "Expression Incense",
        description: "Unlock your voice",
        step: 3,
      },
      {
        name: "Voice Journal",
        description: "Express your truth",
        step: 4,
      },
      {
        name: "Clarity Tea Blend",
        description: "Herbal support for communication",
        step: 5,
      },
    ],
    symbol: "🗣",
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
    description:
      "The Third Eye Chakra is your center of intuition, wisdom, and inner vision. It's where you access higher consciousness and perceive beyond the physical realm.",
    benefits: [
      "Enhanced intuition and insight",
      "Improved mental clarity and focus",
      "Deeper spiritual awareness",
      "Better decision-making through inner wisdom",
      "Vivid dreams and visualization",
    ],
    products: [
      {
        name: "Intuition Oil",
        description: "Awaken your inner sight",
        step: 1,
      },
      {
        name: "Third Eye Crystal Set",
        description: "Stones for intuitive wisdom",
        step: 2,
      },
      {
        name: "Vision Incense",
        description: "Open your third eye",
        step: 3,
      },
      {
        name: "Insight Journal",
        description: "Record your inner visions",
        step: 4,
      },
      {
        name: "Clarity Tea Blend",
        description: "Herbal support for mental clarity",
        step: 5,
      },
    ],
    symbol: "👁",
  },
  expansion: {
    slug: "expansion",
    name: "Crown Chakra",
    sanskritName: "Sahasrara",
    tagline: "Stillness & Coherence",
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
    description:
      "The Crown Chakra is your connection to the divine, universal consciousness, and spiritual enlightenment. It's where you transcend the ego and experience unity with all.",
    benefits: [
      "Deep spiritual connection",
      "Sense of unity and oneness",
      "Enhanced consciousness and awareness",
      "Inner peace and bliss",
      "Connection to higher purpose",
    ],
    products: [
      {
        name: "Aamvarah Muffler",
        description: "Unite with universal consciousness",
        step: 1,
      },
      {
        name: "Crown Chakra Crystal Set",
        description: "Stones for spiritual awakening",
        step: 2,
      },
      {
        name: "Transcendence Incense",
        description: "Elevate your consciousness",
        step: 3,
      },
      {
        name: "Enlightenment Journal",
        description: "Document your spiritual journey",
        step: 4,
      },
      {
        name: "Bliss Tea Blend",
        description: "Herbal support for meditation",
        step: 5,
      },
    ],
    symbol: "✧",
  },
};

export const getAllChakraSlugs = () => Object.keys(chakrasData);

export interface CategoryFAQ {
  question: string;
  answer: string;
}

export interface CategorySEOEntry {
  slug: string;
  dbCategory: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  keywords: string[];
  faqs: CategoryFAQ[];
  relatedLinks: { label: string; href: string }[];
  linkTitle: string;
}

export const CATEGORY_SLUGS = [
  "wall-hanging",
  "jewellery",
  "anchor",
  "muffler",
  "neck-warmer",
  "bonsai",
] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export const categorySEO: Record<CategorySlug, CategorySEOEntry> = {
  "wall-hanging": {
    slug: "wall-hanging",
    dbCategory: "Wall Hanging",
    title: "7 Chakra Wall Hangings | Handcrafted Chakra Wall Decor | Aakaura",
    description:
      "Shop 7 chakra wall hangings handcrafted by Indian artisans. Perfect for meditation rooms and home energy balance. Buy online at Aakaura.",
    h1: "Chakra Wall Hangings",
    intro:
      "Transform your space with Aakaura's seven chakra wall hangings, handcrafted chakra wall decor designed for those who want their home to feel grounded, balanced, and alive. Each piece is slow-made by Indian artisans, blending sacred geometry with intentional design so your walls do more than decorate: they anchor energy. Whether you are creating a meditation room, aligning your living space with Vastu principles, or searching for seven chakra hanging art that speaks to every energy centre, our collection offers chakra tapestry art with meaning behind every thread. From root grounding to crown expansion, explore wall hangings that support chakra healing, mindful living, and the quiet ritual of coming home to yourself.",
    keywords: [
      "7 chakra wall hanging",
      "chakra wall decor",
      "seven chakra hanging",
      "chakra tapestry art",
      "buy 7 chakra wall hanging online",
      "wall hanging for meditation room",
      "Vastu chakra wall decor",
      "balance home energy decor",
    ],
    faqs: [
      {
        question: "What is a 7 chakra wall hanging used for?",
        answer:
          "A 7 chakra wall hanging brings colour, symbolism, and energetic intention into your space. It is ideal for meditation rooms, yoga corners, and entryways where you want visual reminders of balance across all seven chakras.",
      },
      {
        question: "Where should I hang chakra wall decor at home?",
        answer:
          "Place chakra wall decor in spaces where you rest, meditate, or begin your day, such as a bedroom, living room altar, or home office. Many customers follow Vastu or personal intuition to choose a wall that feels central to the home's energy.",
      },
      {
        question: "Are Aakaura wall hangings handcrafted?",
        answer:
          "Yes. Every Aakaura wall hanging is handcrafted by Indian artisans using slow-made, conscious production methods. Each piece reflects traditional craftsmanship adapted for modern spiritual living.",
      },
    ],
    relatedLinks: [
      { label: "Yoga Nidra Desk Anchors", href: "/shop/category/anchor" },
      { label: "Chakra Bonsai Plants", href: "/shop/category/bonsai" },
      { label: "Spiritual Jewellery", href: "/shop/category/jewellery" },
    ],
    linkTitle: "Shop 7 chakra wall hangings and chakra wall decor",
  },
  jewellery: {
    slug: "jewellery",
    dbCategory: "Jewellery",
    title: "Heart Chakra Jewellery | Jhumkis & Necklaces | Aakaura",
    description:
      "Shop heart chakra jhumkis and Anahata pendants handcrafted in India. Jewellery for emotional healing and self-love. Buy online at Aakaura.",
    h1: "Heart Chakra Jewellery",
    intro:
      "Wear your intention with Aakaura's heart chakra jewellery, handcrafted heart chakra jhumkas and Anahata chakra pendants designed for emotional healing, self-love, and conscious living. Our green chakra earrings and spiritual jhumka earrings carry the energy of the heart centre, making them meaningful gifts for heart chakra opening or everyday alignment. Explore premium heart chakra necklaces in sterling silver, authentic Indian spiritual necklace designs, and love energy jewellery that bridges tradition with modern wellness. Whether you seek jewellery for emotional healing, heart chakra balancing earrings, or a thoughtful gift for someone on a spiritual path, each piece is artisan-made with intention, not mass-produced ornament, but wearable ritual.",
    keywords: [
      "heart chakra jhumkis",
      "green chakra earrings",
      "spiritual jhumka earrings",
      "Anahata chakra jewelry",
      "heart chakra necklace",
      "green crystal spiritual necklace",
      "handcrafted heart chakra jhumkas",
      "necklace for inner peace and love",
    ],
    faqs: [
      {
        question: "What is heart chakra jewellery?",
        answer:
          "Heart chakra jewellery is designed to align with Anahata, the fourth chakra associated with love, compassion, and emotional balance. Aakaura's pieces use green tones, intentional craftsmanship, and symbolic design to support heart-centred living.",
      },
      {
        question: "Are Aakaura jhumkis suitable as spiritual gifts?",
        answer:
          "Yes. Heart chakra jhumkis and necklaces make thoughtful gifts for birthdays, milestones, or anyone beginning a meditation or healing practice. Each piece arrives as artisan-made conscious lifestyle jewellery.",
      },
      {
        question: "What materials are used in Aakaura spiritual jewellery?",
        answer:
          "Aakaura jewellery is handcrafted using premium materials including sterling silver and carefully selected stones and finishes. Specifications for each piece are listed on the product detail view.",
      },
    ],
    relatedLinks: [
      { label: "Chakra Wall Hangings", href: "/shop/category/wall-hanging" },
      { label: "Aura Colour Mufflers", href: "/shop/category/muffler" },
      { label: "Chakra Bonsai Plants", href: "/shop/category/bonsai" },
    ],
    linkTitle: "Shop heart chakra jhumkis, necklaces and spiritual jewellery",
  },
  anchor: {
    slug: "anchor",
    dbCategory: "Anchor",
    title: "Yoga Nidra Desk Anchors & Wind Chimes | Spiritual Office Decor | Aakaura",
    description:
      "Shop Yoga Nidra desk anchors, crown chakra decor, and sound healing wind chimes. Focus tools for work and meditation. Buy at Aakaura.",
    h1: "Yoga Nidra Desk Anchors & Sound Healing",
    intro:
      "Bring stillness to your desk with Aakaura's Yoga Nidra desk anchors, crown chakra desk decor and third eye focus anchors designed for mental clarity, stress relief, and spiritual focus at work. These are not ordinary office accessories: each anchor is a mindfulness tool rooted in Yoga Nidra practice, helping you pause, breathe, and reset between tasks. Our collection also includes Yoga Nidra wind chimes and spiritual bell windchimes, handmade sound healing chimes that cleanse home energy and support anxiety relief on balconies, patios, and meditation spaces. Whether you need desk decor for stress relief, a crown chakra anchor for deep meditation, or meditative bell chimes for calming sound therapy, Aakaura offers artisan-made spiritual focus tools for the modern workspace and sacred home corner.",
    keywords: [
      "Yoga Nidra desk anchor",
      "crown chakra desk decor",
      "third eye focus anchor",
      "spiritual office decor",
      "Yoga Nidra wind chimes",
      "sound healing chimes",
      "wind chimes for anxiety relief",
      "mental clarity workplace anchor",
    ],
    faqs: [
      {
        question: "What is a Yoga Nidra desk anchor?",
        answer:
          "A Yoga Nidra desk anchor is a small spiritual focus object placed on your workspace to remind you to pause, breathe, and reconnect. Aakaura anchors are designed for crown and third eye chakra awareness during work or study.",
      },
      {
        question: "How do wind chimes support meditation?",
        answer:
          "Gentle bell chimes create rhythmic, predictable sound that can support parasympathetic activation and slower breathing. Aakaura wind chimes are handcrafted for balconies, patios, and meditation rooms.",
      },
      {
        question: "Can desk anchors be used in an office?",
        answer:
          "Yes. Aakaura desk anchors are subtle, elegant pieces suited for home offices and workplace desks. They serve as spiritual office decor without requiring a dedicated meditation space.",
      },
    ],
    relatedLinks: [
      { label: "Chakra Wall Hangings", href: "/shop/category/wall-hanging" },
      { label: "Chakra Bonsai Plants", href: "/shop/category/bonsai" },
      { label: "Aura Colour Mufflers", href: "/shop/category/muffler" },
    ],
    linkTitle: "Shop Yoga Nidra desk anchors and sound healing wind chimes",
  },
  muffler: {
    slug: "muffler",
    dbCategory: "Muffler",
    title: "Aura Colour-Coded Mufflers | Himalayan Handmade Wool | Aakaura",
    description:
      "Shop aura colour-coded Himalayan handmade mufflers. Spiritual wool winter wear for conscious living. Buy online at Aakaura.",
    h1: "Aura Colour-Coded Mufflers",
    intro:
      "Wrap yourself in intentional warmth with Aakaura's aura colour-coded mufflers, Himalayan handmade wool mufflers where every hue carries energetic meaning. These spiritual wool mufflers are more than winter accessories: they are therapeutic colour-coded clothing designed for high-energy wearable winter fashion and conscious artisan winter living. Each muffler is handcrafted from premium Himalayan wool using traditional techniques, making them ideal spiritual gifts for winter or everyday companions for those who dress with awareness. Explore custom aura colour neck warmers aligned to your chakra journey, from root red to crown violet, and discover slow-made pieces that keep you warm while honouring the energy you carry.",
    keywords: [
      "aura color coded muffler",
      "Himalayan handmade muffler",
      "spiritual wool mufflers",
      "energy color winter wear",
      "handcrafted Himalayan wool mufflers online",
      "conscious artisan winter clothing",
      "therapeutic color coded clothing",
    ],
    faqs: [
      {
        question: "What are aura colour-coded mufflers?",
        answer:
          "Aura colour-coded mufflers are handcrafted wool mufflers where each colour corresponds to a chakra or energetic quality, such as root grounding red or heart-centred green. They combine warmth with intentional colour therapy.",
      },
      {
        question: "Are Aakaura mufflers made from Himalayan wool?",
        answer:
          "Yes. Aakaura mufflers are handmade using premium Himalayan wool blends, crafted for softness, breathability, and lasting warmth through Indian winter seasons.",
      },
      {
        question: "Can I choose a muffler by chakra colour?",
        answer:
          "Each muffler in our collection aligns with a specific chakra colour. Browse the full range to find the hue that matches your current energy focus or gift intention.",
      },
    ],
    relatedLinks: [
      { label: "Himalayan Neck Warmers", href: "/shop/category/neck-warmer" },
      { label: "Heart Chakra Jewellery", href: "/shop/category/jewellery" },
      { label: "Chakra Bonsai Plants", href: "/shop/category/bonsai" },
    ],
    linkTitle: "Shop aura colour-coded Himalayan handmade mufflers",
  },
  "neck-warmer": {
    slug: "neck-warmer",
    dbCategory: "Neck Warmer",
    title: "Himalayan Handmade Neck Warmers | Spiritual Winter Wear | Aakaura",
    description:
      "Shop Himalayan handmade neck warmers and aura colour spiritual winter wear. Conscious artisan gifts for cold seasons. Buy at Aakaura.",
    h1: "Himalayan Handmade Neck Warmers",
    intro:
      "Stay warm with purpose in Aakaura's Himalayan handmade neck warmers, conscious artisan winter clothing that blends comfort with energetic intention. Like our mufflers, these spiritual wool pieces use aura colour coding so your winter wardrobe supports the energy you want to embody. Perfect as warm spiritual gifts for winter, each neck warmer is slow-made by Indian craftspeople using premium yarns and traditional weaving. Whether you style them as a snug neck warmer, light stole, or layered wrap, these pieces offer high-energy wearable winter fashion for meditation lovers, travellers, and anyone who values handmade energy products for inner peace during colder months.",
    keywords: [
      "Himalayan handmade neck warmer",
      "spiritual wool mufflers",
      "energy color winter wear",
      "handcrafted Himalayan wool mufflers online",
      "custom aura color neck warmers",
      "conscious artisan winter clothing",
      "warm spiritual gifts for winter",
    ],
    faqs: [
      {
        question: "What is the difference between a muffler and neck warmer?",
        answer:
          "Neck warmers are compact, snug pieces designed primarily for neck coverage, while mufflers are longer wraps that can be styled multiple ways. Both share Aakaura's aura colour-coded, handcrafted approach.",
      },
      {
        question: "Are neck warmers suitable as gifts?",
        answer:
          "Yes. Aakaura neck warmers make thoughtful warm spiritual gifts for winter, ideal for wellness enthusiasts, meditation practitioners, and anyone who appreciates ethical handmade artisan gifts.",
      },
      {
        question: "How should I care for my Himalayan wool neck warmer?",
        answer:
          "Hand wash or dry clean gently to preserve the wool's softness and colour. Store folded in a dry place between seasons. Care details are included with each product.",
      },
    ],
    relatedLinks: [
      { label: "Aura Colour Mufflers", href: "/shop/category/muffler" },
      { label: "Heart Chakra Jewellery", href: "/shop/category/jewellery" },
      { label: "Chakra Wall Hangings", href: "/shop/category/wall-hanging" },
    ],
    linkTitle: "Shop Himalayan handmade neck warmers and spiritual winter wear",
  },
  bonsai: {
    slug: "bonsai",
    dbCategory: "Bonsai",
    title:
      "Living Chakra Bonsai | Real Adenium with Crochet & Handmade Decor | Aakaura",
    description:
      "Real living Adenium chakra bonsai with handcrafted crochet yarn spirals and faux decorative orbs. Low-maintenance spiritual desk decor. Buy at Aakaura.",
    h1: "Chakra Personality Bonsai Plants",
    intro:
      "Bring living energy to your desk with Aakaura's Aarohma Ekam chakra bonsai — real living Adenium (Desert Rose) plants, each hand-finished with crochet-wrapped yarn spirals, suspended orbs, and faux decorative accents aligned to a chakra-specific personality. The plant is alive; the crochet, yarn, and faux elements are artistic adornments on the living tree, not a substitute for it. These resilient, low-maintenance bonsai need bright indirect light and occasional watering, yet carry deep symbolic meaning for offices, meditation corners, and gifting. Explore living chakra bonsai aligned to root grounding, heart opening, third eye insight, and more. Each piece arrives in a handcrafted terracotta pot, pranic-cleansed and finished by hand — a real plant with handmade decor for those who want beauty, intention, and natural growth in one object.",
    keywords: [
      "living chakra bonsai",
      "Adenium desert rose bonsai",
      "crochet yarn bonsai decor",
      "handmade chakra bonsai",
      "real bonsai with crochet detailing",
      "low maintenance living bonsai",
      "chakra alignment tree for office",
    ],
    faqs: [
      {
        question: "Are Aakaura bonsai plants real or artificial?",
        answer:
          "Yes — every Aarohma Ekam bonsai starts with a real living Adenium (Desert Rose) plant. On top of that, our artisans add handcrafted crochet yarn spirals, suspended orbs, and faux decorative accents as chakra-aligned adornments. The plant is real; the crochet and faux elements are decorative, not a substitute for a living tree.",
      },
      {
        question: "What handmade work goes into each bonsai?",
        answer:
          "Each bonsai is hand-finished with aura-toned crochet/yarn spirals wrapped around the live trunk, plus suspended yarn orbs and faux decorative accents chosen for the chakra it represents. Every piece is pranic-cleansed and finished in a handcrafted terracotta pot.",
      },
      {
        question: "How do I care for an Aakaura living bonsai?",
        answer:
          "Place your Adenium bonsai in bright, indirect sunlight and water sparingly, allowing the soil to dry between watering. Avoid overwatering and prolonged damp conditions, and protect the plant from extreme cold.",
      },
      {
        question: "How do chakra personality bonsai work?",
        answer:
          "Each bonsai aligns with a specific chakra and personality archetype, such as root stability or heart compassion, so you can choose a tree that reflects the energy you want to cultivate in your space.",
      },
      {
        question: "Are bonsai plants good for office desks?",
        answer:
          "Yes. Aakaura living bonsai plants are ideal desk decor — compact, resilient, and symbolically rich. They make excellent chakra alignment gifts for colleagues and loved ones.",
      },
    ],
    relatedLinks: [
      { label: "Yoga Nidra Desk Anchors", href: "/shop/category/anchor" },
      { label: "Chakra Wall Hangings", href: "/shop/category/wall-hanging" },
      { label: "Aura Colour Mufflers", href: "/shop/category/muffler" },
    ],
    linkTitle: "Shop real living chakra bonsai with crochet and handmade decor",
  },
};

export function getCategorySEO(slug: string): CategorySEOEntry | undefined {
  return categorySEO[slug as CategorySlug];
}

export function getCategoryLinkTitle(slug: string): string | undefined {
  return getCategorySEO(slug)?.linkTitle;
}

export const footerCategoryLinks = CATEGORY_SLUGS.map((slug) => {
  const entry = categorySEO[slug];
  return {
    label: entry.h1,
    href: `/shop/category/${slug}`,
    title: entry.linkTitle,
  };
});

export function slugToDbCategory(slug: string): string {
  const entry = getCategorySEO(slug);
  if (entry) return entry.dbCategory;
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

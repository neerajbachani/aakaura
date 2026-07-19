export type HeroPath = "guidance" | "journey" | "bouquet";

export const HERO_PATHS: {
  id: HeroPath;
  label: string;
  shortLabel: string;
  panelId: string;
}[] = [
  {
    id: "guidance",
    label: "Guidance Call",
    shortLabel: "Guidance",
    panelId: "hero-panel-guidance",
  },
  {
    id: "journey",
    label: "Choose Your Journey",
    shortLabel: "Journey",
    panelId: "hero-panel-journey",
  },
  {
    id: "bouquet",
    label: "Digital Chakra Bouquet",
    shortLabel: "Bouquet",
    panelId: "hero-panel-bouquet",
  },
];

export const DEFAULT_HERO_PATH: HeroPath = "journey";

export const HERO_GUIDANCE = {
  eyebrow: "Guidance Call",
  headline: "Book Your Demo Guidance Call",
  description:
    "A 20-minute session with an Aakaura practitioner to understand your chakras, sacred symbols, and the right next steps for your ritual journey.",
  ctaLabel: "Book Now",
  ctaHref: "/book-guidance",
  secondaryLabel: "View ritual support packages",
  secondaryHref: "/ritual-packages",
} as const;

export const HERO_BOUQUET = {
  eyebrow: "Digital Chakra Bouquet",
  headline: "Aakaura Bouquet",
  subline: "Gift digital serenity and beauty",
  description:
    "Choose a chakra bloom, write a card, send energy to someone you care about.",
  ctaLabel: "Create a Bouquet",
  ctaHref: "/bouquet",
  previewBlooms: [
    {
      id: "crown",
      name: "Crown",
      src: "/bouquet/crown-main.webp",
      alt: "Crown Chakra bloom",
      color: "#9333ea",
      row: "center",
    },
    {
      id: "third-eye",
      name: "Third Eye",
      src: "/bouquet/thirdeye1.webp",
      alt: "Third Eye Chakra bloom",
      color: "#3b82f6",
      row: "upper",
    },
    {
      id: "throat",
      name: "Throat",
      src: "/bouquet/throat-main.webp",
      alt: "Throat Chakra bloom",
      color: "#06b6d4",
      row: "upper",
    },
    {
      id: "heart",
      name: "Heart",
      src: "/bouquet/heart-main.webp",
      alt: "Heart Chakra bloom",
      color: "#22c55e",
      row: "middle",
    },
    {
      id: "solar",
      name: "Solar",
      src: "/bouquet/solar-main.webp",
      alt: "Solar Plexus Chakra bloom",
      color: "#eab308",
      row: "middle",
    },
    {
      id: "sacral",
      name: "Sacral",
      src: "/bouquet/sacral-main.webp",
      alt: "Sacral Chakra bloom",
      color: "#f97316",
      row: "lower",
    },
    {
      id: "root",
      name: "Root",
      src: "/bouquet/root-main.webp",
      alt: "Root Chakra bloom",
      color: "#ef4444",
      row: "lower",
    },
  ],
} as const;

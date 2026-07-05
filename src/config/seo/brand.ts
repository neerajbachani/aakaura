export const brandKeywords = [
  "Aakaura wellness products",
  "Aakaura spiritual store",
  "Aakaura sacred geometry decor",
  "Aakaura handmade wellness",
  "Aakaura energetic lifestyle",
] as const;

export const chakraKeywords = [
  "chakra alignment tools",
  "root chakra healing products",
  "heart chakra meditation decor",
  "third eye awareness items",
  "sacred geometry energy decor",
  "spiritual awakening tools",
] as const;

export const artisanKeywords = [
  "handcrafted Indian spiritual decor",
  "artisanal wellness products India",
  "conscious living home decor",
  "slow made spiritual items",
  "ethical handmade artisan gifts",
  "traditional Indian craftsmanship modern forms",
] as const;

export const intentKeywords = [
  "buy energy healing products online",
  "how to balance home energy with sacred geometry",
  "premium spiritual gifts for meditation lovers",
  "handmade energy products for inner peace",
] as const;

export const siteKeywords = [
  ...brandKeywords,
  ...chakraKeywords,
  ...artisanKeywords,
  "Aakaura",
  "spirituality",
  "chakra balancing",
  "meditation",
  "energy healing",
  "handcrafted decor",
  "wellness products India",
].join(", ");

export const organizationSchema = {
  name: "Aakaura",
  url: "https://aakaura.in",
  logo: "https://aakaura.in/splashLogo.png",
  description:
    "Aakaura is a peaceful space for spirituality, self-healing, and energy awareness through handcrafted wellness products and chakra-inspired decor.",
  telephone: "+91-8619029656",
  address: {
    addressLocality: "Jaipur",
    addressRegion: "Rajasthan",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.instagram.com/aakaura.in",
    "https://www.youtube.com/@TheAakauraStudio",
    "https://x.com/_Aakaura_",
    "https://linktr.ee/aakaura0508",
  ],
};

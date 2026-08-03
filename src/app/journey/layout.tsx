import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Chakra Journeys | 7 Chakra Alignment Paths | Aakaura",
  description:
    "Explore all seven Aakaura chakra journeys, from root grounding to crown expansion. Discover handcrafted products for each energy centre.",
  pathname: "/journey",
});

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Aakaura Ritual Interaction Terms & Awareness Guide",
  description:
    "Read and agree to the Aakaura ritual interaction terms before proceeding. Awareness-first guidance, not medical or therapeutic treatment.",
  url: "https://aakaura.in/rituals/awareness-guide",
});

export default function RitualAwarenessGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

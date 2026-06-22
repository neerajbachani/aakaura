import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Aakaura Ritual Interaction Terms & Awareness Guide",
  description:
    "Read and agree to the Aakaura ritual interaction terms before proceeding. Awareness-first guidance — not medical or therapeutic treatment — plus downloadable ritual PDFs by product category.",
  url: "https://aakaura.in/rituals",
});

export default function RitualsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Aakaura Ritual Disclaimers & Notes",
  description:
    "Honest expectations, foundational awareness, and product interaction guides for Aakaura rituals. Explore chakra philosophy, vibrational consistency, and downloadable ritual PDFs by category.",
  url: "https://aakaura.in/rituals",
});

export default function RitualsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Aakaura Ritual Guides",
  description:
    "Download ritual interaction PDFs by product category in Hindi or English. Chakra wall hangings, combos, and more — step-by-step guides for your Aakaura products.",
  url: "https://aakaura.in/rituals",
});

export default function RitualsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

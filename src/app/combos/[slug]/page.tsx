import { notFound } from "next/navigation";
import ChakraJourneyTemplate from "@/components/journey/ChakraJourneyTemplate";
import { getComboById } from "@/lib/api";
import { ChakraData, JourneyProduct } from "@/data/chakras";
import { chakrasData } from "@/data/chakras";
import { Combo } from "@/types/Combo";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

// Helper to adapt Combo to ChakraData
function adaptComboToChakra(combo: Combo): ChakraData {
  // Use the primary chakra's theme (colors, etc.) or default to Root if not found
  const primaryChakraSlug = combo.chakras[0] || "grounding";
  const baseChakra = chakrasData[primaryChakraSlug] || chakrasData["grounding"];

  // Map ComboProducts to JourneyProducts
  const journeyProducts: JourneyProduct[] = combo.products.map((cp, index) => {
    const p = cp.product;
    // Construct base JourneyProduct from DB Product
    return {
      id: p.id,
      name: p.name,
      sanskritName: "", // DB doesn't have this, maybe added in static merge
      description: p.description,
      specificDescription: p.description, // Fallback
      price: `₹${p.price}`,
      ethos: "", // DB missing
      whatItsFor: "", // DB missing
      features: [], // DB missing
      images: p.images || [],
      step: index + 1, // Use order in combo
      category: p.category?.name || "Product",
      // Add other required fields with defaults
      variants: p.variations?.map((v) => ({
        color: "#000",
        name: v.name,
        image: p.images[0] || "",
      })),
    };
  });

  return {
    ...baseChakra, // Inherit mantra, colors, symbol from the chakra
    slug: combo.slug,
    name: combo.name,
    tagline: combo.tagline,
    description: combo.description,
    content: {
      "soul-luxury": journeyProducts,
      "energy-curious": journeyProducts, // Same content for both types in combos for now
    },
  };
}

export default async function ComboJourneyPage({ params }: PageProps) {
  const { slug } = await params;
  const combo = await getComboById(slug);

  if (!combo) {
    notFound();
  }

  const adaptedData = adaptComboToChakra(combo);

  return (
    <ChakraJourneyTemplate
      chakra={adaptedData}
      relatedCombos={null} // Don't show related combos endlessly
    />
  );
}

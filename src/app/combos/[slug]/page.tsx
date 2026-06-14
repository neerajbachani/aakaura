import { notFound } from "next/navigation";
import ChakraJourneyTemplate from "@/components/journey/ChakraJourneyTemplate";
import { getComboById } from "@/lib/api";
import { ChakraData, JourneyProduct } from "@/data/chakras";
import { chakrasData } from "@/data/chakras";
import { Combo } from "@/types/Combo";
import { comboTierToCategoryLabel } from "@/config/comboCategories";
import {
  formatComboPrice,
  resolveComboPricing,
} from "@/lib/comboPricing";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = "force-dynamic";

function adaptComboToChakra(combo: Combo): ChakraData {
  const primaryChakraSlug = combo.chakras[0] || "grounding";
  const baseChakra = chakrasData[primaryChakraSlug] || chakrasData["grounding"];
  const totals = resolveComboPricing(combo);

  const bundleProduct: JourneyProduct = {
    id: combo.slug,
    comboDbId: combo.id,
    name: combo.name,
    sanskritName: "",
    description: combo.description,
    specificDescription: combo.description,
    price: formatComboPrice(totals.original),
    offerPrice:
      totals.effective < totals.original
        ? formatComboPrice(totals.effective)
        : undefined,
    ethos: combo.tagline,
    whatItsFor: `A curated ${combo.tier.toLowerCase()} collection.`,
    features: combo.products.map(
      (cp) => `${cp.quantity}x ${cp.product.name}`,
    ),
    images: combo.images || [],
    mobileImages: combo.mobileImages || [],
    step: 1,
    category: comboTierToCategoryLabel(combo.tier),
    variants: [],
    includedProducts: combo.products.map((cp, index) => ({
      name: cp.product.name,
      image: cp.product.images?.[0] || "",
      url: `/shop/product/${cp.product.id}`,
      step: index + 1,
      description: cp.detail || cp.product.description,
    })),
  };

  return {
    ...baseChakra,
    slug: combo.slug,
    name: combo.name,
    tagline: combo.tagline,
    description: combo.description,
    content: {
      "soul-luxury": [bundleProduct],
      "energy-curious": [bundleProduct],
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
      relatedCombos={null}
    />
  );
}

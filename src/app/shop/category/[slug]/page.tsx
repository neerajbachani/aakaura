import React from "react";
import CategoryJourneyTemplate from "@/components/journey/CategoryJourneyTemplate";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JourneyProduct, ChakraData } from "@/data/chakras";

// Map slug to display category name
const formatCategoryName = (slug: string) => {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

async function getProductsByCategoryFromDB(category: string) {
  const journeys = await prisma.journey.findMany();
  const allProducts: { product: JourneyProduct; chakra: ChakraData }[] = [];

  journeys.forEach((journey) => {
    // Cast content to any to access dynamic fields since Prisma JSON is JsonValue
    const content = journey.content as any;

    // Construct ChakraData object structure needed by the component
    // Note: We might need to map DB fields to ChakraData interface more strictly if they differ
    // For now assuming DB structure mirrors ChakraData
    const chakraData: ChakraData = {
      slug: journey.slug,
      name: journey.name,
      tagline: journey.tagline,
      sanskritName: journey.sanskritName,
      tone: journey.tone,
      colors: journey.colors as any,
      content: content,
      // Add other required fields if JourneyProductPanel needs them
      // missing: element, mantra, symbol, description, crystals, benefits.
      // But JourneyProductPanel mostly uses slug, name, tone, colors.
    } as any;

    (["soul-luxury", "energy-curious"] as const).forEach((clientType) => {
      const products = content[clientType] || [];
      products.forEach((p: any) => {
        // Case-insensitive match for category
        if (p.category && p.category.toLowerCase() === category.toLowerCase()) {
          // Avoid duplicates based on ID
          if (!allProducts.some((item) => item.product.id === p.id)) {
            allProducts.push({ product: p, chakra: chakraData });
          }
        }
      });
    });
  });

  return allProducts;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams?.slug;

  if (!categorySlug) return notFound();

  const categoryName = formatCategoryName(categorySlug);

  // Determine DB category string
  let dbCategory = "";
  if (categorySlug === "muffler") dbCategory = "Muffler";
  else if (categorySlug === "wall-hanging") dbCategory = "Wall Hanging";
  else {
    dbCategory = categoryName;
  }

  const products = await getProductsByCategoryFromDB(dbCategory);

  if (!products || products.length === 0) {
    console.log(
      `No products found in DB for category: ${dbCategory} (slug: ${categorySlug})`,
    );
    // Optional: return notFound() or render empty
  }

  return <CategoryJourneyTemplate categoryName={dbCategory} items={products} />;
}

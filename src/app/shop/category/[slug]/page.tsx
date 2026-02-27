import React from "react";
import CategoryJourneyTemplate from "@/components/journey/CategoryJourneyTemplate";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JourneyProduct, ChakraData } from "@/data/chakras";
import { getCategoriesWithImages } from "@/actions/get-categories-with-images";
import CategoryCard from "@/components/ui/CategoryCard";

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

  const categories = await getCategoriesWithImages();

  const categoriesSection = (
    <section className="py-16 md:py-24 bg-[#f4f1ea]/5 border-t border-[#f4f1ea]/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-[#f4f1ea] mb-2 font-serif">
              Explore All Categories
            </h2>
            <p className="text-[#f4f1ea]/60 md:max-w-xl">
              Discover consciously crafted collections based on your energy
              needs.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              id={category.id}
              name={category.name}
              images={category.images}
              href={`/shop/category/${category.name.toLowerCase().replace(/\s+/g, "-")}`}
            />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <CategoryJourneyTemplate
      categoryName={dbCategory}
      items={products}
      relatedCategories={categoriesSection}
    />
  );
}

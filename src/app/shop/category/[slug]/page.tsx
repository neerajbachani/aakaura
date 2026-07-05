import React from "react";
import CategoryJourneyTemplate from "@/components/journey/CategoryJourneyTemplate";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { JourneyProduct, ChakraData } from "@/data/chakras";
import { getCategoriesWithImages } from "@/actions/get-categories-with-images";
import CategoryCard from "@/components/ui/CategoryCard";
import {
  CATEGORY_SLUGS,
  getCategorySEO,
  slugToDbCategory,
} from "@/config/seo/categories";
import { generateCategorySEO, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import {
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFAQSchema,
} from "@/lib/seo-schema";
import type { Metadata } from "next";

async function getProductsByCategoryFromDB(category: string) {
  const journeys = await prisma.journey.findMany();
  const allProducts: { product: JourneyProduct; chakra: ChakraData }[] = [];

  journeys.forEach((journey) => {
    const content = journey.content as Record<string, JourneyProduct[]>;

    const chakraData: ChakraData = {
      slug: journey.slug,
      name: journey.name,
      tagline: journey.tagline,
      sanskritName: journey.sanskritName,
      tone: journey.tone,
      colors: journey.colors as ChakraData["colors"],
      content: content,
      productSettings: journey.productSettings as ChakraData["productSettings"],
    } as ChakraData;

    (["soul-luxury", "energy-curious"] as const).forEach((clientType) => {
      const products = content[clientType] || [];
      products.forEach((p) => {
        if (p.category && p.category.toLowerCase() === category.toLowerCase()) {
          if (!allProducts.some((item) => item.product.id === p.id)) {
            allProducts.push({ product: p, chakra: chakraData });
          }
        }
      });
    });
  });

  return allProducts;
}

export async function generateStaticParams() {
  return CATEGORY_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return generateCategorySEO(slug);
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = resolvedParams?.slug;

  if (!categorySlug) return notFound();

  const seo = getCategorySEO(categorySlug);
  const dbCategory = seo?.dbCategory ?? slugToDbCategory(categorySlug);
  const products = await getProductsByCategoryFromDB(dbCategory);

  if (!products || products.length === 0) {
    console.log(
      `No products found in DB for category: ${dbCategory} (slug: ${categorySlug})`,
    );
  }

  const categories = await getCategoriesWithImages();
  const categoryUrl = `${SITE_URL}/shop/category/${categorySlug}`;
  const pageName = seo?.h1 ?? dbCategory;

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
    <>
      {seo && (
        <JsonLd
          data={[
            buildBreadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: pageName, url: categoryUrl },
            ]),
            buildCollectionPageSchema({
              name: seo.h1,
              description: seo.description,
              url: categoryUrl,
              products: products.map(({ product }) => ({
                name: product.name,
              })),
            }),
            buildFAQSchema(seo.faqs),
          ]}
        />
      )}
      <CategoryJourneyTemplate
        categoryName={dbCategory}
        items={products}
        relatedCategories={categoriesSection}
        seo={
          seo
            ? {
                h1: seo.h1,
                intro: seo.intro,
                faqs: seo.faqs,
                relatedLinks: seo.relatedLinks,
              }
            : undefined
        }
      />
    </>
  );
}

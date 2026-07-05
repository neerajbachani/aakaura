import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { CATEGORY_SLUGS } from "@/config/seo/categories";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blogs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/rituals`, changeFrequency: "monthly", priority: 0.7 },
    {
      url: `${SITE_URL}/rituals/awareness-guide`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    { url: `${SITE_URL}/vision`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/journey`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/combos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/products`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/quiz`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/shop/category/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  let journeyPages: MetadataRoute.Sitemap = [];
  let comboPages: MetadataRoute.Sitemap = [];
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const [journeys, combos, blogs] = await Promise.all([
      prisma.journey.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.combo.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.blog.findMany({ select: { id: true, createdAt: true } }),
    ]);

    journeyPages = journeys.map((journey) => ({
      url: `${SITE_URL}/journey/${journey.slug}`,
      lastModified: journey.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    comboPages = combos.map((combo) => ({
      url: `${SITE_URL}/combos/${combo.slug}`,
      lastModified: combo.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    blogPages = blogs.map((blog) => ({
      url: `${SITE_URL}/blogs/${blog.id}`,
      lastModified: blog.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Sitemap: failed to fetch dynamic routes", error);
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...journeyPages,
    ...comboPages,
    ...blogPages,
  ];
}

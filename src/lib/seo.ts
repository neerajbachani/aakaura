import { Metadata } from "next";
import { getCategorySEO } from "@/config/seo/categories";
import { siteKeywords } from "@/config/seo/brand";

export const SITE_URL = "https://aakaura.in";

export const defaultSEO = {
  title: "Aakaura - Elevate Your Spiritual Journey & Inner Peace",
  description:
    "Aakaura is a peaceful space for spirituality, self-healing, and energy awareness. Shop handcrafted Indian spiritual decor, chakra wellness products, and conscious artisan gifts online.",
  keywords: siteKeywords,
  image: "/splashLogo.png",
  url: SITE_URL,
};

export interface SEOOptions {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  keywords?: string;
  pathname?: string;
  noIndex?: boolean;
  type?: "website" | "article";
}

export function generateSEO({
  title = defaultSEO.title,
  description = defaultSEO.description,
  image = defaultSEO.image,
  url = defaultSEO.url,
  keywords = defaultSEO.keywords,
  pathname,
  noIndex = false,
  type = "website",
}: SEOOptions = {}): Metadata {
  const canonicalUrl = pathname ? `${SITE_URL}${pathname}` : url;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "Aakaura",
      locale: "en_IN",
      images: [
        {
          url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.startsWith("http") ? image : `${SITE_URL}${image}`],
    },
  };
}

export function generateCategorySEO(slug: string): Metadata {
  const category = getCategorySEO(slug);

  if (!category) {
    return generateSEO({
      title: "Shop Category | Aakaura",
      description:
        "Explore handcrafted spiritual wellness products by category at Aakaura.",
      pathname: `/shop/category/${slug}`,
    });
  }

  return generateSEO({
    title: category.title,
    description: category.description,
    keywords: category.keywords.join(", "),
    pathname: `/shop/category/${slug}`,
  });
}

export function truncateDescription(text: string, maxLength = 155): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength - 3).trim()}...`;
}

export function excerptFromMarkdown(content: string, maxLength = 155): string {
  const plain = content
    .replace(/[#*_`>\[\]()!-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return truncateDescription(plain, maxLength);
}

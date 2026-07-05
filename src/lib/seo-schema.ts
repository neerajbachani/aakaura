import { organizationSchema } from "@/config/seo/brand";
import { SITE_URL } from "@/lib/seo";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: organizationSchema.name,
    url: organizationSchema.url,
    logo: organizationSchema.logo,
    description: organizationSchema.description,
    telephone: organizationSchema.telephone,
    address: {
      "@type": "PostalAddress",
      addressLocality: organizationSchema.address.addressLocality,
      addressRegion: organizationSchema.address.addressRegion,
      addressCountry: organizationSchema.address.addressCountry,
    },
    sameAs: organizationSchema.sameAs,
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Aakaura",
    url: SITE_URL,
    description: organizationSchema.description,
    publisher: {
      "@type": "Organization",
      name: "Aakaura",
      logo: organizationSchema.logo,
    },
  };
}

export function buildBreadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildCollectionPageSchema({
  name,
  description,
  url,
  products,
}: {
  name: string;
  description: string;
  url: string;
  products: { name: string; url?: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: product.url,
      })),
    },
  };
}

export function buildFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function buildBlogPostingSchema({
  title,
  description,
  url,
  image,
  datePublished,
}: {
  title: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    image,
    datePublished,
    author: {
      "@type": "Organization",
      name: "Aakaura",
    },
    publisher: {
      "@type": "Organization",
      name: "Aakaura",
      logo: {
        "@type": "ImageObject",
        url: organizationSchema.logo,
      },
    },
  };
}

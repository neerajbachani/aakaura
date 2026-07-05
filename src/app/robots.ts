import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/shop/",
          "/journey/",
          "/combos/",
          "/blogs/",
          "/about",
          "/rituals",
          "/vision",
          "/products",
          "/quiz",
          "/policies/",
        ],
        disallow: [
          "/admin",
          "/api/",
          "/cart",
          "/checkout",
          "/profile",
          "/orders",
          "/auth",
          "/demo",
          "/bouquet",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

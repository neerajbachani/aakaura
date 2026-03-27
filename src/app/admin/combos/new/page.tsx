import React from "react";
import { prisma } from "@/lib/prisma";
import NewComboClient from "./NewComboClient";

export const dynamic = "force-dynamic";

export default async function NewComboPage() {
  const db = prisma as any;
  // Fetch all products directly via Prisma - avoids HTTP self-fetch that fails on Vercel SSR
  const products = await db.product.findMany({
    include: { category: true, variations: true },
    orderBy: { name: "asc" },
    take: 1000,
  });

  const journeys = await db.journey.findMany({
    select: { content: true },
  });

  const imageToMobileMap: Record<string, string> = {};
  journeys.forEach((j: any) => {
    if (!j.content) return;
    const sl = j.content["soul-luxury"] || [];
    const ec = j.content["energy-curious"] || [];
    const allJourneyProducts = [...sl, ...ec];

    allJourneyProducts.forEach((p: any) => {
      if (
        p.images &&
        Array.isArray(p.images) &&
        p.mobileImages &&
        Array.isArray(p.mobileImages)
      ) {
        p.images.forEach((img: string, idx: number) => {
          if (p.mobileImages[idx] && typeof img === "string") {
            imageToMobileMap[img] = p.mobileImages[idx];
          }
        });
      }
    });
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <NewComboClient
        allProducts={products || []}
        imageMap={imageToMobileMap}
      />
    </div>
  );
}

import React from "react";
import { prisma } from "@/lib/prisma";
import EditComboClient from "./EditComboClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditComboPage({ params }: Props) {
  const { id } = await params;
  const db = prisma as any;

  const [products, combo, journeys] = await Promise.all([
    // Fetch all products directly via Prisma
    db.product.findMany({
      include: { category: true, variations: true },
      orderBy: { name: "asc" },
      take: 1000,
    }),
    // Fetch combo directly via Prisma
    db.combo.findUnique({
      where: { id },
      include: {
        products: {
          include: { product: true, variation: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    // Fetch all journeys to map desktop to mobile URLs
    db.journey.findMany({
      select: { content: true },
    }),
  ]);

  if (!combo) {
    notFound();
  }

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
      <EditComboClient
        allProducts={products || []}
        combo={combo}
        imageMap={imageToMobileMap}
      />
    </div>
  );
}

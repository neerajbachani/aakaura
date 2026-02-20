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

  const [products, combo] = await Promise.all([
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
  ]);

  if (!combo) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <EditComboClient allProducts={products || []} combo={combo} />
    </div>
  );
}

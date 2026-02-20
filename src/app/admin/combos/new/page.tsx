import React from "react";
import { prisma } from "@/lib/prisma";
import NewComboClient from "./NewComboClient";

export const dynamic = "force-dynamic";

export default async function NewComboPage() {
  const db = prisma as any;
  // Fetch all products directly via Prisma — avoids HTTP self-fetch that fails on Vercel SSR
  const products = await db.product.findMany({
    include: { category: true, variations: true },
    orderBy: { name: "asc" },
    take: 1000,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <NewComboClient allProducts={products || []} />
    </div>
  );
}

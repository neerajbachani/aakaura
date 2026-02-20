import React from "react";
import { getAllProducts, getComboById } from "@/lib/api";
import EditComboClient from "./EditComboClient";
// Actually admin pages are usually protected by layout or middleware.
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditComboPage({ params }: Props) {
  const { id } = await params;
  const [products, combo] = await Promise.all([
    getAllProducts(1000), // Fetch all products for dropdown
    getComboById(id),
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

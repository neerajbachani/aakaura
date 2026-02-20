import React from "react";
import { getAllProducts } from "@/lib/api";
import NewComboClient from "./NewComboClient";

export const dynamic = "force-dynamic";

export default async function NewComboPage() {
  const products = await getAllProducts(1000); // Fetch on server with high limit to get all

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <NewComboClient allProducts={products || []} />
    </div>
  );
}

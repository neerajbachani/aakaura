"use client";

import { useQuery } from "@tanstack/react-query";
import { useUpdateJourneyProduct } from "@/hooks/admin/useAdminJourney";
import ProductForm from "@/components/admin/ProductForm";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

// Fetch single journey
async function fetchJourney(slug: string) {
  const response = await fetch(`/api/admin/journeys/${slug}`, {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch journey");
  return response.json();
}

async function fetchAllJourneys() {
  const response = await fetch("/api/admin/journeys", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch journeys");
  return response.json();
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams() as {
    slug: string;
    clientType: string;
    productId: string;
  };
  const { slug, clientType, productId } = params;
  const decodedProductId = decodeURIComponent(productId);

  const validClientType =
    clientType === "soul-luxury" ? "soul-luxury" : "energy-curious";

  // Fetch current journey details
  const {
    data: journey,
    isLoading: isJourneyLoading,
    error: journeyError,
  } = useQuery({
    queryKey: ["admin", "journey", slug],
    queryFn: () => fetchJourney(slug),
  });

  // Fetch all journeys to extract global categories
  const { data: allJourneysData } = useQuery({
    queryKey: ["admin", "journeys", "all"],
    queryFn: fetchAllJourneys,
  });

  const updateProduct = useUpdateJourneyProduct();

  const handleSubmit = async (formData: any) => {
    try {
      await updateProduct.mutateAsync({
        slug,
        clientType: validClientType,
        productId: decodedProductId,
        product: formData,
      });
      toast.success("Product updated successfully");
      router.push("/admin/products-settings");
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    }
  };

  if (isJourneyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (journeyError) {
    return (
      <div className="p-8 text-center text-red-600">
        Error loading journey: {(journeyError as Error).message}
      </div>
    );
  }

  // Find the product in the journey data
  const products = journey?.content?.[validClientType] || [];
  const product = products.find((p: any) => p.id === decodedProductId);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-gray-800">
          Product Not Found
        </h2>
        <p className="text-gray-600 mt-2">
          The product ID "{decodedProductId}" could not be found in this
          journey.
        </p>
        <button
          onClick={() => router.push("/admin/products-settings")}
          className="mt-4 text-indigo-600 hover:text-indigo-800 underline"
        >
          Return to Settings
        </button>
      </div>
    );
  }

  // Extract all unique categories
  const allJourneys = allJourneysData?.journeys || [];
  const allCategories = Array.from(
    new Set(
      allJourneys
        .flatMap((j: any) => [
          ...(j.content?.["soul-luxury"] || []),
          ...(j.content?.["energy-curious"] || []),
        ])
        .map((p: any) => p.category)
        .filter(Boolean),
    ),
  ).sort() as string[];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ProductForm
        mode="edit"
        journey={journey}
        clientType={validClientType}
        initialData={product}
        onSubmit={handleSubmit}
        isSubmitting={updateProduct.isPending}
        existingCategories={allCategories}
      />
    </div>
  );
}

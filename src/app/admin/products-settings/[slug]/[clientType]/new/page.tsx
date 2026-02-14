"use client";

import { useQuery } from "@tanstack/react-query";
import { useAddJourneyProduct } from "@/hooks/admin/useAdminJourney";
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

// Helper to extract categories from a journey list or single journey
// Since we only fetch one journey here, we might want to fetch ALL to get all categories
// For now, we'll just fetch all journeys to get the full category list for suggestions
async function fetchAllJourneys() {
  const response = await fetch("/api/admin/journeys", {
    credentials: "include",
  });
  if (!response.ok) throw new Error("Failed to fetch journeys");
  return response.json();
}

export default function AddProductPage() {
  const router = useRouter();
  const params = useParams() as { slug: string; clientType: string };
  const { slug, clientType } = params;

  // Validate clientType
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

  const addProduct = useAddJourneyProduct();

  const handleSubmit = async (formData: any) => {
    try {
      await addProduct.mutateAsync({
        slug,
        clientType: validClientType,
        product: formData,
      });
      toast.success("Product added successfully");
      router.push("/admin/products-settings");
    } catch (error: any) {
      toast.error(error.message || "Failed to add product");
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
        mode="add"
        journey={journey}
        clientType={validClientType}
        onSubmit={handleSubmit}
        isSubmitting={addProduct.isPending}
        existingCategories={allCategories}
      />
    </div>
  );
}

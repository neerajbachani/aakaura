"use client";

import React, { useState } from "react";
import ComboForm from "@/components/admin/ComboForm";
import { Product } from "@/types/Product";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function NewComboClient({
  allProducts,
}: {
  allProducts: Product[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/combos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to create combo");
      }

      toast.success("Combo created successfully!");
      router.push("/admin/combos");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ComboForm
      mode="add"
      allProducts={allProducts}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}

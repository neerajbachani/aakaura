"use client";

import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface DeleteComboButtonProps {
  comboId: string;
}

export default function DeleteComboButton({ comboId }: DeleteComboButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this combo?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/combos/${comboId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || "Failed to delete combo");
      }

      toast.success("Combo deleted successfully");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete combo");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={`p-2 text-primaryBrown/70 hover:text-primaryRed hover:bg-primaryRed/10 rounded-lg transition-colors ${
        isDeleting ? "opacity-50 cursor-not-allowed" : ""
      }`}
      title="Delete Combo"
    >
      <FaTrash className="text-base sm:text-lg" />
    </button>
  );
}

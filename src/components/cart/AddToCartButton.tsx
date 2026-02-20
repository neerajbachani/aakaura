"use client";

import { useState } from "react";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useAddToCart } from "@/hooks/useCart";
import { motion } from "framer-motion";

interface AddToCartButtonProps {
  productId: string;
  variationId?: string;
  quantity?: number;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export function AddToCartButton({
  productId,
  variationId,
  quantity = 1,
  disabled = false,
  className = "",
  children,
  variant = "primary",
  size = "md",
}: AddToCartButtonProps) {
  const addToCart = useAddToCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        productId,
        variationId,
        quantity,
      });

      // Show success state briefly
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    } catch {
      // Error is handled by the mutation
    }
  };

  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary:
      "bg-[#27190b] text-[#ffe5b6] hover:bg-[#27190b]/90 focus:ring-2 focus:ring-[#BD9958] focus:ring-offset-2",
    secondary:
      "bg-[#BD9958] text-[#27190b] hover:bg-[#BD9958]/90 focus:ring-2 focus:ring-[#27190b] focus:ring-offset-2",
    outline:
      "border-2 border-[#BD9958] text-[#BD9958] hover:bg-[#BD9958] hover:text-[#27190b] focus:ring-2 focus:ring-[#BD9958] focus:ring-offset-2",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5",
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const isLoading = addToCart.isPending;
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      onClick={handleAddToCart}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {isLoading ? (
        <>
          <div
            className={`animate-spin rounded-full border-2 border-white border-t-transparent ${iconSizes[size]}`}
          />
          Adding...
        </>
      ) : isAdded ? (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-green-400"
          >
            ✓
          </motion.div>
          Added!
        </>
      ) : (
        <>
          <ShoppingCartIcon className={iconSizes[size]} />
          {children || "Add to Cart"}
        </>
      )}
    </motion.button>
  );
}

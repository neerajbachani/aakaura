"use client";

import React from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { JourneyProduct } from "@/data/chakras";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useIsInWishlist,
} from "@/hooks/useWishlist";
import { toast } from "react-hot-toast";
import { ClientType } from "./wishlistUtils";

interface WishlistHeartButtonProps {
  product: JourneyProduct;
  journeySlug: string;
  clientType: ClientType;
  isAuthenticated: boolean;
  authLoading: boolean;
  onAuthRequired: () => void;
  size?: "sm" | "lg";
  showLabel?: boolean;
  className?: string;
}

export function WishlistHeartButton({
  product,
  journeySlug,
  clientType,
  isAuthenticated,
  authLoading,
  onAuthRequired,
  size = "sm",
  showLabel = false,
  className = "",
}: WishlistHeartButtonProps) {
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const isInWishlist = useIsInWishlist(journeySlug, product.id, clientType);
  const isLoading = addToWishlist.isPending || removeFromWishlist.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (authLoading) return;

    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      onAuthRequired();
      return;
    }

    if (isInWishlist) {
      removeFromWishlist.mutate({
        journeySlug,
        productId: product.id,
        clientType,
      });
    } else {
      addToWishlist.mutate({
        journeySlug,
        productId: product.id,
        productName: product.name,
        clientType,
      });
    }
  };

  const sizeClasses =
    size === "lg"
      ? "w-12 h-12"
      : "w-10 h-10";

  const iconClasses = size === "lg" ? "w-6 h-6" : "w-5 h-5";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading || authLoading}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={isInWishlist}
      className={`flex items-center justify-center rounded-full border transition-all transform hover:scale-105 disabled:opacity-50 ${sizeClasses} ${
        isInWishlist
          ? "border-[#BD9958] bg-[#BD9958]/20 text-[#BD9958]"
          : "border-white/30 bg-black/20 backdrop-blur-md text-white/70 hover:text-white hover:border-white/60"
      } ${className}`}
    >
      {isInWishlist ? (
        <HeartSolid className={iconClasses} />
      ) : (
        <HeartOutline className={iconClasses} />
      )}
      {showLabel && (
        <span className="ml-2 text-sm uppercase tracking-widest">
          {isInWishlist ? "Saved" : "Wishlist"}
        </span>
      )}
    </button>
  );
}

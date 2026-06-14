"use client";

import React from "react";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { JourneyProduct } from "@/data/chakras";
import { useAddToCart } from "@/hooks/useCart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useIsInWishlist,
} from "@/hooks/useWishlist";
import { toast } from "react-hot-toast";
import { JourneyPriceDisplay } from "@/components/ui/JourneyPriceDisplay";
import { WishlistHeartButton } from "./WishlistHeartButton";
import { ClientType } from "./wishlistUtils";

interface JourneyProductFooterActionsProps {
  product: JourneyProduct;
  journeySlug: string;
  clientType: ClientType;
  isAuthenticated: boolean;
  authLoading: boolean;
  onAuthRequired: () => void;
  isWishlistOnly?: boolean;
  categoryName?: string;
}

export function JourneyProductFooterActions({
  product,
  journeySlug,
  clientType,
  isAuthenticated,
  authLoading,
  onAuthRequired,
  isWishlistOnly = true,
  categoryName,
}: JourneyProductFooterActionsProps) {
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const isInWishlist = useIsInWishlist(journeySlug, product.id, clientType);
  const isLoading = addToWishlist.isPending || removeFromWishlist.isPending;
  const isComboPurchase = Boolean(product.comboDbId);

  const handleWishlistPrimaryClick = () => {
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

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      onAuthRequired();
      return;
    }

    const payload = isComboPurchase
      ? { comboId: product.comboDbId!, quantity: 1 }
      : { productId: product.id, quantity: 1 };

    addToCart.mutateAsync(payload).catch(() => {
      toast.error("Failed to add to cart");
    });
  };

  if (authLoading) {
    return (
      <button
        className="bg-[#f4f1ea]/50 text-[#27190b] px-12 py-4 rounded-full text-sm uppercase tracking-widest"
        disabled
      >
        Loading...
      </button>
    );
  }

  if (isWishlistOnly) {
    return (
      <button
        onClick={handleWishlistPrimaryClick}
        disabled={isLoading}
        className={`px-12 py-4 rounded-full text-sm uppercase tracking-widest transition-all transform hover:scale-105 disabled:opacity-50 flex items-center justify-center gap-2 ${
          isInWishlist
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-[#f4f1ea] text-[#27190b] hover:bg-opacity-90"
        }`}
      >
        {isLoading ? (
          "Processing..."
        ) : isInWishlist ? (
          <>
            <HeartSolid className="w-5 h-5" />
            Saved to Wishlist
          </>
        ) : (
          <>
            <HeartSolid className="w-5 h-5 opacity-70" />
            Add to Wishlist
            <span className="opacity-40 select-none">•</span>
            <JourneyPriceDisplay
              price={product.price}
              offerPrice={product.offerPrice}
              variant="button"
            />
          </>
        )}
      </button>
    );
  }

  return (
    <div className="flex flex-row gap-4 justify-center items-center">
      <button
        onClick={handleAddToCart}
        className="px-12 py-4 rounded-full text-sm uppercase tracking-widest transition-all transform hover:scale-105 bg-[#27190b] text-[#f4f1ea] border border-[#f4f1ea] hover:bg-[#f4f1ea] hover:text-[#27190b]"
      >
        <span className="flex items-center justify-center gap-2">
          Add to Cart <span className="opacity-40 select-none">•</span>
          <JourneyPriceDisplay
            price={product.price}
            offerPrice={product.offerPrice}
            variant="button"
          />
        </span>
      </button>
      <WishlistHeartButton
        product={product}
        journeySlug={journeySlug}
        clientType={clientType}
        isAuthenticated={isAuthenticated}
        authLoading={authLoading}
        onAuthRequired={onAuthRequired}
        size="lg"
      />
    </div>
  );
}

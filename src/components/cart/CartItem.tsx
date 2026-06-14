"use client";

import { useState } from "react";
import Image from "next/image";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { CartItem as CartItemType } from "@/types/Cart";
import { useUpdateCartItem, useRemoveFromCart } from "@/hooks/useCart";
import { motion } from "framer-motion";
import { resolveComboPricing } from "@/lib/comboPricing";

interface CartItemProps {
  item: CartItemType;
  compact?: boolean;
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity);
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  const isCombo = Boolean(item.comboId && item.combo);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (newQuantity > 99) return;

    setQuantity(newQuantity);
    updateCartItem.mutate({
      cartItemId: item.id,
      quantity: newQuantity,
    });
  };

  const handleRemove = () => {
    removeFromCart.mutate({ cartItemId: item.id });
  };

  let currentPrice = 0;
  let originalPrice = 0;

  if (isCombo && item.combo) {
    const pricing =
      item.comboPricing ?? resolveComboPricing(item.combo);
    currentPrice = pricing.effective;
    originalPrice = pricing.original;
  } else if (item.product) {
    currentPrice =
      item.variation?.offerPrice ??
      item.variation?.price ??
      item.product.offerPrice ??
      item.product.price;
    originalPrice = item.variation?.price ?? item.product.price;
  }

  const hasDiscount = currentPrice < originalPrice;
  const itemTotal = currentPrice * quantity;
  const displayName = isCombo ? item.combo!.name : item.product?.name || "";
  const rawImage = isCombo
    ? item.combo!.images?.find((img) => img?.trim())
    : item.product?.images?.find((img) => img?.trim());
  const displayImage = rawImage || "/placeholder-product.jpg";
  const includedCount = isCombo ? item.combo!.products?.length ?? 0 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex gap-4 p-4 bg-transparent rounded-xl border ${compact ? "border-[#BD9958]/10" : "border-[#BD9958]/20"} hover:border-[#BD9958]/40 transition-colors`}
    >
      <div className={`flex-shrink-0 ${compact ? "w-16 h-16" : "w-24 h-24"}`}>
        <Image
          src={displayImage}
          alt={displayName}
          width={compact ? 64 : 96}
          height={compact ? 64 : 96}
          className="w-full h-full object-cover rounded-lg border border-[#BD9958]/20"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3
          className={`font-semibold text-[#BD9958] font-cormorant tracking-wide ${compact ? "text-lg" : "text-xl md:text-2xl"} truncate`}
        >
          {displayName}
        </h3>

        {isCombo ? (
          <p
            className={`text-[#BD9958]/70 ${compact ? "text-xs" : "text-sm"} mt-1`}
          >
            Combo · {includedCount} item{includedCount === 1 ? "" : "s"}{" "}
            included
          </p>
        ) : (
          item.variation && (
            <p
              className={`text-[#BD9958]/70 ${compact ? "text-xs" : "text-sm"} mt-1`}
            >
              {item.variation.name}
            </p>
          )
        )}

        <div className="flex items-center gap-3 mt-2">
          <span
            className={`font-medium text-white ${compact ? "text-sm" : "text-base"}`}
          >
            ₹{currentPrice.toFixed(2)}
          </span>
          {hasDiscount && (
            <span
              className={`text-[#BD9958]/50 line-through ${compact ? "text-xs" : "text-sm"}`}
            >
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center border border-[#BD9958]/30 rounded-md overflow-hidden bg-[#27190B]/50">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || updateCartItem.isPending}
              className="p-1.5 text-[#BD9958] hover:bg-[#BD9958]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <MinusIcon className="h-4 w-4" />
            </button>

            <span className="px-3 py-1 text-sm font-medium min-w-[2.5rem] text-center text-white">
              {quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= 99 || updateCartItem.isPending}
              className="p-1.5 text-[#BD9958] hover:bg-[#BD9958]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="text-right">
            <p
              className={`font-bold text-[#BD9958] ${compact ? "text-sm" : "text-lg"}`}
            >
              ₹{itemTotal.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 ml-2">
        <button
          onClick={handleRemove}
          disabled={removeFromCart.isPending}
          className="p-2 text-[#BD9958]/50 hover:text-red-400 hover:bg-red-400/10 rounded-full transition-all disabled:opacity-50"
          aria-label="Remove item"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}

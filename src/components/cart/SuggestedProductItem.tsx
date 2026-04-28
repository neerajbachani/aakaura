"use client";

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/types/Product";
import { AddToCartButton } from "./AddToCartButton";

interface SuggestedProductItemProps {
  product: Product;
}

export function SuggestedProductItem({ product }: SuggestedProductItemProps) {
  const [selectedVariation, setSelectedVariation] = useState(
    product.variations && product.variations.length > 0
      ? product.variations[0].id
      : undefined
  );

  const displayPrice = product.offerPrice || product.price;

  return (
    <div className="flex gap-4 p-4 bg-[#27190B]/30 rounded-xl border border-[#BD9958]/20 hover:border-[#BD9958]/40 transition-colors">
      <div className="flex-shrink-0 w-20 h-20">
        <Image
          src={product.images[0] || "/placeholder-product.jpg"}
          alt={product.name}
          width={80}
          height={80}
          className="w-full h-full object-cover rounded-lg border border-[#BD9958]/20"
        />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <h3 className="font-semibold text-[#BD9958] font-cormorant tracking-wide text-lg truncate">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-1">
          <span className="font-medium text-white text-sm">
            ₹{displayPrice.toFixed(2)}
          </span>
          {product.offerPrice && product.offerPrice < product.price && (
            <span className="text-[#BD9958]/50 line-through text-xs">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          {product.variations && product.variations.length > 0 ? (
            <select
              value={selectedVariation}
              onChange={(e) => setSelectedVariation(e.target.value)}
              className="flex-1 bg-transparent border border-[#BD9958]/30 rounded text-xs px-2 py-1.5 focus:outline-none focus:border-[#BD9958] text-[#ffe5b6]"
            >
              {product.variations.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#191919]">
                  {v.name}
                </option>
              ))}
            </select>
          ) : null}

          <AddToCartButton
            productId={product.id}
            variationId={selectedVariation}
            quantity={1}
            variant="secondary"
            size="sm"
            className="flex-none px-4 py-1.5 !text-xs font-bold uppercase tracking-wider h-auto"
          >
            Add
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Product, ProductVariation } from "@/types/Product";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import Image from "next/image";
import fonts from "@/config/fonts";
import { useLenis } from "@/context/LenisContext";

interface ProductOverlayProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductOverlay({
  product,
  isOpen,
  onClose,
}: ProductOverlayProps) {
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { lenis } = useLenis();

  // Set default variation
  useEffect(() => {
    if (product.variations.length > 0) {
      setSelectedVariation(product.variations[0]);
    }
  }, [product]);

  // Block body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [isOpen, lenis]);

  const currentPrice = selectedVariation?.offerPrice || selectedVariation?.price || product.offerPrice || product.price;
  const originalPrice = selectedVariation?.offerPrice ? selectedVariation.price : (product.offerPrice ? product.price : null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Slide-up Panel */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[85vh] bg-[#f4f1ea] text-[#27190b] z-[70] rounded-t-[32px] overflow-hidden flex flex-col shadow-2xl"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 transition-colors z-50"
            >
              <XMarkIcon className="w-8 h-8 text-[#27190b]" />
            </button>

            {/* Scrollable Content */}
            <div 
              className="overflow-y-auto h-full p-8 md:p-16 custom-scrollbar"
              data-lenis-prevent
            >
              <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                  {/* Left Column - Images */}
                  <div className="space-y-6">
                    <div className="aspect-[4/5] relative rounded-2xl overflow-hidden bg-[#27190b]/5">
                      <Image
                        src={product.images[0] || "/images/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Thumbnails could go here */}
                  </div>

                  {/* Right Column - Details */}
                  <div className="space-y-8">
                    <div>
                      {product.category?.name && (
                        <span className="inline-block px-3 py-1 rounded-full bg-[#27190b]/5 text-[#27190b] text-xs font-medium uppercase tracking-widest mb-4">
                          {product.category.name}
                        </span>
                      )}
                      <h2 className="text-3xl md:text-5xl font-cormorant font-light mb-4 text-[#27190b]">
                        {product.name}
                      </h2>
                      <div className="flex items-baseline gap-4">
                        <span className="text-2xl md:text-3xl font-cormorant font-light text-[#27190b]">
                          ₹{currentPrice}
                        </span>
                        {originalPrice && (
                          <span className="text-lg line-through opacity-40 font-light">
                            ₹{originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-[#27190b]/10" />

                    <div className="prose prose-brown">
                      <p className="font-light text-lg leading-relaxed opacity-80">
                        {product.description}
                      </p>
                    </div>

                    {/* Variations */}
                    {product.variations.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-sm uppercase tracking-widest font-bold opacity-60">Select Option</h3>
                        <div className="flex flex-wrap gap-3">
                          {product.variations.map((variation) => (
                            <button
                              key={variation.id}
                              onClick={() => setSelectedVariation(variation)}
                              className={`px-6 py-3 rounded-full text-sm transition-all duration-300 ${
                                selectedVariation?.id === variation.id
                                  ? "bg-[#27190b] text-[#f4f1ea]"
                                  : "bg-white border border-[#27190b]/20 text-[#27190b] hover:border-[#27190b]"
                              }`}
                            >
                              {variation.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quantity */}
                    <div className="flex items-center gap-6">
                      <div className="flex items-center border border-[#27190b]/20 rounded-full p-1">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-[#27190b]/5 rounded-full transition-colors"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{quantity}</span>
                        <button
                          onClick={() => setQuantity(Math.min(99, quantity + 1))}
                          className="w-10 h-10 flex items-center justify-center hover:bg-[#27190b]/5 rounded-full transition-colors"
                          disabled={quantity >= 99}
                        >
                          +
                        </button>
                      </div>
                      
                      <div className="flex-1">
                        <AddToCartButton
                          productId={product.id}
                          variationId={selectedVariation?.id}
                          quantity={quantity}
                          className="w-full bg-[#27190b] text-[#f4f1ea] px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-opacity-90 transition-all transform hover:scale-[1.02]"
                          disabled={selectedVariation ? !selectedVariation.inStock : false}
                        >
                          {selectedVariation && !selectedVariation.inStock ? 'Out of Stock' : 'Add to Cart'}
                        </AddToCartButton>
                      </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-[#27190b]/10">
                      <div className="text-center">
                        <div className="text-xl mb-2">✨</div>
                        <div className="text-xs uppercase tracking-widest opacity-60">Authentic</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl mb-2">🌿</div>
                        <div className="text-xs uppercase tracking-widest opacity-60">Natural</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl mb-2">🚚</div>
                        <div className="text-xs uppercase tracking-widest opacity-60">Free Shipping</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChakraData, JourneyProduct } from "@/data/chakras";

type ClientType = "soul-luxury" | "energy-curious";

interface JourneyProductPanelProps {
  product: JourneyProduct;
  index: number;
  chakra: ChakraData;
  clientType: ClientType;
  setClientType: (type: ClientType) => void;
  expandedCard: number | null;
  setExpandedCard: (index: number | null) => void;
  setActiveBgImage: (image: string) => void;
  currentProducts: JourneyProduct[];
  isAuthenticated: boolean;
  authLoading: boolean;
  onAuthRequired: () => void;
  setShowAuthModal: (show: boolean) => void;
  addToWaitlist: any;
  removeFromWaitlist: any;
  useIsInWaitlist: any;
  customMainImage?: string;
}

export function JourneyProductPanel({
  product,
  index,
  chakra,
  clientType,
  setClientType,
  expandedCard,
  setExpandedCard,
  setActiveBgImage,
  currentProducts,
  isAuthenticated,
  authLoading,
  onAuthRequired,
  setShowAuthModal,
  addToWaitlist,
  removeFromWaitlist,
  useIsInWaitlist,
  customMainImage,
}: JourneyProductPanelProps) {
  const [activeVariant, setActiveVariant] = useState(
    product.variants?.[0] || null,
  );

  // Track locally selected side image
  const [selectedSideImage, setSelectedSideImage] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setActiveVariant(product.variants[0]);
    } else {
      setActiveVariant(null);
    }
  }, [product]);

  // Reset side image when variant changes (so the new variant's main image takes precedence unless overridden again)
  useEffect(() => {
    setSelectedSideImage(null);
  }, [activeVariant]);

  // Update centralized background when this panel's modal is open or variant changes
  useEffect(() => {
    if (expandedCard === index && activeVariant) {
      setActiveBgImage(activeVariant.image);
    } else if (expandedCard === index && product.images?.[0]) {
      setActiveBgImage(product.images[0]);
    }
  }, [expandedCard, index, activeVariant, product.images, setActiveBgImage]);

  // Priority: selectedSideImage > customMainImage > activeVariant.image > product.images[0]
  const displayImage =
    selectedSideImage ||
    customMainImage ||
    (activeVariant ? activeVariant.image : product.images?.[0] || "");

  return (
    <div className="panel w-screen h-screen aspect-[16/9] flex-shrink-0 relative flex flex-col md:block bg-[#27190b]">
      {/* Background Image Container */}
      {/* Mobile: Relative 60% height */}
      {/* Desktop: Absolute Full Screen */}
      <div
        className="panel-image relative w-full h-[60vh] md:absolute md:inset-0 md:h-full overflow-hidden"
        style={{
          opacity: expandedCard !== null ? 0 : 1,
          transition: "opacity 0.3s ease-out",
        }}
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: 1 }}
          key={activeVariant ? activeVariant.name : clientType + product.id}
          transition={{ duration: 0.5 }}
        >
          <img
            src={displayImage}
            alt={activeVariant ? activeVariant.name : product.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center center" }}
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-[#27190b] bg-opacity-20"
          style={{
            background: `linear-gradient(to bottom, rgba(39,25,11,0.1) 0%, rgba(39,25,11,0.6) 100%)`,
          }}
        />

        {/* Top Text - Kept inside image container for mobile to overlay image */}
        <div className="absolute top-0 left-0 right-0 p-6 md:p-8">
          <h2
            className={`text-sm md:text-lg uppercase tracking-[0.2em] md:tracking-[0.3em] font-light text-white text-center md:text-left`}
          >
            <span className="max-w-sm block mx-auto md:mx-0">
              AAKAURA'S {chakra.tone.toUpperCase()} COLLECTION
            </span>
          </h2>
        </div>
      </div>

      {/* Side Image Strip */}
      {/* Mobile: Relative row below image */}
      {/* Desktop: Absolute column on left */}
      {expandedCard === null && product.images && product.images.length > 1 && (
        <div
          className={`side-image-strip z-20 flex gap-4 transition-all duration-500
            relative w-full overflow-x-auto px-6 py-4 flex-row items-center justify-center
            md:absolute md:left-8 md:top-[30%] md:-translate-y-1/2 md:flex-col md:w-auto md:h-auto md:max-h-[60vh] md:p-4 md:overflow-visible no-scrollbar`}
          onClick={(e) => e.stopPropagation()}
          style={
            {
              // On desktop, we want the GSAP animation to control opacity/transform.
              // On mobile, we might want it visible immediately or animated differently.
              // For now, let's keep the style inline but override with class utilities if needed.
              // Note: The parent ChakraJourneyTemplate animates ".side-image-strip".
            }
          }
        >
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSideImage(img);
              }}
              className={`w-16 h-16 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 relative flex-shrink-0 bg-black/20 backdrop-blur-sm ${
                selectedSideImage === img ||
                (!selectedSideImage && displayImage === img)
                  ? "border-white scale-110 shadow-lg ring-2 ring-white/20 opacity-100"
                  : "border-white/30 hover:border-white/70 opacity-60 hover:opacity-100 hover:scale-105"
              }`}
            >
              <img
                src={img}
                alt={`View ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Bottom Content */}
      {/* Mobile: Relative below strip */}
      {/* Desktop: Absolute bottom */}
      <div className="relative w-full flex-1 flex flex-col justify-center md:block md:absolute md:bottom-0 md:left-0 md:right-0 p-6 md:p-8 z-10">
        <div className="max-w-[1400px] mx-auto px-0 md:px-10 w-full">
          <div
            className={`flex flex-col md:flex-row justify-between items-center text-lg md:text-xl font-cormorant uppercase tracking-[0.2em] text-white mb-0 md:mb-4 gap-6 md:gap-0`}
          >
            {product.variants && product.variants.length > 0 ? (
              <>
                {/* Color Swatches - Slot 1 */}
                <div className="w-full md:max-w-[300px] flex justify-center md:justify-start items-center gap-4 order-2 md:order-1">
                  <div className="flex items-center gap-3 bg-black/20 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/10">
                    {product.variants.map((variant, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveVariant(variant);
                        }}
                        className={`w-8 h-8 rounded-md transition-all duration-300 relative ${
                          activeVariant?.color === variant.color
                            ? "scale-110 ring-1 ring-white/50"
                            : "hover:scale-110 opacity-70 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: variant.color }}
                        title={variant.name}
                      ></button>
                    ))}
                    <span className="ml-2 text-xs opacity-80 tracking-widest whitespace-nowrap">
                      {activeVariant?.name}
                    </span>
                  </div>
                </div>

                {/* Product Name - Slot 2 */}
                <h2 className="text-2xl md:text-xl text-center order-1 md:order-2">
                  {product.name.toUpperCase()}
                </h2>

                {/* View Description - Slot 3 */}
                <button
                  onClick={(e) => {
                    console.log(
                      "🖱️ VIEW DESCRIPTION clicked for index:",
                      index,
                    );
                    e.stopPropagation();
                    console.log("   Setting expandedCard to:", index);
                    setExpandedCard(index);
                  }}
                  className="hover:opacity-70 transition-opacity border-b border-white/50 pb-1 order-3"
                >
                  VIEW DESCRIPTION
                </button>
              </>
            ) : (
              <>
                {/* Product Name (Left) - Slot 1 */}
                <h2 className="text-2xl md:text-xl text-center md:text-left order-1">
                  {product.name.toUpperCase()}
                </h2>

                {/* View Description (Right) - Slot 2 */}
                <button
                  onClick={(e) => {
                    console.log(
                      "🖱️ VIEW DESCRIPTION clicked for index:",
                      index,
                    );
                    e.stopPropagation();
                    setExpandedCard(index);
                  }}
                  className="hover:opacity-70 transition-opacity border-b border-white/50 pb-1 order-2"
                >
                  VIEW DESCRIPTION
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

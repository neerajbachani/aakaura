"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ChakraData, JourneyProduct, chakrasData } from "@/data/chakras";
import { useRevealer } from "@/hooks/useRevealer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLenis } from "@/context/LenisContext";
import { useAuthStatus } from "@/hooks/useAuth";
import {
  useAddToWaitlist,
  useRemoveFromWaitlist,
  useIsInWaitlist,
} from "@/hooks/useWaitlist";
import { toast } from "react-hot-toast";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ChakraJourneyTemplateProps {
  chakra: ChakraData;
}

type ClientType = "soul-luxury" | "energy-curious";

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  titleClassName?: string;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  children,
  defaultOpen = false,
  titleClassName = "",
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-[#f4f1ea]/20 rounded-xl overflow-hidden text-[#f4f1ea]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex justify-between items-center hover:bg-[#f4f1ea]/5 transition-colors duration-300"
      >
        <h3
          className={`uppercase tracking-widest font-bold opacity-80 ${titleClassName || "text-base"}`}
        >
          {title}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#f4f1ea]"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Image Gallery Component
interface ImageGalleryProps {
  product: JourneyProduct;
  onExpandImage?: (imageUrl: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  product,
  onExpandImage,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Generate placeholder images if product doesn't have images array
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.images?.[0] || "/images/placeholder-product.jpg"];

  return (
    <div className="mb-12 text-[#f4f1ea]">
      <h3 className="text-base uppercase tracking-widest font-bold mb-6 opacity-60">
        Product Images
      </h3>

      {/* Main Image */}
      <div className="relative aspect-[4/3] bg-[#f4f1ea]/5 rounded-2xl overflow-hidden mb-4 border border-[#f4f1ea]/10 group">
        <motion.img
          key={selectedImageIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          src={images[selectedImageIndex]}
          alt={`${product.name} - Image ${selectedImageIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Expand Icon */}
        {onExpandImage && (
          <button
            onClick={() => onExpandImage(images[selectedImageIndex])}
            className="absolute bottom-4 right-4 p-3 bg-[#27190b]/80 hover:bg-[#27190b] rounded-full backdrop-blur-sm transition-all duration-300 opacity-0 group-hover:opacity-100 transform hover:scale-110"
            aria-label="Expand image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 text-[#f4f1ea]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Thumbnail Grid */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative aspect-square bg-[#f4f1ea]/5 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                selectedImageIndex === index
                  ? "border-[#f4f1ea] scale-95"
                  : "border-[#f4f1ea]/20 hover:border-[#f4f1ea]/50"
              }`}
            >
              <img
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Formatted Content Component for rendering markdown-style text
interface FormattedContentProps {
  content: string;
}

const FormattedContent: React.FC<FormattedContentProps> = ({ content }) => {
  // Parse the content and convert markdown-style syntax to JSX
  const renderFormattedText = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let currentList: string[] = [];

    const processInlineFormatting = (text: string) => {
      // Split by ** for bold text
      const parts = text.split(/\*\*(.*?)\*\*/g);
      return parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-[#f4f1ea]">
            {part}
          </strong>
        ) : (
          part
        ),
      );
    };

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="space-y-2 mb-6 ml-6">
            {currentList.map((item, i) => (
              <li
                key={i}
                className="text-base leading-relaxed opacity-80 list-disc"
              >
                {processInlineFormatting(item)}
              </li>
            ))}
          </ul>,
        );
        currentList = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines
      if (!trimmedLine) {
        flushList();
        if (elements.length > 0) {
          elements.push(<div key={`space-${index}`} className="h-4" />);
        }
        return;
      }

      // Check for heading (line starting with **text**)
      if (trimmedLine.match(/^\*\*(.+)\*\*$/)) {
        flushList();
        const headingText = trimmedLine.replace(/^\*\*(.+)\*\*$/, "$1");
        elements.push(
          <h4
            key={`heading-${index}`}
            className="font-cormorant text-xl font-semibold mb-3 mt-8 first:mt-0 text-[#f4f1ea]"
          >
            {headingText}
          </h4>,
        );
      }
      // Check for list item
      else if (trimmedLine.startsWith("-") || trimmedLine.startsWith("•")) {
        currentList.push(trimmedLine.substring(1).trim());
      }
      // Regular paragraph
      else {
        flushList();
        elements.push(
          <p
            key={`para-${index}`}
            className="text-lg leading-relaxed opacity-80 mb-4 font-light"
          >
            {processInlineFormatting(trimmedLine)}
          </p>,
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="formatted-content">{renderFormattedText(content)}</div>
  );
};

export default function ChakraJourneyTemplate({
  chakra,
}: ChakraJourneyTemplateProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [clientType, setClientType] = useState<ClientType>("soul-luxury");
  const [activeBgImage, setActiveBgImage] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  // Track custom main display image for each product by index
  const [productMainImages, setProductMainImages] = useState<
    Record<number, string>
  >({});
  const section3Ref = useRef<HTMLElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const { lenis } = useLenis();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();

  // Waitlist hooks
  const addToWaitlist = useAddToWaitlist();
  const removeFromWaitlist = useRemoveFromWaitlist();

  useRevealer();

  // Close overlay when client type changes
  useEffect(() => {
    setExpandedCard(null);
  }, [clientType]);

  // Derived products list for current view (Merged with static data for variants)
  const currentProducts = React.useMemo(() => {
    const propProducts = chakra.content[clientType] || [];
    const staticChakra = chakrasData[chakra.slug];
    const staticProducts = staticChakra?.content?.[clientType] || [];

    return propProducts.map((p, i) => {
      // Try to find matching static product by ID or index
      const staticP =
        staticProducts.find((sp) => sp.id === p.id) || staticProducts[i];

      // If prop doesn't have variants but static does, use static
      if (!p.variants && staticP?.variants) {
        return { ...p, variants: staticP.variants };
      }
      return p;
    });
  }, [chakra, clientType]);

  // GSAP Horizontal Scroll Effect
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const horizontalContainer = horizontalContainerRef.current;
      const section3 = section3Ref.current;

      if (!horizontalContainer || !section3) return;

      // Calculate scroll width
      const scrollWidth = horizontalContainer.scrollWidth;
      const viewportWidth = window.innerWidth;

      // Only animate if content overflows
      if (scrollWidth <= viewportWidth) return;

      // Create horizontal scroll animation
      const horizontalScroll = gsap.to(horizontalContainer, {
        x: () => -(scrollWidth - viewportWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section3,
          pin: true,
          scrub: 1,
          end: () => `+=${scrollWidth - viewportWidth}`,
          invalidateOnRefresh: true,
        },
      });

      // Animate images scaling to full size when panel is centered
      const panels = gsap.utils.toArray(".panel") as HTMLElement[];
      panels.forEach((panel: HTMLElement, index: number) => {
        const image = panel.querySelector(".panel-image");

        gsap.fromTo(
          image,
          {
            scale: 0.7,
            borderRadius: "24px",
          },
          {
            scale: 1,
            borderRadius: "0px",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalScroll,
              start: "left center",
              end: "center center",
              scrub: 1,
            },
          },
        );

        // Animate side image strip - Fade in LATE (after 80% cross)
        const sideStrip = panel.querySelector(".side-image-strip");
        if (sideStrip) {
          gsap.to(sideStrip, {
            opacity: 1,
            x: 0,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontalScroll,
              start: "left 20%", // Starts when left edge is at 20% of screen (80% crossed)
              end: "center center", // Fully visible at center
              scrub: 1,
            },
          });
        }
      });
    });

    return () => ctx.revert();
  }, [currentProducts]);

  // Track previous expanded card state
  const prevExpandedCardRef = useRef<number | null>(null);

  // Block body scroll when overlay is open + scroll to top on first open
  useEffect(() => {
    console.log("🔄 expandedCard changed:", expandedCard);

    if (expandedCard !== null) {
      console.log("✅ Modal OPENING for index:", expandedCard);
      // Only scroll to top if opening from closed state (not switching between products)
      const wasClosedBefore = prevExpandedCardRef.current === null;
      console.log("   Was closed before?", wasClosedBefore);

      // Commented out temporarily to test
      // if (wasClosedBefore) {
      //   window.scrollTo({
      //     top: 0,
      //     behavior: 'instant'
      //   });
      // }

      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      console.log("❌ Modal CLOSING");
      lenis?.start();
      document.body.style.overflow = "";
    }

    // Update previous state
    prevExpandedCardRef.current = expandedCard;

    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [expandedCard, lenis]);

  return (
    <div className="min-h-screen bg-[#27190b]">
      {/* Revealer overlay for page entrance */}
      <div className="revealer fixed inset-0 bg-[#BD9958] z-50 origin-top pointer-events-none" />

      {/* Fixed Background Overlay - Always rendered, controlled by CSS visibility */}
      <div
        className={`fixed inset-0 z-30 overflow-hidden transition-all duration-[600ms] ${
          expandedCard !== null
            ? "opacity-100 scale-105 pointer-events-none"
            : "opacity-0 pointer-events-none scale-100"
        }`}
        style={{ willChange: "opacity, transform" }}
      >
        <img
          src={
            expandedCard !== null && currentProducts[expandedCard]
              ? activeBgImage ||
                currentProducts[expandedCard]?.variants?.[0]?.image ||
                currentProducts[expandedCard]?.images?.[0] ||
                undefined
              : undefined
          }
          alt={
            expandedCard !== null && currentProducts[expandedCard]
              ? currentProducts[expandedCard]?.name
              : ""
          }
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            expandedCard !== null ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: "center center" }}
        />
        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 bg-[#27190b] bg-opacity-20"
          style={{
            background: `linear-gradient(to bottom, rgba(39,25,11,0.1) 0%, rgba(39,25,11,0.6) 100%)`,
          }}
        />
      </div>

      {/* Section 3: Horizontal Scrolling Products - NOW AT TOP */}
      <section ref={section3Ref} className="relative h-screen overflow-hidden">
        <div ref={horizontalContainerRef} className="flex h-full w-max">
          {currentProducts.map((product, index) => (
            <JourneyProductPanel
              key={product.id || index}
              product={product}
              index={index}
              chakra={chakra}
              clientType={clientType}
              setClientType={setClientType}
              expandedCard={expandedCard}
              setExpandedCard={setExpandedCard}
              setActiveBgImage={setActiveBgImage}
              currentProducts={currentProducts}
              isAuthenticated={isAuthenticated}
              authLoading={authLoading}
              onAuthRequired={() => setShowAuthModal(true)}
              setShowAuthModal={setShowAuthModal}
              addToWaitlist={addToWaitlist}
              removeFromWaitlist={removeFromWaitlist}
              useIsInWaitlist={useIsInWaitlist}
              customMainImage={productMainImages[index]}
            />
          ))}
        </div>
      </section>

      {/* Expanded Details Overlay - Moved to Parent to escape GSAP Transform Context */}
      <AnimatePresence>
        {expandedCard !== null &&
          currentProducts[expandedCard] &&
          (() => {
            const product = currentProducts[expandedCard];
            return (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => {
                    setExpandedCard(null);
                  }}
                  className="fixed inset-0 z-[999]"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.4)", // Restored standard backdrop
                    backdropFilter: "blur(8px)",
                  }}
                />

                {/* Slide-up Panel */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="fixed bottom-0 left-0 right-0 h-[85vh] z-[9999] rounded-t-[32px] overflow-hidden flex flex-col bg-[#27190b]"
                  style={{
                    boxShadow: "0 -20px 40px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setExpandedCard(null)}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                  >
                    <XMarkIcon className="w-8 h-8 text-[#f4f1ea]" />
                  </button>

                  {/* Scrollable Content */}
                  <div
                    className="overflow-y-auto h-full p-8 md:p-16 custom-scrollbar overscroll-y-contain"
                    data-lenis-prevent
                  >
                    <div className="max-w-5xl mx-auto">
                      {/* Client Type Toggle */}
                      {/* <div className="flex justify-center mb-8">
                        <div className="bg-[#f4f1ea]/10 p-1 rounded-full flex relative">
                          <motion.div 
                            className="absolute top-1 bottom-1 bg-[#f4f1ea] rounded-full shadow-md"
                            initial={false}
                            animate={{ 
                              left: clientType === 'soul-luxury' ? '4px' : '50%',
                              width: 'calc(50% - 4px)'
                            }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                          <button 
                            onClick={() => setClientType('soul-luxury')}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-colors duration-300 ${clientType === 'soul-luxury' ? 'text-[#27190b]' : 'text-[#f4f1ea]/60'}`}
                          >
                            Soul Luxury
                          </button>
                          <button 
                            onClick={() => setClientType('energy-curious')}
                            className={`relative z-10 px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-colors duration-300 ${clientType === 'energy-curious' ? 'text-[#27190b]' : 'text-[#f4f1ea]/60'}`}
                          >
                            Energy Curious
                          </button>
                        </div>
                      </div> */}

                      {/* Header */}
                      <div className="mb-12 border-b border-[#f4f1ea]/20 pb-8 text-center md:text-left">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                          <div>
                            <h2 className="text-4xl md:text-6xl font-cormorant font-light mb-2 text-[#f4f1ea]">
                              {product.name}
                            </h2>
                            <p className="text-lg font-light tracking-wide opacity-80 text-[#f4f1ea]">
                              {product.sanskritName}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Two Column Layout - Independent Stacking */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12  ">
                        {/* Left Column */}
                        <div className="space-y-8">
                          {/* Description */}
                          <motion.div
                            key={clientType}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-[#f4f1ea]"
                          >
                            <h3 className="text-base uppercase tracking-widest font-bold mb-6 opacity-60">
                              Description
                            </h3>
                            <p className="font-light text-xl leading-relaxed">
                              {product.specificDescription ||
                                product.description}
                            </p>
                          </motion.div>

                          {(product.symbolism || product.languageEngraving) && (
                            <motion.div
                              key={`${clientType}-premium`}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: 0.1 }}
                              className="bg-[#f4f1ea]/5 p-8 rounded-2xl text-[#f4f1ea] border border-[#f4f1ea]/10"
                            >
                              <h3 className="text-lg uppercase tracking-widest font-bold mb-6 opacity-60">
                                Premium Detailing
                              </h3>
                              {product.symbolism && (
                                <div className="mb-6">
                                  <div className="text-sm uppercase tracking-wider opacity-50 mb-3">
                                    Symbolism
                                  </div>
                                  <p className="font-light text-lg leading-relaxed opacity-90">
                                    {product.symbolism}
                                  </p>
                                </div>
                              )}
                              {product.languageEngraving && (
                                <div>
                                  <div className="text-sm uppercase tracking-wider opacity-50 mb-3">
                                    Language Engraving
                                  </div>
                                  <p className="font-light text-lg leading-relaxed opacity-90">
                                    {product.languageEngraving}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                          {/* Premium Detailing */}
                          {/* Image Gallery */}
                          <div className="text-[#f4f1ea]">
                            <h3 className="text-base uppercase tracking-widest font-bold mb-6 opacity-60">
                              Specifications
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {product.specifications &&
                                Object.entries(product.specifications)
                                  .filter(([_, value]) => value)
                                  .map(([key, value]) => {
                                    // Full-width keys for better layout
                                    const fullWidthKeys = [
                                      "Product Name",
                                      "Material",
                                      "material",
                                      "Ideal For",
                                      "color",
                                      "Color",
                                    ];
                                    const isFullWidth =
                                      fullWidthKeys.includes(key);
                                    return (
                                      <div
                                        key={key}
                                        className={`border-b border-[#f4f1ea]/20 pb-4 mb-4 ${isFullWidth ? "md:col-span-2" : ""}`}
                                      >
                                        <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2">
                                          {key}
                                        </div>
                                        <div className="font-cormorant text-xl md:text-2xl text-[#f4f1ea] leading-none">
                                          {value}
                                        </div>
                                      </div>
                                    );
                                  })}
                              {product.careInstructions && (
                                <div className="border-b border-[#f4f1ea]/20 pb-4 mb-4 md:col-span-2">
                                  <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2">
                                    Care Instructions
                                  </div>
                                  <div className="font-cormorant text-xl md:text-2xl text-[#f4f1ea] leading-relaxed">
                                    {product.careInstructions}
                                  </div>
                                </div>
                              )}
                              {product.idealFor && (
                                <div className="border-b border-[#f4f1ea]/20 pb-4 mb-4 md:col-span-2">
                                  <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2">
                                    Ideal For
                                  </div>
                                  <div className="font-cormorant text-xl md:text-2xl text-[#f4f1ea] leading-relaxed">
                                    {product.idealFor}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* What It's For */}
                          {/* <div className="bg-[#f4f1ea]/8 p-10 rounded-2xl text-[#f4f1ea] border border-[#f4f1ea]/10">
                            <h3 className="font-cormorant text-3xl mb-5 italic">"What it's really for"</h3>
                            <p className="font-light text-base leading-relaxed opacity-90">{product.whatItsFor}</p>
                          </div> */}
                        </div>
                      </div>

                      {/* Collapsible Sections */}
                      <div className="space-y-4">
                        {/* Specifications Accordion */}

                        {/* Design Breakdown Accordion */}
                        {product.designBreakdown && (
                          <CollapsibleSection
                            title="Design Breakdown & Symbolism"
                            defaultOpen={false}
                          >
                            <div className="space-y-5 pt-6">
                              {Array.isArray(product.designBreakdown) ? (
                                // Handle array format
                                product.designBreakdown.map((item, i) => (
                                  <div
                                    key={i}
                                    className="border-l-2 border-[#f4f1ea]/20 pl-6"
                                  >
                                    <h4 className="font-cormorant text-2xl mb-3">
                                      {item.title}
                                    </h4>
                                    <p className="font-light text-lg leading-relaxed opacity-80">
                                      {item.description}
                                    </p>
                                  </div>
                                ))
                              ) : (
                                // Handle string format
                                <FormattedContent
                                  content={product.designBreakdown}
                                />
                              )}
                            </div>
                          </CollapsibleSection>
                        )}

                        {/* Additional Custom Section (Extra Field) */}
                        {product.additionalSection && (
                          <CollapsibleSection
                            title={product.additionalSection.title}
                            defaultOpen={false}
                            titleClassName="text-lg"
                          >
                            <div className="space-y-5 pt-6">
                              <FormattedContent
                                content={product.additionalSection.content}
                              />
                            </div>
                          </CollapsibleSection>
                        )}

                        {/* Production/Energetic Ethos Accordion */}
                        {/* <CollapsibleSection
                          title={clientType === 'energy-curious' ? 'Energetic Ethos' : 'Production Ethos'}
                          defaultOpen={false}
                        >
                          <p className="font-light text-base leading-relaxed opacity-80 pt-6">{product.ethos}</p>
                        </CollapsibleSection> */}

                        {/* Features Accordion */}
                        {/* <CollapsibleSection
                          title={clientType === 'energy-curious' ? 'Vibrational Benefits' : 'Functional Features'}
                          defaultOpen={false}
                        >
                          <ul className="space-y-3 font-light opacity-80 pt-6">
                            {product.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-3">
                                <span className="mt-2 w-2 h-2 rounded-full bg-[#f4f1ea] flex-shrink-0" />
                                <span className="text-base">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleSection>

                        {/* When to Use Accordion */}
                        {product.whenToUse && (
                          <CollapsibleSection
                            title={`When to Work with the ${chakra.name}`}
                            defaultOpen={false}
                            titleClassName="text-lg"
                          >
                            <div className="pt-6 space-y-8">
                              {product.whenToUse.introduction && (
                                <p className="font-light text-base leading-relaxed opacity-90">
                                  {product.whenToUse.introduction}
                                </p>
                              )}

                              {/* Who Should Work */}
                              {product.whenToUse.whoShouldWork &&
                                product.whenToUse.whoShouldWork.length > 0 && (
                                  <div>
                                    <h4 className="text-sm uppercase tracking-widest font-bold mb-5 opacity-60">
                                      Who Should Work on This Chakra
                                    </h4>
                                    <div className="space-y-4">
                                      {product.whenToUse.whoShouldWork.map(
                                        (item, i) => (
                                          <div
                                            key={i}
                                            className="bg-[#f4f1ea]/5 p-5 rounded-lg"
                                          >
                                            <div className="font-cormorant text-lg mb-2">
                                              {item.title}
                                            </div>
                                            <div className="font-light text-base opacity-80">
                                              {item.description}
                                            </div>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Best Spaces */}
                              {product.whenToUse.bestSpaces &&
                                product.whenToUse.bestSpaces.length > 0 && (
                                  <div>
                                    <h4 className="text-sm uppercase tracking-widest font-bold mb-5 opacity-60">
                                      Best Spaces to Work
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                      {product.whenToUse.bestSpaces.map(
                                        (space, i) => (
                                          <div
                                            key={i}
                                            className="bg-[#f4f1ea]/5 p-5 rounded-lg"
                                          >
                                            <div className="font-cormorant text-lg mb-3">
                                              {space.category}
                                            </div>
                                            <ul className="space-y-2">
                                              {space.items.map((item, j) => (
                                                <li
                                                  key={j}
                                                  className="flex items-start gap-2 font-light text-base opacity-80"
                                                >
                                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f4f1ea]/50 flex-shrink-0" />
                                                  {item}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  </div>
                                )}

                              {/* Best Times & Supportive Practices */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {product.whenToUse.bestTimes &&
                                  product.whenToUse.bestTimes.length > 0 && (
                                    <div>
                                      <h4 className="text-sm uppercase tracking-widest font-bold mb-5 opacity-60">
                                        Best Times to Work
                                      </h4>
                                      <ul className="space-y-3">
                                        {product.whenToUse.bestTimes.map(
                                          (time, i) => (
                                            <li
                                              key={i}
                                              className="flex items-start gap-3 font-light opacity-80"
                                            >
                                              <span className="mt-2 w-2 h-2 rounded-full bg-[#f4f1ea] flex-shrink-0" />
                                              <span className="text-base">
                                                {time}
                                              </span>
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}

                                {product.whenToUse.supportivePractices &&
                                  product.whenToUse.supportivePractices.length >
                                    0 && (
                                    <div>
                                      <h4 className="text-sm uppercase tracking-widest font-bold mb-5 opacity-60">
                                        Supportive Practices
                                      </h4>
                                      <ul className="space-y-3">
                                        {product.whenToUse.supportivePractices.map(
                                          (practice, i) => (
                                            <li
                                              key={i}
                                              className="flex items-start gap-3 font-light opacity-80"
                                            >
                                              <span className="mt-2 w-2 h-2 rounded-full bg-[#f4f1ea] flex-shrink-0" />
                                              <span className="text-base">
                                                {practice}
                                              </span>
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    </div>
                                  )}
                              </div>
                            </div>
                          </CollapsibleSection>
                        )}
                      </div>

                      {/* Footer Action */}
                      <div className="mt-16 pt-8 border-t border-[#f4f1ea]/20 flex flex-col md:flex-row gap-4 justify-center items-center">
                        <WaitlistButtonLarge
                          product={product}
                          journeySlug={chakra.slug}
                          clientType={clientType}
                          isAuthenticated={isAuthenticated}
                          authLoading={authLoading}
                          onAuthRequired={() => setShowAuthModal(true)}
                          addToWaitlist={addToWaitlist}
                          removeFromWaitlist={removeFromWaitlist}
                          useIsInWaitlist={useIsInWaitlist}
                        />
                      </div>

                      {/* Suggested Products (Other products in the same journey/type) */}
                      <div className="py-16 border-t border-[#f4f1ea]/20 mt-16">
                        <h2 className="text-2xl md:text-3xl font-cormorant font-light mb-8 text-center text-[#f4f1ea]">
                          Complete Your {chakra.name} Journey
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {currentProducts
                            .filter(
                              (p) =>
                                p.id !== product.id && p.name !== product.name,
                            )
                            .slice(0, 3)
                            .map((p, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  // Find index in the SAME list
                                  const idx = currentProducts.findIndex(
                                    (cp) => cp.name === p.name,
                                  );
                                  if (idx !== -1) setExpandedCard(idx);
                                }}
                                className="group block bg-[#f4f1ea]/5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-left"
                              >
                                <div className="aspect-[4/5] relative overflow-hidden bg-[#f4f1ea]/10">
                                  {/* Show product image if available */}
                                  {(p.images && p.images[0]) ||
                                  (p.variants && p.variants[0]?.image) ? (
                                    <img
                                      src={
                                        p.variants?.[0]?.image ||
                                        p.images?.[0] ||
                                        ""
                                      }
                                      alt={p.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <>
                                      <div
                                        className="absolute inset-0 opacity-20"
                                        style={{
                                          backgroundColor:
                                            chakra.colors.primary,
                                        }}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center text-[#f4f1ea]/20 font-cormorant text-4xl">
                                        {p.step}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="p-4">
                                  <h3 className="font-cormorant text-lg mb-1 group-hover:text-[#f4f1ea]/70 transition-colors text-[#f4f1ea]">
                                    {p.name}
                                  </h3>
                                  <p className="text-xs font-light opacity-60 line-clamp-2 text-[#f4f1ea]">
                                    {p.description}
                                  </p>
                                  <div className="mt-3 text-xs uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity text-[#f4f1ea]">
                                    View Product →
                                  </div>
                                </div>
                              </button>
                            ))}
                        </div>
                      </div>

                      {/* Suggested Combo */}
                      <div className="py-16 mt-8">
                        <div className="bg-[#f4f1ea] rounded-[24px] p-8 text-[#27190b] relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                            <div className="w-full h-full bg-gradient-to-l from-[#27190b] to-transparent" />
                          </div>

                          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div>
                              <span className="text-sm uppercase tracking-widest opacity-60 mb-4 block">
                                Curated for{" "}
                                {clientType === "energy-curious"
                                  ? "Deep Healing"
                                  : "Complete Care"}
                              </span>
                              <h2 className="text-3xl md:text-4xl font-cormorant font-light mb-6">
                                The {chakra.tone} Ritual Set
                              </h2>
                              <p className="font-light text-base opacity-80 mb-8 leading-relaxed">
                                Enhance your experience by combining the{" "}
                                {product.name} with our signature {chakra.name}{" "}
                                Journal and Meditation Oil. Designed to work in
                                harmony.
                              </p>

                              <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-4 bg-[#27190b]/5 rounded-xl border border-[#27190b]/10">
                                  <div className="w-12 h-12 bg-[#27190b]/10 rounded-lg flex-shrink-0" />
                                  <div>
                                    <div className="font-cormorant text-lg">
                                      {product.name}
                                    </div>
                                    <div className="text-xs opacity-60">
                                      Included
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
                                <button className="bg-[#27190b] text-[#f4f1ea] px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all transform hover:scale-105 w-full sm:w-auto">
                                  Add Bundle • ₹7,500
                                </button>
                                <span className="text-xs opacity-60">
                                  Save 15% when bought together
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            );
          })()}
      </AnimatePresence>
    </div>
  );
}

// Waitlist Button Component (for bottom section)
interface WaitlistButtonProps {
  product: JourneyProduct;
  journeySlug: string;
  clientType: "soul-luxury" | "energy-curious";
  isAuthenticated: boolean;
  authLoading: boolean;
  onAuthRequired: () => void;
  addToWaitlist: any;
  removeFromWaitlist: any;
  useIsInWaitlist: (
    journeySlug: string,
    productId: string,
    clientType: "soul-luxury" | "energy-curious",
  ) => boolean;
}

function WaitlistButton({
  product,
  journeySlug,
  clientType,
  isAuthenticated,
  authLoading,
  onAuthRequired,
  addToWaitlist,
  removeFromWaitlist,
  useIsInWaitlist,
}: WaitlistButtonProps) {
  const isInWaitlist = useIsInWaitlist(journeySlug, product.id, clientType);
  const isLoading = addToWaitlist.isPending || removeFromWaitlist.isPending;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to waitlist");
      onAuthRequired();
      return;
    }

    if (isInWaitlist) {
      removeFromWaitlist.mutate({
        journeySlug,
        productId: product.id,
        clientType,
      });
    } else {
      addToWaitlist.mutate({
        journeySlug,
        productId: product.id,
        productName: product.name,
        clientType,
      });
    }
  };

  if (authLoading) {
    return (
      <span className="max-w-md hidden md:block opacity-50">Loading...</span>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="max-w-md hidden md:block hover:opacity-70 transition-opacity disabled:opacity-50"
    >
      {isLoading
        ? "Processing..."
        : isInWaitlist
          ? "✓ In Waitlist"
          : "Add to Waitlist"}
    </button>
  );
}

// Waitlist Button Component (for detail modal)
function WaitlistButtonLarge({
  product,
  journeySlug,
  clientType,
  isAuthenticated,
  authLoading,
  onAuthRequired,
  addToWaitlist,
  removeFromWaitlist,
  useIsInWaitlist,
}: WaitlistButtonProps) {
  const isInWaitlist = useIsInWaitlist(journeySlug, product.id, clientType);
  const isLoading = addToWaitlist.isPending || removeFromWaitlist.isPending;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to waitlist");
      onAuthRequired();
      return;
    }

    if (isInWaitlist) {
      removeFromWaitlist.mutate({
        journeySlug,
        productId: product.id,
        clientType,
      });
    } else {
      addToWaitlist.mutate({
        journeySlug,
        productId: product.id,
        productName: product.name,
        clientType,
      });
    }
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

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-12 py-4 rounded-full text-sm uppercase tracking-widest transition-all transform hover:scale-105 disabled:opacity-50 ${
        isInWaitlist
          ? "bg-green-600 text-white hover:bg-green-700"
          : "bg-[#f4f1ea] text-[#27190b] hover:bg-opacity-90"
      }`}
    >
      {isLoading
        ? "Processing..."
        : isInWaitlist
          ? `✓ In Waitlist • ${product.price}`
          : `Add to Waitlist • ${product.price}`}
    </button>
  );
}
// Product Panel Component (extracted to handle local state for variants)
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

function JourneyProductPanel({
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
    <div className="panel w-screen h-screen aspect-[16/9] flex-shrink-0 relative">
      {/* Full Screen Background Image - Hidden when modal is open */}
      <div
        className="panel-image absolute  inset-0 overflow-hidden"
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
      </div>

      {/* Side Image Strip - Only visible when modal is closed */}
      {expandedCard === null && product.images && product.images.length > 1 && (
        <div
          className="side-image-strip absolute left-8 top-[30%] -translate-y-1/2 z-20 flex flex-col gap-4 max-h-[60vh] no-scrollbar py-4"
          onClick={(e) => e.stopPropagation()}
          style={{ opacity: 0, transform: "translateX(-20px)" }}
        >
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedSideImage(img);
              }}
              className={`w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 relative flex-shrink-0 bg-black/20 backdrop-blur-sm ${
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

      {/* Top Text */}
      <div className="absolute top-0 left-0 right-0 p-6 md:p-8">
        <h2
          className={`text-sm md:text-lg uppercase tracking-[0.2em] md:tracking-[0.3em] font-light text-white text-center md:text-left`}
        >
          <span className="max-w-sm block mx-auto md:mx-0">
            AAKAURA'S {chakra.tone.toUpperCase()} COLLECTION
          </span>
        </h2>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-10">
        <div className="max-w-[1400px] mx-auto px-0 md:px-10">
          <div
            className={`flex flex-col md:flex-row justify-between items-center text-lg md:text-xl font-cormorant uppercase tracking-[0.2em] text-white mb-4 gap-6 md:gap-0`}
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

"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ChakraData, JourneyProduct } from "@/data/chakras";
import { useRevealer } from "@/hooks/useRevealer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLenis } from "@/context/LenisContext";
import Link from "next/link";
import { useAuthStatus } from "@/hooks/useAuth";
import {
  useAddToWaitlist,
  useRemoveFromWaitlist,
  useIsInWaitlist,
} from "@/hooks/useWaitlist";
import { toast } from "react-hot-toast";
import { JourneyProductPanel } from "./JourneyProductPanel";

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CategoryJourneyTemplateProps {
  categoryName: string;
  items: { product: JourneyProduct; chakra: ChakraData }[];
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

// Waitlist Button Component
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
          ? `✓ In Waitlist`
          : `Add to Waitlist`}
    </button>
  );
}

export default function CategoryJourneyTemplate({
  categoryName,
  items,
}: CategoryJourneyTemplateProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [clientType, setClientType] = useState<ClientType>("soul-luxury"); // Default, though we might not use it for filtering here
  const [activeBgImage, setActiveBgImage] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState(false);

  const section3Ref = useRef<HTMLElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const { lenis } = useLenis();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();

  // Store the horizontal scroll tween to share between effects
  const horizontalScrollTweenRef = useRef<gsap.core.Tween | null>(null);

  // Waitlist hooks
  const addToWaitlist = useAddToWaitlist();
  const removeFromWaitlist = useRemoveFromWaitlist();

  useRevealer();

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
      horizontalScrollTweenRef.current = horizontalScroll;

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
      });
    });

    return () => ctx.revert();
  }, [items]);

  // Block body scroll when overlay is open
  useEffect(() => {
    if (expandedCard !== null) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [expandedCard, lenis]);

  // Function to sync background scroll position
  const scrollToProduct = (index: number) => {
    if (!lenis || index === null) return;

    const isDesktop = window.innerWidth >= 768;

    // Start lenis if it was stopped
    lenis.start();
    document.body.style.overflow = "";

    if (isDesktop && section3Ref.current) {
      const scrollTrigger = (horizontalScrollTweenRef.current as any)
        ?.scrollTrigger;

      if (scrollTrigger) {
        const start = scrollTrigger.start;
        const itemScrollWidth = window.innerWidth; // 100vw per item scroll
        const targetScroll = start + index * itemScrollWidth;

        lenis.scrollTo(targetScroll, { immediate: true });
      }
    } else if (horizontalContainerRef.current) {
      // Mobile: Scroll to the specific panel element
      const panels = horizontalContainerRef.current.children;
      const targetPanel = panels[index] as HTMLElement;
      if (targetPanel) {
        lenis.scrollTo(targetPanel, { immediate: true });
      }
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    if (expandedCard !== null) {
      scrollToProduct(expandedCard);
    }
    setExpandedCard(null);
  };

  return (
    <div className="min-h-screen bg-[#27190b]">
      {/* Revealer overlay for page entrance */}
      <div className="revealer fixed inset-0 bg-[#BD9958] z-50 origin-top pointer-events-none" />

      {/* Expanded Background Overlay */}
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
            expandedCard !== null && items[expandedCard]
              ? activeBgImage ||
                items[expandedCard].product.variants?.[0]?.image ||
                items[expandedCard].product.images?.[0] ||
                undefined
              : undefined
          }
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            expandedCard !== null ? "opacity-100" : "opacity-0"
          }`}
          style={{ objectPosition: "center center" }}
        />
        <div
          className="absolute inset-0 bg-[#27190b] bg-opacity-20"
          style={{
            background: `linear-gradient(to bottom, rgba(39,25,11,0.1) 0%, rgba(39,25,11,0.6) 100%)`,
          }}
        />
      </div>

      {/* Horizontal Scroll Section */}
      <section ref={section3Ref} className="relative h-screen overflow-hidden">
        <div ref={horizontalContainerRef} className="flex h-full w-max">
          {items.map(({ product, chakra }, index) => (
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
              currentProducts={items.map((i) => i.product)}
              isAuthenticated={isAuthenticated}
              authLoading={authLoading}
              onAuthRequired={() => setShowAuthModal(true)}
              setShowAuthModal={setShowAuthModal}
              addToWaitlist={addToWaitlist}
              removeFromWaitlist={removeFromWaitlist}
              useIsInWaitlist={useIsInWaitlist}
              tagLine={`Viewing All ${categoryName}s`}
            />
          ))}
        </div>
      </section>

      {/* Expanded Details Overlay */}
      <AnimatePresence>
        {expandedCard !== null &&
          items[expandedCard] &&
          (() => {
            const { product, chakra } = items[expandedCard];
            return (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleCloseModal}
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
                    onClick={handleCloseModal}
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

                      {/* Two Column Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                        {/* Left Column */}
                        <div className="space-y-8">
                          {/* Description */}
                          <motion.div
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
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                          {/* Specifications */}
                          <div className="text-[#f4f1ea]">
                            <>
                              <h3 className="text-base uppercase tracking-widest font-bold mb-6 opacity-60">
                                Specifications
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.specifications && (
                                  <>
                                    {Array.isArray(product.specifications)
                                      ? product.specifications.map(
                                          (spec, index) => {
                                            const fullWidthKeys = [
                                              "Product Name",
                                              "Material",
                                              "material",
                                              "Ideal For",
                                              "color",
                                              "Color",
                                              "Product Type",
                                            ];
                                            const isFullWidth =
                                              fullWidthKeys.includes(spec.key);
                                            return (
                                              <div
                                                key={`${spec.key}-${index}`}
                                                className={`border-b border-[#f4f1ea]/20 pb-4 mb-4 ${isFullWidth ? "md:col-span-2" : ""}`}
                                              >
                                                <div className="text-xs uppercase tracking-[0.2em] opacity-50 mb-2">
                                                  {spec.key}
                                                </div>
                                                <div className="font-cormorant text-xl md:text-2xl text-[#f4f1ea] leading-none">
                                                  {spec.value}
                                                </div>
                                              </div>
                                            );
                                          },
                                        )
                                      : Object.entries(product.specifications)
                                          .filter(([_, value]) => value)
                                          .map(([key, value]) => {
                                            const fullWidthKeys = [
                                              "Product Name",
                                              "Material",
                                              "material",
                                              "Ideal For",
                                              "color",
                                              "Color",
                                              "Product Type",
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
                                                  {value as string}
                                                </div>
                                              </div>
                                            );
                                          })}
                                  </>
                                )}
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
                            </>
                          </div>
                        </div>
                      </div>

                      {/* Collapsible Sections */}
                      <div className="space-y-4">
                        {/* Premium Detailing */}
                        {(product.symbolism ||
                          product.languageEngraving ||
                          product.designBreakdown) && (
                          <CollapsibleSection
                            title="Premium Detailing"
                            defaultOpen={false}
                            titleClassName="text-lg"
                          >
                            <div className="space-y-8 pt-6">
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
                                <div className="mb-6">
                                  <div className="text-sm uppercase tracking-wider opacity-50 mb-3">
                                    Language Engraving
                                  </div>
                                  <p className="font-light text-lg leading-relaxed opacity-90">
                                    {product.languageEngraving}
                                  </p>
                                </div>
                              )}
                              {product.designBreakdown && (
                                <div className="mt-8 border-t border-[#f4f1ea]/10 pt-6">
                                  {Array.isArray(product.designBreakdown) ? (
                                    <div className="space-y-6">
                                      {product.designBreakdown.map(
                                        (item, i) => (
                                          <div key={i}>
                                            <div className="text-sm uppercase tracking-wider opacity-50 mb-2">
                                              {item.title}
                                            </div>
                                            <p className="font-light text-lg leading-relaxed opacity-90">
                                              {item.description}
                                            </p>
                                          </div>
                                        ),
                                      )}
                                    </div>
                                  ) : (
                                    <FormattedContent
                                      content={product.designBreakdown}
                                    />
                                  )}
                                </div>
                              )}
                            </div>
                          </CollapsibleSection>
                        )}

                        {/* Additional Custom Section */}
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

                        {/* When to Use Accordion */}
                        {product.whenToUse && (
                          <CollapsibleSection
                            title={`When to Work with the ${chakra?.name || "Energy"}`}
                            defaultOpen={false}
                            titleClassName="text-lg"
                          >
                            <div className="pt-6 space-y-8">
                              {product.whenToUse.introduction && (
                                <p className="font-light text-base leading-relaxed opacity-90">
                                  {product.whenToUse.introduction}
                                </p>
                              )}

                              {product.whenToUse.whoShouldWork &&
                                product.whenToUse.whoShouldWork.length > 0 && (
                                  <div>
                                    <h4 className="text-sm uppercase tracking-widest font-bold mb-5 opacity-60">
                                      Who Should Work on This
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
                          journeySlug={chakra?.slug || "unknown"}
                          clientType={clientType}
                          isAuthenticated={isAuthenticated}
                          authLoading={authLoading}
                          onAuthRequired={() => setShowAuthModal(true)}
                          addToWaitlist={addToWaitlist}
                          removeFromWaitlist={removeFromWaitlist}
                          useIsInWaitlist={useIsInWaitlist}
                        />
                        {chakra && (
                          <Link
                            href={`/journey/${chakra.slug}`}
                            className="bg-transparent border border-[#f4f1ea] text-[#f4f1ea] px-12 py-4 rounded-full text-sm uppercase tracking-widest transition-all transform hover:bg-[#f4f1ea] hover:text-[#27190b] hover:scale-105"
                          >
                            View all {chakra.name}
                          </Link>
                        )}
                      </div>

                      {/* Suggested Products (Other products in the same category) */}
                      <div className="py-16 border-t border-[#f4f1ea]/20 mt-16">
                        <h2 className="text-2xl md:text-3xl font-cormorant font-light mb-8 text-center text-[#f4f1ea]">
                          Explore More {categoryName}s
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {items
                            .filter(
                              (item) =>
                                item.product.id !== product.id &&
                                item.product.name !== product.name,
                            )
                            .slice(0, 3)
                            .map((item, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  // Find index in the SAME list
                                  const idx = items.findIndex(
                                    (cp) =>
                                      cp.product.name === item.product.name,
                                  );
                                  if (idx !== -1) {
                                    setExpandedCard(null);
                                    setTimeout(() => {
                                      scrollToProduct(idx);
                                    }, 100);
                                  }
                                }}
                                className="group flex flex-col h-full bg-[#f4f1ea]/5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-left"
                              >
                                <div className="aspect-[4/5] relative overflow-hidden bg-[#f4f1ea]/10 flex-shrink-0">
                                  {/* Show product image if available */}
                                  {(item.product.images &&
                                    item.product.images[0]) ||
                                  (item.product.variants &&
                                    item.product.variants[0]?.image) ? (
                                    <img
                                      src={
                                        item.product.variants?.[0]?.image ||
                                        item.product.images?.[0] ||
                                        ""
                                      }
                                      alt={item.product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <>
                                      <div
                                        className="absolute inset-0 opacity-20"
                                        style={{
                                          backgroundColor:
                                            item.chakra?.colors?.primary ||
                                            "#b8860b",
                                        }}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center text-[#f4f1ea]/20 font-cormorant text-4xl">
                                        {item.product.step}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                  <h3 className="font-cormorant text-lg mb-1 group-hover:text-[#f4f1ea]/70 transition-colors text-[#f4f1ea]">
                                    {item.product.name}
                                  </h3>
                                  {item.product.description &&
                                    item.product.description.trim().length >
                                      1 && (
                                      <p className="text-xs font-light opacity-60 line-clamp-2 text-[#f4f1ea]">
                                        {item.product.description}
                                      </p>
                                    )}
                                  <div className="mt-auto pt-3 text-xs uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity text-[#f4f1ea]">
                                    View Product →
                                  </div>
                                </div>
                              </button>
                            ))}
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

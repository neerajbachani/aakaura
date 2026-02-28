"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ChakraData, JourneyProduct, chakrasData } from "@/data/chakras";
import { useRevealer } from "@/hooks/useRevealer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLenis } from "@/context/LenisContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

interface ChakraJourneyTemplateProps {
  chakra: ChakraData;
  relatedCombos?: React.ReactNode;
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
  relatedCombos,
}: ChakraJourneyTemplateProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [clientType, setClientType] = useState<ClientType>("soul-luxury");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeBgImage, setActiveBgImage] = useState<string>("");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();

  // When filtering changes, reset expanded card
  useEffect(() => {
    setExpandedCard(null);
  }, [activeCategory]);

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

  // Scroll to top on page load
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [lenis]);

  // Close overlay when client type changes
  useEffect(() => {
    setExpandedCard(null);
  }, [clientType]);

  // Derived products list for current view (Merged with static data for variants)
  const currentProducts = React.useMemo(() => {
    const propProducts = chakra.content[clientType] || [];
    const staticChakra = chakrasData[chakra.slug];
    const staticProducts = staticChakra?.content?.[clientType] || [];

    return propProducts
      .map((p, i) => {
        // Try to find matching static product by ID or index
        const staticP =
          staticProducts.find((sp) => sp.id === p.id) || staticProducts[i];

        // If prop doesn't have variants but static does, use static
        if (!p.variants && staticP?.variants) {
          return {
            ...p,
            variants: staticP.variants,
            category: p.category || staticP.category,
          };
        }
        return { ...p, category: p.category || staticP?.category };
      })
      .sort((a: any, b: any) => (a.step || 0) - (b.step || 0));
  }, [chakra, clientType]);

  // Extract unique categories
  const categories = React.useMemo(() => {
    const cats = new Set(
      currentProducts.map((p) => p.category).filter(Boolean),
    );
    return ["All", ...Array.from(cats)];
  }, [currentProducts]);

  // Filter products based on active category
  const filteredProducts = React.useMemo(() => {
    if (activeCategory === "All") return currentProducts;
    return currentProducts.filter((p) => p.category === activeCategory);
  }, [currentProducts, activeCategory]);

  // Handle URL hash or query param for initial scroll
  useEffect(() => {
    // Check for product ID in URL params (e.g. ?product=123)
    const params = new URLSearchParams(window.location.search);
    const productId = params.get("product");

    if (productId && filteredProducts.length > 0) {
      const index = filteredProducts.findIndex((p) => p.id === productId);
      if (index !== -1) {
        const autoOpen = params.get("autoOpen") !== "false";

        if (autoOpen && chakra.slug !== "combos") {
          setExpandedCard(index);
        }

        // Clean up URL so the user only sees /journey/[slug]
        if (window.history.replaceState) {
          const url = new URL(window.location.href);
          url.searchParams.delete("product");
          url.searchParams.delete("autoOpen");
          window.history.replaceState({}, "", url.pathname + url.search);
        }

        // Retry logic to ensure scrolling happens after layout & GSAP are ready
        let attempts = 0;
        const tryScroll = () => {
          const isMobile = window.innerWidth < 768;
          const st = (horizontalScrollTweenRef.current as any)?.scrollTrigger;

          if (isMobile || st) {
            if (st) ScrollTrigger.refresh(); // Ensure accurate position before scrolling
            scrollToProduct(index, true); // smooth scroll on initial load
          } else if (attempts < 10) {
            attempts++;
            setTimeout(tryScroll, 300);
          }
        };

        // Small initial delay to let React commit
        setTimeout(tryScroll, 300);
      }
    }
  }, [filteredProducts, chakra.slug]); // Re-run when products load

  // Store the horizontal scroll tween to share between effects
  const horizontalScrollTweenRef = useRef<gsap.core.Tween | null>(null);

  // 1. Structural Effect: Handles the ScrollTrigger pinning and horizontal movement
  // This ONLY re-runs when the product list changes, NOT when modals open/close.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {});

    mm.add("(min-width: 768px)", () => {
      const horizontalContainer = horizontalContainerRef.current;
      const section3 = section3Ref.current;

      if (!horizontalContainer || !section3) return;

      // Calculate scroll width
      const scrollWidth = horizontalContainer.scrollWidth;
      const viewportWidth = window.innerWidth;

      // Only animate if content overflows
      if (scrollWidth <= viewportWidth) return;

      // Create horizontal scroll animation and store in ref
      const horizontalScroll = gsap.to(horizontalContainer, {
        x: () => -(horizontalContainer.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: section3,
          pin: true,
          scrub: 1,
          end: () => `+=${horizontalContainer.scrollWidth - window.innerWidth}`,
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

    return () => {
      mm.revert();
      ctx.revert();
      horizontalScrollTweenRef.current = null;
    };
  }, [filteredProducts]);

  // 2. Content Animation Effect: Handles internal panel animations (Side Strips)
  // This re-runs when modal state changes to ensure side strips are properly targeted/animated
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {});

    mm.add("(min-width: 768px)", () => {
      // If the main scroll tween isn't ready, we can't link animations to it
      if (!horizontalScrollTweenRef.current) return;

      const horizontalScroll = horizontalScrollTweenRef.current;
      const panels = gsap.utils.toArray(".panel") as HTMLElement[];

      panels.forEach((panel: HTMLElement, index: number) => {
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

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [filteredProducts, expandedCard]);

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

  // Function to sync background scroll position
  const scrollToProduct = (index: number, smooth = false) => {
    if (!lenis || index === null) return;

    const isDesktop = window.innerWidth >= 768;

    // Start lenis if it was stopped
    lenis.start();
    document.body.style.overflow = "";

    if (isDesktop && section3Ref.current) {
      // Desktop: Scroll to the corresponding point in the horizontal scroll timeline
      // We assume the pin spacer/trigger starts where section3 starts.
      // safer to use the ScrollTrigger instance if possible, but calculating based on strict layout logic:
      // Start of pin + (index * viewpointHeight/Width equivalent)

      // Get the ScrollTrigger instance for this section if available
      const scrollTrigger = (horizontalScrollTweenRef.current as any)
        ?.scrollTrigger;

      if (scrollTrigger) {
        const start = scrollTrigger.start;
        const itemScrollWidth = window.innerWidth; // 100vw per item scroll
        const targetScroll = start + index * itemScrollWidth;

        lenis.scrollTo(targetScroll, {
          immediate: !smooth,
          duration: smooth ? 1.5 : undefined,
        });

        // Force ScrollTrigger to update immediately to avoid scrub lag
        // explicitly setting progress on the animation
        // scrollTrigger.animation?.progress(index / (filteredProducts.length - 1)); // This might conflict with scroll position
        // Best to just let lenis scroll. If immediate, it jumps.
      } else {
        // Fallback manual calc
        // Note: offsetTop might be unreliable if pinned.
      }
    } else if (horizontalContainerRef.current) {
      // Mobile: Scroll to the specific panel element
      const panels = horizontalContainerRef.current.children;
      const targetPanel = panels[index] as HTMLElement;
      if (targetPanel) {
        lenis.scrollTo(targetPanel, {
          immediate: !smooth,
          duration: smooth ? 1.5 : undefined,
          offset: -50,
        });
      }
    }
  };

  const handleCloseModal = () => {
    if (expandedCard !== null) {
      scrollToProduct(expandedCard, false);
    }
    setExpandedCard(null);
  };

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
            expandedCard !== null && filteredProducts[expandedCard]
              ? activeBgImage ||
                filteredProducts[expandedCard]?.variants?.[0]?.image ||
                filteredProducts[expandedCard]?.images?.[0] ||
                undefined
              : undefined
          }
          alt={
            expandedCard !== null && filteredProducts[expandedCard]
              ? filteredProducts[expandedCard]?.name
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
      {/* Mobile: Use min-h-screen and auto height to allow vertical scroll. Overflow visible. */}
      {/* Desktop: Still h-screen and overflow-hidden for pinned scroll. */}
      <section
        ref={section3Ref}
        className="relative min-h-screen h-auto md:h-screen overflow-visible md:overflow-hidden"
      >
        <div
          ref={horizontalContainerRef}
          className="flex flex-col md:flex-row h-auto md:h-full w-full md:w-max"
        >
          {filteredProducts.map((product, index) => (
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
              currentProducts={filteredProducts}
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
          filteredProducts[expandedCard] &&
          (() => {
            const product = filteredProducts[expandedCard];
            console.log("----------category", product?.category);
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

                      <div
                        className={`grid grid-cols-1 ${chakra.slug !== "combos" ? "lg:grid-cols-2" : ""} gap-8 mb-12  `}
                      >
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
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                          {/* Premium Detailing */}
                          {/* Image Gallery */}
                          <div className="text-[#f4f1ea]">
                            {chakra.slug !== "combos" && (
                              <>
                                <h3 className="text-base uppercase tracking-widest font-bold mb-6 opacity-60">
                                  Specifications
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {product.specifications && (
                                    <>
                                      {Array.isArray(product.specifications)
                                        ? // New Array Format - Preserves Order
                                          product.specifications.map(
                                            (spec, index) => {
                                              // Full-width keys for better layout
                                              const fullWidthKeys = [
                                                "Product Name",
                                                "Material",
                                                "material",
                                                "Ideal For",
                                                "finish",
                                                "Finish",
                                                "color",
                                                "Color",
                                                "Product Type",
                                              ];
                                              const isFullWidth =
                                                fullWidthKeys.includes(
                                                  spec.key,
                                                );
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
                                        : // Legacy Object Format - Fallback
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
                            )}
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

                        {/* Design Breakdown Accordion */}

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
                        {product.category && chakra.slug !== "combos" && (
                          <Link
                            href={`/shop/category/${product.category.toLowerCase().replace(/ /g, "-")}`}
                            className="bg-transparent border border-[#f4f1ea] text-[#f4f1ea] px-12 py-4 rounded-full text-sm uppercase tracking-widest transition-all transform hover:bg-[#f4f1ea] hover:text-[#27190b] hover:scale-105"
                          >
                            View all {product.category}s
                          </Link>
                        )}
                      </div>

                      {/* Suggested Products (Other products in the same journey/type) */}
                      <div className="py-16 border-t border-[#f4f1ea]/20 mt-16">
                        <h2
                          className={`text-2xl md:text-3xl font-cormorant font-light mb-8 text-center text-[#f4f1ea]  `}
                        >
                          Complete Your {chakra.name} Journey
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {product.includedProducts &&
                          product.includedProducts.length > 0
                            ? product.includedProducts.map((p, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    // Try to find if this included product exists in the current filtered list
                                    const idx = filteredProducts.findIndex(
                                      (cp) =>
                                        cp.id === p.id || cp.name === p.name,
                                    );
                                    if (idx !== -1) {
                                      setExpandedCard(null);
                                      setTimeout(() => {
                                        scrollToProduct(idx, false);
                                      }, 100);
                                    } else {
                                      // Fallback to URL navigation if not in current view
                                      router.push(p.url, { scroll: false });
                                    }
                                  }}
                                  className="group flex flex-col h-full bg-[#f4f1ea]/5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-left"
                                >
                                  <div className="aspect-[4/5] relative overflow-hidden bg-[#f4f1ea]/10 flex-shrink-0">
                                    {p.image ? (
                                      <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="absolute inset-0 flex items-center justify-center text-[#f4f1ea]/20 font-cormorant text-4xl">
                                        {i + 1}
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-4 flex flex-col flex-grow">
                                    <h3 className="font-cormorant text-lg mb-1 group-hover:text-[#f4f1ea]/70 transition-colors text-[#f4f1ea]">
                                      {p.name}
                                    </h3>
                                    {p.description &&
                                      p.description.trim().length > 1 && (
                                        <p className="text-xs font-light opacity-60 line-clamp-2 text-[#f4f1ea]">
                                          {p.description}
                                        </p>
                                      )}
                                    <div className="mt-auto pt-3 text-xs uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity text-[#f4f1ea]">
                                      View Product →
                                    </div>
                                  </div>
                                </button>
                              ))
                            : filteredProducts
                                .filter(
                                  (p) =>
                                    p.id !== product.id &&
                                    p.name !== product.name,
                                )
                                .slice(0, 3)
                                .map((p, i) => (
                                  <button
                                    key={i}
                                    onClick={() => {
                                      // Find index in the SAME list
                                      const idx = filteredProducts.findIndex(
                                        (cp) => cp.name === p.name,
                                      );
                                      if (idx !== -1) {
                                        setExpandedCard(null);
                                        // Small timeout to allow modal close animation to start/finish and layout to stabilize
                                        setTimeout(() => {
                                          scrollToProduct(idx, false);
                                        }, 100);
                                      }
                                    }}
                                    className="group flex flex-col h-full bg-[#f4f1ea]/5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-left"
                                  >
                                    <div className="aspect-[4/5] relative overflow-hidden bg-[#f4f1ea]/10 flex-shrink-0">
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
                                    <div className="p-4 flex flex-col flex-grow">
                                      <h3 className="font-cormorant text-lg mb-1 group-hover:text-[#f4f1ea]/70 transition-colors text-[#f4f1ea]">
                                        {p.name}
                                      </h3>
                                      {p.description &&
                                        p.description.trim().length > 1 && (
                                          <p className="text-xs font-light opacity-60 line-clamp-2 text-[#f4f1ea]">
                                            {p.description}
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

                      {/* Suggested Combo */}
                      {/* <div className="py-16 mt-8">
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
                      </div> */}
                    </div>
                  </div>
                </motion.div>
              </>
            );
          })()}
      </AnimatePresence>

      {/* Backlink Button */}
      <div className="w-full flex justify-center py-12 bg-[#27190b] relative z-10 border-t border-[#f4f1ea]/10">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-3 text-[#f4f1ea] uppercase tracking-[0.2em] text-sm hover:opacity-70 transition-opacity"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Related Combos Section */}
      {relatedCombos}
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
          ? `✓ In Waitlist`
          : `Add to Waitlist`}
    </button>
  );
}
// Product Panel Component (extracted to handle local state for variants)

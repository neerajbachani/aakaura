"use client";
import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { ChakraData, JourneyProduct } from "@/data/chakras";
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

  return (
    <div className="min-h-screen bg-[#27190b]">
      {/* Revealer overlay for page entrance */}
      <div className="revealer fixed inset-0 bg-[#BD9958] z-50 origin-top pointer-events-none" />

      {/* Header for Category */}
      <div className="fixed top-24 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="bg-[#27190b]/80 backdrop-blur-md px-6 py-2 rounded-full border border-[#f4f1ea]/20 text-[#f4f1ea] uppercase tracking-widest text-sm pointer-events-auto">
          Viewing All {categoryName}s
        </div>
      </div>

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
            />
          ))}
        </div>
      </section>

      {/* Expanded Details Overlay */}
      <AnimatePresence>
        {expandedCard !== null &&
          items[expandedCard] &&
          (() => {
            const { product } = items[expandedCard];
            return (
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 h-[85vh] z-[9999] rounded-t-[32px] overflow-hidden flex flex-col bg-[#27190b]"
                style={{ boxShadow: "0 -20px 40px rgba(0,0,0,0.5)" }}
              >
                <button
                  onClick={() => setExpandedCard(null)}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                  aria-label="Close"
                >
                  <XMarkIcon className="w-8 h-8 text-[#f4f1ea]" />
                </button>

                <div className="overflow-y-auto h-full p-8 md:p-16 custom-scrollbar">
                  <div className="max-w-5xl mx-auto text-[#f4f1ea]">
                    <h2 className="text-4xl md:text-6xl font-cormorant font-light mb-2">
                      {product.name}
                    </h2>
                    <p className="text-lg font-light tracking-wide opacity-80 mb-8">
                      {product.description}
                    </p>
                    {/* Add more details here if needed, keeping it simple for now */}
                  </div>
                </div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </div>
  );
}

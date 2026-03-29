import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface CartSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

const MODAL_CONTENT = {
  heading: "Happy Shopping with Aak! :)",
  intro: "Our prices are inclusive of:",
  items: [
    {
      emoji: "🧘",
      title: "Pranic-Aligned Blessing",
      body: "Each piece is blessed by trained Pranic Healers before dispatch. This is not a performative ritual, but a precise process intended to stabilize the object's energetic field, ensuring it carries clarity and coherence rather than emotional residue from the making process.",
    },
    {
      emoji: "🗂️",
      title: "The Aakaura Code Ritual Card",
      body: "A minimal ritual card designed to help you consciously initiate the piece into your space. It outlines how to place and observe the form - just as awareness practice. No dogma. No compulsion. Only presence.",
    },
    {
      emoji: "💗",
      title: "Care & Longevity Card",
      body: "A dedicated care card detailing how to maintain the physical integrity and energetic steadiness of your piece over time. This ensures the form ages with dignity and remains stable in both structure and purpose.",
    },
    {
      emoji: "📦",
      title: "Intentional Packaging",
      body: "Your piece is packed with care to preserve form, vibration, and finish during transit - not rushed, not automated, and never treated as inventory.",
    },
  ],
  whyTitle: "Why This Matters:",
  why: "Aakaura products are not mass-produced décor. They are crafted, aligned, initiated, and handed over with responsibility.\nWhat you receive is not just a product; it is a ready-to-live-with form, designed to integrate seamlessly into your space and rhythm.\nQuiet value. No noise. No exaggeration. The kind of quality you don't explain - you recognize.",
};

export default function CartSuccessModal({
  isOpen,
  onClose,
}: CartSuccessModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4"
          style={{ position: "fixed", inset: 0, zIndex: 99999 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <style
            dangerouslySetInnerHTML={{
              __html: `
            .custom-hide-scrollbar::-webkit-scrollbar {
              display: none !important;
            }
            .custom-hide-scrollbar {
              -ms-overflow-style: none !important;
              scrollbar-width: none !important;
            }
          `,
            }}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg md:max-w-3xl bg-[#27190b] border border-[#BD9958]/20 rounded-2xl shadow-2xl z-10 overflow-hidden"
          >
            {/* The single scrollable container */}
            <div
              className="w-full overflow-y-auto custom-hide-scrollbar"
              style={{
                maxHeight: "calc(100vh - 40px)",
                WebkitOverflowScrolling: "touch",
              }}
              data-lenis-prevent
            >
              {/* Header (Sticky) */}
              <div className="sticky top-0 z-20 bg-[#27190b] flex items-center justify-between p-6 border-b border-[#BD9958]/20">
                <h2 className="font-cormorant text-2xl md:text-3xl text-[#BD9958]">
                  {MODAL_CONTENT.heading}
                </h2>
                <button
                  onClick={onClose}
                  className="text-[#BD9958]/70 hover:text-[#BD9958] transition-colors p-1"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Body (Normal Flow) */}
              <div className="p-6 space-y-5 relative z-10">
                <p className="font-light text-base md:text-lg text-[#f4f1ea]/70 tracking-wide uppercase">
                  {MODAL_CONTENT.intro}
                </p>

                {MODAL_CONTENT.items.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <span className="text-xl mt-0.5 shrink-0">
                      {item.emoji}
                    </span>
                    <div>
                      <p className="font-semibold text-[#BD9958] text-base md:text-lg mb-1">
                        {item.title}
                      </p>
                      <p className="font-light text-sm md:text-base text-[#f4f1ea]/80 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-[#BD9958]/15">
                  <p className="font-semibold text-[#BD9958] text-base md:text-lg mb-2">
                    {MODAL_CONTENT.whyTitle}
                  </p>
                  {MODAL_CONTENT.why.split("\n").map((line, i) => (
                    <p
                      key={i}
                      className={`font-light text-sm md:text-base text-[#f4f1ea]/80 leading-relaxed ${i !== 0 ? "mt-2" : ""}`}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              {/* Footer (Sticky) */}
              <div className="sticky bottom-0 z-20 p-6 border-t border-[#BD9958]/20 bg-[#27190b] flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 rounded-full text-sm uppercase tracking-widest border border-[#BD9958]/50 text-[#BD9958] hover:bg-[#BD9958]/10 transition-colors w-full sm:w-auto text-center font-medium"
                >
                  Continue Shopping
                </button>
                <Link
                  href="/cart"
                  className="px-6 py-3 rounded-full text-sm uppercase tracking-widest bg-[#BD9958] text-[#27190B] hover:bg-[#A8874D] transition-colors w-full sm:w-auto text-center font-medium"
                >
                  Confirm Purchase
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

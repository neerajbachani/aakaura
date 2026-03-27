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

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Wall Hanging":
    "Aakaura Wall Hangings are sacred design pieces created to anchor intention into a space. Rooted in chakra philosophy and symbolic geometry, each piece represents a deeper quality - grounding, expansion, clarity, devotion, or transcendence. They are crafted not merely as décor, but as energetic focal points that influence the emotional tone of a room. Placed in a home, studio, or workspace, they act as subtle reminders of balance and alignment. The materials, colours, and forms are chosen with awareness, allowing the space to feel calmer, steadier, and more intentional. They do not demand attention - they shift presence quietly.",
  Muffler:
    "Aakaura Mufflers are woven in the Himalayas, where craft meets stillness. Designed in chakra-resonant colours, each piece carries both physical warmth and symbolic frequency. The softness protects the body, while the colour intention gently interacts with the energy field. Light yet enveloping, they are made for everyday wear without losing their depth of meaning. Whether wrapped loosely or layered close, they become more than winter accessories - they become a personal layer of comfort, grounding, and subtle alignment.",
  "Neck Warmer":
    "Aakaura Neck Warmers are designed to shield one of the body’s most sensitive energetic gateways - the throat space. This region governs expression, truth, and communication. By protecting it from harsh elements, the neck warmer supports both physical warmth and energetic clarity. Minimal in design and refined in construction, it offers comfort without bulk. It is everyday protection for those who value softness, strength, and conscious living. Functional, intentional, and quietly powerful.",
  Jewellery:
    "Aakaura Jewellery is created as wearable energy - adornments that sit close to the body with purpose. Each piece draws from chakra symbolism and sacred design, intended to influence specific energy points through placement, colour, and form. Whether resting near the heart, throat, or solar plexus, the jewellery is designed to harmonize with the body’s subtle field. Elegant yet meaningful, it is not simply decorative. It becomes a reminder of balance, self-awareness, and the unseen layers that shape our presence.",
  Bonsai:
    "Aarohma Ekam Bonsai\n‘Aarohma’ signifies ascension - the rising of one’s inner vibration.\n‘Ekam’ means oneness - the unbroken flow of universal energy.\nTogether, they capture the essence of this collection: the soul’s journey from root to crown, from grounding to awakening. Every Adenium bonsai in this collection is consciously nurtured and pranic-cleansed, designed to harmonize your environment and the frequencies within you. Each piece radiates a distinct chakra energy - Root, Sacral, Solar, Heart, Throat, Third Eye, or Crown - reminding you that your growth is not separate from the Earth’s rhythm. Adorned with aura-toned yarns, wooden bases, and minimal symbolic detailing, these bonsais are both meditative and modern - a dialogue between ancient energy wisdom and contemporary design. Place it in your workspace, altar, or living space, and let it serve as a quiet reminder of balance, patience, and presence.",
};

// Also support plural forms in the record
CATEGORY_DESCRIPTIONS["Wall Hangings"] = CATEGORY_DESCRIPTIONS["Wall Hanging"];
CATEGORY_DESCRIPTIONS["Mufflers"] = CATEGORY_DESCRIPTIONS["Muffler"];
CATEGORY_DESCRIPTIONS["Neck Warmers"] = CATEGORY_DESCRIPTIONS["Neck Warmer"];
CATEGORY_DESCRIPTIONS["Jewelery"] = CATEGORY_DESCRIPTIONS["Jewellery"];

export default function CartSuccessModal({
  isOpen,
  onClose,
  category,
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

  const getDescription = () => {
    if (!category) return "";

    // Attempt exact match first
    if (CATEGORY_DESCRIPTIONS[category]) return CATEGORY_DESCRIPTIONS[category];

    // Attempt case-insensitive match
    const match = Object.keys(CATEGORY_DESCRIPTIONS).find(
      (key) => key.toLowerCase() === category.toLowerCase(),
    );
    if (match) return CATEGORY_DESCRIPTIONS[match];

    // Try a partial match
    const partialMatch = Object.keys(CATEGORY_DESCRIPTIONS).find(
      (key) =>
        category.toLowerCase().includes(key.toLowerCase()) ||
        key.toLowerCase().includes(category.toLowerCase()),
    );
    return partialMatch
      ? CATEGORY_DESCRIPTIONS[partialMatch]
      : "Great choice! This item carries deep energetic intention and conscious craftsmanship.";
  };

  const description = getDescription();

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

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg md:max-w-3xl bg-[#27190b] border border-[#BD9958]/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
          >
            <div className="flex items-center justify-between p-6 border-b border-[#BD9958]/20">
              <h2 className="font-cormorant text-3xl text-[#BD9958]">
                Great Choice!
              </h2>
              <button
                onClick={onClose}
                className="text-[#BD9958]/70 hover:text-[#BD9958] transition-colors p-1"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {description.split("\n").map((paragraph, index) => (
                <p
                  key={index}
                  className={`font-light  text-lg md:text-xl text-[#f4f1ea]/90 leading-relaxed ${index !== 0 ? "mt-4" : ""}`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="p-6 border-t border-[#BD9958]/20 bg-[#27190b]/50 flex flex-col sm:flex-row gap-4 justify-end">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-full text-sm uppercase tracking-widest border border-[#BD9958]/50 text-[#BD9958] hover:bg-[#BD9958]/10 transition-colors w-full sm:w-auto text-center font-medium"
              >
                Keep Shopping
              </button>
              <Link
                href="/cart"
                className="px-6 py-3 rounded-full text-sm uppercase tracking-widest bg-[#BD9958] text-[#27190B] hover:bg-[#A8874D] transition-colors w-full sm:w-auto text-center font-medium"
              >
                View Cart
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

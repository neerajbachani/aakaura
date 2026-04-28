"use client";

import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const CHAKRAS_CONFIG = [
  {
    id: "root",
    name: "Root Chakra",
    nameSanskrit: "Muladhara",
    description: "Gift grounding, stability, and a deep connection to the Earth.",
    variants: [
      { id: "root-main", path: "/bouquet/root-main.webp", label: "Bloom I" },
      { id: "root-1", path: "/bouquet/root (1).webp", label: "Bloom II" },
      { id: "root-2", path: "/bouquet/root (2).webp", label: "Bloom III" },
    ],
  },
  {
    id: "sacral",
    name: "Sacral Chakra",
    nameSanskrit: "Svadhisthana",
    description: "Inspire creativity, passion, and emotional flow.",
    variants: [
      { id: "sacral-main", path: "/bouquet/sacral-main.webp", label: "Bloom I" },
      { id: "sacral-1", path: "/bouquet/sacral (1).webp", label: "Bloom II" },
      { id: "sacral-2", path: "/bouquet/sacral (2).webp", label: "Bloom III" },
    ],
  },
  {
    id: "solar-plexus",
    name: "Solar Plexus Chakra",
    nameSanskrit: "Manipura",
    description: "Send confidence, personal power, and radiant energy.",
    variants: [
      { id: "solar-plexus-main", path: "/bouquet/solar-main.webp", label: "Bloom I" },
      { id: "solar-plexus-1", path: "/bouquet/solar (3).webp", label: "Bloom II" },
      { id: "solar-plexus-2", path: "/bouquet/solar (4).webp", label: "Bloom III" },
    ],
  },
  {
    id: "heart",
    name: "Heart Chakra",
    nameSanskrit: "Anahata",
    description: "This is for someone you want to send pure love and compassion.",
    variants: [
      { id: "heart-main", path: "/bouquet/heart-main.webp", label: "Bloom I" },
      { id: "heart-1", path: "/bouquet/heart (1).webp", label: "Bloom II" },
      { id: "heart-2", path: "/bouquet/heart (2).webp", label: "Bloom III" },
    ],
  },
  {
    id: "throat",
    name: "Throat Chakra",
    nameSanskrit: "Vishuddha",
    description: "Encourage truth, clear communication, and authentic expression.",
    variants: [
      { id: "throat-main", path: "/bouquet/throat-main.webp", label: "Bloom I" },
      { id: "throat-1", path: "/bouquet/throat (6).webp", label: "Bloom II" },
      { id: "throat-2", path: "/bouquet/throat (7).webp", label: "Bloom III" },
    ],
  },
  {
    id: "third-eye",
    name: "Third Eye Chakra",
    nameSanskrit: "Ajna",
    description: "Gift intuition, insight, and deep inner wisdom.",
    variants: [
      { id: "third-eye-main", path: "/bouquet/thirdeye-main.webp", label: "Bloom I" },
      { id: "third-eye-1", path: "/bouquet/thirdeye (1).webp", label: "Bloom II" },
      { id: "third-eye-2", path: "/bouquet/thirdeye (2).webp", label: "Bloom III" },
    ],
  },
  {
    id: "crown",
    name: "Crown Chakra",
    nameSanskrit: "Sahasrara",
    description: "Share spiritual connection, divine light, and universal awareness.",
    variants: [
      { id: "crown-main", path: "/bouquet/crown-main.webp", label: "Bloom I" },
      { id: "crown-1", path: "/bouquet/crown (1).webp", label: "Bloom II" },
      { id: "crown-2", path: "/bouquet/crown (5).webp", label: "Bloom III" },
    ],
  },
];

type Flower = { id: string; uid: number };

export default function ChakraSelectionPage() {
  const params = useParams();
  const router = useRouter();
  const chakraId = params?.chakraId as string;
  const chakra = CHAKRAS_CONFIG.find((c) => c.id === chakraId);

  const [flowers, setFlowers] = useState<Flower[]>([]);
  const nextUid = useRef(0);

  if (!chakra) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex flex-col items-center justify-center">
        <h1 className="text-[#BD9958] font-cormorant text-4xl mb-4">
          Chakra not found
        </h1>
        <Link
          href="/bouquet"
          className="text-[#27190B]/60 hover:text-[#BD9958] font-cormorant tracking-widest uppercase text-sm transition-colors"
        >
          ← Back to Bouquet
        </Link>
      </div>
    );
  }

  const addFlower = (variantId: string) => {
    if (flowers.length >= 10) {
      toast.error("You can select up to 10 blooms maximum.");
      return;
    }
    setFlowers((prev) => [...prev, { id: variantId, uid: nextUid.current++ }]);
  };

  const removeLastOfVariant = (variantId: string) => {
    const reversed = [...flowers].reverse();
    const revIdx = reversed.findIndex((f) => f.id === variantId);
    if (revIdx === -1) return;
    const actualIdx = flowers.length - 1 - revIdx;
    setFlowers((prev) => prev.filter((_, i) => i !== actualIdx));
  };

  const removeFlowerByUid = (uid: number) => {
    setFlowers((prev) => prev.filter((f) => f.uid !== uid));
  };

  const getVariantCount = (variantId: string) =>
    flowers.filter((f) => f.id === variantId).length;

  const getVariantInfo = (flowerId: string) =>
    chakra.variants.find((v) => v.id === flowerId);

  const handleContinue = () => {
    if (flowers.length === 0) {
      toast.error("Please select at least one bloom.");
      return;
    }
    const selection = {
      chakraId: chakra.id,
      flowers,
      nextUid: nextUid.current,
    };
    sessionStorage.setItem("bouquet_selection", JSON.stringify(selection));
    router.push("/bouquet");
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#27190B] py-20 px-4 font-sans relative overflow-x-hidden">
      {/* Background glow */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#BD9958]/20 to-transparent blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Back */}
        <Link
          href="/bouquet"
          className="text-[#27190B]/50 hover:text-[#BD9958] uppercase text-xs tracking-widest font-cormorant mb-10 flex items-center transition-colors"
        >
          ← Back to Chakras
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#BD9958]/60 mb-3 font-light">
            {chakra.nameSanskrit}
          </p>
          <h1 className="text-5xl md:text-6xl text-[#BD9958] font-cormorant mb-4 tracking-widest">
            {chakra.name}
          </h1>
          <p className="text-[#27190B]/60 font-light tracking-wide max-w-md mx-auto text-sm">
            {chakra.description}
          </p>
        </div>

        {/* Count indicator */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 px-5 py-2 bg-white/70 border border-[#BD9958]/30 rounded-full text-sm font-cormorant tracking-widest text-[#27190B]/70 backdrop-blur-sm">
            <span
              className={`w-2 h-2 rounded-full ${flowers.length >= 10 ? "bg-red-400" : "bg-[#BD9958]"}`}
            />
            {flowers.length} / 10 blooms selected
          </span>
        </div>

        {/* Variant Picker */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mb-10">
          {chakra.variants.map((variant) => {
            const count = getVariantCount(variant.id);
            const isSelected = count > 0;
            return (
              <motion.div
                key={variant.id}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative flex flex-col items-center bg-white/60 backdrop-blur-sm border rounded-2xl p-4 md:p-6 transition-all ${
                  isSelected
                    ? "border-[#BD9958] shadow-[0_0_20px_rgba(189,153,88,0.25)]"
                    : "border-[#BD9958]/20 hover:border-[#BD9958]/50 shadow-sm"
                }`}
              >
                {/* Badge */}
                <AnimatePresence>
                  {count > 0 && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-3 right-3 bg-[#BD9958] text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow z-10"
                    >
                      {count}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Flower Image */}
                <div className="relative w-24 h-24 md:w-36 md:h-36 mb-4">
                  <Image
                    src={variant.path}
                    alt={variant.label}
                    fill
                    className={`object-contain drop-shadow-[0_0_12px_rgba(189,153,88,0.4)] transition-all ${isSelected ? "scale-105" : ""}`}
                  />
                </div>

                <p className="text-xs uppercase tracking-widest text-[#27190B]/50 font-cormorant mb-4">
                  {variant.label}
                </p>

                {/* +/- controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => removeLastOfVariant(variant.id)}
                    disabled={count === 0}
                    className="w-8 h-8 rounded-full border border-[#BD9958]/40 flex items-center justify-center text-[#BD9958] text-lg leading-none hover:bg-[#BD9958] hover:text-white hover:border-[#BD9958] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-5 text-center font-cormorant text-lg text-[#27190B] font-medium">
                    {count}
                  </span>
                  <button
                    onClick={() => addFlower(variant.id)}
                    disabled={flowers.length >= 10}
                    className="w-8 h-8 rounded-full border border-[#BD9958]/40 flex items-center justify-center text-[#BD9958] text-lg leading-none hover:bg-[#BD9958] hover:text-white hover:border-[#BD9958] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Strip */}
        <div className="bg-white/60 border border-[#BD9958]/30 p-6 rounded-xl mb-10 backdrop-blur-sm min-h-[96px] flex flex-col justify-center">
          <h3 className="text-[#BD9958] font-cormorant tracking-widest text-center mb-4 text-xs uppercase">
            Your Selection ({flowers.length} / 10)
          </h3>
          <AnimatePresence mode="popLayout">
            {flowers.length === 0 ? (
              <motion.p
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[#27190B]/40 italic font-light text-center w-full text-sm"
              >
                Tap a bloom above to add it to your bouquet.
              </motion.p>
            ) : (
              <motion.div className="flex flex-wrap justify-center gap-3">
                {flowers.map((flower) => {
                  const variantInfo = getVariantInfo(flower.id);
                  if (!variantInfo) return null;
                  return (
                    <motion.div
                      key={flower.uid}
                      layout
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="relative group cursor-pointer"
                      onClick={() => removeFlowerByUid(flower.uid)}
                    >
                      <div className="w-14 h-14 bg-white/80 rounded-full border border-[#BD9958]/20 flex items-center justify-center relative shadow-sm overflow-hidden">
                        <Image
                          src={variantInfo.path}
                          alt={variantInfo.label}
                          fill
                          className="object-contain p-1 group-hover:opacity-20 transition-opacity drop-shadow-[0_0_6px_rgba(189,153,88,0.3)]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-red-400 font-bold text-base">✕</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={flowers.length === 0}
            className="px-12 py-4 bg-[#BD9958] text-black font-cormorant uppercase tracking-widest text-lg hover:bg-[#FFD700] hover:shadow-[0_0_25px_rgba(189,153,88,0.5)] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#BD9958] disabled:hover:shadow-none border border-[#BD9958] hover:border-[#FFD700]"
          >
            Continue to Arrange →
          </button>
          <p className="text-[#27190B]/40 text-xs mt-3 font-light tracking-wide">
            {flowers.length === 0
              ? "Add at least one bloom to continue"
              : `${flowers.length} bloom${flowers.length !== 1 ? "s" : ""} ready to arrange`}
          </p>
        </div>
      </div>
    </div>
  );
}

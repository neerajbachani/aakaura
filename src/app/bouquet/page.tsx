"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";

// ─── Config ──────────────────────────────────────────────────────────────────

const CHAKRAS = [
  {
    id: "root",
    name: "Root Chakra",
    path: "/bouquet/root-main.webp",
    description: (
      <div className="space-y-1">
        <p className="font-semibold text-[#ef4444]">Root Chakra ❤️</p>
        <p>Unstable/ Broke-core/ Panicking/ Obsessed</p>
        <p className="italic opacity-70 px-1">(Send this before they buy another useless thing 😭)</p>
      </div>
    ),
    variants: [
      { id: "root-main", path: "/bouquet/root-main.webp", label: "Bloom I" },
      { id: "root-1", path: "/bouquet/root (1).webp", label: "Bloom II" },
      { id: "root-2", path: "/bouquet/root (2).webp", label: "Bloom III" },
    ],
  },
  {
    id: "sacral",
    name: "Sacral Chakra",
    path: "/bouquet/sacral-main.webp",
    description: (
      <div className="space-y-1">
        <p className="font-semibold text-[#f97316]">Sacral Chakra 🧡</p>
        <p>Dry/ Overavailable/ Down-bad</p>
        <p className="italic opacity-70 px-1">(Yeah… you know who this is for 💀)</p>
      </div>
    ),
    variants: [
      { id: "sacral-main", path: "/bouquet/sacral-main.webp", label: "Bloom I" },
      { id: "sacral-1", path: "/bouquet/sacral (1).webp", label: "Bloom II" },
      { id: "sacral-2", path: "/bouquet/sacral (2).webp", label: "Bloom III" },
    ],
  },
  {
    id: "solar-plexus",
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar-main.webp",
    description: (
      <div className="space-y-1">
        <p className="font-semibold text-[#eab308]">Solar Plexus Chakra 💛</p>
        <p>Delusional/ Insecure/ Procrastinating</p>
        <p className="italic opacity-70 px-1">(Potential exists…please use it bro 🥹)</p>
      </div>
    ),
    variants: [
      { id: "solar-plexus-main", path: "/bouquet/solar-main.webp", label: "Bloom I" },
      { id: "solar-plexus-1", path: "/bouquet/solar (3).webp", label: "Bloom II" },
      { id: "solar-plexus-2", path: "/bouquet/solar (4).webp", label: "Bloom III" },
    ],
  },
  {
    id: "heart",
    name: "Heart Chakra",
    path: "/bouquet/heart-main.webp",
    description: (
      <div className="space-y-1">
        <p className="font-semibold text-[#22c55e]">Heart Chakra 💚</p>
        <p>Cold/ Detached/ Triggered/ Guarded</p>
        <p className="italic opacity-70 px-1">(“I don’t care” ≠ healed btw 💀)</p>
      </div>
    ),
    variants: [
      { id: "heart-main", path: "/bouquet/heart-main.webp", label: "Bloom I" },
      { id: "heart-1", path: "/bouquet/heart (1).webp", label: "Bloom II" },
      { id: "heart-2", path: "/bouquet/heart (2).webp", label: "Bloom III" },
    ],
  },
  {
    id: "throat",
    name: "Throat Chakra",
    path: "/bouquet/throat-main.webp",
    description: (
      <div className="space-y-1">
        <p className="font-semibold text-[#06b6d4]">Throat Chakra 💙</p>
        <p>Shy/ Yapping/ Capping</p>
        <p className="italic opacity-70 px-1">(Learn to speak bro… not anything but the truth too.. 😭)</p>
      </div>
    ),
    variants: [
      { id: "throat-main", path: "/bouquet/throat-main.webp", label: "Bloom I" },
      { id: "throat-1", path: "/bouquet/throat (6).webp", label: "Bloom II" },
      { id: "throat-2", path: "/bouquet/throat (7).webp", label: "Bloom III" },
    ],
  },
  {
    id: "third-eye",
    name: "Third Eye Chakra",
    path: "/bouquet/thirdeye-main.webp",
    description: (
      <div className="space-y-1">
        <p className="font-semibold text-[#3b82f6]">Third Eye Chakra 💜</p>
        <p>Clueless/ Overthinking/ Lost</p>
        <p className="italic opacity-70 px-1">(Everything can be Googled, not understood 🥲)</p>
      </div>
    ),
    variants: [
      { id: "third-eye-main", path: "/bouquet/thirdeye-main.webp", label: "Bloom I" },
      { id: "third-eye-1", path: "/bouquet/thirdeye (1).webp", label: "Bloom II" },
      { id: "third-eye-2", path: "/bouquet/thirdeye (2).webp", label: "Bloom III" },
    ],
  },
  {
    id: "crown",
    name: "Crown Chakra",
    path: "/bouquet/crown-main.webp",
    description: (
      <div className="space-y-1">
        <p className="font-semibold text-[#9333ea]">Crown Chakra 🤍</p>
        <p>Spiralling/ Zoning-out/ Clueless</p>
        <p className="italic opacity-70 px-1">(Send this. They need it 💀)</p>
      </div>
    ),
    variants: [
      { id: "crown-main", path: "/bouquet/crown-main.webp", label: "Bloom I" },
      { id: "crown-1", path: "/bouquet/crown (1).webp", label: "Bloom II" },
      { id: "crown-2", path: "/bouquet/crown (5).webp", label: "Bloom III" },
    ],
  },
];

const CHAKRAS_MAP: Record<string, { name: string; path: string }> = {
  "root-main": { name: "Root Chakra", path: "/bouquet/root-main.webp" },
  "root-1": { name: "Root Chakra", path: "/bouquet/root (1).webp" },
  "root-2": { name: "Root Chakra", path: "/bouquet/root (2).webp" },
  "sacral-main": { name: "Sacral Chakra", path: "/bouquet/sacral-main.webp" },
  "sacral-1": { name: "Sacral Chakra", path: "/bouquet/sacral (1).webp" },
  "sacral-2": { name: "Sacral Chakra", path: "/bouquet/sacral (2).webp" },
  "solar-plexus-main": { name: "Solar Plexus Chakra", path: "/bouquet/solar-main.webp" },
  "solar-plexus-1": { name: "Solar Plexus Chakra", path: "/bouquet/solar (3).webp" },
  "solar-plexus-2": { name: "Solar Plexus Chakra", path: "/bouquet/solar (4).webp" },
  "heart-main": { name: "Heart Chakra", path: "/bouquet/heart-main.webp" },
  "heart-1": { name: "Heart Chakra", path: "/bouquet/heart (1).webp" },
  "heart-2": { name: "Heart Chakra", path: "/bouquet/heart (2).webp" },
  "throat-main": { name: "Throat Chakra", path: "/bouquet/throat-main.webp" },
  "throat-1": { name: "Throat Chakra", path: "/bouquet/throat (6).webp" },
  "throat-2": { name: "Throat Chakra", path: "/bouquet/throat (7).webp" },
  "third-eye-main": { name: "Third Eye Chakra", path: "/bouquet/thirdeye-main.webp" },
  "third-eye-1": { name: "Third Eye Chakra", path: "/bouquet/thirdeye (1).webp" },
  "third-eye-2": { name: "Third Eye Chakra", path: "/bouquet/thirdeye (2).webp" },
  "crown-main": { name: "Crown Chakra", path: "/bouquet/crown-main.webp" },
  "crown-1": { name: "Crown Chakra", path: "/bouquet/crown (1).webp" },
  "crown-2": { name: "Crown Chakra", path: "/bouquet/crown (5).webp" },
};

const BUSH_OPTIONS = [
  "/bouquet/bush-2.png",
  "/bouquet/bush-1.png",
  "/bouquet/bush-3.png",
  "/bouquet/bush-4.png",
];

// ─── Pyramid rows (for Step 1 layout) ────────────────────────────────────────

// Replaced PYRAMID_ROWS with direct layout inspired by BannerImage for dynamic pyramid widths

// ─── Types ────────────────────────────────────────────────────────────────────

type Flower = { id: string; uid: number };
type ChakraConfig = (typeof CHAKRAS)[0];

// ─── DraggableFlower ──────────────────────────────────────────────────────────
// Each flower is positioned absolutely at the container centre (top:50%, left:50%
// with a negative margin equal to half the element size). Framer's x/y motion
// values handle the drag offset from that origin.  This ensures dragConstraints
// bounding-box math is always correct and flowers never snap back unexpectedly.

// Explicit constraint object type for drag bounds
type DragBounds = { left: number; right: number; top: number; bottom: number };

function DraggableFlower({
  id,
  uid,
  path,
  name,
  index,
  total,
  dragBounds,
  onPositionChange,
}: {
  id: string;
  uid: number;
  path: string;
  name: string;
  index: number;
  total: number;
  dragBounds: DragBounds;
  onPositionChange: (uid: number, x: number, y: number) => void;
}) {
  // Spread flowers evenly in a circle so they don't stack at center
  const angle =
    total === 1 ? 0 : (index / total) * 2 * Math.PI - Math.PI / 2;
  const radius = total === 1 ? 0 : Math.min(90, 18 + total * 8);
  // Clamp initial spread to within the constraint bounds
  const initX = Math.max(
    dragBounds.left,
    Math.min(dragBounds.right, Math.round(Math.cos(angle) * radius)),
  );
  const initY = Math.max(
    dragBounds.top,
    Math.min(dragBounds.bottom, Math.round(Math.sin(angle) * radius)),
  );

  const x = useMotionValue(initX);
  const y = useMotionValue(initY);

  return (
    <motion.div
      data-id={`${id}-${index}`}
      className="draggable-flower absolute cursor-grab active:cursor-grabbing"
      style={{
        // Anchor the element's centre to the container's centre.
        // dragBounds are then the allowed displacement from that origin.
        top: "50%",
        left: "50%",
        width: 96,
        height: 96,
        marginTop: -48,
        marginLeft: -48,
        x,
        y,
        zIndex: 20,
        touchAction: "none",
      }}
      drag
      // Explicit bounds are always correct — no bounding-rect recalculation needed
      dragConstraints={dragBounds}
      dragMomentum={false}
      // dragElastic={0}: zero spring so the element never bounces past the wall
      dragElastic={0}
      whileDrag={{ scale: 1.12, zIndex: 30 }}
      onDragEnd={() => onPositionChange(uid, x.get(), y.get())}
    >
      <Image
        src={path}
        alt={name}
        fill
        className="object-contain drop-shadow-[0_0_15px_rgba(189,153,88,0.6)] pointer-events-none select-none hover:drop-shadow-[0_0_22px_rgba(189,153,88,0.9)] transition-all"
      />
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BouquetCreationPage() {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedChakraId, setSelectedChakraId] = useState<string | null>(null);
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [bouquetBase, setBouquetBase] = useState(BUSH_OPTIONS[1]);
  const [formData, setFormData] = useState({ to: "", message: "", from: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const nextUidRef = useRef(0);
  const flowerPositionsRef = useRef<Record<number, { x: number; y: number }>>({});
  // Explicit drag constraints computed from container dimensions
  const [dragBounds, setDragBounds] = useState<DragBounds>({
    left: -200,
    right: 200,
    top: -200,
    bottom: 200,
  });

  // Derive the full chakra config from the selected id
  const selectedChakraConfig = CHAKRAS.find((c) => c.id === selectedChakraId) ?? null;

  // ── Compute drag constraints whenever container size changes ────────────────
  useEffect(() => {
    if (step !== 2 || !containerRef.current) return;
    const el = containerRef.current;
    const compute = () => {
      const halfW = el.offsetWidth / 2;
      const halfH = el.offsetHeight / 2;
      const halfEl = 48; // half of element size (96 / 2)
      setDragBounds({
        left: -(halfW - halfEl),
        right: halfW - halfEl,
        top: -(halfH - halfEl),
        bottom: halfH - halfEl,
      });
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [step]);

  // ── Flower management ────────────────────────────────────────────────────────
  const addFlower = (variantId: string) => {
    if (flowers.length >= 10) {
      toast.error("You can select up to 10 blooms maximum.");
      return;
    }
    setFlowers((prev) => [
      ...prev,
      { id: variantId, uid: nextUidRef.current++ },
    ]);
  };

  const removeLastOfVariant = (variantId: string) => {
    const revIdx = [...flowers].reverse().findIndex((f) => f.id === variantId);
    if (revIdx === -1) return;
    const actualIdx = flowers.length - 1 - revIdx;
    const removed = flowers[actualIdx];
    delete flowerPositionsRef.current[removed.uid];
    setFlowers((prev) => prev.filter((_, i) => i !== actualIdx));
  };

  const removeFlowerByUid = (uid: number) => {
    delete flowerPositionsRef.current[uid];
    setFlowers((prev) => prev.filter((f) => f.uid !== uid));
  };

  const getVariantCount = (variantId: string) =>
    flowers.filter((f) => f.id === variantId).length;

  const handlePositionChange = (uid: number, x: number, y: number) => {
    flowerPositionsRef.current[uid] = { x, y };
  };

  // ── Navigation ──────────────────────────────────────────────────────────────
  const handleChakraClick = (id: string) => {
    // If clicking a different chakra, reset bloom selection
    if (id !== selectedChakraId) {
      setFlowers([]);
      flowerPositionsRef.current = {};
      nextUidRef.current = 0;
    }
    setSelectedChakraId(id);
    setStep(2);
  };

  const handleContinue = () => {
    if (flowers.length === 0) {
      toast.error("Please select at least one bloom.");
      return;
    }
    setStep(2);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setFlowers([]);
    setSelectedChakraId(null);
    flowerPositionsRef.current = {};
    nextUidRef.current = 0;
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (flowers.length === 0) {
      toast.error("Please add at least one bloom.");
      return;
    }
    if (!formData.to || !formData.message || !formData.from) {
      toast.error("Please fill out all the card details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const chakrasArray = flowers.map((f) => f.id);
      const flowerPositions: Record<string, { x: number; y: number }> = {};
      flowers.forEach((flower, idx) => {
        const pos = flowerPositionsRef.current[flower.uid] ?? { x: 0, y: 0 };
        flowerPositions[`${flower.id}-${idx}`] = pos;
      });

      const res = await fetch("/api/bouquet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chakras: chakrasArray,
          bouquetBase,
          flowerPositions,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create bouquet");

      toast.success("Bouquet created successfully!");
      router.push(`/bouquet/${data.bouquet.id}`);
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  // ── Shared styles ───────────────────────────────────────────────────────────
  const inputClasses =
    "w-full bg-transparent border-b border-[#BD9958]/50 focus:border-[#BD9958] focus:ring-0 py-3 px-1 text-[#27190B] font-light transition-colors placeholder-[#27190B]/30 outline-none";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-[#BD9958] font-cormorant mb-1";

  const getChakra = (id: string) => CHAKRAS.find((c) => c.id === id)!;

  const renderChakraItem = (chakraId: string) => {
    const chakra = getChakra(chakraId);
    const isActive = selectedChakraId === chakraId;
    return (
      <motion.button
        key={chakraId}
        onClick={() => handleChakraClick(chakraId)}
        whileHover={{ scale: 1.08, y: -6 }}
        whileTap={{ scale: 0.96 }}
        animate={isActive ? { scale: 1.1 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22 }}
        className="group relative flex flex-col items-center gap-2 md:gap-4 focus:outline-none"
      >
        {/* Active glow */}
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 scale-150 pointer-events-none ${
            isActive
              ? "bg-[#BD9958]/20"
              : "bg-[#BD9958]/0 group-hover:bg-[#BD9958]/10"
          }`}
        />

        {/* Flower */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36">
          <Image
            src={chakra.path}
            alt={chakra.name}
            fill
            priority
            className={`object-contain transition-all duration-500 ${
              isActive
                ? "drop-shadow-[0_0_22px_rgba(189,153,88,0.8)]"
                : "drop-shadow-[0_0_10px_rgba(189,153,88,0.25)] group-hover:drop-shadow-[0_0_20px_rgba(189,153,88,0.6)]"
            }`}
          />
        </div>

        {/* Name */}
        <span
          className={`text-[10px] sm:text-xs md:text-sm tracking-widest font-cormorant uppercase transition-colors whitespace-nowrap ${
            isActive
              ? "text-[#BD9958]"
              : "text-[#27190B]/50 group-hover:text-[#BD9958]"
          }`}
        >
          {chakra.name}
        </span>

        {/* Description tooltip (only when not active) */}
        {!isActive && (
          <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-56 sm:w-64 px-4 py-3 bg-[#FCF8F2] border border-[#BD9958]/30 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] text-xs text-center text-[#27190B]/90 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-30 font-light leading-relaxed hidden md:block">
            {chakra.description}
          </div>
        )}
      </motion.button>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#27190B] py-20 px-4 font-sans relative overflow-x-hidden">
      {/* Preload all variant images */}
      {CHAKRAS.flatMap((c) =>
        c.variants.map((v) => (
          <link key={v.id} rel="preload" as="image" href={v.path} />
        )),
      )}

      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#BD9958]/20 to-transparent blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Page header */}
        <div className="text-center mb-16 px-4">
          <h1 className="text-5xl md:text-6xl text-[#BD9958] font-cormorant mb-4 tracking-widest">
            Aakaura Bouquet
          </h1>
          <p className="text-[#27190B]/60 tracking-wider font-light">
            GIFT DIGITAL SERENITY AND BEAUTY
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 1 — Choose a chakra
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-center text-sm tracking-[0.25em] uppercase font-cormorant text-[#27190B]/70 mb-12">
              Choose a Chakra to Begin
            </h2>

            {/* ── Pyramid ─────────────────────────────────────────────────── */}
            <div className="flex flex-col items-center gap-6 md:gap-8 mb-16 w-full max-w-[340px] sm:max-w-lg md:max-w-3xl lg:max-w-5xl mx-auto relative z-10 px-2 lg:px-0">
              {/* Row 1: Center - Crown */}
              <div className="flex justify-center w-full">
                {renderChakraItem("crown")}
              </div>

              {/* Row 2: Upper - Third Eye, Throat */}
              <div className="flex justify-between w-[75%] md:w-[60%]">
                {renderChakraItem("third-eye")}
                {renderChakraItem("throat")}
              </div>

              {/* Row 3: Middle - Heart, Solar Plexus */}
              <div className="flex justify-between w-[92%] md:w-[80%]">
                {renderChakraItem("heart")}
                {renderChakraItem("solar-plexus")}
              </div>

              {/* Row 4: Lower - Sacral, Root */}
              <div className="flex justify-between w-full">
                {renderChakraItem("sacral")}
                {renderChakraItem("root")}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            STEP 2 — Arrange & write card
        ══════════════════════════════════════════════════════════════════════ */}
        {step === 2 && selectedChakraConfig && (
          <div className="animate-fadeIn max-w-[1400px] mx-auto xl:px-8">
            <button
              onClick={handleBackToStep1}
              className="text-[#27190B]/50 hover:text-[#BD9958] uppercase text-xs tracking-widest font-cormorant mb-8 flex items-center transition-colors px-4 xl:px-0"
            >
              ← Choose a Different Chakra
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* ── LEFT COLUMN: Canvas Section ────────────────────────────── */}
              <div className="flex flex-col order-1 px-4 xl:px-0">
                <div className="bg-white/60 backdrop-blur-sm border border-[#BD9958]/20 p-6 md:p-8 shadow-xl rounded-sm">

                  {/* 1. Bloom Picker */}
                  <h3 className="text-center text-sm tracking-widest uppercase font-cormorant text-[#BD9958] mb-5">
                    1. Add or Remove Blooms
                  </h3>
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-xs text-[#27190B]/40 font-light tracking-wide">
                      {selectedChakraConfig.name}
                    </span>
                    <span
                      className={`text-xs font-cormorant tracking-widest ${
                        flowers.length >= 10
                          ? "text-red-400"
                          : "text-[#BD9958]/60"
                      }`}
                    >
                      ({flowers.length} / 10)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {selectedChakraConfig.variants.map((variant) => {
                      const count = getVariantCount(variant.id);
                      return (
                        <div
                          key={variant.id}
                          className={`relative flex flex-col items-center rounded-xl border p-3 transition-all ${
                            count > 0
                              ? "border-[#BD9958] bg-[#BD9958]/5"
                              : "border-[#BD9958]/20 bg-white/40 hover:border-[#BD9958]/40"
                          }`}
                        >
                          {/* Badge */}
                          <AnimatePresence>
                            {count > 0 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute top-2 right-2 bg-[#BD9958] text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow"
                              >
                                {count}
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className="relative w-14 h-14 mb-2">
                            <Image
                              src={variant.path}
                              alt={variant.label}
                              fill
                              className="object-contain drop-shadow-[0_0_8px_rgba(189,153,88,0.35)]"
                            />
                          </div>
                          <p className="text-[10px] uppercase tracking-widest text-[#27190B]/40 font-cormorant mb-2">
                            {variant.label}
                          </p>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => removeLastOfVariant(variant.id)}
                              disabled={count === 0}
                              className="w-6 h-6 rounded-full border border-[#BD9958]/40 flex items-center justify-center text-[#BD9958] text-sm leading-none hover:bg-[#BD9958] hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                              −
                            </button>
                            <span className="w-4 text-center font-cormorant text-sm text-[#27190B]">
                              {count}
                            </span>
                            <button
                              onClick={() => addFlower(variant.id)}
                              disabled={flowers.length >= 10}
                              className="w-6 h-6 rounded-full border border-[#BD9958]/40 flex items-center justify-center text-[#BD9958] text-sm leading-none hover:bg-[#BD9958] hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Flower strip */}
                  {flowers.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6 min-h-[48px]">
                      <AnimatePresence mode="popLayout">
                        {flowers.map((flower) => {
                          const v = selectedChakraConfig.variants.find((vr) => vr.id === flower.id);
                          if (!v) return null;
                          return (
                            <motion.div
                              key={flower.uid}
                              layout
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 25,
                              }}
                              className="relative group cursor-pointer"
                              onClick={() => removeFlowerByUid(flower.uid)}
                              title="Click to remove"
                            >
                              <div className="w-10 h-10 bg-white/80 rounded-full border border-[#BD9958]/20 relative shadow-sm overflow-hidden">
                                <Image
                                  src={v.path}
                                  alt={v.label}
                                  fill
                                  className="object-contain p-0.5 group-hover:opacity-20 transition-opacity"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <span className="text-red-400 font-bold text-xs">
                                    ✕
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}

                  <div className="border-t border-[#BD9958]/20 my-6" />

                  {/* 2. Bush Selector */}
                  <h3 className="text-center text-sm tracking-widest uppercase font-cormorant text-[#BD9958] mb-5">
                    2. Select a Background
                  </h3>
                  <div className="flex justify-center gap-4 mb-8">
                    {BUSH_OPTIONS.map((path, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setBouquetBase(path)}
                        className={`relative w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          bouquetBase === path
                            ? "border-[#BD9958] scale-110 shadow-[0_0_15px_rgba(189,153,88,0.5)]"
                            : "border-transparent hover:border-[#BD9958]/50"
                        }`}
                      >
                        <Image
                          src={path}
                          alt={`Bouquet background ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-[#BD9958]/20 my-6" />

                  {/* 3. Drag Canvas */}
                  <h3 className="text-center text-sm tracking-widest uppercase font-cormorant text-[#BD9958] mb-3">
                    3. Arrange Your Blooms
                  </h3>
                  <p className="text-center text-[#27190B]/50 text-xs font-light italic mb-5">
                    Drag the blooms to arrange them gracefully on your bouquet.
                  </p>

                  <div
                    ref={containerRef}
                    className="relative w-full h-[60vh] lg:h-[70vh] mx-auto rounded-lg overflow-hidden border border-[#BD9958]/30 shadow-inner bg-[#27190B]/5"
                  >
                    {/* Base bush */}
                    <Image
                      src={bouquetBase}
                      alt="Bouquet Base"
                      fill
                      priority
                      className="object-cover pointer-events-none opacity-90"
                    />

                    {/* Draggable flowers */}
                    <div className="absolute inset-0 z-10">
                      <AnimatePresence>
                        {flowers.map((flower, idx) => {
                          const mapped = CHAKRAS_MAP[flower.id];
                          if (!mapped) return null;
                          return (
                            <DraggableFlower
                              key={flower.uid}
                              id={flower.id}
                              uid={flower.uid}
                              path={mapped.path}
                              name={mapped.name}
                              index={idx}
                              total={flowers.length}
                              dragBounds={dragBounds}
                              onPositionChange={handlePositionChange}
                            />
                          );
                        })}
                      </AnimatePresence>
                    </div>

                    {/* Bush overlay */}
                    <Image
                      src="/bouquet/bush-1-top.png"
                      alt="Bouquet Overlay"
                      fill
                      priority
                      className="object-cover pointer-events-none z-30"
                    />
                  </div>
                </div>
              </div>

              {/* ── RIGHT COLUMN: Card form ─────────────────────────────────── */}
              <div className="flex flex-col order-2 px-4 xl:px-0 lg:sticky lg:top-8">
                <h2 className="text-center lg:text-left text-2xl md:text-3xl tracking-widest uppercase font-cormorant text-[#27190B] mb-8">
                  WRITE THE CARD
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="bg-[#fcf8f2] backdrop-blur-md border border-[#BD9958]/40 p-8 md:p-12 shadow-[0_15px_40px_rgba(189,153,88,0.15)] relative rounded-sm flex-1 flex flex-col"
                >
                  {/* Aesthetic accents */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#BD9958]/30 via-transparent to-transparent border-t border-r border-[#BD9958]/40" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#BD9958]/30 via-transparent to-transparent border-b border-l border-[#BD9958]/40" />
                  <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#BD9958]/20 pointer-events-none" />

                  <div className="space-y-8 flex-1 relative z-10">
                    <div>
                      <label className={labelClasses}>To</label>
                      <input
                        required
                        type="text"
                        value={formData.to}
                        onChange={(e) =>
                          setFormData({ ...formData, to: e.target.value })
                        }
                        className={inputClasses}
                        placeholder="Dear Beloved"
                      />
                    </div>

                    <div className="flex-1 flex flex-col min-h-[250px]">
                      <label className={labelClasses}>Message</label>
                      <textarea
                        required
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        className={`${inputClasses} bg-transparent resize-none flex-1 font-cormorant text-xl tracking-wide leading-relaxed py-4`}
                        placeholder="I have so much to tell you..."
                      />
                    </div>

                    <div>
                      <label className={labelClasses}>From</label>
                      <input
                        required
                        type="text"
                        value={formData.from}
                        onChange={(e) =>
                          setFormData({ ...formData, from: e.target.value })
                        }
                        className={inputClasses}
                        placeholder="Sincerely, Secret Admirer"
                      />
                    </div>
                  </div>

                  <div className="mt-12 text-center lg:text-right relative z-10">
                    <button
                      type="submit"
                      disabled={isSubmitting || flowers.length === 0}
                      className="px-12 py-4 bg-[#BD9958] text-black font-cormorant uppercase tracking-widest text-lg hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(189,153,88,0.5)] transition-all disabled:opacity-50 inline-block w-full md:w-auto border border-[#BD9958] hover:border-[#FFD700]"
                    >
                      {isSubmitting ? "Creating..." : "Finalize & Share"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

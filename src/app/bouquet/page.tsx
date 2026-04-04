"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const CHAKRAS = [
  {
    id: "root",
    name: "Root Chakra",
    path: "/bouquet/root-main.webp",
    hasVariants: true,
    variants: ["/bouquet/root (1).webp", "/bouquet/root (2).webp"],
  },
  {
    id: "sacral",
    name: "Sacral Chakra",
    path: "/bouquet/sacral-main.webp",
    hasVariants: true,
    variants: ["/bouquet/sacral (1).webp", "/bouquet/sacral (2).webp"],
  },
  {
    id: "solar-plexus",
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar-main.webp",
    hasVariants: true,
    variants: ["/bouquet/solar (3).webp", "/bouquet/solar (4).webp"],
  },
  {
    id: "heart",
    name: "Heart Chakra",
    path: "/bouquet/heart-main.webp",
    hasVariants: true,
    variants: ["/bouquet/heart (1).webp", "/bouquet/heart (2).webp"],
  },
  {
    id: "throat",
    name: "Throat Chakra",
    path: "/bouquet/throat-main.webp",
    hasVariants: true,
    variants: ["/bouquet/throat (6).webp", "/bouquet/throat (7).webp"],
  },
  {
    id: "third-eye",
    name: "Third Eye Chakra",
    path: "/bouquet/thirdeye-main.webp",
    hasVariants: true,
    variants: ["/bouquet/thirdeye (1).webp", "/bouquet/thirdeye (2).webp"],
  },
  {
    id: "crown",
    name: "Crown Chakra",
    path: "/bouquet/crown-main.webp",
    hasVariants: true,
    variants: ["/bouquet/crown (1).webp", "/bouquet/crown (5).webp"],
  },
];

const CHAKRAS_MAP: Record<string, { name: string; path: string }> = {
  "root-main": { name: "Root Chakra", path: "/bouquet/root-main.webp" },
  "root-1": { name: "Root Chakra", path: "/bouquet/root (1).webp" },
  "root-2": { name: "Root Chakra", path: "/bouquet/root (2).webp" },
  "sacral-main": { name: "Sacral Chakra", path: "/bouquet/sacral-main.webp" },
  "sacral-1": { name: "Sacral Chakra", path: "/bouquet/sacral (1).webp" },
  "sacral-2": { name: "Sacral Chakra", path: "/bouquet/sacral (2).webp" },
  "solar-plexus-main": {
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar-main.webp",
  },
  "solar-plexus-1": {
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar (3).webp",
  },
  "solar-plexus-2": {
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar (4).webp",
  },
  "heart-main": { name: "Heart Chakra", path: "/bouquet/heart-main.webp" },
  "heart-1": { name: "Heart Chakra", path: "/bouquet/heart (1).webp" },
  "heart-2": { name: "Heart Chakra", path: "/bouquet/heart (2).webp" },
  "throat-main": { name: "Throat Chakra", path: "/bouquet/throat-main.webp" },
  "throat-1": { name: "Throat Chakra", path: "/bouquet/throat (6).webp" },
  "throat-2": { name: "Throat Chakra", path: "/bouquet/throat (7).webp" },
  "third-eye-main": {
    name: "Third Eye Chakra",
    path: "/bouquet/thirdeye-main.webp",
  },
  "third-eye-1": {
    name: "Third Eye Chakra",
    path: "/bouquet/thirdeye (1).webp",
  },
  "third-eye-2": {
    name: "Third Eye Chakra",
    path: "/bouquet/thirdeye (2).webp",
  },
  "crown-main": { name: "Crown Chakra", path: "/bouquet/crown-main.webp" },
  "crown-1": { name: "Crown Chakra", path: "/bouquet/crown (1).webp" },
  "crown-2": { name: "Crown Chakra", path: "/bouquet/crown (5).webp" },
};

const pyramidRows = [
  ["crown"],
  ["third-eye", "throat"],
  ["heart", "solar-plexus"],
  ["sacral", "root"],
];

function ExpandableFlower({
  chakra,
  isExpanded,
  onToggleExpand,
  onAddFlower,
}: {
  chakra: (typeof CHAKRAS)[0];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onAddFlower: (id: string) => void;
}) {
  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (chakra.hasVariants) {
      if (isExpanded) {
        onAddFlower(`${chakra.id}-main`);
      } else {
        onToggleExpand();
      }
    } else {
      onAddFlower(chakra.id);
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-center items-center w-40 h-40 md:w-56 md:h-56 ${isExpanded ? "z-50" : "z-10"}`}
    >
      <button
        onClick={handleMainClick}
        className="absolute z-10 w-32 h-32 md:w-44 md:h-44 transition-transform transform hover:scale-110 active:scale-95"
      >
        <Image
          src={chakra.path}
          alt={chakra.name}
          fill
          priority
          className={`object-contain drop-shadow-[0_0_10px_rgba(189,153,88,0.3)] ${!chakra.hasVariants ? "opacity-90 hover:opacity-100" : ""}`}
        />
      </button>

      <span className="absolute -bottom-8 text-xs text-[#27190B]/60 font-cormorant tracking-widest whitespace-nowrap">
        {chakra.name}
      </span>

      <AnimatePresence>
        {chakra.hasVariants && isExpanded && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {chakra.variants?.map((path, idx) => {
              // idx 0 -> left (-120px)
              // idx 1 -> right (120px)
              // We use responsive distances relative to screen size or simply fixed distances
              const xDesktop = idx === 0 ? -160 : 160;
              const xMobile = idx === 0 ? -120 : 120;
              // Slightly move them up
              const y = -20;

              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x:
                      typeof window !== "undefined" && window.innerWidth < 768
                        ? xMobile
                        : xDesktop,
                    y,
                  }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFlower(`${chakra.id}-${idx + 1}`);
                  }}
                  className="absolute top-1/2 left-1/2 -mt-12 -ml-12 md:-mt-16 md:-ml-16 w-24 h-24 md:w-32 md:h-32 pointer-events-auto transition-transform transform hover:scale-110 active:scale-95"
                >
                  <Image
                    src={path}
                    alt={`${chakra.name} variant ${idx + 1}`}
                    fill
                    className="object-contain drop-shadow-[0_0_15px_rgba(189,153,88,0.5)]"
                  />
                </motion.button>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BouquetCreationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedChakras, setSelectedChakras] = useState<string[]>([]);
  const [formData, setFormData] = useState({ to: "", message: "", from: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedChakra, setExpandedChakra] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedChakra((prev) => (prev === id ? null : id));
  };

  const handleAddFlower = (id: string) => {
    if (selectedChakras.length >= 10) {
      toast.error("You can select up to 10 blooms maximum.");
      return;
    }
    setSelectedChakras([...selectedChakras, id]);
  };

  const handleRemoveChakra = (indexToRemove: number) => {
    setSelectedChakras(
      selectedChakras.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleNextStep = () => {
    if (selectedChakras.length < 6) {
      toast.error("Please pick at least 6 blooms.");
      return;
    }
    setStep(2);
    setExpandedChakra(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedChakras.length < 6 || selectedChakras.length > 10) {
      toast.error("You must select between 6 and 10 blooms.");
      return;
    }
    if (!formData.to || !formData.message || !formData.from) {
      toast.error("Please fill out all the card details.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bouquet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chakras: selectedChakras,
          ...formData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create bouquet");

      toast.success("Bouquet created successfully!");
      router.push(`/bouquet/${data.bouquet.id}`);
    } catch (error: any) {
      toast.error(error.message);
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full bg-transparent border-b border-[#BD9958]/50 focus:border-[#BD9958] focus:ring-0 py-3 px-1 text-[#27190B] font-light transition-colors placeholder-[#27190B]/30 outline-none";
  const labelClasses =
    "block text-xs uppercase tracking-widest text-[#BD9958] font-cormorant mb-1";

  const getChakra = (id: string) => CHAKRAS.find((c) => c.id === id)!;

  return (
    <div
      className="min-h-screen bg-[#FDFBF7] text-[#27190B] py-20 px-4 font-sans relative overflow-x-hidden"
      onClick={() => setExpandedChakra(null)}
    >
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#BD9958]/20 to-transparent blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16 px-4">
          <h1 className="text-5xl md:text-6xl text-[#BD9958] font-cormorant mb-4 tracking-widest">
            Aakaura Bouquet
          </h1>
          <p className="text-[#27190B]/60 tracking-wider font-light">
            GIFT DIGITAL SERENITY AND BEAUTY
          </p>
        </div>

        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-center text-xl tracking-widest uppercase font-cormorant text-[#27190B] mb-10">
              PICK 6 TO 10 BLOOMS
            </h2>

            <div className="flex flex-col items-center gap-2 md:gap-4 mb-24 w-full  relative z-20 mx-auto">
              {/* Crown Row */}
              <div
                className={`flex justify-center w-full relative ${"crown" === expandedChakra ? "z-50" : "z-10"}`}
              >
                <ExpandableFlower
                  chakra={getChakra("crown")}
                  isExpanded={expandedChakra === "crown"}
                  onToggleExpand={() => handleToggleExpand("crown")}
                  onAddFlower={handleAddFlower}
                />
              </div>

              {/* Upper Row */}
              <div
                className={`flex justify-between w-full max-w-xl relative mx-auto ${["third-eye", "throat"].includes(expandedChakra as string) ? "z-50" : "z-10"}`}
              >
                <ExpandableFlower
                  chakra={getChakra("third-eye")}
                  isExpanded={expandedChakra === "third-eye"}
                  onToggleExpand={() => handleToggleExpand("third-eye")}
                  onAddFlower={handleAddFlower}
                />
                <ExpandableFlower
                  chakra={getChakra("throat")}
                  isExpanded={expandedChakra === "throat"}
                  onToggleExpand={() => handleToggleExpand("throat")}
                  onAddFlower={handleAddFlower}
                />
              </div>

              {/* Middle Row */}
              <div
                className={`flex justify-between w-full max-w-4xl relative mx-auto ${["heart", "solar-plexus"].includes(expandedChakra as string) ? "z-50" : "z-10"}`}
              >
                <ExpandableFlower
                  chakra={getChakra("heart")}
                  isExpanded={expandedChakra === "heart"}
                  onToggleExpand={() => handleToggleExpand("heart")}
                  onAddFlower={handleAddFlower}
                />
                <ExpandableFlower
                  chakra={getChakra("solar-plexus")}
                  isExpanded={expandedChakra === "solar-plexus"}
                  onToggleExpand={() => handleToggleExpand("solar-plexus")}
                  onAddFlower={handleAddFlower}
                />
              </div>

              {/* Lower Row */}
              <div
                className={`flex justify-between items-end w-full max-w-xl  relative mx-auto ${["sacral", "root"].includes(expandedChakra as string) ? "z-50" : "z-10"}`}
              >
                <ExpandableFlower
                  chakra={getChakra("sacral")}
                  isExpanded={expandedChakra === "sacral"}
                  onToggleExpand={() => handleToggleExpand("sacral")}
                  onAddFlower={handleAddFlower}
                />
                <ExpandableFlower
                  chakra={getChakra("root")}
                  isExpanded={expandedChakra === "root"}
                  onToggleExpand={() => handleToggleExpand("root")}
                  onAddFlower={handleAddFlower}
                />
              </div>
            </div>

            <div className="bg-white/60 border border-[#BD9958]/30 p-8 rounded-lg min-h-[200px] mb-12 relative z-10 backdrop-blur-sm">
              <h3 className="text-[#BD9958] font-cormorant tracking-widest text-center mb-6">
                YOUR ARRANGEMENT ({selectedChakras.length} / 10)
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {selectedChakras.length === 0 ? (
                  <p className="text-[#27190B]/40 italic font-light text-center w-full">
                    Tap a bloom above to add it to your bouquet.
                  </p>
                ) : (
                  selectedChakras.map((id, index) => {
                    const mapped = CHAKRAS_MAP[id];
                    if (!mapped) return null;
                    const isSvg = mapped.path.endsWith(".svg");
                    return (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => handleRemoveChakra(index)}
                      >
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/80 rounded-full border border-[#BD9958]/20 flex items-center justify-center relative shadow-[0_0_10px_rgba(189,153,88,0.2)]">
                          <Image
                            src={mapped.path}
                            alt={mapped.name}
                            fill
                            className="object-contain p-1 group-hover:opacity-30 transition-opacity drop-shadow-[0_0_8px_rgba(189,153,88,0.3)]"
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-red-400 font-bold">X</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="text-center relative z-10">
              <button
                onClick={handleNextStep}
                disabled={selectedChakras.length < 6}
                className="px-10 py-3 bg-[#BD9958] text-black font-cormorant uppercase tracking-widest hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(189,153,88,0.5)] transition-all disabled:opacity-50 disabled:hover:bg-[#BD9958] disabled:hover:shadow-none"
              >
                Assemble Bouquet
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn max-w-2xl mx-auto">
            <button
              onClick={() => setStep(1)}
              className="text-[#27190B]/50 hover:text-[#BD9958] uppercase text-xs tracking-widest font-cormorant mb-8 flex items-center transition-colors"
            >
              ← Back to Arrangement
            </button>

            <h2 className="text-center text-2xl tracking-widest uppercase font-cormorant text-[#27190B] mb-10">
              WRITE THE CARD
            </h2>

            <form
              onSubmit={handleSubmit}
              className="bg-white/60 backdrop-blur-sm border border-[#BD9958]/20 p-8 md:p-12 shadow-2xl relative"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-transparent via-transparent to-[#BD9958]/10 border-l border-b border-[#BD9958]/20" />

              <div className="space-y-8">
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

                <div>
                  <label className={labelClasses}>Message</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`${inputClasses} resize-none`}
                    placeholder="I have so much to tell you..."
                  ></textarea>
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

              <div className="mt-12 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-12 py-4 bg-[#BD9958] text-black font-cormorant uppercase tracking-widest text-lg hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(189,153,88,0.5)] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Finalize & Share"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

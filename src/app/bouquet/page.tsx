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
    path: "/chakras/root-symbol.svg",
    hasVariants: false,
  },
  {
    id: "sacral",
    name: "Sacral Chakra",
    path: "/chakras/sacral-symbol.svg",
    hasVariants: false,
  },
  {
    id: "solar-plexus",
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar (1).webp",
    hasVariants: true,
    variants: [1, 2, 3, 4, 5].map((i) => `/bouquet/solar (${i}).webp`),
  },
  {
    id: "heart",
    name: "Heart Chakra",
    path: "/chakras/heart-symbol.svg",
    hasVariants: false,
  },
  {
    id: "throat",
    name: "Throat Chakra",
    path: "/bouquet/throat (1).webp",
    hasVariants: true,
    variants: [1, 2, 3, 4, 5].map((i) => `/bouquet/throat (${i}).webp`),
  },
  {
    id: "third-eye",
    name: "Third Eye Chakra",
    path: "/chakras/third-eye-symbol.svg",
    hasVariants: false,
  },
  {
    id: "crown",
    name: "Crown Chakra",
    path: "/bouquet/crown (1).webp",
    hasVariants: true,
    variants: [1, 2, 3, 4, 5].map((i) => `/bouquet/crown (${i}).webp`),
  },
];

const CHAKRAS_MAP: Record<string, { name: string; path: string }> = {
  root: { name: "Root Chakra", path: "/chakras/root-symbol.svg" },
  sacral: { name: "Sacral Chakra", path: "/chakras/sacral-symbol.svg" },
  heart: { name: "Heart Chakra", path: "/chakras/heart-symbol.svg" },
  "third-eye": {
    name: "Third Eye Chakra",
    path: "/chakras/third-eye-symbol.svg",
  },
  ...[1, 2, 3, 4, 5].reduce(
    (acc, i) => ({
      ...acc,
      [`solar-plexus-${i}`]: {
        name: "Solar Plexus Chakra",
        path: `/bouquet/solar (${i}).webp`,
      },
    }),
    {},
  ),
  ...[1, 2, 3, 4, 5].reduce(
    (acc, i) => ({
      ...acc,
      [`throat-${i}`]: {
        name: "Throat Chakra",
        path: `/bouquet/throat (${i}).webp`,
      },
    }),
    {},
  ),
  ...[1, 2, 3, 4, 5].reduce(
    (acc, i) => ({
      ...acc,
      [`crown-${i}`]: {
        name: "Crown Chakra",
        path: `/bouquet/crown (${i}).webp`,
      },
    }),
    {},
  ),
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
        onAddFlower(`${chakra.id}-1`);
      } else {
        onToggleExpand();
      }
    } else {
      onAddFlower(chakra.id);
    }
  };

  return (
    <div className={`relative flex flex-col justify-center items-center w-32 h-32 md:w-40 md:h-40 ${isExpanded ? 'z-50' : 'z-10'}`}>
      <button
        onClick={handleMainClick}
        className="absolute z-10 w-24 h-24 md:w-32 md:h-32 transition-transform transform hover:scale-110 active:scale-95"
      >
        <Image
          src={chakra.path}
          alt={chakra.name}
          fill
          className={`object-contain drop-shadow-[0_0_10px_rgba(189,153,88,0.3)] ${!chakra.hasVariants ? "filter brightness-0 opacity-70 hover:opacity-100" : ""}`}
        />
      </button>

      <span className="absolute -bottom-8 text-xs text-[#27190B]/60 font-cormorant tracking-widest whitespace-nowrap">
        {chakra.name}
      </span>

      <AnimatePresence>
        {chakra.hasVariants && isExpanded && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {chakra.variants?.slice(1).map((path, idx) => {
              const angle = (idx * 90 + 45) * (Math.PI / 180);
              const radius = 110;
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <motion.button
                  key={idx}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, scale: 1, x, y }}
                  exit={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFlower(`${chakra.id}-${idx + 2}`);
                  }}
                  className="absolute top-1/2 left-1/2 -mt-10 -ml-10 md:-mt-14 md:-ml-14 w-20 h-20 md:w-28 md:h-28 pointer-events-auto transition-transform transform hover:scale-110 active:scale-95"
                >
                  <Image
                    src={path}
                    alt={`${chakra.name} variant ${idx + 2}`}
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

            <div className="flex flex-col items-center gap-12 md:gap-16 mb-24 relative z-20">
              {pyramidRows.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className={`flex justify-center gap-10 md:gap-24 w-full relative ${row.includes(expandedChakra as string) ? 'z-50' : 'z-10'}`}
                >
                  {row.map((id) => (
                    <ExpandableFlower
                      key={id}
                      chakra={getChakra(id)}
                      isExpanded={expandedChakra === id}
                      onToggleExpand={() => handleToggleExpand(id)}
                      onAddFlower={handleAddFlower}
                    />
                  ))}
                </div>
              ))}
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
                            className={`object-contain p-2 group-hover:opacity-30 transition-opacity ${isSvg ? "filter brightness-0 opacity-60" : "drop-shadow-[0_0_5px_rgba(189,153,88,0.3)] opacity-90"}`}
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

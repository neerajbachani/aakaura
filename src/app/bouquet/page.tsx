"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

const CHAKRAS = [
  { id: "root", name: "Root Chakra", path: "/chakras/root-symbol.svg" },
  { id: "sacral", name: "Sacral Chakra", path: "/chakras/sacral-symbol.svg" },
  { id: "solar-plexus", name: "Solar Plexus Chakra", path: "/chakras/solar-plexus-symbol.svg" },
  { id: "heart", name: "Heart Chakra", path: "/chakras/heart-symbol.svg" },
  { id: "throat", name: "Throat Chakra", path: "/chakras/throat-symbol.svg" },
  { id: "third-eye", name: "Third Eye Chakra", path: "/chakras/third-eye-symbol.svg" },
  { id: "crown", name: "Crown Chakra", path: "/chakras/crown-symbol.svg" },
];

export default function BouquetCreationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedChakras, setSelectedChakras] = useState<string[]>([]);
  const [formData, setFormData] = useState({ to: "", message: "", from: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChakraClick = (chakraId: string) => {
    if (selectedChakras.length >= 10) {
      toast.error("You can select up to 10 blooms maximum.");
      return;
    }
    setSelectedChakras([...selectedChakras, chakraId]);
  };

  const handleRemoveChakra = (indexToRemove: number) => {
    setSelectedChakras(selectedChakras.filter((_, index) => index !== indexToRemove));
  };

  const handleNextStep = () => {
    if (selectedChakras.length < 6) {
      toast.error("Please pick at least 6 blooms.");
      return;
    }
    setStep(2);
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
    "w-full bg-black/50 border-b border-[#BD9958]/50 focus:border-[#BD9958] focus:ring-0 py-3 px-1 text-white font-light transition-colors placeholder-white/20 outline-none";
  const labelClasses = "block text-xs uppercase tracking-widest text-[#BD9958] font-cormorant mb-1";

  return (
    <div className="min-h-screen bg-[#27190B] text-white py-20 px-4 font-sans relative overflow-hidden">
      {/* Decorative Aurora Background */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-[#BD9958]/20 to-transparent blur-3xl opacity-50 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl text-[#BD9958] font-cormorant mb-4 tracking-widest">
            Aakaura Bouquet
          </h1>
          <p className="text-white/60 tracking-wider font-light">
            GIFT DIGITAL SERENITY AND BEAUTY
          </p>
        </div>

        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-center text-xl tracking-widest uppercase font-cormorant text-white mb-10">
              PICK 6 TO 10 BLOOMS
            </h2>

            {/* Selection Area */}
            <div className="flex flex-wrap justify-center gap-6 mb-16">
              {CHAKRAS.map((chakra) => (
                <div key={chakra.id} className="group relative flex flex-col items-center">
                  <button
                    onClick={() => handleChakraClick(chakra.id)}
                    className="w-24 h-24 md:w-32 md:h-32 transition-transform transform hover:scale-110 active:scale-95"
                  >
                    <Image
                      src={chakra.path}
                      alt={chakra.name}
                      width={128}
                      height={128}
                      className="drop-shadow-[0_0_10px_rgba(189,153,88,0.3)] filter brightness-0 invert opacity-80 hover:opacity-100"
                    />
                  </button>
                  <span className="text-xs text-white/50 font-cormorant mt-2 tracking-widest">
                    {chakra.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Selected Basket */}
            <div className="bg-black/30 border border-[#BD9958]/30 p-8 rounded-lg min-h-[200px] mb-12">
              <h3 className="text-[#BD9958] font-cormorant tracking-widest text-center mb-6">
                YOUR ARRANGEMENT ({selectedChakras.length} / 10)
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {selectedChakras.length === 0 ? (
                  <p className="text-white/30 italic font-light">Tap a bloom above to add it to your bouquet.</p>
                ) : (
                  selectedChakras.map((id, index) => {
                    const chakra = CHAKRAS.find((c) => c.id === id);
                    if (!chakra) return null;
                    return (
                      <div key={index} className="relative group cursor-pointer" onClick={() => handleRemoveChakra(index)}>
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-black/50 rounded-full border border-white/10 flex items-center justify-center relative">
                          <Image
                            src={chakra.path}
                            alt={chakra.name}
                            width={50}
                            height={50}
                            className="filter brightness-0 invert opacity-70 group-hover:opacity-30 transition-opacity"
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

            <div className="text-center">
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
              className="text-white/50 hover:text-[#BD9958] uppercase text-xs tracking-widest font-cormorant mb-8 flex items-center transition-colors"
            >
              ← Back to Arrangement
            </button>

            <h2 className="text-center text-2xl tracking-widest uppercase font-cormorant text-white mb-10">
              WRITE THE CARD
            </h2>

            <form onSubmit={handleSubmit} className="bg-white/[0.02] border border-[#BD9958]/20 p-8 md:p-12 shadow-2xl relative">
              {/* Card Fold Detail */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-transparent via-transparent to-[#BD9958]/10 border-l border-b border-[#BD9958]/20" />

              <div className="space-y-8">
                <div>
                  <label className={labelClasses}>To</label>
                  <input
                    required
                    type="text"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
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

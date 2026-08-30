"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { motion, AnimatePresence } from "framer-motion";
import HeroPathSelector from "@/components/home/HeroPathSelector";
import HeroGuidancePanel from "@/components/home/HeroGuidancePanel";
import HeroBouquetPanel from "@/components/home/HeroBouquetPanel";
import ChakraInfoBottomSheet from "@/components/home/ChakraInfoBottomSheet";
import {
  DEFAULT_HERO_PATH,
  type HeroPath,
} from "@/config/homeHero";
import { chakraBalanceSheetContent } from "@/config/chakraBalanceSheet";

// Chakras configuration array with slug mapping
// Chakras configuration array with slug mapping
const chakrasConfig = [
  {
    id: "grounding",
    slug: "grounding",
    name: "Root Chakra",
    sanskrit: "Muladhara (Constant stress)",
    devanagari: "मूलाधार",
    color: "#ef4444",
    shadow: "rgba(239,68,68,0.6)",
    image: "/chakras/root-symbol.svg",
    position: "lower-right",
    info: "The right to exist.\nThis is where survival becomes stillness.\nWhere fear learns discipline and chaos learns loyalty.\nWhen this chakra is awake, life stops feeling like a constant emergency.",
    shortInfo: "You ground",
  },
  {
    id: "flow",
    slug: "flow",
    name: "Sacral Chakra",
    sanskrit: "Swadhisthana (Feeling disconnected)",
    devanagari: "स्वाधिष्ठान",
    color: "#f97316",
    shadow: "rgba(249,115,22,0.6)",
    image: "/chakras/sacral-symbol.svg",
    position: "lower-left",
    offsetX: "-10%",
    info: "The right to feel.\nThis chakra doesn't beg permission to flow.\nBlocked sacral energy dries life into routine.\nCreation begins here; pleasure, emotion, intimacy, art.\nIt knows that softness is not weakness; it is intelligence in motion.",
    shortInfo: "Feel deeply",
  },
  {
    id: "power",
    slug: "power",
    name: "Solar Plexus Chakra",
    sanskrit: "Manipura (Low confidence)",
    devanagari: "मणिपुर",
    color: "#eab308",
    shadow: "rgba(234,179,8,0.6)",
    image: "/chakras/solar-plexus-symbol.svg",
    position: "middle-right",
    info: "The right to act.\nFire of will. Seat of self-respect.\nThis is where intention turns into direction.\nA balanced Maṇipūra doesn't dominate; it decides.",
    shortInfo: "Power stabilizes",
  },
  {
    id: "love",
    slug: "love",
    name: "Heart Chakra",
    sanskrit: "Anahata (Emotional heaviness)",
    devanagari: "अनाहत",
    color: "#22c55e",
    shadow: "rgba(34,197,94,0.6)",
    image: "/chakras/heart-symbol.svg",
    position: "middle-left",
    info: "The right to love.\nNot romance. Not attachment.\nAn open heart doesn't leak energy; it circulates it.\nThis is love as frequency: steady, forgiving, expansive.",
    shortInfo: "You soften",
  },
  {
    id: "expression",
    slug: "expression",
    name: "Throat Chakra",
    sanskrit: "Vishuddhi (Can’t express)",
    devanagari: "विशुद्ध",
    color: "#06b6d4",
    shadow: "rgba(6,182,212,0.6)",
    image: "/chakras/throat-symbol.svg",
    position: "upper-right",
    info: "The right to speak the truth.\nWhen aligned, words carry weight, not noise.\nWhen blocked, truth suffocates into compliance.\nExpression without distortion. Silence without fear.\nThis chakra governs honesty-with others and with the self.",
    shortInfo: "Truth flows",
  },
  {
    id: "insight",
    slug: "insight",
    name: "Third Eye Chakra",
    sanskrit: "Ajna (Something feels off)",
    devanagari: "आज्ञा",
    color: "#3b82f6",
    shadow: "rgba(59,130,246,0.6)",
    image: "/chakras/third-eye-symbol.svg",
    position: "upper-left",
    info: "The right to see.\nBeyond logic. Beyond conditioning.\nOnce open, the illusion loses its grip.\nĀjñā doesn't predict the future; it recognises patterns.",
    shortInfo: "Clarity begins",
  },
  {
    id: "expansion",
    slug: "expansion",
    name: "Crown Chakra",
    sanskrit: "Sahasrara (Overthinking)",
    devanagari: "सहस्रार",
    color: "#9333ea",
    shadow: "rgba(147,51,234,0.9)",
    image: "/chakras/crown-symbol.svg",
    position: "center",
    info: 'Not escape. Not superiority.\nUnion. Stillness. Witnessing.\nThe right to know you are more.\nThis chakra dissolves the question of "why me?"\nHere, surrender becomes the highest form of power.',
    shortInfo: "Awareness expands",
  },
];

// Chakra Circle Component
function ChakraCircle({
  chakra,
  onNavigate,
  onHover,
  isMobile,
  onClick,
}: {
  chakra: (typeof chakrasConfig)[0];
  onNavigate: (slug: string) => void;
  onHover: (chakra: (typeof chakrasConfig)[0] | null) => void;
  isMobile: boolean;
  onClick: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 relative group">
      {/* Short Info - Above Icon (Desktop Only) */}
      {!isMobile && (
        <p
          className={`text-sm md:text-lg font-medium tracking-wide transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ color: chakra.color }}
        >
          {(chakra as any).shortInfo}
        </p>
      )}

      <div
        className="relative w-16 h-16 sm:w-[5.8rem] sm:h-[5.8rem] flex items-center justify-center cursor-pointer"
        onMouseEnter={() => {
          if (!isMobile) {
            setIsHovered(true);
            onHover(chakra);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            setIsHovered(false);
            onHover(null);
          }
        }}
        onClick={() => {
          if (isMobile) {
            onClick();
          } else {
            onNavigate(chakra.slug);
          }
        }}
      >
        {/* Glow effect behind SVG - always visible */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500 blur-[75px] sm:blur-[40px]"
          style={{
            backgroundColor: chakra.color,
            opacity: 0.8,
            transform: isHovered ? "scale(1.2)" : "scale(1.4)",
          }}
        />

        {/* Additional hover glow */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500 blur-[30px] md:blur-[60px]"
          style={{
            backgroundColor: chakra.color,
            opacity: isHovered ? 0.6 : 0,
            transform: "scale(1.5)",
          }}
        />

        <div
          className="relative w-14 h-14 md:w-24 md:h-24 transition-transform duration-500 group-hover:scale-110"
          style={{ filter: "brightness(1.7) contrast(1.8)" }}
        >
          <div
            className="absolute inset-0"
            style={{
              transform: `translateX(${(chakra as any).offsetX || "0"})`,
            }}
          >
            <Image
              src={chakra.image}
              alt={chakra.name}
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div
        className="flex flex-col items-center gap-1 mt-2"
        style={{
          transform: `translateX(${(chakra as any).offsetX || "0"})`,
        }}
      >
        <p
          className="text-xs md:text-sm font-medium opacity-90"
          style={{ color: chakra.color }}
        >
          {(chakra as any).devanagari}
        </p>
        <p
          className="text-xs md:text-xl leading-relaxed font-normal opacity-80"
          style={{ color: chakra.color }}
        >
          {chakra.name}
        </p>
      </div>
    </div>
  );
}

export default function BannerImage() {
  const router = useTransitionRouter();
  const [activePath, setActivePath] = useState<HeroPath>(DEFAULT_HERO_PATH);
  const [hoveredChakra, setHoveredChakra] = useState<
    (typeof chakrasConfig)[0] | null
  >(null);
  const [selectedChakra, setSelectedChakra] = useState<
    (typeof chakrasConfig)[0] | null
  >(null);
  const [isMobile, setIsMobile] = useState(false);

  // Screen size detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Clear chakra selection when leaving journey tab
  useEffect(() => {
    if (activePath !== "journey") {
      setSelectedChakra(null);
      setHoveredChakra(null);
    }
  }, [activePath]);

  const centerChakra = chakrasConfig.find((c) => c.position === "center");
  const upperChakras = chakrasConfig
    .filter((c) => c.position.startsWith("upper"))
    .sort((a, b) => (a.position.includes("left") ? -1 : 1));
  const middleChakras = chakrasConfig
    .filter((c) => c.position.startsWith("middle"))
    .sort((a, b) => (a.position.includes("left") ? -1 : 1));
  const lowerChakras = chakrasConfig
    .filter((c) => c.position.startsWith("lower"))
    .sort((a, b) => (a.position.includes("left") ? -1 : 1));

  const triggerPageTransition = () => {
    document.documentElement.animate(
      [
        { clipPath: "circle(0% at 50% 50%)" },
        { clipPath: "circle(150% at 50% 50%)" },
      ],
      {
        duration: 2000,
        easing: "cubic-bezier(0.9, 0, 0.1, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  };

  const handleNavigation = (slug: string) => {
    setSelectedChakra(null);
    router.push(`/journey/${slug}`, {
      onTransitionReady: triggerPageTransition,
    });
  };

  const panelMotion = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
    transition: { duration: 0.3, ease: "easeOut" as const },
  };

  return (
    <section className="min-h-[100vh] bg-transparent flex items-center justify-center px-4 relative">
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-pulseGlow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="flex flex-col items-center gap-2 w-full max-w-7xl mx-auto relative z-10 pt-16 md:pt-0">
        {/* Shared welcome: selector sits where "Choose your Journey" used to */}
        <div className="flex flex-col items-center text-center mb-6 md:mb-8 z-20 w-full px-4 animate-fadeIn">
          <h1 className="text-3xl md:text-4xl lg:text-5xl text-[#BD9958] font-light mb-2 tracking-wide">
            Welcome to Aakaura
          </h1>
          <p className="text-base md:text-xl text-[#BD9958]/80 mb-6 font-light">
            (आकार to your aura);
          </p>
          <HeroPathSelector activePath={activePath} onChange={setActivePath} />
        </div>

        {/* Panel content area: min-height prevents layout jump */}
        <div className="w-full min-h-[55vh] md:min-h-[65vh] relative flex flex-col items-center">
          {/* Guidance Panel */}
          <AnimatePresence mode="wait">
            {activePath === "guidance" && (
              <motion.div
                key="guidance"
                role="tabpanel"
                id="hero-panel-guidance"
                aria-labelledby="hero-tab-guidance"
                {...panelMotion}
              >
                <HeroGuidancePanel />
              </motion.div>
            )}

            {activePath === "bouquet" && (
              <motion.div
                key="bouquet"
                role="tabpanel"
                id="hero-panel-bouquet"
                aria-labelledby="hero-tab-bouquet"
                {...panelMotion}
              >
                <HeroBouquetPanel />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Journey Panel: stays mounted to preserve hover state */}
          <div
            role="tabpanel"
            id="hero-panel-journey"
            aria-labelledby="hero-tab-journey"
            hidden={activePath !== "journey"}
            className={
              activePath === "journey"
                ? "flex flex-col items-center gap-2 w-full animate-fadeIn"
                : "hidden"
            }
          >
            {/* Center - Crown Chakra */}
            {centerChakra && (
              <div className="flex justify-center w-full">
                <ChakraCircle
                  chakra={centerChakra}
                  onNavigate={handleNavigation}
                  onHover={setHoveredChakra}
                  isMobile={isMobile}
                  onClick={() => setSelectedChakra(centerChakra)}
                />
              </div>
            )}

            {/* Upper Row */}
            <div className="flex justify-between w-[65%] mx-auto">
              {upperChakras.map((chakra) => (
                <ChakraCircle
                  key={chakra.id}
                  chakra={chakra}
                  onNavigate={handleNavigation}
                  onHover={setHoveredChakra}
                  isMobile={isMobile}
                  onClick={() => setSelectedChakra(chakra)}
                />
              ))}
            </div>

            {/* Middle Row with Central Info Display */}
            <div className="flex justify-between w-[85%] mx-auto relative">
              {middleChakras.map((chakra) => (
                <ChakraCircle
                  key={chakra.id}
                  chakra={chakra}
                  onNavigate={handleNavigation}
                  onHover={setHoveredChakra}
                  isMobile={isMobile}
                  onClick={() => setSelectedChakra(chakra)}
                />
              ))}

              {/* Central Info Display */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {hoveredChakra && (
                  <div className="text-white text-center min-w-[420px] max-w-xl animate-fadeIn flex flex-col items-center justify-center">
                    <p
                      className="text-[#bd9958] text-xs md:text-xl leading-relaxed text-center whitespace-pre-line font-bold drop-shadow-md"
                      style={{ lineHeight: "2.8" }}
                    >
                      {hoveredChakra.info}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Lower Row */}
            <div className="flex items-end justify-between w-full mx-auto relative">
              {lowerChakras[0] && (
                <div className="flex-shrink-0">
                  <ChakraCircle
                    chakra={lowerChakras[0]}
                    onNavigate={handleNavigation}
                    onHover={setHoveredChakra}
                    isMobile={isMobile}
                    onClick={() => setSelectedChakra(lowerChakras[0])}
                  />
                </div>
              )}

              <Link
                href="/journey"
                className="hidden md:flex absolute left-1/2 -translate-x-1/2 bottom-4 group flex-col items-center justify-center gap-2 hover:scale-105 transition-transform duration-500"
              >
                <div className="relative overflow-hidden px-8 py-3 border border-[#BD9958]/30 rounded-full bg-[#BD9958]/5 hover:bg-[#BD9958]/10 backdrop-blur-sm transition-all duration-500">
                  <span className="relative z-10 font-cormorant text-2xl text-[#BD9958] tracking-widest uppercase group-hover:text-primaryBeige transition-colors duration-300">
                    Start With What You Feel
                  </span>
                  <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#BD9958]/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                </div>
                <span className="text-[10px] text-[#BD9958]/60 tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                  Start Your Journey
                </span>
              </Link>

              {lowerChakras[1] && (
                <div className="flex-shrink-0">
                  <ChakraCircle
                    chakra={lowerChakras[1]}
                    onNavigate={handleNavigation}
                    onHover={setHoveredChakra}
                    isMobile={isMobile}
                    onClick={() => setSelectedChakra(lowerChakras[1])}
                  />
                </div>
              )}
            </div>

            {/* Mobile CTA */}
            <Link
              href="/journey"
              className="flex md:hidden group relative flex-col items-center justify-center gap-2 mt-8 hover:scale-105 transition-transform duration-500"
            >
              <div className="relative overflow-hidden px-8 py-3 border border-[#BD9958]/30 rounded-full bg-[#BD9958]/5 hover:bg-[#BD9958]/10 backdrop-blur-sm transition-all duration-500">
                <span className="relative z-10 font-cormorant text-lg text-[#BD9958] tracking-widest uppercase group-hover:text-primaryBeige transition-colors duration-300">
                  Start With What You Feel
                </span>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-[#BD9958]/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
              </div>
              <span className="text-[10px] text-[#BD9958]/60 tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-y-2 group-hover:translate-y-0">
                Start Your Journey
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet: journey only */}
      <AnimatePresence>
        {isMobile &&
          activePath === "journey" &&
          selectedChakra &&
          chakraBalanceSheetContent[selectedChakra.slug] && (
            <>
              <motion.div
                key="chakra-sheet-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedChakra(null)}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
              />

              <motion.div
                key="chakra-sheet-panel"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-[#27190b] z-[101] rounded-t-[32px] px-6 pt-4 pb-10 shadow-[0_-20px_40px_rgba(0,0,0,0.5)] border-t border-[#BD9958]/20"
              >
                <ChakraInfoBottomSheet
                  chakra={{
                    name: selectedChakra.name,
                    slug: selectedChakra.slug,
                  }}
                  content={chakraBalanceSheetContent[selectedChakra.slug]}
                  onDiscover={() => handleNavigation(selectedChakra.slug)}
                />
              </motion.div>
            </>
          )}
      </AnimatePresence>
    </section>
  );
}

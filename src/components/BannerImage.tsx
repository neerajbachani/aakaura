"use client";
import Image from "next/image";
import { useState } from "react";
import { useTransitionRouter } from "next-view-transitions";

// Chakras configuration array with slug mapping
// Chakras configuration array with slug mapping
const chakrasConfig = [
  {
    id: "grounding",
    slug: "grounding",
    name: "Root",
    sanskrit: "Mulādhāra",
    color: "#ef4444",
    shadow: "rgba(239,68,68,0.6)",
    image: "/chakras/root-symbol.svg",
    position: "lower-right",
    info: "The right to exist.\nThis is where survival becomes stillness.\nWhere fear learns discipline and chaos learns loyalty.\nWhen this chakra is awake, life stops feeling like a constant emergency.",
  },
  {
    id: "flow",
    slug: "flow",
    name: "Sacral",
    sanskrit: "Svādhiṣṭhāna",
    color: "#f97316",
    shadow: "rgba(249,115,22,0.6)",
    image: "/chakras/sacral-symbol.svg",
    position: "lower-left",
    info: "The right to feel.\nThis chakra doesn't beg permission to flow.\nBlocked sacral energy dries life into routine.\nCreation begins here; pleasure, emotion, intimacy, art.\nIt knows that softness is not weakness; it is intelligence in motion.",
  },
  {
    id: "power",
    slug: "power",
    name: "Solar Plexus",
    sanskrit: "Maṇipūra",
    color: "#eab308",
    shadow: "rgba(234,179,8,0.6)",
    image: "/chakras/solar-plexus-symbol.svg",
    position: "middle-right",
    info: "The right to act.\nFire of will. Seat of self-respect.\nThis is where intention turns into direction.\nA balanced Maṇipūra doesn't dominate; it decides.",
  },
  {
    id: "love",
    slug: "love",
    name: "Heart",
    sanskrit: "Anāhata",
    color: "#22c55e",
    shadow: "rgba(34,197,94,0.6)",
    image: "/chakras/heart-symbol.svg",
    position: "middle-left",
    info: "The right to love.\nNot romance. Not attachment.\nAn open heart doesn't leak energy; it circulates it.\nThis is love as frequency: steady, forgiving, expansive.",
  },
  {
    id: "expression",
    slug: "expression",
    name: "Throat",
    sanskrit: "Viśuddha",
    color: "#06b6d4",
    shadow: "rgba(6,182,212,0.6)",
    image: "/chakras/throat-symbol.svg",
    position: "upper-right",
    info: "The right to speak the truth.\nWhen aligned, words carry weight, not noise.\nWhen blocked, truth suffocates into compliance.\nExpression without distortion. Silence without fear.\nThis chakra governs honesty—with others and with the self.",
  },
  {
    id: "insight",
    slug: "insight",
    name: "Third Eye",
    sanskrit: "Ājñā",
    color: "#3b82f6",
    shadow: "rgba(59,130,246,0.6)",
    image: "/chakras/third-eye-symbol.svg",
    position: "upper-left",
    info: "The right to see.\nBeyond logic. Beyond conditioning.\nOnce open, the illusion loses its grip.\nĀjñā doesn't predict the future; it recognises patterns.",
  },
  {
    id: "expansion",
    slug: "expansion",
    name: "Crown",
    sanskrit: "Sahasrāra",
    color: "#9333ea",
    shadow: "rgba(147,51,234,0.9)",
    image: "/chakras/crown-symbol.svg",
    position: "center",
    info: "Not escape. Not superiority.\nUnion. Stillness. Witnessing.\nThe right to know you are more.\nThis chakra dissolves the question of \"why me?\"\nHere, surrender becomes the highest form of power.",
  },
];

// Chakra Circle Component
function ChakraCircle({
  chakra,
  onNavigate,
  onHover,
}: {
  chakra: typeof chakrasConfig[0];
  onNavigate: (slug: string) => void;
  onHover: (chakra: typeof chakrasConfig[0] | null) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 relative group">
      {/* Sanskrit Name - Above Icon */}
      <p
        className={`text-2xl font-light italic tracking-wide transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        style={{ color: chakra.color }}
      >
        {chakra.sanskrit}
      </p>
      
      <div
        className="relative w-[5.8rem] h-[5.8rem] flex items-center justify-center cursor-pointer"
        onMouseEnter={() => {
          setIsHovered(true);
          onHover(chakra);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          onHover(null);
        }}
        onClick={() => onNavigate(chakra.slug)}
      >
        {/* Glow effect behind SVG - always visible */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            backgroundColor: chakra.color,
            filter: "blur(40px)",
            opacity: 0.8,
            transform: isHovered ? "scale(1.2)" : "scale(1.4)",
          }}
        />

        {/* Additional hover glow */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            backgroundColor: chakra.color,
            filter: "blur(60px)",
            opacity: isHovered ? 0.6 : 0,
            transform: "scale(1.5)",
          }}
        />

        <div
          className="relative w-24 h-24 transition-transform duration-500 group-hover:scale-110"
          style={{ filter: "brightness(1.7) contrast(1.8)" }}
        >
          <Image
            src={chakra.image}
            alt={`${chakra.name} Chakra`}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <p
        className="text-xl leading-relaxed font-medium "
        style={{ color: chakra.color }}
      >
        {chakra.name}
      </p>
    </div>
  );
}

export default function BannerImage() {
  const router = useTransitionRouter();
  const [hoveredChakra, setHoveredChakra] = useState<typeof chakrasConfig[0] | null>(null);

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
      }
    );
  };

  const handleNavigation = (slug: string) => {
    router.push(`/journey/${slug}`, {
      onTransitionReady: triggerPageTransition,
    });
  };

  return (
    <section className="min-h-[90vh] bg-transparent flex items-center justify-center px-4 relative">
        <style jsx>{`
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

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
            0%, 100% {
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

        {/* Content Layer */}
        <div className="flex flex-col items-center gap-2 w-full animate-float relative z-10">
          {/* Center - Crown Chakra */}
          {centerChakra && (
            <div className="flex justify-center">
              <ChakraCircle
                chakra={centerChakra}
                onNavigate={handleNavigation}
                onHover={setHoveredChakra}
              />
            </div>
          )}

          {/* Upper Row */}
          <div className="flex justify-between w-full max-w-xl">
            {upperChakras.map((chakra) => (
              <ChakraCircle
                key={chakra.id}
                chakra={chakra}
                onNavigate={handleNavigation}
                onHover={setHoveredChakra}
              />
            ))}
          </div>

          {/* Middle Row with Central Info Display */}
          <div className="flex justify-between w-full max-w-[60rem] relative">
            {middleChakras.map((chakra) => (
              <ChakraCircle
                key={chakra.id}
                chakra={chakra}
                onNavigate={handleNavigation}
                onHover={setHoveredChakra}
              />
            ))}
            
            {/* Central Info Display */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              {hoveredChakra && (
                <div
                  className="text-white text-center min-w-[420px] max-w-xl animate-fadeIn flex flex-col items-center justify-center"
                >
                  {/* <h3
                    className="text-3xl font-bold mb-4 drop-shadow-lg"
                    style={{ 
                      color: hoveredChakra.color,
                      textShadow: `0 0 20px ${hoveredChakra.shadow}`
                    }}
                  >
                    {hoveredChakra.name} Chakra
                  </h3> */}
                  <p 
                    className="text-[#bd9958] text-xl leading-relaxed text-center whitespace-pre-line font-bold drop-shadow-md"
                    style={{ lineHeight: '2.8' }}
                  >
                    {hoveredChakra.info}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Lower Row */}
          <div className="flex justify-between w-full max-w-[80rem]">
            {lowerChakras.map((chakra) => (
              <ChakraCircle
                key={chakra.id}
                chakra={chakra}
                onNavigate={handleNavigation}
                onHover={setHoveredChakra}
              />
            ))}
          </div>
        </div>
    </section>
  );
}

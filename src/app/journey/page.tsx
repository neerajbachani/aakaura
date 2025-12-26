"use client";
import Image from "next/image";
import { useState } from "react";
import { useTransitionRouter } from "next-view-transitions";
import { useRevealer } from "@/hooks/useRevealer";
import Galaxy from "@/components/ui/Galaxy";

// Chakras configuration array with slug mapping
const chakrasConfig = [
  {
    id: "expansion",
    slug: "expansion",
    name: "Crown",
    color: "#9333ea",
    shadow: "rgba(147,51,234,0.9)",
    image: "/chakras/crown-symbol.svg",
    position: "center",
    info: "Connection to divine consciousness and spiritual enlightenment",
  },
  {
    id: "insight",
    slug: "insight",
    name: "Third Eye",
    color: "#3b82f6",
    shadow: "rgba(59,130,246,0.6)",
    image: "/chakras/third-eye-symbol.svg",
    position: "upper-left",
    info: "Intuition, insight, and inner wisdom",
  },
  {
    id: "expression",
    slug: "expression",
    name: "Throat",
    color: "#06b6d4",
    shadow: "rgba(6,182,212,0.6)",
    image: "/chakras/throat-symbol.svg",
    position: "upper-right",
    info: "Communication, self-expression, and truth",
  },
  {
    id: "love",
    slug: "love",
    name: "Heart",
    color: "#22c55e",
    shadow: "rgba(34,197,94,0.6)",
    image: "/chakras/heart-symbol.svg",
    position: "middle-left",
    info: "Love, compassion, and emotional balance",
  },
  {
    id: "power",
    slug: "power",
    name: "Solar Plexus",
    color: "#eab308",
    shadow: "rgba(234,179,8,0.6)",
    image: "/chakras/solar-plexus-symbol.svg",
    position: "middle-right",
    info: "Personal power, confidence, and self-esteem",
  },
  {
    id: "flow",
    slug: "flow",
    name: "Sacral",
    color: "#f97316",
    shadow: "rgba(249,115,22,0.6)",
    image: "/chakras/sacral-symbol.svg",
    position: "lower-left",
    info: "Creativity, pleasure, and emotional flow",
  },
  {
    id: "grounding",
    slug: "grounding",
    name: "Root",
    color: "#ef4444",
    shadow: "rgba(239,68,68,0.6)",
    image: "/chakras/root-symbol.svg",
    position: "lower-right",
    info: "Grounding, stability, and physical security",
  },
];

// Chakra Circle Component
function ChakraCircle({ 
  chakra, 
  onNavigate 
}: { 
  chakra: typeof chakrasConfig[0];
  onNavigate: (slug: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center gap-2 relative group">
      <div
        className="relative w-[5.8rem] h-[5.8rem] flex items-center justify-center cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onNavigate(chakra.slug)}
      >
        {/* Glow effect behind SVG - always visible */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            backgroundColor: chakra.color,
            filter: 'blur(40px)',
            opacity: 0.8,
            transform: isHovered ? 'scale(1.2)' : 'scale(1.4)',
          }}
        />

        {/* Additional hover glow */}
        <div
          className="absolute inset-0 rounded-full transition-all duration-500"
          style={{
            backgroundColor: chakra.color,
            filter: 'blur(60px)',
            opacity: isHovered ? 0.6 : 0,
            transform: 'scale(1.5)',
          }}
        />

        <div className="relative w-24 h-24 transition-transform duration-500 group-hover:scale-110" style={{ filter: 'brightness(1.7) contrast(1.8)' }}>
          <Image
            src={chakra.image}
            alt={`${chakra.name} Chakra`}
            fill
            className="object-contain"
          />
        </div>
      </div>
      <p className="text-xl leading-relaxed font-medium " style={{ color: chakra.color }}>
        {chakra.name}
      </p>

      {/* Tooltip on hover */}
      {isHovered && (
        <div
          className="absolute left-36 mt-4 bg-black/90 text-white text-md px-3 py-2 rounded-lg shadow-lg text-center text-nowrap z-10 animate-fadeIn"
          style={{
            borderColor: chakra.color,
            borderWidth: "1px",
          }}
        >
          {chakra.info}
          <div
            className="absolute left-0 top-[50%] transform -translate-x-1/2 w-2 h-2 -rotate-45 bg-black/90"
            style={{
              borderLeft: `1px solid ${chakra.color}`,
              borderTop: `1px solid ${chakra.color}`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function JourneyPage() {
  const router = useTransitionRouter();
  useRevealer();

  const centerChakra = chakrasConfig.find((c) => c.position === "center");
  const upperChakras = chakrasConfig.filter((c) =>
    c.position.startsWith("upper")
  );
  const middleChakras = chakrasConfig.filter((c) =>
    c.position.startsWith("middle")
  );
  const lowerChakras = chakrasConfig.filter((c) =>
    c.position.startsWith("lower")
  );

  const triggerPageTransition = () => {
    document.documentElement.animate(
      [
        { clipPath: "polygon(25% 75%, 75% 75%, 75% 75%, 25% 75%)" },
        { clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)" }
      ],
      {
        duration: 2000,
        easing: "cubic-bezier(0.9, 0, 0.1, 1)",
        pseudoElement: "::view-transition-new(root)"
      }
    );
  };

  const handleNavigation = (slug: string) => {
    router.push(`/journey/${slug}`, {
      onTransitionReady: triggerPageTransition,
    });
  };

  return (
    <>
      {/* Galaxy Background - Fixed to cover entire viewport including navbar */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Galaxy
          mouseInteraction={false}
          mouseRepulsion={false}
          density={0.3}
          glowIntensity={0.2}
          saturation={0}
          hueShift={140}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          // repulsionStrength={2}
          // autoCenterRepulsion={0}
          starSpeed={0.3}
          speed={0.8}
          transparent={true}
        />
      </div>

      <section className="min-h-[85vh] bg-transparent flex items-center justify-center px-4 relative">
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

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      {/* Revealer overlay for page entrance */}
      <div className="revealer fixed inset-0 bg-[#27190b] z-50 origin-top" />

      {/* Content Layer */}
      <div className="flex flex-col items-center gap-2 w-full animate-float relative z-10">
        {/* Center - Crown Chakra */}
        {centerChakra && (
          <div className="flex justify-center">
            <ChakraCircle chakra={centerChakra} onNavigate={handleNavigation} />
          </div>
        )}

        {/* Upper Row */}
        <div className="flex justify-between w-full max-w-xl">
          {upperChakras.map((chakra) => (
            <ChakraCircle key={chakra.id} chakra={chakra} onNavigate={handleNavigation} />
          ))}
        </div>

        {/* Middle Row */}
        <div className="flex justify-between w-full max-w-[60rem]">
          {middleChakras.map((chakra) => (
            <ChakraCircle key={chakra.id} chakra={chakra} onNavigate={handleNavigation} />
          ))}
        </div>

        {/* Lower Row */}
        <div className="flex justify-between w-full max-w-[80rem]">
          {lowerChakras.map((chakra) => (
            <ChakraCircle key={chakra.id} chakra={chakra} onNavigate={handleNavigation} />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

"use client";
import React from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import fonts from "@/config/fonts";
import Container from "./ui/Container";

const chakras = [
  {
    id: "grounding",
    name: "Root",
    symbol: "/chakras/root-symbol.svg",
    color: "#ef4444",
    x: 882,
    y: 611,
  },
  {
    id: "flow",
    name: "Sacral",
    symbol: "/chakras/sacral-symbol.svg",
    color: "#f97316",
    x: 18,
    y: 586,
  },
  {
    id: "power",
    name: "Solar Plexus",
    symbol: "/chakras/solar-plexus-symbol.svg",
    color: "#eab308",
    x: 881,
    y: 437,
  },
  {
    id: "love",
    name: "Heart",
    symbol: "/chakras/heart-symbol.svg",
    color: "#22c55e",
    x: 19,
    y: 367,
  },
  {
    id: "expression",
    name: "Throat",
    symbol: "/chakras/throat-symbol.svg",
    color: "#06b6d4",
    x: 882,
    y: 218,
  },
  {
    id: "insight",
    name: "Third Eye",
    symbol: "/chakras/third-eye-symbol.svg",
    color: "#3b82f6",
    x: 19,
    y: 162,
  },
  {
    id: "expansion",
    name: "Crown",
    symbol: "/chakras/crown-symbol.svg",
    color: "#9333ea",
    x: 873,
    y: 45,
  },
];

interface HumanBranchesProps {
  onChakraClick?: (chakraId: string) => void;
}

export default function HumanBranches({ onChakraClick }: HumanBranchesProps = {}) {
  const [hoveredChakra, setHoveredChakra] = React.useState<string | null>(null);

  return (
    <section className="py-4 md:py-6 bg-transparent overflow-hidden relative flex items-center justify-center w-full">
      <Container className="relative w-full">
        {/* Desktop: Side by side layout, Mobile/Tablet: Stacked */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-8 lg:gap-12">
          
          {/* Left Side - Human Branches Visualization */}
          <div className="relative w-full lg:w-1/2 flex items-center justify-center p-[10px] md:p-0">
            {/* Smaller on mobile, larger on desktop */}
            <div className="relative aspect-[1/1] md:aspect-[5/4] w-full max-w-md md:max-w-md lg:max-w-2xl">
              {/* Background SVG */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="/images/human-branches.svg"
                  alt="Human Branches"
                  fill
                  className="object-contain opacity-50"
                />
              </div>

              {/* Chakra Symbols Overlaid on "Eclipse" Shapes - Added padding to prevent clipping */}
              <div className="absolute inset-0 z-10">
                <svg
                  viewBox="0 0 900 900"
                  className="w-full h-full"
                  style={{ filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))", overflow: "visible" }}
                >
                  {chakras.map((chakra, index) => (
                    <motion.g
                      key={chakra.id}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      onMouseEnter={() => setHoveredChakra(chakra.name)}
                      onMouseLeave={() => setHoveredChakra(null)}
                    >
                      {/* Glow Effect */}
                      <circle
                        cx={chakra.x}
                        cy={chakra.y}
                        r="60"
                        fill={chakra.color}
                        className="opacity-20"
                      >
                        <animate
                          attributeName="r"
                          values="60;70;60"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.2;0.4;0.2"
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>

                      {/* Chakra symbol image - Increased size */}
                      <image
                        href={chakra.symbol}
                        x={chakra.x - 50}
                        y={chakra.y - 50}
                        width="100"
                        height="100"
                        className="cursor-pointer hover:scale-110 transition-transform"
                        style={{ filter: "brightness(1.5)" }}
                      />
                      
                      {/* Label on Hover Area (invisible but functional) - Larger clickable area */}
                      <circle
                        cx={chakra.x}
                        cy={chakra.y}
                        r="55"
                        fill="transparent"
                        className="cursor-pointer group"
                        onClick={() => onChakraClick?.(chakra.id)}
                      />
                    </motion.g>
                  ))}
                </svg>
              </div>
            </div>

            {/* Hover Label - Centered - Hidden on small screens */}
            <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20">
              <AnimatePresence>
                {hoveredChakra && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-full border border-[#BD9958]/30 shadow-xl"
                  >
                    <span className={`${fonts.playfair} text-2xl text-[#BD9958] whitespace-nowrap tracking-widest`}>
                      {hoveredChakra.toUpperCase()}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Side - Seven Sacred Journeys Text */}
          <div className="w-full lg:w-1/2 flex items-center justify-center">
            <div className="text-center lg:text-left space-y-6 md:space-y-4 max-w-xl px-2 md:px-0">
              <h2 className={`${fonts.playfair} text-3xl md:text-4xl lg:text-5xl text-[#BD9958] font-light`}>
                Seven Sacred Journeys
              </h2>
              <p className={`${fonts.mulish} text-[#BD9958]/70 text-base md:text-lg lg:text-xl leading-relaxed`}>
                Unlock the flow of energy through the branches of your existence. 
                Each node represents a portal to deeper self-awareness.
              </p>
              <div className="pt-2 md:pt-4">
                <p className={`${fonts.mulish} text-[#BD9958]/50 text-xs md:text-sm italic`}>
                  Hover over each chakra to reveal its name, then click to explore its journey.
                </p>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}

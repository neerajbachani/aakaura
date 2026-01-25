"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import HumanBranches from "@/components/HumanBranches";
import Container from "@/components/ui/Container";
import Aurora from "@/components/ui/Aurora";
import fonts from "@/config/fonts";

// Journey data configuration
const journeys = [
  {
    id: "grounding",
    name: "Root Chakra",
    title: "The Grounded Journey",
    color: "#ef4444",
    symbol: "/chakras/root-symbol.svg",
    chooseIf: [
      "You feel unsafe even when nothing is wrong",
      "Money, stability, or survival thoughts dominate your mind",
      "You're always planning for worst-case scenarios",
      "Rest feels undeserved",
    ],
    teaches: "Safety is not outside you. The body must feel rooted before the mind can rise.",
    wisdom: "A tree that ignores its roots falls in the first storm.",
  },
  {
    id: "flow",
    name: "Sacral Chakra",
    title: "The Flow Journey",
    color: "#f97316",
    symbol: "/chakras/sacral-symbol.svg",
    chooseIf: [
      "You feel emotionally numb or creatively blocked",
      "Pleasure feels guilty",
      "Relationships feel forced or draining",
      "You overthink feelings instead of feeling them",
    ],
    teaches: "Life is meant to move. Suppressed emotion always leaks elsewhere.",
    wisdom: "Traditionally known as the seat of creation… not just art, but life-force itself.",
  },
  {
    id: "power",
    name: "Solar Plexus Chakra",
    title: "The Power Journey",
    color: "#eab308",
    symbol: "/chakras/solar-plexus-symbol.svg",
    chooseIf: [
      "You doubt yourself despite being capable",
      "You give power away easily",
      "Anger simmers beneath calmness",
      "You struggle with boundaries",
    ],
    teaches: "Power is not domination. It's self-trust.",
    wisdom: "Ancient systems placed fire at the center for a reason…without it, nothing transforms.",
  },
  {
    id: "love",
    name: "Heart Chakra",
    title: "The Love Journey",
    color: "#22c55e",
    symbol: "/chakras/heart-symbol.svg",
    chooseIf: [
      "You love deeply but protect heavily",
      "Forgiveness feels impossible",
      "You oscillate between attachment and detachment",
      "You feel isolated even among people",
    ],
    teaches: "The heart is not weak. It's the bridge between earth and sky.",
    wisdom: "Traditionally, this was considered the balance point… where human meets divine.",
  },
  {
    id: "expression",
    name: "Throat Chakra",
    title: "The Truth Journey",
    color: "#06b6d4",
    symbol: "/chakras/throat-symbol.svg",
    chooseIf: [
      "You struggle to speak your truth",
      "You're misunderstood often",
      "You swallow words to keep peace",
      "You express everything except how you really feel",
    ],
    teaches: "Truth unspoken becomes tension stored.",
    wisdom: "Old cultures believed words carry energy… silence does too.",
  },
  {
    id: "insight",
    name: "Third Eye Chakra",
    title: "The Vision Journey",
    color: "#3b82f6",
    symbol: "/chakras/third-eye-symbol.svg",
    chooseIf: [
      "You sense things but dismiss them",
      "Logic dominates intuition",
      "You feel disconnected from meaning",
      "You seek answers outside instead of within",
    ],
    teaches: "Seeing isn't visual. It's perceptual.",
    wisdom: "Ancient science placed intuition above intellect, not against it.",
  },
  {
    id: "expansion",
    name: "Crown Chakra",
    title: "The Surrender Journey",
    color: "#9333ea",
    symbol: "/chakras/crown-symbol.svg",
    chooseIf: [
      "You're searching for purpose",
      "Success feels hollow",
      "You feel guided yet confused",
      "You're ready to release control",
    ],
    teaches: "You are not separate from existence.",
    wisdom: "Traditions never treated surrender as weakness, it was the highest intelligence.",
  },
];

// Journey Section Component
function JourneySection({ journey, index }: { journey: typeof journeys[0]; index: number }) {
  return (
    <section
      id={journey.id}
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
      style={{
        background: `linear-gradient(135deg, ${journey.color}10 0%, transparent 50%, ${journey.color}05 100%)`,
      }}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at ${index % 2 === 0 ? 'left' : 'right'} center, ${journey.color} 0%, transparent 70%)`,
        }}
      />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Symbol and Title */}
            <div className="flex flex-col items-center md:items-start space-y-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="relative w-32 h-32 md:w-40 md:h-40"
              >
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-50"
                  style={{ background: journey.color }}
                />
                <Image
                  src={journey.symbol}
                  alt={journey.name}
                  fill
                  className="object-contain relative z-10"
                  style={{ filter: "brightness(1.3) drop-shadow(0 0 20px currentColor)" }}
                />
              </motion.div>

              <div className="text-center md:text-left">
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`${fonts.playfair} text-4xl md:text-5xl font-light mb-2`}
                  style={{ color: journey.color }}
                >
                  {journey.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className={`${fonts.mulish} text-[#BD9958]/70 text-lg tracking-wider`}
                >
                  {journey.name}
                </motion.p>
              </div>
            </div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-8"
            >
              {/* Choose this journey if */}
              <div className="space-y-4">
                <h3
                  className={`${fonts.playfair} text-2xl font-medium text-[#BD9958]`}
                >
                  Choose this journey if:
                </h3>
                <ul className={`${fonts.mulish} space-y-3 text-white/80`}>
                  {journey.chooseIf.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: journey.color }}
                      />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* What this journey teaches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1 }}
                className="space-y-3"
              >
                <h3
                  className={`${fonts.playfair} text-2xl font-medium text-[#BD9958]`}
                >
                  What this journey teaches:
                </h3>
                <p className={`${fonts.mulish} text-white/90 text-lg leading-relaxed`}>
                  {journey.teaches}
                </p>
              </motion.div>

              {/* Traditional wisdom */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="relative"
              >
                <div
                  className="p-6 rounded-lg border-l-4"
                  style={{
                    borderColor: journey.color,
                    background: `linear-gradient(135deg, ${journey.color}05 0%, transparent 100%)`,
                  }}
                >
                  <p className={`${fonts.playfair} text-[#BD9958]/90 italic text-lg leading-relaxed`}>
                    {journey.wisdom}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default function JourneysPage() {
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (chakraId: string) => {
    const section = document.getElementById(chakraId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="bg-[#27190B] relative">
      {/* Aurora Background - Fixed */}
      <div className="fixed inset-0 z-0 opacity-30">
        <Aurora
          colorStops={["#BD9958", "#A01B04", "#27190B"]}
          amplitude={1.8}
          blend={0.6}
          speed={0.3}
        />
      </div>

      {/* Hero Section with HumanBranches */}
      <section className="h-screen flex flex-col items-center justify-between relative overflow-hidden py-8">
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="space-y-2"
          >
            <h1
              className={`${fonts.playfair} text-4xl md:text-6xl text-[#BD9958] font-light tracking-wide`}
            >
              Seven Sacred Journeys
            </h1>
            <p className={`${fonts.mulish} text-white/70 text-base md:text-lg max-w-2xl mx-auto`}>
              Each chakra holds a gateway to deeper self-awareness.
              <br />
              Click on the branches below to explore your path.
            </p>
          </motion.div>
        </Container>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="w-full flex-1 flex items-center justify-center"
        >
          <HumanBranches onChakraClick={scrollToSection} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5, repeat: Infinity, repeatType: "reverse" }}
          className="relative z-10 pb-4"
        >
          <div className="flex flex-col items-center gap-2">
            <span className={`${fonts.mulish} text-[#BD9958]/50 text-sm tracking-widest`}>
              SCROLL TO EXPLORE
            </span>
            <svg
              className="w-6 h-6 text-[#BD9958]/50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Journey Sections */}
      {journeys.map((journey, index) => (
        <JourneySection key={journey.id} journey={journey} index={index} />
      ))}

      {/* Closing CTA Section */}
      <section className="min-h-[50vh] flex items-center justify-center relative overflow-hidden py-20">
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-3xl mx-auto"
          >
            <h2 className={`${fonts.playfair} text-4xl md:text-5xl text-[#BD9958] font-light`}>
              Ready to Begin?
            </h2>
            <p className={`${fonts.mulish} text-white/80 text-xl leading-relaxed`}>
              Every journey starts with a single step inward.
              <br />
              Choose the path that calls to you, or let your intuition guide the way.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a
                href="/quiz"
                className={`${fonts.mulish} inline-block px-8 py-4 bg-[#BD9958] text-[#27190B] rounded-full text-lg font-medium tracking-wide hover:bg-[#BD9958]/90 transition-colors`}
              >
                Take the Quiz
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import Aurora from "@/components/ui/Aurora";
import fonts from "@/config/fonts";

export default function RitualGuidesHero() {
  return (
    <section className="relative min-h-[28vh] md:min-h-[32vh] flex items-center justify-center overflow-hidden mb-8 lg:mb-10">
      <div className="absolute inset-0 z-0 opacity-30">
        <Aurora
          colorStops={["#BD9958", "#A01B04", "#27190B"]}
          amplitude={1.5}
          blend={0.7}
          speed={0.4}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className={`${fonts.playfair} text-3xl sm:text-4xl md:text-5xl font-semibold text-primaryBeige tracking-wide leading-tight`}
        >
          Ritual Guides
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-6 md:mt-8 h-[1px] w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-[#BD9958] to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-5 md:mt-6 text-base md:text-lg lg:text-xl text-primaryBeige/70 italic font-light"
        >
          Select your product category, then open Hindi or English.
        </motion.p>
      </div>
    </section>
  );
}

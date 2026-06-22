"use client";

import { motion } from "framer-motion";
import Aurora from "@/components/ui/Aurora";
import fonts from "@/config/fonts";

export default function RitualsHero() {
  return (
    <section className="relative min-h-[40vh] md:min-h-[45vh] flex items-center justify-center overflow-hidden mb-12 lg:mb-16">
      <div className="absolute inset-0 z-0 opacity-30">
        <Aurora
          colorStops={["#BD9958", "#A01B04", "#27190B"]}
          amplitude={1.5}
          blend={0.7}
          speed={0.4}
        />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-base md:text-lg lg:text-xl tracking-[0.15em] uppercase mb-4 md:mb-6 text-[#BD9958] italic font-light"
        >
          Clarity first. Always.
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className={`${fonts.playfair} text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-primaryBeige tracking-wide leading-tight`}
        >
          AAKAURA RITUAL INTERACTION TERMS &amp; AWARENESS GUIDE
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-8 md:mt-10 h-[1px] w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-[#BD9958] to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-primaryBeige/70 italic font-light"
        >
          (Please read &amp; agree fully before proceeding)
        </motion.p>
      </div>
    </section>
  );
}

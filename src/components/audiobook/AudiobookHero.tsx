"use client";

import { motion, useReducedMotion } from "framer-motion";
import Aurora from "@/components/ui/Aurora";
import fonts from "@/config/fonts";

type AudiobookHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export default function AudiobookHero({
  eyebrow,
  title,
  subtitle,
}: AudiobookHeroProps) {
  const reduce = useReducedMotion();

  return (
    <section className="relative mb-10 flex min-h-[32vh] items-center justify-center overflow-hidden md:mb-14 md:min-h-[38vh]">
      <div className="absolute inset-0 z-0 opacity-30">
        <Aurora
          colorStops={["#BD9958", "#A01B04", "#27190B"]}
          amplitude={1.5}
          blend={0.7}
          speed={reduce ? 0 : 0.4}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-sm tracking-[0.32em] uppercase text-primaryBeige/60"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`${fonts.playfair} mt-4 text-4xl font-semibold leading-tight text-primaryBeige sm:text-5xl md:text-6xl`}
        >
          {title}
        </motion.h1>
        <motion.div
          initial={reduce ? false : { opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 0.35 }}
          className="mx-auto mt-6 h-px w-full max-w-md bg-gradient-to-r from-transparent via-[#BD9958] to-transparent md:mt-8"
        />
        {subtitle && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mx-auto mt-5 max-w-2xl text-lg italic text-primaryBeige/70 md:mt-6 md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}

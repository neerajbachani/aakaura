"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HERO_BOUQUET } from "@/config/homeHero";

type Bloom = (typeof HERO_BOUQUET.previewBlooms)[number];

/** Soft arc: edges low, peak in the middle (flat pyramid) */
const ARC_OFFSETS = ["translate-y-3", "translate-y-1", "-translate-y-1", "-translate-y-3", "-translate-y-1", "translate-y-1", "translate-y-3"];

function BloomFlower({
  bloom,
  delay = 0,
  arcClass,
}: {
  bloom: Bloom;
  delay?: number;
  arcClass: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={`group flex flex-col items-center gap-1.5 ${arcClass}`}
    >
      <div className="relative w-11 h-11 sm:w-14 sm:h-14 md:w-[4.25rem] md:h-[4.25rem] lg:w-20 lg:h-20">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 scale-125"
          style={{ backgroundColor: bloom.color }}
          aria-hidden="true"
        />
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{
            duration: 3 + delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-full h-full"
        >
          <Image
            src={bloom.src}
            alt={bloom.alt}
            fill
            loading="lazy"
            className="object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.35)] group-hover:scale-110 transition-transform duration-500"
            sizes="80px"
          />
        </motion.div>
      </div>
      <span
        className="text-[8px] sm:text-[9px] md:text-[10px] font-cormorant tracking-[0.15em] uppercase opacity-70 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        style={{ color: bloom.color }}
      >
        {bloom.name}
      </span>
    </motion.div>
  );
}

export default function HeroBouquetPanel() {
  // Left-to-right: root → crown (body order), for a natural flat arc
  const rowOrder = ["root", "sacral", "solar", "heart", "throat", "third-eye", "crown"] as const;
  const blooms = rowOrder
    .map((id) => HERO_BOUQUET.previewBlooms.find((b) => b.id === id)!)
    .filter(Boolean);

  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-[55vh] md:min-h-[60vh] w-full max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 45%, rgba(189,153,88,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center w-full gap-4 md:gap-5">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-[#BD9958]/90 text-xs md:text-sm uppercase tracking-[0.25em]"
        >
          {HERO_BOUQUET.eyebrow}
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-cormorant text-3xl md:text-4xl lg:text-5xl text-[#BD9958] font-light tracking-wide"
        >
          {HERO_BOUQUET.headline}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[#BD9958]/75 text-xs md:text-sm tracking-[0.2em] font-light uppercase"
        >
          {HERO_BOUQUET.subline}
        </motion.p>

        {/* Single row: gentle flat-pyramid arc */}
        <div className="flex items-end justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 my-4 md:my-6 w-full max-w-3xl mx-auto px-1">
          {blooms.map((bloom, i) => (
            <BloomFlower
              key={bloom.id}
              bloom={bloom}
              delay={0.12 + i * 0.04}
              arcClass={ARC_OFFSETS[i]}
            />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="text-[#F5E6D3]/85 text-sm md:text-base lg:text-lg leading-relaxed max-w-md font-light"
        >
          {HERO_BOUQUET.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Link
            href={HERO_BOUQUET.ctaHref}
            className="group relative inline-flex overflow-hidden px-10 py-3.5 border border-[#BD9958]/40 rounded-full bg-[#BD9958] text-[#27190b] font-cormorant text-lg md:text-xl tracking-widest uppercase hover:bg-[#BD9958]/90 transition-all duration-300 hover:scale-105 mt-1"
          >
            <span className="relative z-10">{HERO_BOUQUET.ctaLabel}</span>
            <span className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/25 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

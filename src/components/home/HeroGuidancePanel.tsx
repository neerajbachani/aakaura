"use client";

import Link from "next/link";
import Image from "next/image";
import { GUIDANCE_CALL, GUIDANCE_PRACTITIONERS } from "@/config/guidance";
import { HERO_GUIDANCE } from "@/config/homeHero";
import GuidancePromoBanner from "@/components/guidance/GuidancePromoBanner";

export default function HeroGuidancePanel() {
  return (
    <div className="relative flex flex-col items-center justify-center text-center min-h-[55vh] md:min-h-[60vh] px-4 py-8 max-w-2xl mx-auto">
      {/* Soft radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(189,153,88,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 md:gap-6">
        <GuidancePromoBanner className="w-full max-w-xl mb-1" />

        <p className="text-[#BD9958]/90 text-xs md:text-sm uppercase tracking-[0.25em]">
          {HERO_GUIDANCE.eyebrow}
        </p>

        <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl text-[#BD9958] font-light tracking-wide">
          {HERO_GUIDANCE.headline}
        </h2>

        <p className="text-[#F5E6D3]/90 text-sm md:text-lg leading-relaxed max-w-xl">
          {HERO_GUIDANCE.description}
        </p>

        {/* Stat chips */}
        <div className="flex items-center gap-3 md:gap-4">
          <div className="px-5 py-2.5 rounded-full border border-[#BD9958]/30 bg-[#BD9958]/10 backdrop-blur-sm">
            <p className="text-[#F5E6D3]/70 text-[10px] uppercase tracking-widest mb-0.5">
              Price
            </p>
            <p className="text-xl md:text-2xl font-semibold text-[#F5E6D3]">
              ₹{GUIDANCE_CALL.price}
            </p>
          </div>
          <div className="px-5 py-2.5 rounded-full border border-[#BD9958]/30 bg-[#BD9958]/10 backdrop-blur-sm">
            <p className="text-[#F5E6D3]/70 text-[10px] uppercase tracking-widest mb-0.5">
              Duration
            </p>
            <p className="text-xl md:text-2xl font-semibold text-[#F5E6D3]">
              {GUIDANCE_CALL.durationMinutes} Min
            </p>
          </div>
        </div>

        {/* Compact practitioner avatars */}
        <div className="flex flex-col items-center gap-3 mt-1">
          <div className="flex -space-x-3">
            {GUIDANCE_PRACTITIONERS.map((p) => (
              <div
                key={p.slug}
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-[#BD9958]/40"
              >
                <Image
                  src={p.imageUrl}
                  alt={p.name}
                  fill
                  className="object-cover"
                  sizes="56px"
                />
              </div>
            ))}
          </div>
          <p className="text-[#BD9958]/80 text-xs md:text-sm tracking-wide">
            Meet our practitioners
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-3 mt-2">
          <Link
            href={HERO_GUIDANCE.ctaHref}
            className="group relative overflow-hidden px-10 py-3.5 border border-[#BD9958]/40 rounded-full bg-[#BD9958] text-[#27190b] font-cormorant text-lg md:text-xl tracking-widest uppercase hover:bg-[#BD9958]/90 transition-all duration-300 hover:scale-105"
          >
            {HERO_GUIDANCE.ctaLabel}
          </Link>
          <Link
            href={HERO_GUIDANCE.secondaryHref}
            className="text-[#BD9958]/70 text-sm tracking-wide hover:text-[#BD9958] transition-colors underline underline-offset-4 decoration-[#BD9958]/30 hover:decoration-[#BD9958]"
          >
            {HERO_GUIDANCE.secondaryLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

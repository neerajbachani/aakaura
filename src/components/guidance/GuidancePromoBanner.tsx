import { GUIDANCE_COMPLIMENTARY_PROMO } from "@/config/guidance";
import { HERO_GUIDANCE } from "@/config/homeHero";
import fonts from "@/config/fonts";

type GuidancePromoBannerProps = {
  className?: string;
};

export default function GuidancePromoBanner({ className = "" }: GuidancePromoBannerProps) {
  const promo = HERO_GUIDANCE.promo;
  if (!promo?.enabled || !GUIDANCE_COMPLIMENTARY_PROMO.enabled) return null;

  return (
    <div className={`text-center ${className}`} role="status">
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="h-px w-10 md:w-14 bg-gradient-to-r from-transparent to-[#BD9958]/35" aria-hidden="true" />
        <span
          className={`${fonts.mulish} text-[#BD9958]/75 text-[10px] md:text-xs uppercase tracking-[0.2em] font-normal not-italic`}
        >
          From {GUIDANCE_COMPLIMENTARY_PROMO.startLabel}
        </span>
        <span className="h-px w-10 md:w-14 bg-gradient-to-l from-transparent to-[#BD9958]/35" aria-hidden="true" />
      </div>

      <p
        className={`${fonts.mulish} text-[#F5E6D3]/90 text-sm md:text-base lg:text-lg font-normal leading-relaxed not-italic max-w-xl mx-auto`}
      >
        The first {GUIDANCE_COMPLIMENTARY_PROMO.limit} guidance calls are complimentary, from
        Aakaura&apos;s side.
      </p>
    </div>
  );
}

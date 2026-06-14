import { getJourneyPricing } from "@/utils/pricing";

type JourneyPriceVariant = "panel" | "header" | "button" | "admin";

interface JourneyPriceDisplayProps {
  price: string;
  offerPrice?: string;
  variant?: JourneyPriceVariant;
  className?: string;
}

const variantStyles: Record<
  JourneyPriceVariant,
  { current: string; original: string; container: string }
> = {
  panel: {
    container: "flex items-center gap-2",
    current: "text-sm md:text-base opacity-70 tracking-widest",
    original: "text-xs md:text-sm opacity-40 line-through tracking-widest",
  },
  header: {
    container: "flex items-baseline gap-3 whitespace-nowrap",
    current:
      "text-2xl md:text-3xl font-cormorant font-light text-[#f4f1ea] opacity-80",
    original:
      "text-lg md:text-xl font-cormorant font-light text-[#f4f1ea]/40 line-through",
  },
  button: {
    container: "inline-flex items-baseline gap-2",
    current: "text-lg md:text-xl font-bold",
    original: "text-sm md:text-base font-normal opacity-40 line-through",
  },
  admin: {
    container: "flex items-center gap-2",
    current: "text-sm font-medium text-gray-700",
    original: "text-sm text-gray-400 line-through",
  },
};

export function JourneyPriceDisplay({
  price,
  offerPrice,
  variant = "panel",
  className = "",
}: JourneyPriceDisplayProps) {
  const { hasDiscount, currentPrice, originalPrice } = getJourneyPricing(
    price,
    offerPrice,
  );
  const styles = variantStyles[variant];

  if (!hasDiscount) {
    return <span className={`${styles.current} ${className}`}>{price}</span>;
  }

  return (
    <span className={`${styles.container} ${className}`}>
      <span className={styles.current}>{currentPrice}</span>
      <span className={styles.original}>{originalPrice}</span>
    </span>
  );
}

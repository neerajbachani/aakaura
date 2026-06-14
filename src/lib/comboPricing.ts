import { Combo, ComboProduct } from "@/types/Combo";

export interface ComboPricingTotals {
  original: number;
  effective: number;
}

type ComboProductRow = Pick<
  ComboProduct,
  "quantity" | "variationId"
> & {
  product: {
    price: number;
    offerPrice?: number | null;
  };
  variation?: {
    price?: number | null;
    offerPrice?: number | null;
  } | null;
};

function lineRegularPrice(cp: ComboProductRow): number {
  if (cp.variation?.price != null) return cp.variation.price;
  return cp.product.price || 0;
}

function lineEffectivePrice(cp: ComboProductRow): number {
  const regular = lineRegularPrice(cp);
  const offer =
    cp.variation?.offerPrice ?? cp.product.offerPrice ?? null;
  if (offer != null && offer < regular) return offer;
  return regular;
}

export function computeComboTotals(
  products: ComboProductRow[],
): ComboPricingTotals {
  return products.reduce(
    (acc, cp) => ({
      original: acc.original + lineRegularPrice(cp) * cp.quantity,
      effective: acc.effective + lineEffectivePrice(cp) * cp.quantity,
    }),
    { original: 0, effective: 0 },
  );
}

export function resolveComboPricing(
  combo: Pick<Combo, "price" | "offerPrice"> & {
    products: ComboProductRow[];
  },
): ComboPricingTotals {
  const computed = computeComboTotals(combo.products);
  const original = combo.price ?? computed.original;
  const effective =
    combo.offerPrice != null && combo.offerPrice < original
      ? combo.offerPrice
      : original;
  return { original, effective };
}

export function formatComboPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function parsePriceInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = parseFloat(trimmed.replace(/[₹,\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function getCartItemUnitPrices(
  pricing: ComboPricingTotals,
): { regular: number; effective: number } {
  return { regular: pricing.original, effective: pricing.effective };
}

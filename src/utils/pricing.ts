export function parsePriceString(
  value: string | number | undefined | null,
): number {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  return parseFloat(value.replace(/[^0-9.]/g, "")) || 0;
}

export function getJourneyPricing(price: string, offerPrice?: string) {
  const originalNum = parsePriceString(price);
  const offerNum = offerPrice ? parsePriceString(offerPrice) : null;
  const hasDiscount =
    offerNum != null && offerNum > 0 && offerNum < originalNum;

  return {
    hasDiscount,
    currentPrice: hasDiscount ? offerPrice! : price,
    originalPrice: hasDiscount ? price : null,
  };
}

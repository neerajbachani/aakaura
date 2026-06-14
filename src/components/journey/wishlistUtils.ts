import { ChakraData, JourneyProduct } from "@/data/chakras";

type ClientType = "soul-luxury" | "energy-curious";

type ProductSettings = Record<
  string,
  { isWaitlist?: boolean; isWishlistOnly?: boolean }
>;

export function isWishlistOnlyProduct(
  productSettings: ProductSettings | undefined,
  productId: string,
): boolean {
  const settings = productSettings?.[productId];
  return settings?.isWishlistOnly ?? settings?.isWaitlist ?? true;
}

export function getProductSettings(chakra: ChakraData): ProductSettings | undefined {
  return chakra.productSettings as ProductSettings | undefined;
}

export type { ClientType };

import { CartItem } from "@/types/Cart";

export function isJaipurPincode(zipCode: string): boolean {
  const zip = zipCode.trim();
  return zip.startsWith("302") || zip.startsWith("303");
}

export function cartHasBonsai(items: CartItem[]): boolean {
  return items.some((item) => {
    if (item.comboId && item.combo?.products) {
      return item.combo.products.some(
        (cp) => cp.product?.category?.name?.toLowerCase() === "bonsai",
      );
    }
    return item.product?.category?.name?.toLowerCase() === "bonsai";
  });
}

/** Human-readable labels for checkout messaging */
export function getBonsaiCartLabels(items: CartItem[]): string[] {
  const labels: string[] = [];

  for (const item of items) {
    if (item.comboId && item.combo?.products) {
      const comboHasBonsai = item.combo.products.some(
        (cp) => cp.product?.category?.name?.toLowerCase() === "bonsai",
      );
      if (comboHasBonsai) {
        labels.push(item.combo.name);
      }
      continue;
    }
    if (item.product?.category?.name?.toLowerCase() === "bonsai") {
      labels.push(item.product.name);
    }
  }

  return [...new Set(labels)];
}

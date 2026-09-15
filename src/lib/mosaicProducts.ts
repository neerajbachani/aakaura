import { Product } from "@/types/Product";

const CATEGORY_PRIORITY = [
  "wall hanging",
  "muffler",
  "jewellery",
  "anchor",
  "neck warmer",
  "bonsai",
];

function normalizeCategoryName(name?: string): string {
  return (name ?? "").trim().toLowerCase();
}

function getCategoryPriority(categoryName?: string): number {
  const normalized = normalizeCategoryName(categoryName);

  const exactIndex = CATEGORY_PRIORITY.indexOf(normalized);
  if (exactIndex >= 0) return exactIndex;

  const partialIndex = CATEGORY_PRIORITY.findIndex((category) =>
    normalized.includes(category),
  );
  if (partialIndex >= 0) return partialIndex;

  return CATEGORY_PRIORITY.length;
}

export function sortProductsByCategory(products: Product[]): Product[] {
  return [...products].sort((a, b) => {
    const priorityDiff =
      getCategoryPriority(a.category?.name) -
      getCategoryPriority(b.category?.name);

    if (priorityDiff !== 0) return priorityDiff;

    return a.name.localeCompare(b.name);
  });
}

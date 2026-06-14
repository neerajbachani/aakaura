export const COMBO_TIER_LABELS = {
  ENTRY: "Starter Bundles",
  CORE: "Core Ritual Sets",
  PREMIUM: "Premium Collections",
} as const;

export type ComboTierLabel =
  (typeof COMBO_TIER_LABELS)[keyof typeof COMBO_TIER_LABELS];

export const COMBO_CATEGORY_LINKS = [
  { name: "All Combos", href: "/combos", filter: "All" as const },
  {
    name: COMBO_TIER_LABELS.ENTRY,
    href: "/combos?category=starter-bundles",
    filter: COMBO_TIER_LABELS.ENTRY,
    slug: "starter-bundles",
  },
  {
    name: COMBO_TIER_LABELS.CORE,
    href: "/combos?category=core-ritual-sets",
    filter: COMBO_TIER_LABELS.CORE,
    slug: "core-ritual-sets",
  },
  {
    name: COMBO_TIER_LABELS.PREMIUM,
    href: "/combos?category=premium-collections",
    filter: COMBO_TIER_LABELS.PREMIUM,
    slug: "premium-collections",
  },
] as const;

const slugToFilter = new Map(
  COMBO_CATEGORY_LINKS.filter(
    (link): link is typeof link & { slug: string } => "slug" in link,
  ).map((link) => [link.slug, link.filter]),
);

export function getComboCategoryFilterFromSlug(
  slug: string | null | undefined,
): string {
  if (!slug) return "All";
  return slugToFilter.get(slug) ?? "All";
}

export function getComboCategorySlugFromFilter(filter: string): string | null {
  const link = COMBO_CATEGORY_LINKS.find((item) => item.filter === filter);
  return link && "slug" in link ? link.slug : null;
}

export function comboTierToCategoryLabel(tier: string): ComboTierLabel {
  if (tier === "PREMIUM") return COMBO_TIER_LABELS.PREMIUM;
  if (tier === "CORE") return COMBO_TIER_LABELS.CORE;
  return COMBO_TIER_LABELS.ENTRY;
}

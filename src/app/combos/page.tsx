import { prisma } from "@/lib/prisma";
import ChakraJourneyTemplate from "@/components/journey/ChakraJourneyTemplate";
import { ChakraData, JourneyProduct, chakrasData } from "@/data/chakras";

export const dynamic = "force-dynamic";

export default async function CombosPage() {
  // Query Prisma directly — avoids circular HTTP self-fetch that fails on Vercel SSR
  const db = prisma as any;
  const combos = await db.combo.findMany({
    include: {
      products: {
        include: {
          product: true,
          variation: true,
        },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!combos || combos.length === 0) {
    return (
      <div className="min-h-screen bg-[#27190b] flex items-center justify-center text-[#f4f1ea]">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Combos & Sets</h1>
          <p className="opacity-60">No combos available at the moment.</p>
        </div>
      </div>
    );
  }

  // Construct a "Combos" ChakraData object
  // We'll use the 'grounding' chakra styles as a base or maybe neutral/gold if possible
  const baseChakra = chakrasData["grounding"];

  // Fetch all journeys from the database
  const journeys = await prisma.journey.findMany();

  // Create a product lookup map using normalized names
  // Map<normalizedName, { slug: string, id: string }>
  const productLookup = new Map<string, { slug: string; id: string }>();

  journeys.forEach((journey) => {
    const content = journey.content as any;
    const normalize = (str: string) =>
      str.toLowerCase().replace(/[^a-z0-9]/g, "");

    // Check soul-luxury
    const slProducts = content["soul-luxury"] || [];
    slProducts.forEach((p: any) => {
      if (p.name) {
        productLookup.set(normalize(p.name), { slug: journey.slug, id: p.id });
      }
    });

    // Check energy-curious
    const ecProducts = content["energy-curious"] || [];
    ecProducts.forEach((p: any) => {
      if (p.name) {
        productLookup.set(normalize(p.name), { slug: journey.slug, id: p.id });
      }
    });
  });

  const journeyProducts: JourneyProduct[] = combos.map(
    (combo: any, index: number) => {
      // Calculate total price from products if not available on combo
      // Note: Combo type usually doesn't have price, but products do.
      const totalPrice = combo.products.reduce((sum: number, cp: any) => {
        const pPrice = cp.product.price || 0;
        return sum + pPrice * cp.quantity;
      }, 0);

      return {
        id: combo.slug, // Use combo slug as ID so ?product=slug works
        name: combo.name,
        sanskritName: "",
        description: combo.description,
        specificDescription: combo.description, // Use duplicate for now
        price: `₹${totalPrice}`,
        ethos: combo.tagline,
        whatItsFor: `A curated ${combo.tier.toLowerCase()} collection.`,
        features: combo.products.map(
          (cp: any) => `${cp.quantity}x ${cp.product.name}`,
        ),
        images: combo.images || [],
        step: index + 1,
        category:
          combo.tier === "PREMIUM"
            ? "Premium Collections"
            : combo.tier === "CORE"
              ? "Core Ritual Sets"
              : "Starter Bundles",
        // We can use variants to show included products if we want to get fancy,
        // but for now let's stick to the main images.
        variants: [],
        // Add custom fields if needed by template
        includedProducts: combo.products.map((cp: any) => {
          const normalize = (str: string) =>
            str.toLowerCase().replace(/[^a-z0-9]/g, "");
          const productName = cp.product.name;
          const normalizedName = normalize(productName);

          let lookup = productLookup.get(normalizedName);

          // Fallback: Fuzzy match if exact match not found
          // This handles cases like "Muffler: Orange" vs "Muffler: Tangerine"
          if (!lookup) {
            // Strategy 1: Use 'detail' field to find Journey (e.g. "Sacral" -> "flow")
            if (cp.detail) {
              const detailLower = cp.detail.toLowerCase();
              const targetJourney = journeys.find(
                (j) =>
                  j.name.toLowerCase().includes(detailLower) ||
                  j.slug.toLowerCase().includes(detailLower) ||
                  (j.content as any)?.sanskritName
                    ?.toLowerCase()
                    .includes(detailLower),
              );

              if (targetJourney) {
                const content = targetJourney.content as any;
                const allJourneyProducts = [
                  ...(content["soul-luxury"] || []),
                  ...(content["energy-curious"] || []),
                ];

                // Find best match in this journey
                // Simple heuristic: check if journey product name contains key parts of combo product name
                // e.g. "Muffler"
                const keywords = productName
                  .split(/[\s:-]+/)
                  .filter((w: string) => w.length > 3)
                  .map((w: string) => w.toLowerCase());

                const bestMatch = allJourneyProducts.find((p: any) => {
                  const pNameLower = p.name.toLowerCase();
                  // Check if at least one significant keyword matches
                  return keywords.some((k: string) => pNameLower.includes(k));
                });

                if (bestMatch) {
                  lookup = { slug: targetJourney.slug, id: bestMatch.id };
                }
              }
            }

            // Strategy 2: Global fuzzy match (if detail search failed)
            if (!lookup) {
              const keywords = productName
                .split(/[\s:-]+/)
                .filter((w: string) => w.length > 4)
                .map((w: string) => w.toLowerCase());
              // Iterate all journeys to find any product containing keywords
              for (const journey of journeys) {
                const content = journey.content as any;
                const allJourneyProducts = [
                  ...(content["soul-luxury"] || []),
                  ...(content["energy-curious"] || []),
                ];
                const potentialMatch = allJourneyProducts.find((p: any) => {
                  const pNameLower = p.name.toLowerCase();
                  // Require match of "Aamvaraah" AND "Muffler" if present?
                  // Let's just require 2 keywords to match if possible, or 1 unique one.
                  const matches = keywords.filter((k: string) =>
                    pNameLower.includes(k),
                  );
                  return matches.length >= Math.min(keywords.length, 2);
                });
                if (potentialMatch) {
                  lookup = { slug: journey.slug, id: potentialMatch.id };
                  break;
                }
              }
            }
          }

          const url = lookup
            ? `/journey/${lookup.slug}?product=${lookup.id}&autoOpen=false`
            : "#";

          return {
            name: cp.product.name,
            image: cp.product.images[0] || "",
            url,
            description: cp.detail || undefined,
          };
        }),
      };
    },
  );

  const combosChakraData: ChakraData = {
    ...baseChakra,
    slug: "combos",
    name: "Curated Combos",
    tagline: "Begin Your Journey",
    sanskritName: "Sangha", // Sanskrit for community/collection/association
    tone: "Wholeness",
    description:
      "Thoughtfully assembled collections to support your spiritual journey. From starter bundles to premium ritual sets.",
    // Override colors for a "Combos" theme - maybe Gold/Neutral
    colors: {
      primary: "#D4AF37", // Gold
      dark: "#78350F", // Brown
      light: "#FFFBEB", // Light yellow/beige
      gradient: "from-amber-500 via-yellow-500 to-orange-400",
    },
    // Populate both client types with the same list for now
    content: {
      "soul-luxury": journeyProducts,
      "energy-curious": journeyProducts,
    },
  };

  return (
    <ChakraJourneyTemplate
      chakra={combosChakraData}
      relatedCombos={null} // Don't show related combos on the combos page
    />
  );
}

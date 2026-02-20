import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Combo } from "@/types/Combo";
import { prisma } from "@/lib/prisma";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

interface RelatedCombosProps {
  chakraSlug: string;
}

export default async function RelatedCombos({
  chakraSlug,
}: RelatedCombosProps) {
  // Query Prisma directly — avoids HTTP self-fetch that fails on Vercel SSR
  const db = prisma as any;
  const combos: Combo[] = await db.combo.findMany({
    where: {
      chakras: { has: chakraSlug },
    },
    include: {
      products: {
        include: { product: true },
        orderBy: { order: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 6,
  });

  if (!combos || combos.length === 0) {
    return null;
  }

  // Helper to get main image
  const getMainImage = (combo: Combo) => {
    return combo.images && combo.images.length > 0
      ? combo.images[0]
      : "/placeholder.png";
  };

  return (
    <section className="py-16 md:py-24 bg-[#f4f1ea]/5 border-t border-[#f4f1ea]/10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-[#f4f1ea] mb-2 font-serif">
              Curated Sets & Combos
            </h2>
            <p className="text-[#f4f1ea]/60 md:max-w-xl">
              Enhance your journey with these hand-picked collections featuring
              items from this chakra.
            </p>
          </div>
          <Link
            href="/combos"
            className="hidden md:flex items-center gap-2 text-[#f4f1ea] border-b border-[#f4f1ea]/30 hover:border-[#f4f1ea] pb-1 transition-all"
          >
            View All Combos <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {combos.map((combo) => (
            <Link
              href={`/combos?product=${combo.slug}`}
              key={combo.id}
              className="group block relative bg-[#f4f1ea]/5 border border-[#f4f1ea]/10 rounded-xl overflow-hidden hover:border-[#f4f1ea]/30 transition-all duration-500"
            >
              {/* Image Aspect Ratio Container */}
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src={getMainImage(combo)}
                  alt={combo.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

                {/* Tag / Tier */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`
                    px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase backdrop-blur-md
                    ${
                      combo.tier === "PREMIUM"
                        ? "bg-purple-500/20 text-purple-200 border border-purple-500/30"
                        : combo.tier === "CORE"
                          ? "bg-blue-500/20 text-blue-200 border border-blue-500/30"
                          : "bg-green-500/20 text-green-200 border border-green-500/30"
                    }
                  `}
                  >
                    {combo.tier}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-medium text-[#f4f1ea] group-hover:text-[#d4af37] transition-colors">
                    {combo.name}
                  </h3>
                </div>

                <p className="text-[#f4f1ea]/50 text-sm mb-4 line-clamp-2 min-h-[40px]">
                  {combo.tagline}
                </p>

                {/* Included Items Preview */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-[#f4f1ea]/40 uppercase tracking-widest">
                    Includes:
                  </span>
                  <div className="flex -space-x-2">
                    {combo.products?.slice(0, 3).map((item, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border border-[#1a1a1a] bg-[#2a2a2a] overflow-hidden relative"
                        title={item.product?.name}
                      >
                        {item.product?.images?.[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                    ))}
                    {(combo.products?.length || 0) > 3 && (
                      <div className="w-6 h-6 rounded-full border border-[#1a1a1a] bg-[#333] flex items-center justify-center text-[9px] text-white">
                        +{combo.products!.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center text-[#f4f1ea] text-sm font-medium border-t border-[#f4f1ea]/10 pt-4 mt-auto">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-2">
                    View Details <ArrowRightIcon className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 md:hidden text-center">
          <Link
            href="/combos"
            className="inline-flex items-center gap-2 text-[#f4f1ea] border-b border-[#f4f1ea]/30 hover:border-[#f4f1ea] pb-1"
          >
            View All Combos <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

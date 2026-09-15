"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Product } from "@/types/Product";
import fonts from "@/config/fonts";

const GRID_SIZE = 12;
const STAGGER_MS = 700;
const CYCLE_PAUSE_MS = 3500;
const TRANSITION_MS = 0;

type MosaicTile = {
  product: Product;
  image: string;
};

function tileKey(tile: MosaicTile): string {
  return `${tile.product.id}:${tile.image}`;
}

function buildAllTiles(products: Product[]): MosaicTile[] {
  const tiles: MosaicTile[] = [];

  for (const product of products) {
    for (const image of product.images ?? []) {
      if (!image) continue;
      tiles.push({ product, image });
    }
  }

  return tiles;
}

function buildInitialVisible(allTiles: MosaicTile[]): MosaicTile[] {
  if (allTiles.length === 0) return [];

  const visible: MosaicTile[] = [];
  const usedKeys = new Set<string>();

  for (const tile of allTiles) {
    const key = tileKey(tile);
    if (usedKeys.has(key)) continue;
    visible.push(tile);
    usedKeys.add(key);
    if (visible.length >= GRID_SIZE) return visible;
  }

  let index = 0;
  while (visible.length < GRID_SIZE) {
    visible.push(allTiles[index % allTiles.length]);
    index += 1;
  }

  return visible;
}

function pickNextTile(
  visible: MosaicTile[],
  slotIndex: number,
  pool: MosaicTile[],
  poolIndexRef: { current: number },
): MosaicTile {
  const current = visible[slotIndex];
  const visibleKeys = new Set(visible.map(tileKey));

  for (let offset = 0; offset < pool.length; offset += 1) {
    const index = (poolIndexRef.current + offset) % pool.length;
    const candidate = pool[index];

    if (visibleKeys.has(tileKey(candidate))) continue;

    poolIndexRef.current = (index + 1) % pool.length;
    return candidate;
  }

  return current;
}

function swapTileAt(
  visible: MosaicTile[],
  slotIndex: number,
  pool: MosaicTile[],
  poolIndexRef: { current: number },
): MosaicTile[] {
  const next = [...visible];
  next[slotIndex] = pickNextTile(visible, slotIndex, pool, poolIndexRef);
  return next;
}

function shuffledSlotOrder(): number[] {
  const indices = Array.from({ length: GRID_SIZE }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

interface ProductMosaicGridProps {
  products: Product[];
}

export default function ProductMosaicGrid({ products }: ProductMosaicGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const poolIndexRef = useRef(0);
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const allTiles = useMemo(() => buildAllTiles(products), [products]);
  const allTilesRef = useRef(allTiles);
  const initialVisible = useMemo(
    () => buildInitialVisible(allTiles),
    [allTiles],
  );

  allTilesRef.current = allTiles;

  const [visibleTiles, setVisibleTiles] = useState<MosaicTile[]>(initialVisible);
  const canAnimate = allTiles.length > GRID_SIZE;

  useEffect(() => {
    setVisibleTiles(initialVisible);
    poolIndexRef.current = 0;
  }, [initialVisible]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion || !canAnimate) return;

    let cancelled = false;
    let timeoutId: number;

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timeoutId = window.setTimeout(resolve, ms);
      });

    const runCycle = async () => {
      await sleep(CYCLE_PAUSE_MS);
      if (cancelled) return;

      while (!cancelled) {
        const slotOrder = shuffledSlotOrder();

        for (let step = 0; step < slotOrder.length; step += 1) {
          if (cancelled) return;

          if (step > 0) {
            await sleep(STAGGER_MS);
            if (cancelled) return;
          }

          const slotIndex = slotOrder[step];
          setVisibleTiles((current) =>
            swapTileAt(
              current,
              slotIndex,
              allTilesRef.current,
              poolIndexRef,
            ),
          );
        }

        await sleep(CYCLE_PAUSE_MS);
      }
    };

    runCycle();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [isVisible, prefersReducedMotion, canAnimate]);

  if (visibleTiles.length === 0) return null;

  return (
    <section
        ref={sectionRef}
        aria-label="Featured product collection"
        className="relative h-screen min-h-[100dvh] w-full overflow-hidden bg-[#27190B]"
      >
        <div className="grid h-full w-full grid-cols-2 grid-rows-6 md:grid-cols-3 md:grid-rows-4 lg:grid-cols-4 lg:grid-rows-3">
          {visibleTiles.map((tile, index) => (
            <div
              key={`cell-${index}`}
              className="relative min-h-0 overflow-hidden bg-[#1a1008]"
              aria-hidden="true"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tileKey(tile)}
                  initial={prefersReducedMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : TRANSITION_MS / 1000,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={tile.image}
                    alt={tile.product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(39,25,11,0.55)_0%,rgba(39,25,11,0.18)_42%,transparent_70%)]">
          <div className="pointer-events-auto mx-4 max-w-xl px-4 text-center sm:px-8">
            <h2
              className={`${fonts.cormorant} text-4xl font-medium tracking-[0.18em] text-white uppercase sm:text-5xl md:text-6xl lg:text-7xl`}
            >
              The Collection
            </h2>
            <p
              className={`${fonts.cormorant} mt-3 text-base tracking-wide text-white/85 sm:mt-4 sm:text-lg md:text-xl`}
            >
              Handcrafted pieces for the energy within.
            </p>
            <Link
              href="/products"
              className={`${fonts.cormorant} mt-6 inline-flex items-center justify-center bg-[#111111] px-8 py-3 text-sm tracking-[0.22em] text-white uppercase transition-colors duration-300 hover:bg-[#BD9958] hover:text-[#27190B] sm:mt-8 sm:px-10 sm:text-base`}
            >
              Shop now
            </Link>
          </div>
        </div>
    </section>
  );
}

"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { HERO_PATHS, type HeroPath } from "@/config/homeHero";

interface HeroPathSelectorProps {
  activePath: HeroPath;
  onChange: (path: HeroPath) => void;
}

export default function HeroPathSelector({
  activePath,
  onChange,
}: HeroPathSelectorProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);

  // Scroll active tab into view only when needed (skip first paint so default stays centered)
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const index = HERO_PATHS.findIndex((p) => p.id === activePath);
    const tab = tabRefs.current[index];
    const list = listRef.current;
    if (!tab || !list) return;

    const listRect = list.getBoundingClientRect();
    const tabRect = tab.getBoundingClientRect();
    const overflows =
      tabRect.left < listRect.left + 4 || tabRect.right > listRect.right - 4;
    if (overflows) {
      tab.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activePath]);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = HERO_PATHS.findIndex((p) => p.id === activePath);
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % HERO_PATHS.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + HERO_PATHS.length) % HERO_PATHS.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = HERO_PATHS.length - 1;
    } else {
      return;
    }

    onChange(HERO_PATHS[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className="flex w-full justify-center">
      <div
        ref={listRef}
        role="tablist"
        aria-label="Choose how to begin"
        onKeyDown={handleKeyDown}
        className="grid grid-cols-3 w-full max-w-3xl gap-1 p-1 rounded-full border border-[#BD9958]/30 bg-[#BD9958]/5 backdrop-blur-sm"
      >
        {HERO_PATHS.map((path, index) => {
          const isActive = activePath === path.id;
          return (
            <button
              key={path.id}
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              role="tab"
              id={`hero-tab-${path.id}`}
              aria-selected={isActive}
              aria-controls={path.panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(path.id)}
              className={`
                w-full min-w-0 px-2 sm:px-3 md:px-4 py-2.5 md:py-3
                rounded-full font-cormorant
                text-[10px] sm:text-xs md:text-sm tracking-widest uppercase
                text-center transition-all duration-300
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BD9958] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent
                ${
                  isActive
                    ? "bg-[#BD9958]/15 border border-[#BD9958]/50 text-[#BD9958] shadow-[0_0_20px_rgba(189,153,88,0.15)]"
                    : "border border-transparent text-[#BD9958] opacity-70 hover:opacity-100"
                }
              `}
            >
              <span className="md:hidden">{path.shortLabel}</span>
              <span className="hidden md:inline leading-tight">{path.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

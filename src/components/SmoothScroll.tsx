"use client";

import { ReactNode, useEffect, useRef } from "react";
import Lenis from "lenis";
import { LenisProvider, useLenis } from "@/context/LenisContext";

type Props = {
  children: ReactNode;
};

const LenisController = ({ children }: { children: ReactNode }) => {
  const { setLenis } = useLenis();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // You can pass other options: smoothWheel, smoothTouch, etc.
    });
    lenisRef.current = lenis;
    setLenis(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      setLenis(null as any);
    };
  }, [setLenis]);

  return <>{children}</>;
};

const SmoothScroll = ({ children }: Props) => {
  return (
    <LenisProvider>
      <LenisController>{children}</LenisController>
    </LenisProvider>
  );
};

export default SmoothScroll;

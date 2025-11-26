"use client";
import React, { createContext, useContext, useState } from "react";
import Lenis from "lenis";

interface LenisContextType {
  lenis: Lenis | null;
  setLenis: (lenis: Lenis) => void;
}

const LenisContext = createContext<LenisContextType | undefined>(undefined);

export const LenisProvider = ({ children }: { children: React.ReactNode }) => {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  return (
    <LenisContext.Provider value={{ lenis, setLenis }}>
      {children}
    </LenisContext.Provider>
  );
};

export const useLenis = () => {
  const context = useContext(LenisContext);
  if (context === undefined) {
    throw new Error("useLenis must be used within a LenisProvider");
  }
  return context;
};

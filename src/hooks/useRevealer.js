"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

// Register custom "hop" ease
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export function useRevealer() {
  useEffect(() => {
    gsap.to(".revealer", {
      scaleY: 0,
      duration: 1.25,
      delay: 1,
      ease: "hop",
    });
  }, []);
}
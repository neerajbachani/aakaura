'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedTextProps {
  text?: string;
  className?: string;
}

export default function AnimatedText({ 
  text = "Still searching? Your search ends now.",
  className = ""
}: AnimatedTextProps) {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const textWrapperRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);

  const [mounted, setMounted] = useState(false);

  // Explicit direction sets
  const upChars = new Set(['S', 'o', ',']);
  const downChars = new Set(['a', 'r', 'e']);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const pinWrapper = pinWrapperRef.current;
    const textWrapper = textWrapperRef.current;
    const letters = lettersRef.current;

    if (!pinWrapper || !textWrapper || letters.length === 0) return;

    // Initialize revealed array - REMOVED
    let scrollProgress = 0;

    function updateAnimation() {
      if (!pinWrapper || !textWrapper) return;

      const rect = pinWrapper.getBoundingClientRect();
      const pinWrapperHeight = pinWrapper.offsetHeight;
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;

      // Global scroll progress across pinned section (0..1)
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        scrollProgress = Math.abs(rect.top) / (pinWrapperHeight - windowHeight);
        scrollProgress = Math.max(0, Math.min(1, scrollProgress));
      } else if (rect.top > 0) {
        scrollProgress = 0;
      } else {
        scrollProgress = 1;
      }

      // Horizontal translate
      // We want the end of the text to be centered at scrollProgress = 1
      const totalWidth = textWrapper.scrollWidth;
      // Target: translateX + totalWidth = windowWidth / 2
      const targetTranslateX = (windowWidth / 2) - totalWidth;
      const translateX = scrollProgress * targetTranslateX;
      
      textWrapper.style.transform = `translate3d(${translateX}px, 0, 0)`;

      // Per-letter threshold: when the letter center crosses this X, lock it straight
      const thresholdX = windowWidth * 0.3;

      // Wave settings
      const baseAmplitude = 60;
      const frequency = 3.0;
      const staggerBase = 0.12;

      letters.forEach((letter, index) => {
        if (!letter) return;

        const r = letter.getBoundingClientRect();
        const centerX = r.left + r.width / 2;

        // If letter has crossed the threshold, lock it straight
        if (centerX <= thresholdX) {
          letter.style.transform = `translateY(0px) rotate(0deg)`;
          return;
        }

        // Not revealed: compute easing factor based on distance to threshold
        const distance = Math.max(0, centerX - thresholdX);
        const fadeRange = windowWidth * 0.6;
        const rawFactor = Math.max(0, Math.min(1, distance / fadeRange));
        const amplitudeFactor = rawFactor * rawFactor;

        // Direction sign per letter
        let sign = (index % 2 === 0) ? 1 : -1;
        const char = (letter.textContent || '').trim();
        if (upChars.has(char)) sign = -1;
        if (downChars.has(char)) sign = 1;

        // Phase / progress for this letter
        const phase = (scrollProgress * 1.5) + (index * staggerBase);
        const angle = phase * Math.PI * frequency;

        // Compute vertical motion and gentle rotation
        const y = Math.sin(angle) * baseAmplitude * amplitudeFactor * sign;
        const rotation = Math.sin(angle * 0.7) * 3 * amplitudeFactor * sign;

        letter.style.transform = `translateY(${y}px) rotate(${rotation}deg)`;
      });
    }

    // Optimized scroll loop
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateAnimation();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateAnimation);

    // Initial call
    updateAnimation();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateAnimation);
    };
  }, [mounted, upChars, downChars]);

  // Split text into letters and spaces
  const renderText = () => {
    return text.split('').map((char, index) => {
      if (char === ' ') {
        return <span key={index} className="inline-block w-[0.3em]" />;
      }
      return (
        <span
          key={index}
          ref={(el) => {
            if (el) lettersRef.current[index] = el;
          }}
          className="inline-block will-change-transform"
        >
          {char}
        </span>
      );
    });
  };

  return (
    <>
      {/* Spacer before */}
      {/* <div className="h-screen flex items-center justify-center text-5xl text-gray-600">
        ↓ Scroll down to see the animation ↓
      </div> */}

      {/* Pin wrapper */}
      <div ref={pinWrapperRef} className="h-[400vh] relative">
        <div className="sticky top-0 w-screen h-screen flex items-center overflow-hidden bg-[#27190B] text-white">
          <div
            ref={textWrapperRef}
            className={`flex whitespace-nowrap text-[25vw] md:text-[16vw] lg:text-[12vw] font-bold leading-[0.9] tracking-[0.02em] pl-[100vw] will-change-transform ${className}`}
          >
            {renderText()}
          </div>
        </div>
      </div>

      {/* Spacer after */}
     
    </>
  );
}

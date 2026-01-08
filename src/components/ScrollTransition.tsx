'use client';

import { useLayoutEffect, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ScrollTransition.css';

// Ensure ScrollTrigger is registered
gsap.registerPlugin(ScrollTrigger);

export default function ScrollTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // We need a 2D array of refs for the words in each block
  const wordsRefs = useRef<(HTMLSpanElement | null)[][]>([[], [], []]);
  
  const blocksContent = [
    "We work with form, earth, and silence. Not to change you, but to remove what never belonged.",
    "Everything here is made slowly. Because energy doesn't respond to urgency.",
    // "The final images aim to capture the shift between who they are and become the moment the shutter falls still."
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // --- STAGGER MATH ---
      const getStaggerProgress = (progress: number, index: number, total: number, overlap = 4) => {
        const singleDuration = 1 / total;
        const totalDuration = 1 + (overlap * singleDuration);
        
        const start = (index * singleDuration) / totalDuration;
        const end = start + (overlap * singleDuration) / totalDuration;
        
        return gsap.utils.clamp(0, 1, gsap.utils.mapRange(start, end, 0, 1, progress));
      };

      // Initial set state: blocks > 0 hidden
      // The snippet hides words of block 1 and 2 initially?
      // Snippet logic:
      /*
        if(i > 0) {
            gsap.set(words, { yPercent: 100, opacity: 0 });
        }
      */
      wordsRefs.current.forEach((words, i) => {
        if (i > 0 && words) {
           gsap.set(words, { yPercent: 100, opacity: 0 });
        }
      });

      // --- SCROLL TRIGGER ---
      ScrollTrigger.create({
        trigger: ".scroll-grid-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0,
        onUpdate: (self) => {
          const p = self.progress;
          
          gsap.set(".progress-fill", { scaleY: p });

          let phase1 = 0;
          let phase2 = 0;

          if (p <= 0.5) {
            phase1 = p * 2;
          } else {
            phase1 = 1;
            phase2 = (p - 0.5) * 2;
          }

          // BLOCK 1: Exits Up
          const w1 = wordsRefs.current[0];
          w1.forEach((word, i) => {
            if (!word) return;
            const prog = getStaggerProgress(phase1, i, w1.length);
            gsap.set(word, { 
              yPercent: -100 * prog,
              opacity: 1 - prog
            });
          });

          // BLOCK 2: Enters then Exits
          const w2 = wordsRefs.current[1];
          const totalWords2 = w2.length;
          w2.forEach((word, i) => {
             if (!word) return;
             if (p <= 0.5) {
                const prog = getStaggerProgress(phase1, i, totalWords2);
                gsap.set(word, { 
                  yPercent: 100 * (1 - prog),
                  opacity: prog
                });
             } else {
                const prog = getStaggerProgress(phase2, i, totalWords2);
                gsap.set(word, { 
                   yPercent: -100 * prog,
                   opacity: 1 - prog
                });
             }
          });

          // BLOCK 3: Enters
          const w3 = wordsRefs.current[2];
          w3.forEach((word, i) => {
             if (!word) return;
             const prog = getStaggerProgress(phase2, i, w3.length);
             gsap.set(word, { 
                yPercent: 100 * (1 - prog),
                opacity: prog
             });
          });
        }
      });

      // --- VELOCITY-BASED MARQUEE ---
      // We need to implement ticker here.
      // Since specific variables are needed, we can do it inside context too.
    }, containerRef); // Scope to container

    // Ticker needs to be outside or careful with cleanup.
    // The snippet used global window.scrollY.
    // We can clean this up separately.
    
    let marqueePos = 0;
    let baseSpeed = 0.5;
    let currentSpeed = 0.5;
    let lastScrollY = window.scrollY;
    let velocity = 0;

    const tickerFunc = () => {
        const currentScrollY = window.scrollY;
        velocity = Math.abs(currentScrollY - lastScrollY);
        lastScrollY = currentScrollY;

        const targetSpeed = baseSpeed + (velocity * 0.2);
        currentSpeed += (targetSpeed - currentSpeed) * 0.1;

        marqueePos -= currentSpeed;

        if (trackRef.current) {
            const totalWidth = trackRef.current.scrollWidth;
            // We have 3 sets of items. oneSetWidth is roughly 1/3
            // Wait, the snippet had items.forEach clone twice => 3 sets.
            // "totalWidth" is full width. "oneSetWidth" is 1/3 of total.
            const oneSetWidth = totalWidth / 3;

            if (Math.abs(marqueePos) >= oneSetWidth) {
                marqueePos += oneSetWidth;
            }

            gsap.set(trackRef.current, { x: marqueePos });
        }
    };

    gsap.ticker.add(tickerFunc);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerFunc);
    };
  }, []);

  // Helper for image items
  const imgItems = [
     "Image 1", "Image 2", "Image 3", "Image 4", "Image 5", "Image 6"
  ];
  // Triplicate the items
  const allMarqueeItems = [...imgItems, ...imgItems, ...imgItems];

  return (
    <div className="st-wrapper " ref={containerRef}>
      <div className="scroll-grid-container  ">
        
        {/* Sticky Hero */}
        <section className="sticky-hero ">
            
            {/* Nav positioned consistently with hero */}
            <nav className="st-nav">
                <div className="nav-col">
                    <p>C/ G191125</p>
                </div>
                <div className="nav-col">
                    <p>Experiment_507</p>
                </div>
            </nav>

            <div className="text-wrapper">
                {blocksContent.map((text, blockIndex) => (
                    <div className="text-block" id={`block-${blockIndex + 1}`} key={blockIndex}>
                        <p>
                            {text.split(' ').map((word, wordIndex) => (
                                <span 
                                  className="word" 
                                  key={wordIndex}
                                  ref={(el) => {
                                      if (wordsRefs.current[blockIndex]) {
                                          wordsRefs.current[blockIndex][wordIndex] = el;
                                      }
                                  }}
                                >
                                    {word}{' '}
                                </span>
                            ))}
                        </p>
                    </div>
                ))}
            </div>

            <div className="marquee-container">
                <div className="marquee-track" ref={trackRef}>
                    {allMarqueeItems.map((itemText, i) => (
                        <div className="img-item" key={i}>{itemText}</div>
                    ))}
                </div>
            </div>

            <div className="progress-bar">
                <div className="progress-fill"></div>
            </div>
        </section>
      </div>
    </div>
  );
}

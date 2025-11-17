"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChakraData } from "@/data/chakras";
import fonts from "@/config/fonts";
import { useRevealer } from "@/hooks/useRevealer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ChakraJourneyTemplateProps {
  chakra: ChakraData;
}

export default function ChakraJourneyTemplate({
  chakra,
}: ChakraJourneyTemplateProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  
  useRevealer();

  // GSAP Horizontal Scroll Effect
  useEffect(() => {
    const horizontalContainer = horizontalContainerRef.current;
    const section3 = section3Ref.current;

    if (!horizontalContainer || !section3) return;

    // Calculate scroll width
    const scrollWidth = horizontalContainer.scrollWidth;
    const viewportWidth = window.innerWidth;

    // Create horizontal scroll animation
    const horizontalScroll = gsap.to(horizontalContainer, {
      x: () => -(scrollWidth - viewportWidth),
      ease: "none",
      scrollTrigger: {
        trigger: section3,
        pin: true,
        scrub: 1,
        end: () => `+=${scrollWidth - viewportWidth}`,
        invalidateOnRefresh: true,
      }
    });

    // Animate images scaling to full size when panel is centered
    const panels = gsap.utils.toArray('.panel');
    panels.forEach((panel: any, index) => {
      const image = panel.querySelector('.panel-image');
      
      gsap.fromTo(image, 
        {
          scale: 0.7,
          borderRadius: '24px',
        },
        {
          scale: 1,
          borderRadius: '0px',
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalScroll,
            start: 'left center',
            end: 'center center',
            scrub: 1,
          }
        }
      );
    });

    return () => {
      horizontalScroll.kill();
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [chakra.products]);

  // Background image mapping for each chakra
  const getBackgroundImage = (slug: string) => {
    const backgrounds: Record<string, string> = {
      grounding: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
      flow: "/images/flow-journey.png",
      power: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop",
      love: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop",
      expression: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop",
      insight: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop",
      expansion: "/images/flow-product.png",
    };
    return backgrounds[slug] || backgrounds.grounding;
  };

  return (
    <div className="min-h-screen bg-[#27190b]">
      {/* Revealer overlay for page entrance */}
      <div className="revealer fixed inset-0 bg-primaryBrown z-50 origin-top" />
      
      {/* Section 3: Horizontal Scrolling Products - NOW AT TOP */}
      <section ref={section3Ref} className="relative h-screen overflow-hidden">
        <div ref={horizontalContainerRef} className="flex h-full w-max">
          {chakra.products.map((product, index) => (
            <div 
              key={index} 
              className="panel w-screen h-screen flex-shrink-0 relative"
            >
              {/* Full Screen Background Image */}
              <div className="panel-image absolute inset-0 overflow-hidden">
                <img 
                  src={getBackgroundImage(chakra.slug)} 
                  alt={product.name}
                  className="w-full h-full object-cover" 
                />
                
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-[#27190b] bg-opacity-20"
                  style={{
                    background: ` `,
                  }}
                />
              </div>

              {/* Top Text */}
              <div className="absolute top-0 left-0 right-0 p-8">
                <h2 
                  className={` text-sm uppercase tracking-[0.3em] font-light text-white`}
                >
                  {product.name.toUpperCase()}
                </h2>
              </div>
              
              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="max-w-[1400px] mx-auto px-10">
                  <div 
                    className={` flex justify-between items-center text-xl font-cormorant uppercase tracking-[0.2em] text-white mb-4 `}
                  >
                    <span>AAKAURA'S {chakra.tone.toUpperCase()} COLLECTION</span>
                    <span className=" max-w-md">{product.description.substring(0, 50)}...</span>
                    <button className="hover:opacity-70 transition-opacity">
                      WAITLIST
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


     
    </div>
  );
}
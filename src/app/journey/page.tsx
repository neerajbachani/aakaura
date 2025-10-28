// "use client";
// import Link from "next/link";
// import { chakrasData } from "@/data/chakras";
// import fonts from "@/config/fonts";

// export default function JourneyPage() {
//   const chakras = Object.values(chakrasData);

//   return (
//     // <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
//     //   {/* Hero Section */}
//     //   <section className="relative bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white py-24 px-4">
//     //     <div className="max-w-7xl mx-auto text-center">
//     //       <h1 className={`${fonts.merriweather} text-5xl md:text-6xl font-bold mb-6`}>
//     //         Your Chakra Journey Awaits
//     //       </h1>
//     //       <p className={`${fonts.mulish} text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto`}>
//     //         Explore the seven energy centers and discover products to support your spiritual transformation
//     //       </p>
//     //     </div>
//     //   </section>

//     //   {/* Chakras Grid */}
//     //   <section className="py-20 px-4">
//     //     <div className="max-w-7xl mx-auto">
//     //       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//     //         {chakras.map((chakra) => (
//     //           <Link
//     //             key={chakra.slug}
//     //             href={`/journey/${chakra.slug}`}
//     //             className="group"
//     //           >
//     //             <div
//     //               className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 border-2"
//     //               style={{ borderColor: chakra.colors.primary }}
//     //             >
//     //               <div
//     //                 className="p-8 text-center"
//     //                 style={{
//     //                   background: `linear-gradient(135deg, ${chakra.colors.primary}, ${chakra.colors.dark})`,
//     //                 }}
//     //               >
//     //                 <div className="text-6xl mb-4">{chakra.symbol}</div>
//     //                 <h2 className={`${fonts.merriweather} text-2xl font-bold text-white mb-2`}>
//     //                   {chakra.name}
//     //                 </h2>
//     //                 <p className={`${fonts.mulish} text-white/90 text-lg`}>
//     //                   {chakra.sanskritName}
//     //                 </p>
//     //               </div>
                  
//     //               <div className="p-6">
//     //                 <div
//     //                   className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4`}
//     //                   style={{
//     //                     backgroundColor: chakra.colors.light,
//     //                     color: chakra.colors.dark,
//     //                   }}
//     //                 >
//     //                   {chakra.tone}
//     //                 </div>
                    
//     //                 <p className={`${fonts.mulish} text-neutral-600 mb-6 line-clamp-3`}>
//     //                   {chakra.description}
//     //                 </p>
                    
//     //                 <div className="flex items-center justify-between text-sm">
//     //                   <div>
//     //                     <span className={`${fonts.mulish} text-neutral-500`}>Element: </span>
//     //                     <span className={`${fonts.merriweather} font-semibold`} style={{ color: chakra.colors.dark }}>
//     //                       {chakra.element}
//     //                     </span>
//     //                   </div>
//     //                   <div>
//     //                     <span className={`${fonts.mulish} text-neutral-500`}>Mantra: </span>
//     //                     <span className={`${fonts.merriweather} font-semibold`} style={{ color: chakra.colors.dark }}>
//     //                       {chakra.mantra}
//     //                     </span>
//     //                   </div>
//     //                 </div>
                    
//     //                 <div
//     //                   className={`${fonts.merriweather} mt-6 w-full py-3 rounded-full font-semibold text-white text-center transition-all group-hover:opacity-90`}
//     //                   style={{ backgroundColor: chakra.colors.primary }}
//     //                 >
//     //                   Begin Journey →
//     //                 </div>
//     //               </div>
//     //             </div>
//     //           </Link>
//     //         ))}
//     //       </div>
//     //     </div>
//     //   </section>

//     //   {/* Info Section */}
//     //   <section className="py-20 px-4 bg-neutral-100">
//     //     <div className="max-w-4xl mx-auto text-center">
//     //       <h2 className={`${fonts.merriweather} text-4xl font-bold mb-6 text-neutral-800`}>
//     //         What Are Chakras?
//     //       </h2>
//     //       <p className={`${fonts.mulish} text-lg text-neutral-600 leading-relaxed mb-8`}>
//     //         Chakras are energy centers within the body that govern different aspects of our physical, 
//     //         emotional, and spiritual well-being. When balanced and aligned, they create harmony and 
//     //         vitality in our lives. Each chakra journey offers unique products and practices to help 
//     //         you activate and balance these powerful energy centers.
//     //       </p>
//     //       <Link
//     //         href="/products"
//     //         className={`${fonts.merriweather} inline-block px-8 py-4 bg-primaryBrown text-white rounded-full font-semibold hover:bg-neutral-800 transition-all shadow-lg hover:shadow-xl`}
//     //       >
//     //         Explore All Products
//     //       </Link>
//     //     </div>
//     //   </section>
//     // </div>
//     <>
//     <section className=" bg-secondaryBeige">
//       <img src="/images/flow-journey.jpeg" alt="Flow Journey" className="w-full h-full " />
//     </section>
//     <section className="min-h-screen bg-secondaryBeige"></section>
//     <section className="min-h-screen bg-red-300 "></section>
//     </>
//   );
// }

"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function JourneyPage() {
  const heroImageRef = useRef<HTMLImageElement>(null);
  const combinedSectionRef = useRef<HTMLElement>(null);
  const section3Ref = useRef<HTMLElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const scrollRow1Ref = useRef<HTMLDivElement>(null);
  const scrollRow2Ref = useRef<HTMLDivElement>(null);
  const scrollRow3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroImageRef.current || !combinedSectionRef.current || !section3Ref.current || !horizontalContainerRef.current) return;

    // Initial fade in
    gsap.fromTo(
      heroImageRef.current,
      { scale: 1.2, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "power3.out",
      }
    );

    // Animation 1: Image animates down and shrinks
    gsap.fromTo(heroImageRef.current, {
      filter: "blur(2.5px)",
    }, { 
      scrollTrigger: {
        trigger: combinedSectionRef.current,
        start: "top top",
        end: "40% top",
        scrub: 1,
      },
      x: "35vw",
      filter: "blur(0px)",
      padding: 30,
      y: '90vh',
      width: '30vw',
      height: '90vh',
      ease: "none",
    });

    // Animation 2: Pin the entire combined section
    ScrollTrigger.create({
      trigger: combinedSectionRef.current,
      start: "40% top",
      end: "bottom bottom",
      pin: true,

    });

    // Infinite horizontal scrolling animations
    if (scrollRow1Ref.current) {
      gsap.to(scrollRow1Ref.current, {
        x: "0%",
        duration: 20,
        ease: "none",
        repeat: -1,
      });
    }

    if (scrollRow2Ref.current) {
      gsap.to(scrollRow2Ref.current, {
        x: "-100%",
        duration: 8,
        ease: "none",
        repeat: -1,
      });
    }

    if (scrollRow3Ref.current) {
      gsap.to(scrollRow3Ref.current, {
        x: "0%",
        duration: 25,
        ease: "none",
        repeat: -1,
      });
    }

    // Section 3: Horizontal scroll animation
    const panels = horizontalContainerRef.current.querySelectorAll(".panel");
    
    // Calculate total scroll width
    const scrollWidth = horizontalContainerRef.current.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // Main horizontal scroll animation
    const horizontalScroll = gsap.to(horizontalContainerRef.current, {
      x: () => -(scrollWidth - viewportWidth),
      ease: "none",
      scrollTrigger: {
        trigger: section3Ref.current,
        pin: true,
        scrub: 1,
        end: () => `+=${scrollWidth - viewportWidth}`,
        invalidateOnRefresh: true,
      }
    });

    // Panel image zoom effects - using containerAnimation
    panels.forEach((panel) => {
      const img = panel.querySelector('.panel-image');
      if (img) {
        gsap.fromTo(img, {
          scale: 0.9,
          yPercent: 30,
        }, {
          scale: 1,
          yPercent: 0,
          ease: "power1.in",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: horizontalScroll,
            start: "left right",
            end: "center center",
            scrub: 0.5,
          }
        });
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const projects = [
    {
      title: "Wall Hanging",
      year: "2025",
      img: "images/wall-hanging.png",
      category1: "Health and Wellness",
      category2: "Brand and Packaging",
      bg: "bg-[#112639]",
      textColor: "text-white",
      borderColor: "border-white",
      buttonBg: "bg-white",
      buttonText: "text-[#112639]",
      gradient: "from-[#1a3a52] to-[#112639]"
    },
    {
      title: "Cars Daily",
      year: "2025",
       img: "images/flow-journey.png",
      category1: "Transportation",
      category2: "Brand and Packaging",
      bg: "bg-[#FDF6E3]",
      textColor: "text-[#EE6813]",
      borderColor: "border-[#EE6813]",
      buttonBg: "bg-[#EE6813]",
      buttonText: "text-[#FDF6E3]",
      gradient: "from-[#FFF5D6] to-[#FDF6E3]"
    },
    {
      title: "Un:fltrd",
      year: "2025",
      category1: "Beauty",
      category2: "Branding",
      bg: "bg-[#570B20]",
      textColor: "text-white",
      borderColor: "border-white",
      buttonBg: "bg-white",
      buttonText: "text-[#570B20]",
      gradient: "from-[#6e1028] to-[#570B20]"
    },
    {
      title: "Balance Story",
      year: "2025",
      category1: "Health and Wellness",
      category2: "Branding",
      bg: "bg-[#FFFBF2]",
      textColor: "text-[#F87C47]",
      borderColor: "border-[#F87C47]",
      buttonBg: "bg-[#F87C47]",
      buttonText: "text-white",
      gradient: "from-[#FFFEF8] to-[#FFFBF2]"
    }
  ];

  return (
    <>
      <section ref={combinedSectionRef} className="relative" style={{ height: '200vh' }}>
        <div className="h-[80vh] relative">
          <img
            ref={heroImageRef}
            src="/images/flow-journey.png"
            alt="Flow Journey"
            className="w-full h-full object-cover absolute top-0 left-0 z-50"
          />
        </div>
        
        <div className="min-h-screen relative flex flex-col justify-center gap-8 overflow-hidden">
          <div className="relative overflow-hidden -rotate-[3deg]">
            <div ref={scrollRow1Ref} className="flex whitespace-nowrap -rotate-[3deg]" style={{ transform: 'translateX(-100%)' }}>
              <span className="text-[5rem] font-serif text-transparent mx-8 text-stroke-red">Stillness & Coherence*</span>
              <span className="text-[5rem] font-serif text-amber-900 mx-8">Stillness & Coherence*</span>
              <span className="text-[5rem] font-serif text-[#a01b04] mx-8">Stillness & Coherence*</span>
              <span className="text-[5rem] font-serif text-transparent text-stroke-brown mx-8">Stillness & Coherence*</span>
            </div>
          </div>

          <div className="relative overflow-hidden -rotate-[3deg]">
            <div ref={scrollRow2Ref} className="flex whitespace-nowrap">
              <span className="text-[5rem] font-serif mx-8 text-[#a01b04]">When your inner waters calm,</span>
              <span className="text-[5rem] font-serif text-transparent mx-8 text-stroke-red">clarity <span className="bg-[#0077b6] text-[#caf0f8] px-5">Flows.</span></span>
              <span className="text-[5rem] font-serif mx-8 text-[#a01b04]">When your inner waters calm,</span>
              <span className="text-[5rem] font-serif text-transparent mx-8 text-stroke-red">clarity <span className="text-blue-400">Flows.</span></span>
            </div>
          </div>

          <div className="relative overflow-hidden -rotate-[3deg]">
            <div ref={scrollRow3Ref} className="flex whitespace-nowrap" style={{ transform: 'translateX(-100%)' }}>
              <span className="text-[5rem] font-serif mx-8 text-[#a01b04]">bringing balance,</span>
              <span className="text-[5rem] font-serif text-stroke-red text-transparent mx-8">Beauty,</span>
              <span className="text-[5rem] font-serif text-amber-900 mx-8">Coherence To Your Energy</span>
              <span className="text-[5rem] font-serif mx-8 text-[#a01b04]">bringing balance,</span>
              <span className="text-[5rem] font-serif text-stroke-red text-transparent mx-8">Beauty,</span>
              <span className="text-[5rem] font-serif text-amber-900 mx-8">Coherence To Your Energy</span>
            </div>
          </div>
        </div>
       
      </section>

      {/* Section 3: Horizontal Scrolling Projects */}
      <section ref={section3Ref} className="relative h-screen">
        <div ref={horizontalContainerRef} className="flex h-full w-max">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={`panel w-screen h-screen flex-shrink-0 flex items-center justify-center ${project.bg}`}
            >
              <div className={`w-full h-full flex flex-col justify-between ${project.textColor} max-w-[1280px] mx-auto`}>
                {/* Image Container */}
                <div className="flex-1 overflow-hidden relative">
                  <div className={`panel-image w-full h-full bg-gradient-to-br ${project.gradient} flex items-center justify-center absolute inset-0`}>
                    <img src={project.img} alt="Flow Journey" className="w-full h-full object-cover" />
                    {/* <div className="text-[8rem] opacity-30 font-bold">{project.title}</div> */}
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-8 z-10">
                  <div className={`flex justify-between items-center uppercase text-sm mb-6 ${project.borderColor}`}>
                    <span className={`border px-4 py-1 ${project.borderColor}`}>{project.year}</span>
                    <span>{project.category1}</span>
                    <span>{project.category2}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <h1 className="text-6xl lg:text-7xl xl:text-8xl font-medium tracking-tight">{project.title}</h1>
                    <button className={`group rounded-full border ${project.borderColor} p-3 hover:scale-110 transition-transform`}>
                      <div className={`${project.buttonBg} rounded-full p-4`}>
                        <svg 
                          className={`w-10 h-10 -rotate-45 group-hover:rotate-0 transition-transform ${project.buttonText}`}
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Extra section for scroll continuation */}
      <section className="min-h-screen bg-gray-900 flex items-center justify-center">
        <h2 className="text-white text-6xl">Continue Your Journey</h2>
      </section>

      <style jsx>{`
        .text-stroke-red {
          -webkit-text-stroke: 2px #a01b04;
        }
        .text-stroke-brown {
          -webkit-text-stroke: 2px #92400e;
        }
      `}</style>
    </>
  );
}
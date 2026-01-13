
// "use client";

// // import { fonts } from "@/utils/fonts";
// import Image from "next/image";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef, useMemo } from "react";

// interface BlogSection {
//   title: string;
//   description: string;
//   icon: string;
// }

// const blogSection: BlogSection[] = [
//   {
//     title: "Client-Centric Approach",
//     description:
//       "Dedication to putting need of clients first & providing personalized solutions.",
//     icon: "/why-us1.svg",
//   },
//   {
//     title: "Dedicated Support",
//     description:
//       "Availability of dedicated support & assistance from expert professionals.",
//     icon: "/why-us2.svg",
//   },
//   {
//     title: "Innovative Solutions",
//     description:
//       "Ability to customize service to meet the specific needs and goals of each client.",
//     icon: "/why-us3.svg",
//   },
//   {
//     title: "Transparent Communication",
//     description:
//       "Clear and transparent communication throughout the client engagement.",
//     icon: "/why-us4.svg",
//   },
// ];

// export default function BlogSection() {
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   // Pin the section and track scroll progress
//   const { scrollYProgress } = useScroll({
//     target: containerRef,
//     offset: ["start start", "end start"]
//   });

//   // Create transforms outside of the render loop
//   const headerOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
//   const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

//   // Create all transforms at the top level using useMemo
//   const card0Y = useTransform(scrollYProgress, [0, 0, 0.05, 0.2, 0.5, 0.8, 1], [200, 200, -20, 0, 0, -400, -400]);
//   const card0Opacity = useTransform(scrollYProgress, [0, 0, 0.05, 0.2, 0.5, 0.8, 1], [0, 0, 1, 1, 1, 0, 0]);

//   const card1Y = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.3, 0.6, 0.9, 1], [200, 200, -30, 0, 0, -400, -400]);
//   const card1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.15, 0.3, 0.6, 0.9, 1], [0, 0, 1, 1, 1, 0, 0]);

//   const card2Y = useTransform(scrollYProgress, [0, 0.2, 0.25, 0.4, 0.7, 1, 1], [200, 200, -40, 0, 0, -400, -400]);
//   const card2Opacity = useTransform(scrollYProgress, [0, 0.2, 0.25, 0.4, 0.7, 1, 1], [0, 0, 1, 1, 1, 0, 0]);

//   const card3Y = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.8, 1, 1], [200, 200, 0, 0, -400, -400]);
//   const card3Opacity = useTransform(scrollYProgress, [0, 0.3, 0.5, 0.8, 1, 1], [0, 0, 1, 1, 0, 0]);

//   // Store transforms in an array for easy access
//   const cardTransforms = useMemo(() => [
//     { y: card0Y, opacity: card0Opacity },
//     { y: card1Y, opacity: card1Opacity },
//     { y: card2Y, opacity: card2Opacity },
//     { y: card3Y, opacity: card3Opacity },
//   ], [card0Y, card0Opacity, card1Y, card1Opacity, card2Y, card2Opacity, card3Y, card3Opacity]);

//   return (
//     <div ref={containerRef} className="relative h-[200vh]">
//       {/* Sticky/Pinned Section */}
//       <div className="sticky top-0 h-screen overflow-hidden">
//         <section
//           className="relative w-full h-full flex items-center bg-cover bg-center bg-no-repeat"
//           style={{ backgroundImage: "url('/images/about-banner (1).jpg')" }}
//         >
//           {/* Dark overlay */}
//           <div className="absolute inset-0"></div>

//           {/* Content */}
//           <div className="relative z-10 w-full container mx-auto px-6 md:px-12 lg:px-16">
//             {/* Header */}
//             <motion.div 
//               className="mb-12 md:mb-16 lg:mb-20 max-w-4xl"
//               style={{
//                 opacity: headerOpacity,
//                 y: headerY
//               }}
//             >
//               <p
//                 className={`font-cormorant text-white text-sm md:text-base lg:text-2xl font-medium tracking-wider mb-4 md:mb-6`}
//               >
//                 Why Us
//               </p>
//               <h2
//                 className={`font-cormorant  text-white text-3xl md:text-4xl lg:text-5xl leading-tight mb-4 md:mb-6`}
//               >
//                 Partner in Financial Success and Growth.
//               </h2>
//               <p className={`font-cormorant max-w-2xl text-white text-sm md:text-base font-normal leading-relaxed`}>
//                 We understand that choosing the right accounting partner is crucial.
//                 We offer unparalleled expertise in Finanacial Goals and Business
//               </p>
//             </motion.div>

//             {/* Cards Grid with Momentum Wave Animation */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
//               {blogSection.map((item, index) => {
//                 return (
//                   <motion.div
//                     key={index}
//                     className="bg-white py-14 px-6 md:px-8 space-y-4 md:space-y-4 hover:shadow-xl transition-shadow duration-300"
//                     style={cardTransforms[index]}
//                   >
//                     {/* Icon */}
//                     <div className="w-12 h-12 md:w-16 md:h-16">
//                       <Image
//                         src={item.icon}
//                         alt={item.title}
//                         width={58}
//                         height={58}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>

//                     {/* Title */}
//                     <h3
//                       className={`font-cormorant text-primaryBlue text-xl md:text-2xl`}
//                     >
//                       {item.title}
//                     </h3>

//                     {/* Description */}
//                     <p className={`text-[#191919] text-sm md:text-base leading-relaxed font-cormorant`}>
//                       {item.description}
//                     </p>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }

"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useMemo, useState, useEffect } from "react";

interface BlogSection {
  title: string;
  description: string;
  icon: string;
}

const blogSection: BlogSection[] = [
  {
    title: "Manifestation Power",
    description:
      "Unlock the power within you to manifest your dreams and desires into reality through focused intention.",
    icon: "/chakras/crown-symbol.svg",
  },
  {
    title: "Chakra Alignment",
    description:
      "Balance your seven energy centers to achieve harmony, healing, and spiritual awakening in your life.",
    icon: "/chakras/crown-symbol.svg",
  },
  {
    title: "Spiritual Growth",
    description:
      "Expand your consciousness and connect with your higher self through guided spiritual practices and wisdom.",
    icon: "/chakras/crown-symbol.svg",
  },
  {
    title: "Energy Healing",
    description:
      "Transform your life through ancient healing techniques and universal energy flow for mind-body-soul wellness.",
    icon: "/chakras/crown-symbol.svg",
  },
];

export default function BlogSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if we are on desktop to enable the sticky scroll effect
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // lg breakpoint
    };
    
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);
  
  // Pin the section and track scroll progress (Only relevant for desktop)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // --- DESKTOP ANIMATIONS (Scroll Scrub) ---
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // SMOOTH SLIDE-UP ANIMATION (No Momentum)
  const card0Y = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.5, 1], [200, 200, 0, 0, 0]);
  const card0Opacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.5, 1], [0, 0, 1, 1, 1]);

  const card1Y = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.55, 1], [200, 200, 0, 0, 0]);
  const card1Opacity = useTransform(scrollYProgress, [0, 0.1, 0.2, 0.55, 1], [0, 0, 1, 1, 1]);

  const card2Y = useTransform(scrollYProgress, [0, 0.15, 0.25, 0.6, 1], [200, 200, 0, 0, 0]);
  const card2Opacity = useTransform(scrollYProgress, [0, 0.15, 0.25, 0.6, 1], [0, 0, 1, 1, 1]);

  const card3Y = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.65, 1], [200, 200, 0, 0, 0]);
  const card3Opacity = useTransform(scrollYProgress, [0, 0.2, 0.3, 0.65, 1], [0, 0, 1, 1, 1]);

  // Store transforms
  const cardTransforms = useMemo(() => [
    { y: card0Y, opacity: card0Opacity },
    { y: card1Y, opacity: card1Opacity },
    { y: card2Y, opacity: card2Opacity },
    { y: card3Y, opacity: card3Opacity },
  ], [card0Y, card0Opacity, card1Y, card1Opacity, card2Y, card2Opacity, card3Y, card3Opacity]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full ${isDesktop ? 'h-[150vh]' : 'h-auto py-16'}`}
    >
      {/* Sticky Wrapper - Only sticky on Desktop */}
      <div className={`${isDesktop ? 'sticky bg-[#BD9958] top-0 h-screen overflow-hidden' : 'relative h-auto'}`}>
        <section
          className="relative w-full h-full flex items-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/about-bannergh (2).jpg')" }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 "></div>

          {/* Content */}
          <div className="relative z-10 w-full container mx-auto px-4 sm:px-6 md:px-12 lg:px-16 py-10 lg:py-0">
            {/* Header */}
            <motion.div 
              className="mb-8 md:mb-12 lg:mb-16 max-w-4xl"
              style={isDesktop ? { opacity: headerOpacity, y: headerY } : {}}
              initial={isDesktop ? {} : { opacity: 0, y: 30 }}
              whileInView={isDesktop ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p
                className={`font-cormorant text-[#27190B] text-base sm:text-lg md:text-xl lg:text-3xl font-medium tracking-wider mb-2 sm:mb-3 md:mb-4 lg:mb-6`}
              >
              AAKAURA SPEAKS
              </p>
              <h2
                className={`font-cormorant text-[#27190B] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-3 sm:mb-4 md:mb-5 lg:mb-6`}
              >
                Journey to Spiritual Awakening and Inner Peace.
              </h2>
              <p className={`font-cormorant max-w-xl lg:max-w-2xl text-[#27190B] text-sm sm:text-base md:text-lg font-normal leading-relaxed`}>
                Awakening isn't an event. It's a quiet remembering that happens when noise finally loses its grip
              </p>
            </motion.div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-6">
              {blogSection.map((item, index) => {
                return (
                  <motion.div
                    key={index}
                    className="bg-[#27190B] py-8 sm:py-10 md:py-12 lg:py-14 px-5 sm:px-6 md:px-8 space-y-3 sm:space-y-4 hover:shadow-xl transition-all duration-300 rounded-xl lg:rounded-2xl cursor-pointer hover:scale-[1.02]"
                    // Desktop: Use Scroll Transforms
                    style={isDesktop ? cardTransforms[index] : {}}
                    // Mobile: Static (No Animation)
                    initial={{ opacity: 1, y: 0 }}
                    whileInView={undefined}
                    viewport={undefined}
                    transition={{ duration: 0 }}
                  >
                    {/* Icon with glow effect */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 relative">
                      <div className="absolute inset-0 bg-purple-400 blur-xl opacity-50 rounded-full"></div>
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={58}
                        height={58}
                        className="w-full h-full object-contain relative z-10"
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className={`font-cormorant text-[#BD9958] text-xl sm:text-2xl font-semibold`}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-[#BD9958] text-sm sm:text-base leading-relaxed font-cormorant`}>
                      {item.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
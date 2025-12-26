
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
import { useRef, useMemo } from "react";

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
  
  // Pin the section and track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Create transforms outside of the render loop
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);

  // DEEP WAVE with STRONG MOMENTUM and FLUID CURVES
  // More keyframes create smoother, more pronounced wave curves
  // Larger Y values create deeper wave motion with more force
  
  const card0Y = useTransform(
    scrollYProgress, 
    [0,    0,    0.06, 0.12, 0.18, 0.28, 0.5,  0.75, 0.9,  1], 
    [400,  400,  150,  -80,  -30,  0,    0,    -200, -600, -600]
  );
  const card0Opacity = useTransform(
    scrollYProgress, 
    [0, 0, 0.06, 0.18, 0.5, 0.75, 0.9, 1], 
    [0, 0, 1,    1,    1,   1,    0,   0]
  );

  const card1Y = useTransform(
    scrollYProgress, 
    [0,    0.08, 0.14, 0.2,  0.26, 0.36, 0.55, 0.8,  0.92, 1], 
    [400,  400,  180,  -100, -40,  0,    0,    -200, -600, -600]
  );
  const card1Opacity = useTransform(
    scrollYProgress, 
    [0, 0.08, 0.14, 0.26, 0.55, 0.8, 0.92, 1], 
    [0, 0,    1,    1,    1,    1,   0,    0]
  );

  const card2Y = useTransform(
    scrollYProgress, 
    [0,    0.16, 0.22, 0.28, 0.34, 0.44, 0.6,  0.85, 0.94, 1], 
    [400,  400,  200,  -120, -50,  0,    0,    -200, -600, -600]
  );
  const card2Opacity = useTransform(
    scrollYProgress, 
    [0, 0.16, 0.22, 0.34, 0.6, 0.85, 0.94, 1], 
    [0, 0,    1,    1,    1,   1,    0,    0]
  );

  const card3Y = useTransform(
    scrollYProgress, 
    [0,    0.24, 0.3,  0.36, 0.42, 0.52, 0.65, 0.88, 0.96, 1], 
    [400,  400,  220,  -140, -60,  0,    0,    -200, -600, -600]
  );
  const card3Opacity = useTransform(
    scrollYProgress, 
    [0, 0.24, 0.3, 0.42, 0.65, 0.88, 0.96, 1], 
    [0, 0,    1,   1,    1,    1,    0,    0]
  );

  // Store transforms in an array for easy access
  const cardTransforms = useMemo(() => [
    { y: card0Y, opacity: card0Opacity },
    { y: card1Y, opacity: card1Opacity },
    { y: card2Y, opacity: card2Opacity },
    { y: card3Y, opacity: card3Opacity },
  ], [card0Y, card0Opacity, card1Y, card1Opacity, card2Y, card2Opacity, card3Y, card3Opacity]);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      {/* Sticky/Pinned Section */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <section
          className="relative w-full h-full flex items-center bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/about-bannergh (2).jpg')" }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#BD9958] opacity-40"></div>

          {/* Content */}
          <div className="relative z-10 w-full container mt-28 mx-auto px-6 md:px-12 lg:px-16">
            {/* Header */}
            <motion.div 
              className="mb-12 md:mb-16 lg:mb-20 max-w-4xl"
              style={{
                opacity: headerOpacity,
                y: headerY
              }}
            >
              <p
                className={`font-cormorant text-[#27190B] text-sm md:text-base lg:text-3xl font-medium tracking-wider mb-4 md:mb-6`}
              >
                Our Thoughts
              </p>
              <h2
                className={`font-cormorant  text-[#27190B] text-3xl md:text-4xl lg:text-6xl leading-tight mb-4 md:mb-6`}
              >
                Journey to Spiritual Awakening and Inner Peace.
              </h2>
              <p className={`font-cormorant max-w-2xl text-[#27190B] text-sm md:text-base lg:text-lg font-normal leading-relaxed`}>
                We believe that true transformation begins within. Explore our insights on
                manifestation, chakra healing, and spiritual enlightenment.
              </p>
            </motion.div>

            {/* Cards Grid with Deep Wave Animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-6">
              {blogSection.map((item, index) => {
                return (
                  <motion.div
                    key={index}
                    className="bg-[#27190B] py-14 px-6 md:px-8 space-y-4 md:space-y-4 hover:shadow-xl transition-all duration-300 rounded-2xl cursor-pointer hover:scale-105"
                    style={cardTransforms[index]}
                  >
                    {/* Icon with glow effect */}
                    <div className="w-12 h-12 md:w-16 md:h-16 relative">
                      <div className="absolute inset-0 bg-purple-400 blur-xl  opacity-50 rounded-full"></div>
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
                      className={`font-cormorant text-[#BD9958] text-xl md:text-2xl`}
                    >
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-[#BD9958] text-sm md:text-base leading-relaxed font-cormorant`}>
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
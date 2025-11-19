
// import React from 'react';
// import Aurora from './ui/Aurora';
// import { ArrowRightIcon } from '@heroicons/react/24/outline';

// export default function AboutHeader() {
//   return (
//     <div className="relative w-full min-h-screen">
//       {/* Aurora Background - Full Width & Height */}
//       <div className="absolute inset-0 w-full h-full">
//         <div className="w-full h-full opacity-30">
//           <Aurora 
//             colorStops={['#FFF600','#FF0000', "#3E5EEC" ,'#0CDAD0','#CC00FF']}
//             amplitude={1.2}
//             blend={0.6}
//             speed={0.5}
//           />
//         </div>
//       </div>

//       {/* Content Container */}
//       <div className="relative z-10">
//         <div className='container  mx-auto px-4'>
//           <div className="mb-6 flex w-full items-center justify-between">
//             <div className=' mt-20'>
//               <h1 className="font-sans text-white justify-center text-5xl font-medium leading-[1] tracking-tight md:text-6xl lg:text-9xl">
//                 <span className="inline-block overflow-hidden">
//                   <span className="inline-block text-[#BD9958]">
//                     Se<span className="tracking-wide">rv</span>ices
//                   </span>
//                 </span>
//                 <span className="block overflow-hidden">
//                   <span className="inline-block -translate-y-[8%] text-[#BD9958]">
//                     We provide
//                   </span>
//                 </span>
//               </h1>
              
//               <a 
//                 className="hover:text-[#FFD700] group mt-16 hidden max-w-md pb-2 lg:block" 
//                 href="/services"
//               >
//                 <div className="bg-[#BD9958]/40 group-hover:bg-[#FFD700] mb-2 h-[1px] w-full transition-colors duration-300" />
//                 <div className="flex items-center justify-between">
//                   <p className="text-lg text-[#BD9958] group-hover:text-[#FFD700] transition-colors">
//                     Learn More
//                   </p>
//                   <ArrowRightIcon 
//                     className="transition-transform text-[#BD9958] group-hover:text-[#FFD700] h-8 w-8 duration-300 group-hover:-rotate-45" 
//                     aria-hidden="true"
//                   />
//                 </div>
//               </a>
//             </div>
            
//             <div className="hidden gap-10 text-lg text-white lg:flex">
//               <p className="text-[#BD9958]">[04] Summary:</p>
//               <ul className="space-y-2">
//                 <li className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FFD700] transition-all">
//                   Branding
//                 </li>
//                 <li className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FFD700] transition-all">
//                   UI/UX Design
//                 </li>
//                 <li className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FFD700] transition-all">
//                   Development
//                 </li>
//                 <li className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FFD700] transition-all">
//                   Packaging
//                 </li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useRef } from 'react';
import Aurora from './ui/Aurora';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function AboutHeader() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress relative to this specific section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map scroll progress (0 to 1) to horizontal movement (100% right to 0% center)
  const x = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  return (
    // 1. Create a tall scroll track (300vh makes the scroll last longer)
    <div ref={containerRef} className="relative h-[300vh]">
      
      {/* 2. Make the content sticky so it pins to the screen */}
      <div className="sticky top-0 h-screen overflow-hidden">
        
        {/* Aurora Background - Full Width & Height */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full opacity-30">
            <Aurora 
              colorStops={['#FFF600','#FF0000', "#3E5EEC" ,'#0CDAD0','#CC00FF']}
              amplitude={1.2}
              blend={0.6}
              speed={0.5}
            />
          </div>
        </div>

        {/* Content Container (Your Original Code - Unchanged Design) */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className='container mx-auto px-4'>
            <div className="mb-6 flex w-full items-center justify-between">
              <div className='mt-20'>
                <h1 className="font-sans text-white justify-center text-5xl font-medium leading-[1] tracking-tight md:text-6xl lg:text-9xl">
                  <span className="inline-block overflow-hidden">
                    <span className="inline-block text-[#BD9958]">
                      Se<span className="tracking-wide">rv</span>ices
                    </span>
                  </span>
                  <span className="block overflow-hidden">
                    <span className="inline-block -translate-y-[8%] text-[#BD9958]">
                      We provide
                    </span>
                  </span>
                </h1>
                
                <a 
                   className="hover:text-[#FFD700] group mt-16 hidden max-w-md pb-2 lg:block" 
                   href="/services"
                >
                  <div className="bg-[#BD9958]/40 group-hover:bg-[#FFD700] mb-2 h-[1px] w-full transition-colors duration-300" />
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-[#BD9958] group-hover:text-[#FFD700] transition-colors">
                      Learn More
                    </p>
                    <ArrowRightIcon 
                       className="transition-transform text-[#BD9958] group-hover:text-[#FFD700] h-8 w-8 duration-300 group-hover:-rotate-45" 
                       aria-hidden="true"
                    />
                  </div>
                </a>
              </div>
              
              <div className="hidden gap-10 text-lg text-white lg:flex">
                <p className="text-[#BD9958]">[04] Summary:</p>
                <ul className="space-y-2">
                  <li className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FFD700] transition-all">
                    Branding
                  </li>
                  <li className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FFD700] transition-all">
                    UI/UX Design
                  </li>
                  <li className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FFD700] transition-all">
                    Development
                  </li>
                  <li className="cursor-pointer opacity-50 hover:opacity-100 hover:text-[#FFD700] transition-all">
                    Packaging
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. The REIMAGINED Text Animation */}
          <div className="w-full overflow-hidden pb-10">
            <motion.h2 
              style={{ x }}
              className="whitespace-nowrap text-center text-[12vw] font-bold leading-none text-[#BD9958] opacity-90"
            >
              REIMAGINED
            </motion.h2>
          </div>
        </div>

      </div>
    </div>
  );
}
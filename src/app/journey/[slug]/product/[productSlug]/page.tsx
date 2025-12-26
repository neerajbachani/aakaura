// "use client";
// import React, { useState, useEffect } from "react";
// import { notFound, useSearchParams } from "next/navigation";
// import { chakrasData, getAllChakraSlugs, ChakraData } from "@/data/chakras";
// import { motion, AnimatePresence } from "framer-motion";
// import Link from "next/link";
// import Image from "next/image";
// import { ArrowLeftIcon } from "@heroicons/react/24/outline";

// type ClientType = 'soul-luxury' | 'energy-curious';

// interface PageProps {
//   params: {
//     slug: string;
//     productSlug: string;
//   };
// }

// // Helper to slugify product names for matching
// const slugify = (text: string) => {
//   return text
//     .toString()
//     .toLowerCase()
//     .replace(/\s+/g, '-')
//     .replace(/[^\w\-]+/g, '')
//     .replace(/\-\-+/g, '-')
//     .replace(/^-+/, '')
//     .replace(/-+$/, '');
// };

// export default function ProductPage({ params }: PageProps) {
//   const searchParams = useSearchParams();
//   const initialClientType = searchParams.get('type') as ClientType | null;
//   const [clientType, setClientType] = useState<ClientType>(initialClientType || 'soul-luxury');
  
//   const chakra = chakrasData[params.slug];
  
//   if (!chakra) {
//     notFound();
//   }

//   const product = chakra.products.find(p => slugify(p.name) === params.productSlug);

//   if (!product) {
//     notFound();
//   }

//   // Reuse the content logic from the template
//   const getContent = (type: ClientType) => {
//     if (type === 'energy-curious') {
//       return {
//         price: "₹5,500",
//         description: "A sacred shield for your aura. Woven with intention to ground your energy and protect your throat chakra during the colder transitions.",
//         ethos: "Consciously crafted to align with your energetic vibrations. Each thread holds the intention of warmth and protection.",
//         whatItsFor: "For the seeker who knows that clothing is energy. This muffler isn't just fabric; it's a boundary, a warm embrace for your spirit, and a grounding tool for your daily practice. Wear it when you need to feel held by the universe.",
//         features: [
//           "Energetically cleansed before shipping",
//           "Natural fibers to maintain auric integrity",
//           "Mindfully woven to support grounding"
//         ]
//       };
//     }
//     return {
//       price: "₹4,500",
//       description: "Handcrafted Winter Muffler. Premium wool-blend yarn (soft-touch, breathable & skin-friendly). Traditional handwoven flat knit.",
//       ethos: "Artisan-crafted in India. Small-batch, slow-made, supporting traditional craftsmanship.",
//       whatItsFor: "Aamvaraah isn’t made for fast fashion. It’s made for those who appreciate things that last — warm, dependable, and rooted. The kind of muffler your grandfather would approve of… but your wardrobe desperately needed an upgrade. Classic sense, modern soul.",
//       features: [
//         "Retains warmth without trapping excess heat",
//         "Breathable weave for all-day comfort",
//         "Can be styled as muffler, stole or wrap"
//       ]
//     };
//   };

//   // Reuse background logic
//   const getBackgroundImage = (slug: string, type: ClientType) => {
//     const soulLuxuryBackgrounds: Record<string, string> = {
//       grounding: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
//       flow: "/images/aamvaraah-muffler2.png",
//       power: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?q=80&w=2076&auto=format&fit=crop",
//       love: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop",
//       expression: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop",
//       insight: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=2013&auto=format&fit=crop",
//       expansion: "/images/aamvaraah-muffler2.png",
//     };

//     const energyCuriousBackgrounds: Record<string, string> = {
//       grounding: "/images/aamvaraah-muffler.jpeg",
//       flow: "/images/aamvaraah-muffler.jpeg",
//       power: "/images/aamvaraah-muffler.jpeg",
//       love: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=2070&auto=format&fit=crop",
//       expression: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop",
//       insight: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop",
//       expansion: "/images/aamvaraah-muffler.jpeg",
//     };

//     const backgrounds = type === 'energy-curious' ? energyCuriousBackgrounds : soulLuxuryBackgrounds;
//     return backgrounds[slug] || soulLuxuryBackgrounds[slug] || soulLuxuryBackgrounds.grounding;
//   };

//   const content = getContent(clientType);
//   const backgroundImage = getBackgroundImage(chakra.slug, clientType);

//   return (
//     <div className="min-h-screen bg-[#f4f1ea] text-[#27190b]">
//       {/* Navigation */}
//       <nav className="fixed top-0 left-0 right-0 p-6 z-50 flex justify-between items-center">
//         <Link 
//           href={`/journey/${params.slug}`}
//           className="flex items-center gap-2 text-[#f4f1ea] hover:opacity-80 transition-opacity mix-blend-difference"
//         >
//           <ArrowLeftIcon className="w-6 h-6" />
//           <span className="uppercase tracking-widest text-sm">Back to Journey</span>
//         </Link>
//       </nav>

//       {/* Hero Section */}
//       <section className="relative h-screen w-full overflow-hidden">
//         <motion.div 
//           className="absolute inset-0"
//           initial={false}
//           animate={{ opacity: 1 }}
//           key={clientType}
//           transition={{ duration: 0.5 }}
//         >
//           <Image
//             src={backgroundImage}
//             alt={product.name}
//             fill
//             className="object-cover"
//             priority
//           />
//           <div className="absolute inset-0 bg-black/30" />
//         </motion.div>

//         <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-10">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="max-w-4xl"
//           >
//             <h1 className="text-5xl md:text-7xl font-cormorant font-light text-[#f4f1ea] mb-6">
//               {product.name}
//             </h1>
//             <p className="text-xl md:text-2xl font-light text-[#f4f1ea]/90 mb-12 max-w-2xl mx-auto">
//               {clientType === 'energy-curious' ? 'Energetic Shield & Warmth' : 'Handcrafted Winter Muffler'}
//             </p>

//             {/* Client Type Toggle */}
//             <div className="flex justify-center mb-12">
//               <div className="bg-[#f4f1ea]/10 backdrop-blur-md p-1 rounded-full flex relative border border-[#f4f1ea]/20">
//                 <motion.div 
//                   className="absolute top-1 bottom-1 bg-[#f4f1ea] rounded-full shadow-lg"
//                   initial={false}
//                   animate={{ 
//                     left: clientType === 'soul-luxury' ? '4px' : '50%',
//                     width: 'calc(50% - 4px)'
//                   }}
//                   transition={{ type: "spring", stiffness: 300, damping: 30 }}
//                 />
//                 <button 
//                   onClick={() => setClientType('soul-luxury')}
//                   className={`relative z-10 px-8 py-3 rounded-full text-sm uppercase tracking-widest transition-colors duration-300 ${clientType === 'soul-luxury' ? 'text-[#27190b]' : 'text-[#f4f1ea]'}`}
//                 >
//                   Soul Luxury
//                 </button>
//                 <button 
//                   onClick={() => setClientType('energy-curious')}
//                   className={`relative z-10 px-8 py-3 rounded-full text-sm uppercase tracking-widest transition-colors duration-300 ${clientType === 'energy-curious' ? 'text-[#27190b]' : 'text-[#f4f1ea]'}`}
//                 >
//                   Energy Curious
//                 </button>
//               </div>
//             </div>

//             <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
//               <span className="text-4xl font-cormorant text-[#f4f1ea]">
//                 {content.price}
//               </span>
//               <button className="bg-[#f4f1ea] text-[#27190b] px-12 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105">
//                 Add to Cart
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Details Section */}
//       <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
//           {/* Left Column */}
//           <div className="space-y-12">
//             <div>
//               <h3 className="text-sm uppercase tracking-widest font-bold mb-6 opacity-60">The Story</h3>
//               <p className="font-light text-xl leading-relaxed">
//                 {content.description}
//               </p>
//             </div>

//             <div>
//               <h3 className="text-sm uppercase tracking-widest font-bold mb-6 opacity-60">Specifications</h3>
//               <div className="space-y-4 font-light text-lg">
//                 <div className="flex justify-between border-b border-[#27190b]/10 pb-4">
//                   <span>Material</span>
//                   <span className="font-medium">Premium wool-blend yarn</span>
//                 </div>
//                 <div className="flex justify-between border-b border-[#27190b]/10 pb-4">
//                   <span>Weave Type</span>
//                   <span className="font-medium">Traditional handwoven flat knit</span>
//                 </div>
//                 <div className="flex justify-between border-b border-[#27190b]/10 pb-4">
//                   <span>Dimensions</span>
//                   <span className="font-medium">180 cm × 35 cm</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-12">
//             <div>
//               <h3 className="text-sm uppercase tracking-widest font-bold mb-6 opacity-60">
//                 {clientType === 'energy-curious' ? 'Energetic Ethos' : 'Production Ethos'}
//               </h3>
//               <p className="font-light text-lg leading-relaxed opacity-80">
//                 {content.ethos}
//               </p>
//             </div>

//             <div className="bg-[#27190b]/5 p-10 rounded-3xl">
//               <h3 className="font-cormorant text-3xl mb-6 italic">"What it’s really for"</h3>
//               <p className="font-light text-lg leading-relaxed opacity-90">
//                 {content.whatItsFor}
//               </p>
//             </div>

//             <div>
//               <h3 className="text-sm uppercase tracking-widest font-bold mb-6 opacity-60">
//                 {clientType === 'energy-curious' ? 'Vibrational Benefits' : 'Key Features'}
//               </h3>
//               <ul className="space-y-4 font-light opacity-80">
//                 {content.features.map((feature, i) => (
//                   <li key={i} className="flex items-start gap-3 text-lg">
//                     <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#27190b] flex-shrink-0" />
//                     {feature}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Suggested Products */}
//       <section className="py-24 bg-[#27190b]/5">
//         <div className="max-w-7xl mx-auto px-8 md:px-16">
//           <h2 className="text-3xl md:text-4xl font-cormorant font-light mb-12 text-center">
//             Complete Your {chakra.name} Journey
//           </h2>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             {chakra.products
//               .filter(p => slugify(p.name) !== params.productSlug)
//               .slice(0, 3)
//               .map((p, i) => (
//                 <Link 
//                   href={`/journey/${params.slug}/product/${slugify(p.name)}?type=${clientType}`}
//                   key={i}
//                   className="group block bg-[#f4f1ea] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
//                 >
//                   <div className="aspect-[4/5] relative overflow-hidden bg-[#27190b]/10">
//                     {/* Placeholder for product image - using chakra color as fallback */}
//                     <div 
//                       className="absolute inset-0 opacity-20"
//                       style={{ backgroundColor: chakra.colors.primary }}
//                     />
//                     <div className="absolute inset-0 flex items-center justify-center text-[#27190b]/20 font-cormorant text-4xl">
//                       {p.step}
//                     </div>
//                   </div>
//                   <div className="p-6">
//                     <h3 className="font-cormorant text-xl mb-2 group-hover:text-[#27190b]/70 transition-colors">
//                       {p.name}
//                     </h3>
//                     <p className="text-sm font-light opacity-60 line-clamp-2">
//                       {p.description}
//                     </p>
//                     <div className="mt-4 text-sm uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity">
//                       View Product →
//                     </div>
//                   </div>
//                 </Link>
//               ))}
//           </div>
//         </div>
//       </section>

//       {/* Suggested Combo */}
//       <section className="py-24 px-8 md:px-16 max-w-7xl mx-auto">
//         <div className="bg-[#27190b] rounded-[32px] p-8 md:p-16 text-[#f4f1ea] relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
//              {/* Abstract shape or pattern could go here */}
//              <div className="w-full h-full bg-gradient-to-l from-white to-transparent" />
//           </div>

//           <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div>
//               <span className="text-sm uppercase tracking-widest opacity-60 mb-4 block">
//                 Curated for {clientType === 'energy-curious' ? 'Deep Healing' : 'Complete Care'}
//               </span>
//               <h2 className="text-4xl md:text-5xl font-cormorant font-light mb-6">
//                 The {chakra.tone} Ritual Set
//               </h2>
//               <p className="font-light text-lg opacity-80 mb-8 leading-relaxed">
//                 Enhance your experience by combining the {product.name} with our signature {chakra.name} Journal and Meditation Oil. Designed to work in harmony.
//               </p>
              
//               <div className="flex flex-col gap-4">
//                 <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
//                   <div className="w-16 h-16 bg-white/10 rounded-lg flex-shrink-0" />
//                   <div>
//                     <div className="font-cormorant text-xl">{product.name}</div>
//                     <div className="text-sm opacity-60">Included</div>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
//                   <div className="w-16 h-16 bg-white/10 rounded-lg flex-shrink-0" />
//                   <div>
//                     <div className="font-cormorant text-xl">{chakra.name} Journal</div>
//                     <div className="text-sm opacity-60">Guided reflections</div>
//                   </div>
//                 </div>
//               </div>

//               <div className="mt-10 flex items-center gap-6">
//                 <button className="bg-[#f4f1ea] text-[#27190b] px-10 py-4 rounded-full text-sm uppercase tracking-widest hover:bg-white transition-all transform hover:scale-105">
//                   Add Bundle • ₹7,500
//                 </button>
//                 <span className="text-sm opacity-60">Save 15% when bought together</span>
//               </div>
//             </div>

//             <div className="hidden md:block relative h-[500px]">
//                {/* Placeholder for combo image */}
//                <div className="absolute inset-0 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
//                   <span className="font-cormorant text-4xl opacity-20">Ritual Bundle Image</span>
//                </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

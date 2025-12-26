"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChakraData, JourneyProduct } from "@/data/chakras";
import { useRevealer } from "@/hooks/useRevealer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLenis } from "@/context/LenisContext";
import { useAuthStatus } from "@/hooks/useAuth";
import { useAddToWaitlist, useRemoveFromWaitlist, useIsInWaitlist } from "@/hooks/useWaitlist";
import { toast } from "react-hot-toast";

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ChakraJourneyTemplateProps {
  chakra: ChakraData;
}

type ClientType = 'soul-luxury' | 'energy-curious';

export default function ChakraJourneyTemplate({
  chakra,
}: ChakraJourneyTemplateProps) {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [clientType, setClientType] = useState<ClientType>('soul-luxury');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const section3Ref = useRef<HTMLElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const { lenis } = useLenis();
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  
  // Waitlist hooks
  const addToWaitlist = useAddToWaitlist();
  const removeFromWaitlist = useRemoveFromWaitlist();
  
  useRevealer();

  // Close overlay when client type changes
  useEffect(() => {
    setExpandedCard(null);
  }, [clientType]);

  // Derived products list for current view
  const currentProducts = chakra.content[clientType] || [];

  // GSAP Horizontal Scroll Effect
  useEffect(() => {
    const horizontalContainer = horizontalContainerRef.current;
    const section3 = section3Ref.current;

    if (!horizontalContainer || !section3) return;

    // Calculate scroll width
    const scrollWidth = horizontalContainer.scrollWidth;
    const viewportWidth = window.innerWidth;
    
    // Only animate if content overflows
    if (scrollWidth <= viewportWidth) return;

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
    const panels = gsap.utils.toArray('.panel') as HTMLElement[];
    panels.forEach((panel: HTMLElement, index: number) => {
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
  }, [currentProducts]);

  // Block body scroll when overlay is open
  useEffect(() => {
    if (expandedCard !== null) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [expandedCard, lenis]);

  return (
    <div className="min-h-screen bg-[#27190b]">
      {/* Revealer overlay for page entrance */}
      <div className="revealer fixed inset-0 bg-[#BD9958] z-50 origin-top" />
      
      {/* Section 3: Horizontal Scrolling Products - NOW AT TOP */}
      <section ref={section3Ref} className="relative h-screen overflow-hidden">
        <div ref={horizontalContainerRef} className="flex h-full w-max">
          {currentProducts.map((product, index) => (
            <div 
              key={product.id || index}
              className="panel w-screen h-screen flex-shrink-0 relative"
            >
              {/* Full Screen Background Image */}
              <div className="panel-image absolute inset-0 overflow-hidden">
                <motion.div 
                  className="absolute inset-0"
                  initial={false}
                  animate={{ opacity: 1 }}
                  key={clientType} // Re-animate on toggle? Maybe better to keep it smooth
                  transition={{ duration: 0.5 }}
                >
                  <img 
                    src={product.images?.[0] || ""} 
                    alt={product.name}
                    className="w-full h-full object-cover" 
                  />
                </motion.div>
                
                {/* Gradient Overlay */}
                <div 
                  className="absolute inset-0 bg-[#27190b] bg-opacity-20"
                  style={{
                    background: `linear-gradient(to bottom, rgba(39,25,11,0.1) 0%, rgba(39,25,11,0.6) 100%)`,
                  }}
                />
              </div>

              {/* Top Text */}
              <div className="absolute top-0 left-0 right-0 p-8">
                <h2 
                  className={` text-lg uppercase tracking-[0.3em] font-light text-white`}
                >
                  {product.name.toUpperCase()}
                </h2>
              </div>
              
              {/* Bottom Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                <div className="max-w-[1400px] mx-auto px-10">
                  <div 
                    className={` flex justify-between items-center text-xl font-cormorant uppercase tracking-[0.2em] text-white mb-4 `}
                  >
                    <span className="max-w-sm">AAKAURA'S {chakra.tone.toUpperCase()} COLLECTION</span>
                    <button 
                      onClick={() => setExpandedCard(index)}
                      className="hover:opacity-70 transition-opacity border-b border-white/50 pb-1"
                    >
                      VIEW DETAILS
                    </button>

                    <WaitlistButton
                      product={product}
                      journeySlug={chakra.slug}
                      clientType={clientType}
                      isAuthenticated={isAuthenticated}
                      authLoading={authLoading}
                      onAuthRequired={() => setShowAuthModal(true)}
                      addToWaitlist={addToWaitlist}
                      removeFromWaitlist={removeFromWaitlist}
                      useIsInWaitlist={useIsInWaitlist}
                    />
                    
                  </div>
                </div>
              </div>

              {/* Expanded Details Overlay */}
              <AnimatePresence>
                {expandedCard === index && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setExpandedCard(null)}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                    
                    {/* Slide-up Panel */}
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 25, stiffness: 200 }}
                      className="absolute bottom-0 left-0 right-0 h-[85vh] bg-[#27190b] text-[#f4f1ea] z-50 rounded-t-[32px] overflow-hidden flex flex-col"
                    >
                      {/* Close Button */}
                      <button 
                        onClick={() => setExpandedCard(null)}
                        className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors z-50"
                      >
                        <XMarkIcon className="w-8 h-8 text-[#f4f1ea]" />
                      </button>

                      {/* Scrollable Content */}
                      <div 
                        className="overflow-y-auto h-full p-8 md:p-16 custom-scrollbar overscroll-y-contain"
                        data-lenis-prevent
                      >
                        <div className="max-w-5xl mx-auto">
                          
                          {/* Client Type Toggle */}
                          <div className="flex justify-center mb-8">
                            <div className="bg-[#f4f1ea]/10 p-1 rounded-full flex relative">
                              <motion.div 
                                className="absolute top-1 bottom-1 bg-[#f4f1ea] rounded-full shadow-md"
                                initial={false}
                                animate={{ 
                                  left: clientType === 'soul-luxury' ? '4px' : '50%',
                                  width: 'calc(50% - 4px)'
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                              />
                              <button 
                                onClick={() => setClientType('soul-luxury')}
                                className={`relative z-10 px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-colors duration-300 ${clientType === 'soul-luxury' ? 'text-[#27190b]' : 'text-[#f4f1ea]/60'}`}
                              >
                                Soul Luxury
                              </button>
                              <button 
                                onClick={() => setClientType('energy-curious')}
                                className={`relative z-10 px-6 py-2 rounded-full text-sm uppercase tracking-widest transition-colors duration-300 ${clientType === 'energy-curious' ? 'text-[#27190b]' : 'text-[#f4f1ea]/60'}`}
                              >
                                Energy Curious
                              </button>
                            </div>
                          </div>

                          {/* Header */}
                          <div className="mb-12 border-b border-[#f4f1ea]/20 pb-8 text-center md:text-left">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                              <div>
                                <h2 className="text-4xl md:text-6xl font-cormorant font-light mb-2 text-[#f4f1ea]">
                                  {product.name}
                                </h2>
                                <p className="text-lg font-light tracking-wide opacity-80">
                                  {product.sanskritName || (clientType === 'energy-curious' ? 'Energetic Shield & Warmth' : 'Handcrafted Winter Muffler')}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24">
                            {/* Left Column - Specs */}
                            <div className="space-y-8">
                              <motion.div
                                key={clientType}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <h3 className="text-sm uppercase tracking-widest font-bold mb-4 opacity-60">Description</h3>
                                <p className="font-light text-lg leading-relaxed mb-8">
                                  {product.specificDescription || product.description}
                                </p>

                                <h3 className="text-sm uppercase tracking-widest font-bold mb-4 opacity-60">Specifications</h3>
                                <div className="space-y-4 font-light">
                                   {/* If we had concrete specs in the data we would map them here. 
                                       For now, just showing Features as specs or keeping placeholders? 
                                       The previous template had hardcoded specs (Material, Weave...).
                                       The current data doesn't have a 'specs' map.
                                       I will render features here or if we want generic placeholders we can keep them.
                                       I'll keep them but maybe hide if empty, but for now the user data has no strict 'specs' object.
                                       I will omit the hardcoded specs block for now as it was confusing with dynamic data.
                                   */}
                                </div>
                              </motion.div>
                            </div>

                            {/* Right Column - Story & Features */}
                            <div className="space-y-8">
                              <motion.div
                                key={`${clientType}-right`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                              >
                                <div>
                                  <h3 className="text-sm uppercase tracking-widest font-bold mb-4 opacity-60">
                                    {clientType === 'energy-curious' ? 'Energetic Ethos' : 'Production Ethos'}
                                  </h3>
                                  <p className="font-light leading-relaxed opacity-80">
                                    {product.ethos}
                                  </p>
                                </div>

                                <div className="mt-8">
                                  <h3 className="text-sm uppercase tracking-widest font-bold mb-4 opacity-60">
                                    {clientType === 'energy-curious' ? 'Vibrational Benefits' : 'Functional Features'}
                                  </h3>
                                  <ul className="space-y-2 font-light opacity-80">
                                    {product.features.map((feature, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#f4f1ea] flex-shrink-0" />
                                        {feature}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                <div className="bg-[#f4f1ea]/5 p-8 rounded-2xl mt-8">
                                  <h3 className="font-cormorant text-2xl mb-4 italic">"What it's really for"</h3>
                                  <p className="font-light leading-relaxed opacity-90">
                                    {product.whatItsFor}
                                  </p>
                                </div>
                              </motion.div>
                            </div>
                          </div>
                          
                          {/* Footer Action */}
                          <div className="mt-16 pt-8 border-t border-[#f4f1ea]/20 flex flex-col md:flex-row gap-4 justify-center items-center">
                             <WaitlistButtonLarge
                               product={product}
                               journeySlug={chakra.slug}
                               clientType={clientType}
                               isAuthenticated={isAuthenticated}
                               authLoading={authLoading}
                               onAuthRequired={() => setShowAuthModal(true)}
                               addToWaitlist={addToWaitlist}
                               removeFromWaitlist={removeFromWaitlist}
                               useIsInWaitlist={useIsInWaitlist}
                             />
                          </div>

                          {/* Suggested Products (Other products in the same journey/type) */}
                          <div className="py-16 border-t border-[#f4f1ea]/20 mt-16">
                            <h2 className="text-2xl md:text-3xl font-cormorant font-light mb-8 text-center text-[#f4f1ea]">
                              Complete Your {chakra.name} Journey
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {currentProducts
                                .filter(p => p.id !== product.id && p.name !== product.name)
                                .slice(0, 3)
                                .map((p, i) => (
                                  <button 
                                    key={i}
                                    onClick={() => {
                                       // Find index in the SAME list
                                       const idx = currentProducts.findIndex(cp => cp.name === p.name);
                                       if (idx !== -1) setExpandedCard(idx);
                                    }}
                                    className="group block bg-[#f4f1ea]/5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 text-left"
                                  >
                                    <div className="aspect-[4/5] relative overflow-hidden bg-[#f4f1ea]/10">
                                      <div 
                                        className="absolute inset-0 opacity-20"
                                        style={{ backgroundColor: chakra.colors.primary }}
                                      />
                                      <div className="absolute inset-0 flex items-center justify-center text-[#f4f1ea]/20 font-cormorant text-4xl">
                                        {p.step}
                                      </div>
                                    </div>
                                    <div className="p-4">
                                      <h3 className="font-cormorant text-lg mb-1 group-hover:text-[#f4f1ea]/70 transition-colors text-[#f4f1ea]">
                                        {p.name}
                                      </h3>
                                      <p className="text-xs font-light opacity-60 line-clamp-2 text-[#f4f1ea]">
                                        {p.description}
                                      </p>
                                      <div className="mt-3 text-xs uppercase tracking-widest font-bold opacity-40 group-hover:opacity-100 transition-opacity text-[#f4f1ea]">
                                        View Product →
                                      </div>
                                    </div>
                                  </button>
                                ))}
                            </div>
                          </div>

                          {/* Suggested Combo - Kept standard for now, could be dynamic */}
                          <div className="py-16 mt-8">
                            <div className="bg-[#f4f1ea] rounded-[24px] p-8 text-[#27190b] relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                                 <div className="w-full h-full bg-gradient-to-l from-[#27190b] to-transparent" />
                              </div>

                              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                                <div>
                                  <span className="text-sm uppercase tracking-widest opacity-60 mb-4 block">
                                    Curated for {clientType === 'energy-curious' ? 'Deep Healing' : 'Complete Care'}
                                  </span>
                                  <h2 className="text-3xl md:text-4xl font-cormorant font-light mb-6">
                                    The {chakra.tone} Ritual Set
                                  </h2>
                                  <p className="font-light text-base opacity-80 mb-8 leading-relaxed">
                                    Enhance your experience by combining the {product.name} with our signature {chakra.name} Journal and Meditation Oil. Designed to work in harmony.
                                  </p>
                                  
                                  <div className="flex flex-col gap-4">
                                    <div className="flex items-center gap-4 p-4 bg-[#27190b]/5 rounded-xl border border-[#27190b]/10">
                                      <div className="w-12 h-12 bg-[#27190b]/10 rounded-lg flex-shrink-0" />
                                      <div>
                                        <div className="font-cormorant text-lg">{product.name}</div>
                                        <div className="text-xs opacity-60">Included</div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-10 flex flex-col sm:flex-row items-center gap-6">
                                    <button className="bg-[#27190b] text-[#f4f1ea] px-8 py-3 rounded-full text-xs uppercase tracking-widest hover:bg-opacity-90 transition-all transform hover:scale-105 w-full sm:w-auto">
                                      Add Bundle • ₹7,500
                                    </button>
                                    <span className="text-xs opacity-60">Save 15% when bought together</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// Waitlist Button Component (for bottom section)
interface WaitlistButtonProps {
  product: JourneyProduct;
  journeySlug: string;
  clientType: 'soul-luxury' | 'energy-curious';
  isAuthenticated: boolean;
  authLoading: boolean;
  onAuthRequired: () => void;
  addToWaitlist: any;
  removeFromWaitlist: any;
  useIsInWaitlist: (journeySlug: string, productId: string, clientType: 'soul-luxury' | 'energy-curious') => boolean;
}

function WaitlistButton({
  product,
  journeySlug,
  clientType,
  isAuthenticated,
  authLoading,
  onAuthRequired,
  addToWaitlist,
  removeFromWaitlist,
  useIsInWaitlist,
}: WaitlistButtonProps) {
  const isInWaitlist = useIsInWaitlist(journeySlug, product.id, clientType);
  const isLoading = addToWaitlist.isPending || removeFromWaitlist.isPending;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to waitlist');
      onAuthRequired();
      return;
    }

    if (isInWaitlist) {
      removeFromWaitlist.mutate({
        journeySlug,
        productId: product.id,
        clientType,
      });
    } else {
      addToWaitlist.mutate({
        journeySlug,
        productId: product.id,
        productName: product.name,
        clientType,
      });
    }
  };

  if (authLoading) {
    return <span className="max-w-md hidden md:block opacity-50">Loading...</span>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="max-w-md hidden md:block hover:opacity-70 transition-opacity disabled:opacity-50"
    >
      {isLoading ? 'Processing...' : isInWaitlist ? '✓ In Waitlist' : 'Add to Waitlist'}
    </button>
  );
}

// Waitlist Button Component (for detail modal)
function WaitlistButtonLarge({
  product,
  journeySlug,
  clientType,
  isAuthenticated,
  authLoading,
  onAuthRequired,
  addToWaitlist,
  removeFromWaitlist,
  useIsInWaitlist,
}: WaitlistButtonProps) {
  const isInWaitlist = useIsInWaitlist(journeySlug, product.id, clientType);
  const isLoading = addToWaitlist.isPending || removeFromWaitlist.isPending;

  const handleClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to waitlist');
      onAuthRequired();
      return;
    }

    if (isInWaitlist) {
      removeFromWaitlist.mutate({
        journeySlug,
        productId: product.id,
        clientType,
      });
    } else {
      addToWaitlist.mutate({
        journeySlug,
        productId: product.id,
        productName: product.name,
        clientType,
      });
    }
  };

  if (authLoading) {
    return (
      <button className="bg-[#f4f1ea]/50 text-[#27190b] px-12 py-4 rounded-full text-sm uppercase tracking-widest" disabled>
        Loading...
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`px-12 py-4 rounded-full text-sm uppercase tracking-widest transition-all transform hover:scale-105 disabled:opacity-50 ${
        isInWaitlist
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-[#f4f1ea] text-[#27190b] hover:bg-opacity-90'
      }`}
    >
      {isLoading 
        ? 'Processing...' 
        : isInWaitlist 
        ? `✓ In Waitlist • ${product.price}` 
        : `Add to Waitlist • ${product.price}`
      }
    </button>
  );
}

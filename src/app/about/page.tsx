"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Aurora from "@/components/ui/Aurora";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import AnimatedText from "@/components/AnimatedText";

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="bg-[#27190B] text-[#BD9958] font-cormorant">
      {/* Cinematic Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Aurora 
            colorStops={['#BD9958', '#A01B04', '#27190B']}
            amplitude={1.5}
            blend={0.7}
            speed={0.4}
          />
        </div>

        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-5xl"
        >
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg md:text-xl tracking-[0.3em] uppercase mb-6 text-white/60"
          >
            A Sacred Narrative
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-9xl font-medium leading-[1.1] text-white"
          >
            THE UNIVERSE <br />
            <span className="text-[#BD9958]">EMBODIED</span>
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
            className="mt-12 h-[1px] w-full max-w-md mx-auto bg-gradient-to-r from-transparent via-[#BD9958] to-transparent"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="mt-8 text-xl md:text-3xl text-white/80 font-light tracking-[0.15em]"
          >
            A QUIET SHIFT BACK TO SELF
          </motion.h2>
        </motion.div>

        {/* Floating Background Image - Subtle Parallax */}
        <div className="absolute inset-0 z-[-1] opacity-20">
          <Image
            src="/images/aboutBanner.jpg"
            alt="Spiritual Background"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container mx-auto px-6 py-32 md:py-48">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="space-y-10"
          >
            <h2 className="text-4xl md:text-6xl text-white leading-tight">
              A Simple <span className="italic text-[#BD9958]">Truth</span>
            </h2>
            <div className="space-y-8 text-xl md:text-2xl text-white/80 leading-relaxed font-light text-justify">
              <p>
                Aakaura was born from a simple truth: <span className="text-[#BD9958] font-medium">energy shapes everything</span>; how we feel, think, and live. 
              </p>
              <p>
                It is very important for humans to understand that they are not here for mere materialism but entail the cosmic secrets to the universe as each one is the universe embodied.
              </p>
              <p className="text-white font-medium text-2xl border-l-2 border-[#BD9958] pl-6 py-2">
                "In a world addicted to distraction, speed, and surface-level living, we work with what most people overlook: subtle energy, intention, and presence."
              </p>
            </div>
          </motion.div>

          <div className="relative h-[600px] rounded-2xl overflow-hidden group shadow-2xl">
             <Image
                src="/images/About_1.jpg"
                alt="Sacred Space"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-110"
              />
          </div>
        </div>
      </section>

      {/* Roots & Craft Section */}
      <section className="bg-[#1a1107] py-32 md:py-48">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative h-[600px] rounded-2xl overflow-hidden order-2 lg:order-1 shadow-2xl">
               <Image
                  src="/images/About_2.jpg"
                  alt="Crystal Collection"
                  fill
                  className="object-cover object-right grayscale hover:grayscale-0 transition-all duration-700"
                />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-10 order-1 lg:order-2"
            >
              <h2 className="text-4xl md:text-6xl text-white leading-tight">
                Wisdom & <span className="italic text-[#BD9958]">Craft</span>
              </h2>
              <div className="space-y-6 text-xl text-white/80 leading-relaxed font-light text-justify">
                <p>
                  Rooted in ancient Indian energetic wisdom and informed by modern science, Aakaura sits at the intersection of spirituality, craftsmanship, and conscious living.
                </p>
                <p>
                  We believe that every object carries an energetic signature; and when created with awareness, it can shift how a space feels and how a person exists within it.
                </p>
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <p className="text-[#BD9958] italic mb-4">The Conscious Creation:</p>
                  <p>
                    Our pieces are handmade in small batches by artisans, using natural materials and symbolic geometry. Nothing is mass-produced. Nothing is accidental. Every detail is intentional.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="container mx-auto px-6 py-32 md:py-48 text-center max-w-4xl">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="space-y-12"
        >
          <h2 className="text-4xl md:text-5xl text-white leading-tight">
            Aakaura isn’t about aesthetic spirituality or borrowed beliefs.
          </h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <span className="block text-[#BD9958] text-4xl md:text-6xl font-medium mb-2">Awareness</span>
              <span className="text-white/40 uppercase tracking-widest text-xs">The Foundation</span>
            </div>
            <div className="text-center">
              <span className="block text-[#BD9958] text-4xl md:text-6xl font-medium mb-2">Discipline</span>
              <span className="text-white/40 uppercase tracking-widest text-xs">The Practice</span>
            </div>
            <div className="text-center">
              <span className="block text-[#BD9958] text-4xl md:text-6xl font-medium mb-2">Alignment</span>
              <span className="text-white/40 uppercase tracking-widest text-xs">The State</span>
            </div>
          </div>
          <p className="text-2xl md:text-3xl text-white/80 italic">
            "About living consciously in a world that rewards numbness."
          </p>
        </motion.div>
      </section>



      {/* Closing CTA Section */}
      <section className="relative h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="/images/aboutBanner.jpg"
            alt="Closing Background"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="relative z-10 space-y-12 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            <h2 className="text-4xl md:text-6xl text-[#BD9958] font-medium leading-tight">
              This is for those who sense more than they can explain.
            </h2>
            
            <div className="grid md:grid-cols-2 gap-12 text-left pt-8">
              <div className="space-y-4">
                <p className="text-2xl font-medium text-[#BD9958] border-b border-[#BD9958]/20 pb-4">Meaning over excess.</p>
                <p className="text-white/80">Choosing depth in a world of shallow abundance.</p>
              </div>
              <div className="space-y-4">
                <p className="text-2xl font-medium text-[#BD9958] border-b border-[#BD9958]/20 pb-4">Energy is intuitive.</p>
                <p className="text-white/80">It is not imaginary; it is the language of the soul.</p>
              </div>
            </div>
          </motion.div>
          
          <Link 
            href="/journey"
            className="inline-flex items-center gap-4 text-[#BD9958] hover:text-white border-b border-[#BD9958] pb-2 transition-all group pt-8"
          >
            <span className="text-lg tracking-widest uppercase">Begin Your Shift</span>
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Dynamic Animated Text Footer */}
      {/* <section className="bg-[#27190B]">
        <AnimatedText 
          text="SHIFT BACK TO SELF-AWARENESS." 
          className="text-[#BD9958]/20 italic"
        />
      </section> */}
    </div>
  );
}

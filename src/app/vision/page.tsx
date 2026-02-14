"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Aurora from "@/components/ui/Aurora";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

export default function VisionPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div
      ref={containerRef}
      className="bg-[#27190B] text-[#BD9958] font-cormorant min-h-screen"
    >
      {/* Cinematic Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Aurora Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <Aurora
            colorStops={["#BD9958", "#A01B04", "#27190B"]}
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
            Aakaura
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.1] text-white"
          >
            The Vision <span className="text-[#BD9958]">Behind</span>
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
            className="mt-8 text-xl md:text-2xl text-white/80 font-light tracking-[0.05em] max-w-3xl mx-auto"
          >
            Driven by disciplined study and conscious exploration.
          </motion.h2>
        </motion.div>
      </section>

      {/* Leadership Section */}
      <section className="container mx-auto px-6 py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-20">
          {/* Founder */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-3xl md:text-4xl text-white">
              Our <span className="text-[#BD9958] italic">Founder</span>
            </h3>
            <div className="h-[1px] w-20 bg-[#BD9958]" />
            <p className="text-lg text-white/80 leading-relaxed font-light text-justify">
              A certified <span className="text-[#BD9958]">Pranic Healer</span>{" "}
              by the GMCKS Pranic Healing Trust, Rajasthan, with an academic
              background in Economics and Finance. She always felt called to
              contribute to something larger than conventional business.
            </p>
            <p className="text-lg text-white/80 leading-relaxed font-light text-justify">
              Trained to understand systems, incentives, and value creation, she
              became deeply aware of a quiet imbalance… where immense human
              skill exists, yet remains undervalued. Across villages, hilly
              regions, and remote communities, she saw highly skilled artisans
              whose craftsmanship carried generations of wisdom.
            </p>
          </motion.div>

          {/* CEO */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl md:text-4xl text-white">
              Our <span className="text-[#BD9958] italic">CEO</span>
            </h3>
            <div className="h-[1px] w-20 bg-[#BD9958]" />
            <p className="text-lg text-white/80 leading-relaxed font-light text-justify">
              A dedicated researcher and lifelong reader, deeply interested in
              human consciousness, neuroplasticity, and the untapped potential
              of the human mind.
            </p>
            <p className="text-lg text-white/80 leading-relaxed font-light text-justify">
              Both of them have been continuously studying consciousness,
              metaphysics, and the ways in which the universe and cosmos
              operate; bridging ancient energy systems with modern inquiry.
            </p>
            <p className="text-lg text-white/80 leading-relaxed font-light text-justify">
              Their perspectives are shaped by extensive reading across
              neuroscience, quantum concepts, metaphysical thought, and
              contemporary authors such as{" "}
              <span className="italic text-[#BD9958]">Dr. Joe Dispenza</span>{" "}
              and{" "}
              <span className="italic text-[#BD9958]">
                Mr. Jiddu Krishnamurti
              </span>{" "}
              along with classical philosophical traditions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="bg-[#1a1107] py-24 md:py-36">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-3xl md:text-5xl text-white leading-tight mb-8">
                A Symbolic & Experiential{" "}
                <span className="text-[#BD9958] italic">Reminder</span>
              </h2>
              <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
                Every Aakaura product is an invitation for the human mind to
                re-engage, to remember, and to reclaim self-awareness and inner
                independence in a world designed for distraction and numbing.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Belief Section */}
      <section className="container mx-auto px-6 py-24 md:py-36">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
            {/* Fallback pattern or image if specific vision image isn't available, using Aurora as placeholder background style */}
            <div className="absolute inset-0 bg-[#27190B]">
              <Aurora
                colorStops={["#BD9958", "#4A3423", "#1a1107"]}
                amplitude={1.0}
                blend={0.5}
                speed={0.2}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-4xl text-white/20 font-light tracking-widest uppercase">
                Awareness
              </h3>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-3xl md:text-5xl text-white">
              The Single Belief
            </h2>
            <div className="space-y-6 text-lg text-white/80 font-light leading-relaxed text-justify">
              <p>
                Aakaura does not claim supernatural abilities or guaranteed
                transformations. Instead, it works on a single belief:
              </p>
              <div className="pl-6 border-l-2 border-[#BD9958]">
                <p className="text-xl italic text-white">
                  "That modern life conditions humans to forget their innate
                  awareness—and that remembrance begins with intention,
                  curiosity, and conscious engagement."
                </p>
              </div>
              <p>
                Aakaura exists not to provide answers, but to provoke
                reflection, restore attention, and invite individuals to
                reconnect with who they are beneath conditioning.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer / Closing */}
      <section className="py-24 text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          <div className="h-[1px] w-24 bg-[#BD9958] mx-auto mb-8" />
          <p className="text-xl md:text-3xl text-white leading-relaxed font-light">
            "Aakaura is shaped by{" "}
            <span className="text-[#BD9958] italic">healing hands</span> and{" "}
            <span className="text-[#BD9958] italic">questioning minds</span>."
          </p>
          <p className="text-lg text-white/60">
            Hands trained in energy discipline. Minds trained to understand
            systems, economics, and the unseen forces that govern both markets
            and consciousness.
          </p>
          <div className="pt-12">
            <Link
              href="/journey"
              className="inline-flex items-center gap-3 text-[#BD9958] hover:text-white border-b border-[#BD9958] pb-1 transition-all group"
            >
              <span className="uppercase tracking-widest text-sm">
                Explore Our Journey
              </span>
              <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

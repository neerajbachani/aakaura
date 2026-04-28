"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import HumanBranches from "@/components/HumanBranches";
import Container from "@/components/ui/Container";
import Aurora from "@/components/ui/Aurora";
import fonts from "@/config/fonts";

// Journey data configuration
const journeys = [
  {
    id: "grounding",
    name: "The Grounded Journey",
    title: "Muladhara Chakra",
    color: "#ef4444",
    symbol: "/chakras/root-symbol.svg",
    chooseIf: [
      "You feel on edge.. even when everything is fine",
      "Your mind keeps going to “what if everything goes wrong?”",
      "You prepare for worst case scenarios, even when unnecessary",
      "You are unable to relax without feeling guilty for ‘wasting’ time",
      "You obsessively plan for your finances (stability, survival) all the time",
      "Your nervous system is almost every time in survival mode and therefore the constant need to control everything possible",
    ],
    teachesHeading: "What shifts this inner journey brings:",
    teaches:
      "You stop living in survival mode. Your body starts feeling rooted to finally support the mind to rise.",
    wisdom:
      "Old wisdom says: A tree that ignores its roots falls in the first storm.",
    buttonText: "Begin your journey",
  },
  {
    id: "flow",
    name: "The Flow Journey",
    title: "Svadhisthana Chakra",
    color: "#f97316",
    symbol: "/chakras/sacral-symbol.svg",
    chooseIf: [
      "You are unable to express emotions or often lack creativity (solutions) at work",
      "You are unable to feel pleasure without feeling guilty",
      "Relationships feel suffocating after sometime for no reason (also includes self- sabotaging relationships because of fear of real intimacy or co-dependency)",
      "You are unable to come out of an overthinking spiral when it comes to feeling emotions (intense mood swings as well)",
      "You are subconsciously giving access to people who you do not know properly (hypersexuality)",
      "You also tend to subconsciously indulge in manipulative behaviours to have control over others",
    ],
    teachesHeading: "What shifts this inner journey brings:",
    teaches:
      "You start allowing life to simply flow. Suppressed emotions are not a thing anymore, the unhealthy leakage of emotions stops and you feel emotions with space.",
    wisdom:
      "Traditionally known as the seat of creation.. not just art, but life-force itself.",
    buttonText: "Begin your journey",
  },
  {
    id: "power",
    name: "The Power Journey",
    title: "Manipura Chakra",
    color: "#eab308",
    symbol: "/chakras/solar-plexus-symbol.svg",
    chooseIf: [
      "You are capable beyond measure but you still doubt your decisions a lot",
      "You are very clumsy with giving power upon yourself, your feelings and emotions",
      "You feel anger but do not understand how to express it properly until it converts into aggression (or into numbed calmness).",
      "You are unable to set boundaries because you feel guilty for setting them",
      "You are arrogant or egotistical with the knowledge you have",
      "Perfectionism does not leave you- for yourself (harsh self-judgement) & others (my way or the highway)",
    ],
    teachesHeading: "What shifts this inner journey brings:",
    teaches:
      "For you- power is not domination anymore, it is now self-trust. A non-negotiable.",
    wisdom:
      "Ancient systems placed fire at the center for a reason…without it, nothing transforms.",
    buttonText: "Begin your journey",
  },
  {
    id: "love",
    name: "The Compassion Journey",
    title: "Anahata Chakra",
    color: "#22c55e",
    symbol: "/chakras/heart-symbol.svg",
    chooseIf: [
      "You have different worlds- one with you in isolation with yAakaura Speaks, one with everyone else including loved ones",
      "You love deeply but protect heavily (self sabotage) suddenly when it feels too real",
      "You are not at all able to forgive those who did you wrong",
      "You are always confused between getting attached and detached",
      "You have a poor sense of self-love which results in jealousy, poor boundaries, obsession with your loved one(s), constant overthinking in love relations",
      "You give way too much combined with levels of self-neglect which is not healthy",
    ],
    teachesHeading: "What shifts this inner journey brings:",
    teaches:
      "Your heart is free to breathe now- no fear of vulnerability, only feeling of security, even when the weather is turbulent. It becomes the bridge between earth and sky- powerful beyond galaxies.",
    wisdom:
      "Traditionally, this was considered the balance point… where human meets divine.",
    buttonText: "Begin your journey",
  },
  {
    id: "expression",
    name: "The Truth Journey",
    title: "Vishuddha Chakra",
    color: "#06b6d4",
    symbol: "/chakras/throat-symbol.svg",
    chooseIf: [
      "You are unable to speak your truest feelings to even your closest people",
      "You over-explain but still somehow feel misunderstood often",
      "You feel swallowing words will help you keep the peace even among family",
      "You express everything (even violently sometimes) except how you really feel (which makes you cry often in arguments)",
      "You have a habit of talking excessively to dominate conversations or becoming verbally aggressive",
      "You unintentionally interrupt others during discussions to prove a point; you love gossiping",
    ],
    teachesHeading: "What shifts this inner journey brings:",
    teaches:
      "Your truth does not remain unspoken anymore. Your words become more balanced, perspective more nuanced and you are not party to the common ‘silent treatment.’",
    wisdom: "Old cultures knew words carry energy… silence does too..",
    buttonText: "Begin your journey",
  },
  {
    id: "insight",
    name: "The Vision Journey",
    title: "Third Eye Chakra",
    color: "#3b82f6",
    symbol: "/chakras/third-eye-symbol.svg",
    chooseIf: [
      "You sense things but dismiss them because of lack of trust in your own instincts",
      "If a decision does not particularly follow logic but intuition, you are unsure of it",
      "You feel disconnected from your higher purpose and are stagnant",
      "You seek answers for validation outside instead of within; lack of inner compass",
      "You overthink everything and you cannot sit in silence; quieting the mind is a task",
      "You use spirituality as a bypass to avoid dealing with practical life or humans in general",
    ],
    teachesHeading: "What this journey teaches:",
    teaches:
      "You stop seeing things for what they are supposed to be and become perceptual for what they are. Repeating patterns are no more an everyday thing, you take full control over your life decisions, personality and stability in relations.",
    wisdom: "Ancient science placed intuition above intellect, not against it.",
    buttonText: "Begin your journey",
  },
  {
    id: "expansion",
    name: "The Surrender Journey",
    title: "Crown Chakra",
    color: "#9333ea",
    symbol: "/chakras/crown-symbol.svg",
    chooseIf: [
      "You’re constantly searching for purpose but unable to find anything",
      "Achievements leave you feeling hollow; success feels numbing",
      "You feel guided yet confused and unsure of the path ahead",
      "You have ‘programmed’ spirituality into your life resulting in total cut off from the external environment and responsibilities",
      "You feel disconnected from everything, even your own body sometimes (insomnia or vivid dreams that do not let you sleep properly)",
      "You’re ready to release control",
    ],
    teachesHeading: "What this journey teaches:",
    teaches:
      "You finally realise that you are not separate from existence. You are the subtle cause for everything around you- this device, your breath, others’ actions- everything is revolving around you and you are the universe interacting with itself all the time.",
    wisdom:
      "Traditions never treated surrender as weakness, it was the highest intelligence.",
    buttonText: "Begin your journey",
  },
];

// Journey Section Component
function JourneySection({
  journey,
  index,
}: {
  journey: (typeof journeys)[0];
  index: number;
}) {
  return (
    <section
      id={journey.id}
      className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
      style={{
        background: `linear-gradient(135deg, ${journey.color}10 0%, transparent 50%, ${journey.color}05 100%)`,
      }}
    >
      {/* Background glow effect */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `radial-gradient(circle at ${index % 2 === 0 ? "left" : "right"} center, ${journey.color} 0%, transparent 70%)`,
        }}
      />

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Symbol and Title */}
            <div className="flex flex-col items-center md:items-start space-y-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2, type: "spring" }}
                className="relative w-32 h-32 md:w-40 md:h-40"
              >
                <div
                  className="absolute inset-0 rounded-full blur-2xl opacity-50"
                  style={{ background: journey.color }}
                />
                <Image
                  src={journey.symbol}
                  alt={journey.name}
                  fill
                  className="object-contain relative z-10"
                  style={{
                    filter:
                      "brightness(1.3) drop-shadow(0 0 20px currentColor)",
                  }}
                />
              </motion.div>

              <div className="text-center md:text-left">
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`${fonts.playfair} text-4xl md:text-5xl font-light mb-2`}
                  style={{ color: journey.color }}
                >
                  {journey.title}
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className={`${fonts.mulish} text-[#BD9958]/70 text-lg tracking-wider`}
                >
                  {journey.name}
                </motion.p>
                {(journey as any).subtitle && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.45 }}
                    className={`${fonts.mulish} text-white/60 text-lg italic mt-3 max-w-sm mx-auto md:mx-0`}
                  >
                    {(journey as any).subtitle}
                  </motion.p>
                )}
              </div>
            </div>

            {/* Right side - Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-8"
            >
              {/* Choose this journey if */}
              <div className="space-y-4">
                <h3
                  className={`${fonts.playfair} text-2xl font-medium text-[#BD9958]`}
                >
                  Do any of these feel like you?
                </h3>
                <ul className={`${fonts.mulish} space-y-3 text-white/80`}>
                  {journey.chooseIf.map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.6 + idx * 0.1 }}
                      className="flex items-start gap-3"
                    >
                      <span
                        className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: journey.color }}
                      />
                      <span>{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* What this journey teaches */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1 }}
                className="space-y-3"
              >
                <div className="flex items-center gap-3 pt-2">
                  <div
                    className={`w-8 h-[1px]`}
                    style={{ background: journey.color }}
                  />
                  <span className={`${fonts.mulish} text-white/50 italic`}>
                    If yes,
                  </span>
                </div>
                <h3
                  className={`${fonts.playfair} text-2xl font-medium text-[#BD9958]`}
                >
                  {journey.teachesHeading}
                </h3>
                <p
                  className={`${fonts.mulish} text-white/90 text-lg leading-relaxed`}
                >
                  {journey.teaches}
                </p>
              </motion.div>

              {/* Traditional wisdom */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="relative"
              >
                <div
                  className="p-6 rounded-lg border-l-4"
                  style={{
                    borderColor: journey.color,
                    background: `linear-gradient(135deg, ${journey.color}05 0%, transparent 100%)`,
                  }}
                >
                  <p
                    className={`${fonts.playfair} text-[#BD9958]/90 italic text-lg leading-relaxed`}
                  >
                    {journey.wisdom}
                  </p>
                </div>
              </motion.div>

              {/* Start Journey Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="pt-4"
              >
                <Link
                  href={`/journey/${journey.id}`}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 overflow-hidden rounded-full bg-white/5 border border-white/10 hover:border-[#BD9958]/50 transition-all duration-500"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#BD9958]/10 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />

                  <span
                    className={`${fonts.mulish} relative z-10 text-[#BD9958] group-hover:text-white tracking-widest uppercase text-sm font-medium transition-colors duration-300`}
                  >
                    This feels like me
                  </span>

                  <svg
                    className="w-5 h-5 text-[#BD9958] group-hover:text-white group-hover:translate-x-1 transition-all duration-300 transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default function JourneysPage() {
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const scrollToSection = (chakraId: string) => {
    const section = document.getElementById(chakraId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="bg-[#27190B] relative">
      {/* Aurora Background - Fixed */}
      {/* <div className="fixed inset-0 z-0 opacity-30">
        <Aurora
          colorStops={["#BD9958", "#A01B04", "#27190B"]}
          amplitude={1.8}
          blend={0.6}
          speed={0.3}
        />
      </div> */}

      {/* Hero Section with HumanBranches */}
      <section className="h-screen flex flex-col items-center justify-between relative overflow-hidden lg:py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.6 }}
          className="w-full  flex items-center justify-center"
        >
          <HumanBranches onChakraClick={scrollToSection} />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1,
            delay: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="relative z-10 pb-4"
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className={`${fonts.mulish} text-[#BD9958]/50 text-sm tracking-widest`}
            >
              SCROLL TO EXPLORE
            </span>
            <svg
              className="w-6 h-6 text-[#BD9958]/50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </section>

      {/* Intro Section */}
      <section className="py-20 relative z-10">
        <Container className="max-w-4xl mx-auto text-center space-y-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${fonts.playfair} text-3xl md:text-5xl text-[#BD9958] font-light`}
          >
            Congratulations! Welcome back to consciousness.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className={`${fonts.mulish} text-white/80 text-lg md:text-xl leading-relaxed space-y-6`}
          >
            <p>
              A chakra (vital energy centers located along the human spine) can
              either be in excess energy or deficit energy. It should be
              balanced (a little difficult in this oversimulated world but who
              doesn&apos;t like challenges? Especially when it comes to inner
              work.) Let&apos;s see!
            </p>

            <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-[#BD9958]/10 to-transparent border border-[#BD9958]/20 backdrop-blur-sm text-center max-w-3xl mx-auto shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#27190B] px-6 rounded-full border border-[#BD9958]/20 shadow-sm">
                <span className="text-[#BD9958] tracking-[0.2em] uppercase text-xs font-semibold py-1 block">
                  Small Note
                </span>
              </div>

              <div className="space-y-6 text-white/90 text-lg md:text-xl font-light flex flex-col items-center mt-2">
                <p className="leading-relaxed opacity-90">
                  We are spiritual beings having a human experience.
                  <br />
                  We don’t “become spiritual” overnight.
                  <br />
                  We don’t heal everything at once.
                  <br />
                  And we don’t need to understand energy to feel it.
                </p>

                <div className="w-16 h-[1px] bg-[#BD9958]/40 my-2"></div>

                <p className="leading-relaxed font-medium text-[#BD9958] italic text-xl md:text-2xl">
                  What matters is honesty about where we are right now.
                </p>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Journey Sections */}
      {journeys.map((journey, index) => (
        <JourneySection key={journey.id} journey={journey} index={index} />
      ))}

      {/* Closing CTA Section */}
      <section className="min-h-[50vh] flex items-center justify-center relative overflow-hidden py-20">
        <Container className="relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8 max-w-3xl mx-auto"
          >
            <h2
              className={`${fonts.playfair} text-4xl md:text-5xl text-[#BD9958] font-light`}
            >
              Ready to Begin?
            </h2>
            <p
              className={`${fonts.mulish} text-white/80 text-xl leading-relaxed`}
            >
              Every journey starts with a single step inward.
              <br />
              Choose the path that calls to you, or let your intuition guide the
              way.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <a
                href="/quiz"
                className={`${fonts.mulish} inline-block px-8 py-4 bg-[#BD9958] text-[#27190B] rounded-full text-lg font-medium tracking-wide hover:bg-[#BD9958]/90 transition-colors`}
              >
                Check your energy level
              </a>
            </motion.div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}

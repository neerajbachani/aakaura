"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Aurora from "@/components/ui/Aurora";
import { ImSpinner8 } from "react-icons/im";

// --- Data & Types ---

type OptionChar = "A" | "B" | "C" | "D" | "E" | "F" | "G";

interface Situation {
  id: number;
  title: string;
  question: string;
  options: { char: OptionChar; text: string }[];
}

const situations: Situation[] = [
  {
    id: 1,
    title: "SITUATION 1",
    question: "You walk into a room full of people you know, but suddenly feel out of place. What happens next?",
    options: [
      { char: "A", text: "I mentally check out and wait for it to end." },
      { char: "B", text: "My mind starts overanalyzing how I’m being perceived." },
      { char: "C", text: "I feel emotionally weird but can’t explain why." },
      { char: "D", text: "I want to say something but stop myself." },
      { char: "E", text: "I feel irritated and restless." },
      { char: "F", text: "I feel like none of this actually matters." },
      { char: "G", text: "I feel unsafe or uncomfortable." },
    ],
  },
  {
    id: 2,
    title: "SITUATION 2",
    question: "You have a free day with no responsibilities. Your reaction?",
    options: [
      { char: "A", text: "I still feel oddly empty." },
      { char: "B", text: "My mind stays busy anyway." },
      { char: "C", text: "My mood keeps fluctuating." },
      { char: "D", text: "I want to express myself but don’t know how." },
      { char: "E", text: "I procrastinate even then." },
      { char: "F", text: "I start questioning life." },
      { char: "G", text: "I worry about what I should be doing." },
    ],
  },
  {
    id: 3,
    title: "SITUATION 3",
    question: "Someone misunderstands you.",
    options: [
      { char: "A", text: "I detach emotionally." },
      { char: "B", text: "I replay the conversation repeatedly." },
      { char: "C", text: "I feel hurt more than I show." },
      { char: "D", text: "I wish I had spoken better." },
      { char: "E", text: "I feel frustrated but don’t act." },
      { char: "F", text: "I think, “People never really get me.”" },
      { char: "G", text: "I feel threatened or insecure." },
    ],
  },
  {
    id: 4,
    title: "SITUATION 4",
    question: "You’re about to start something important (project, conversation, life change).",
    options: [
      { char: "A", text: "I feel disconnected from it." },
      { char: "B", text: "My mind fills with doubts." },
      { char: "C", text: "My emotions take over." },
      { char: "D", text: "I struggle to say what I really want." },
      { char: "E", text: "I delay starting." },
      { char: "F", text: "I question the purpose of it." },
      { char: "G", text: "I fear losing stability." },
    ],
  },
  {
    id: 5,
    title: "SITUATION 5",
    question: "Late night. No distractions. Just you.",
    options: [
      { char: "A", text: "I feel numb." },
      { char: "B", text: "My mind won’t shut up." },
      { char: "C", text: "Emotions surface unexpectedly." },
      { char: "D", text: "I think of things I never said." },
      { char: "E", text: "I feel guilty about not doing enough." },
      { char: "F", text: "I feel spiritually disconnected." },
      { char: "G", text: "I worry about security or future." },
    ],
  },
  {
    id: 6,
    title: "SITUATION 6",
    question: "You’re scrolling endlessly. Why?",
    options: [
      { char: "A", text: "To avoid feeling anything." },
      { char: "B", text: "To keep my brain occupied." },
      { char: "C", text: "To soothe emotions." },
      { char: "D", text: "To distract from unexpressed thoughts." },
      { char: "E", text: "To escape responsibility." },
      { char: "F", text: "To fill a deeper emptiness." },
      { char: "G", text: "To feel temporarily safe." },
    ],
  },
  {
    id: 7,
    title: "SITUATION 7",
    question: "When things finally go quiet in life…",
    options: [
      { char: "A", text: "I feel lost." },
      { char: "B", text: "My mind creates noise." },
      { char: "C", text: "My emotions surface." },
      { char: "D", text: "I feel unheard." },
      { char: "E", text: "I feel unproductive." },
      { char: "F", text: "I feel disconnected from meaning." },
      { char: "G", text: "I feel unsafe." },
    ],
  },
];

const JOURNEYS: Record<OptionChar, { name: string; slug: string; message: string }> = {
  A: {
    name: "Crown Journey",
    slug: "crown",
    message:
      "You are stepping into higher awareness and connection with universal consciousness. This journey will guide you to expand your perspective and embrace spiritual insight.",
  },
  B: {
    name: "Third Eye Journey",
    slug: "third-eye",
    message:
      "Your intuition and inner vision are awakening. This journey will help you trust your instincts and perceive beyond the ordinary.",
  },
  C: {
    name: "Heart Journey",
    slug: "heart",
    message:
      "Love, compassion, and emotional balance are your focus. This journey nurtures empathy and deepens your connections with others.",
  },
  D: {
    name: "Throat Journey",
    slug: "throat",
    message:
      "Expression and communication are key for you now. This journey empowers you to speak your truth and share your authentic voice.",
  },
  E: {
    name: "Solar Plexus Journey",
    slug: "solar-plexus",
    message:
      "Personal power and confidence are emerging. This journey strengthens your will, self-esteem, and ability to take decisive action.",
  },
  F: {
    name: "Sacral Journey",
    slug: "sacral",
    message:
      "Creativity, pleasure, and emotional flow are highlighted. This journey encourages you to embrace joy, passion, and healthy relationships.",
  },
  G: {
    name: "Root Journey",
    slug: "root",
    message:
      "Grounding and stability are your foundation. This journey helps you feel secure, connected to your body, and ready to build a strong base for growth.",
  },
};

// --- Components ---

function IntroStep({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-xl mx-auto text-center space-y-8 px-6"
    >
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F5E6D3]">
          “Welcome Home.”
        </h1>
        <p className="text-lg md:text-xl text-[#F5E6D3]/80 font-light leading-relaxed">
          This quiz isn’t about labels. It’s about patterns.
          <br />
          Through everyday situations, it reads where your energy is asking for
          attention right now.
        </p>
      </div>

      <div className="space-y-4 text-sm md:text-base text-[#F5E6D3]/60 bg-[#F5E6D3]/05 p-6 rounded-2xl border border-[#F5E6D3]/10 backdrop-blur-sm">
        <p>No prior understanding of chakras is needed.</p>
        <p>No right or wrong answers exist.</p>
        <p>Just choose what feels most true in the moment.</p>
        <p className="italic">Don’t overthink it. Your first instinct usually knows.</p>
      </div>

      <button
        onClick={onStart}
        className="group relative px-8 py-3 bg-[#F5E6D3] text-[#27190B] font-medium text-lg rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
      >
        Begin Journey
      </button>

      <p className="text-xs text-[#F5E6D3]/40">Takes 2–3 minutes</p>
    </motion.div>
  );
}

function QuestionStep({
  situation,
  onAnswer,
}: {
  situation: Situation;
  onAnswer: (char: OptionChar) => void;
  currentCount: number;
  totalCount: number;
}) {
  return (
    <motion.div
      key={situation.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto px-4 w-full"
    >
      <div className="mb-8 text-center">
        <span className="text-xs tracking-widest uppercase text-[#F5E6D3]/40">
          Situation {situation.id} / 7
        </span>
        <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3] mt-4 leading-normal">
          {situation.question}
        </h2>
      </div>

      <div className="space-y-3">
        {situation.options.map((option, idx) => (
          <motion.button
            key={option.char}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onAnswer(option.char)}
            className="w-full text-left p-4 md:p-5 rounded-xl border border-[#F5E6D3]/10 bg-[#F5E6D3]/05 hover:bg-[#F5E6D3]/10 hover:border-[#F5E6D3]/30 transition-all duration-200 group flex items-start gap-4"
          >
            <span className="flex-shrink-0 w-6 h-6 rounded-full border border-[#F5E6D3]/20 flex items-center justify-center text-xs text-[#F5E6D3]/60 group-hover:border-[#F5E6D3]/40 group-hover:text-[#F5E6D3]">
              {option.char}
            </span>
            <span className="text-[#F5E6D3]/90 group-hover:text-white font-light text-base md:text-lg">
              {option.text}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function AnalyzingStep() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center space-y-6 text-[#F5E6D3]"
    >
      <ImSpinner8 className="w-12 h-12 animate-spin text-[#F5E6D3]/50" />
      <p className="text-xl font-light tracking-wide animate-pulse">
        Listening to your energy...
      </p>
    </motion.div>
  );
}

function ResultStep({ answers }: { answers: OptionChar[] }) {
  const result = useMemo(() => {
    const counts: Record<string, number> = {};
    answers.forEach((char) => {
      counts[char] = (counts[char] || 0) + 1;
    });

    let maxChar: OptionChar = "G";
    let maxCount = 0;

    Object.entries(counts).forEach(([char, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxChar = char as OptionChar;
      }
    });

    // If no option exceeds 30-35% (approx < 3 out of 7), trigger Balanced
    if (maxCount < 3) {
      return {
        type: "balanced",
        journey: JOURNEYS["G"], // Default to Root
      };
    }

    return {
      type: "dominant",
      journey: JOURNEYS[maxChar],
    };
  }, [answers]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-3xl mx-auto px-6 text-center"
    >
      {result.type === "balanced" ? (
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-serif text-[#F5E6D3] leading-tight">
              You’re Not One Thing Right Now
              <br />
              <span className="text-[#F5E6D3]/60">— and That’s Okay.</span>
            </h2>
          </div>

          <div className="space-y-6 bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md">
            <p className="text-lg md:text-xl text-[#F5E6D3]/90 font-light leading-relaxed">
              You’re experiencing multiple signals because your system isn’t asking for focus yet.
              <br />
              It’s asking for <span className="font-medium text-[#F5E6D3]">stability first</span>.
            </p>
            <p className="text-[#F5E6D3]/70 font-light">
              Before clarity comes grounding.
              <br />
              Before direction comes balance.
            </p>
            <div className="pt-4 pb-2">
               <span className="inline-block px-4 py-1.5 rounded-full bg-[#F5E6D3]/10 text-[#F5E6D3]/80 text-sm">
                Too many tabs open. Time to stabilize the system.
               </span>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm uppercase tracking-widest text-[#F5E6D3]/40">
              Recommended Journey
            </p>
            <h3 className="text-3xl font-serif text-[#F5E6D3]">Root Journey</h3>
             <p className="max-w-xl mx-auto text-[#F5E6D3]/70">
              Not because it’s trendy — because it’s foundational. When energy is scattered, grounding is step one.
            </p>
            <div className="pt-6">
              <Link
                href={`/journey/${result.journey.slug}`}
                className="inline-block px-10 py-4 bg-[#F5E6D3] text-[#27190B] font-medium text-lg rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(245,230,211,0.2)]"
              >
                Begin Root Journey
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
           <div className="space-y-2">
            <p className="text-sm uppercase tracking-widest text-[#F5E6D3]/40">
              Your Energy Speaks
            </p>
            <h2 className="text-4xl md:text-6xl font-serif text-[#F5E6D3] drop-shadow-lg">
              {result.journey.name}
            </h2>
          </div>

          <div className="space-y-6 bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md max-w-2xl mx-auto">
            <p className="text-xl text-[#F5E6D3]/90 font-light leading-relaxed">
              {result.journey.message}
            </p>
          </div>

          <div className="pt-4">
            <Link
              href={`/journey/${result.journey.slug}`}
              className="inline-block px-10 py-4 bg-[#F5E6D3] text-[#27190B] font-medium text-lg rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(245,230,211,0.2)]"
            >
              Explore This Journey
            </Link>
          </div>
        </div>
      )}

      {/* Footer / Disclaimer */}
      <div className="mt-16 pt-8 border-t border-[#F5E6D3]/10 text-[#F5E6D3]/30 text-xs md:text-sm space-y-2 font-light">
        <p>All energies work together. Life isn’t meant to be lived by fixing one part at a time.</p>
        <p>This journey is simply your starting point, not your destination. Begin where you are.</p>
      </div>
    </motion.div>
  );
}

export default function QuizPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "analyzing" | "result">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<OptionChar[]>([]);

  const handleStart = () => {
    setStep("quiz");
  };

  const handleAnswer = (answer: OptionChar) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < situations.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 250); // Slight delay for visual feedback
    } else {
      setStep("analyzing");
      setTimeout(() => {
        setStep("result");
      }, 2000); // 2 seconds of "analyzing"
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#27190B] text-[#F5E6D3] relative overflow-hidden flex flex-col items-center justify-center py-20">
      {/* Background Aurora */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <Aurora
          colorStops={["#27190B", "#5D4037", "#1A1005"]}
          blend={0.6}
          amplitude={0.8}
          speed={0.5}
        />
      </div>

       {/* Gentle Grain/Texture Overlay (Optional - keeping clean for now) */}
       
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "intro" && (
            <IntroStep key="intro" onStart={handleStart} />
          )}
          {step === "quiz" && (
            <QuestionStep
              key="quiz"
              situation={situations[currentQuestionIndex]}
              onAnswer={handleAnswer}
              currentCount={currentQuestionIndex + 1}
              totalCount={situations.length}
            />
          )}
          {step === "analyzing" && <AnalyzingStep key="analyzing" />}
          {step === "result" && (
            <ResultStep key="result" answers={answers} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

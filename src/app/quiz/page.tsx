"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Aurora from "@/components/ui/Aurora";
import { ImSpinner8 } from "react-icons/im";
import {
  IoIosArrowBack,
  IoIosArrowForward,
  IoIosInformationCircleOutline,
} from "react-icons/io";

// --- Data & Types ---

type ChakraSlug =
  | "root"
  | "sacral"
  | "solar-plexus"
  | "heart"
  | "throat"
  | "third-eye"
  | "crown";
type EnergyState = "excess" | "deficit" | "stable";

interface QuizAnswer {
  id: string;
  text: string;
  chakra: ChakraSlug;
  state: EnergyState;
  weight: number;
}

interface Question {
  id: string;
  question: string;
  answers: QuizAnswer[];
  multiSelect: boolean;
}

interface ChakraResult {
  name: string;
  slug: ChakraSlug;
  state: "excess" | "deficit" | "stable";
  score: number;
}

const chakraNames: Record<ChakraSlug, string> = {
  root: "Root Chakra",
  sacral: "Sacral Chakra",
  "solar-plexus": "Solar Plexus Chakra",
  heart: "Heart Chakra",
  throat: "Throat Chakra",
  "third-eye": "Third Eye Chakra",
  crown: "Crown Chakra",
};

// --- Components ---

function IntroStep({ onStart }: { onStart: () => void }) {
  const [accepted, setAccepted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl mx-auto text-center space-y-8 px-6"
    >
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#F5E6D3]">
          Welcome Home.
        </h1>
        <p className="text-lg md:text-xl text-[#F5E6D3]/80 font-light leading-relaxed">
          This quiz reads where your energy is right now.
          <br />
          Not where it should be. Not where it was.
        </p>
      </div>

      {/* <div className="space-y-4 text-base md:text-lg lg:text-2xl text-[#F5E6D3]/80 bg-[#F5E6D3]/05 p-6 md:p-8 rounded-2xl border border-[#F5E6D3]/10 backdrop-blur-sm">
        <p className="font-medium text-[#F5E6D3]">
          Balance is not a personality trait.
        </p>
        <p>It is a moment.</p>
        <p>So yes balanced chakras should be hard to "get".</p>
        <p className="italic">
          They should show up like: "oh wow, okay, you're doing well right now"
        </p>
        <p>not "congrats, you're enlightened, buy incense"</p>

        <div className="pt-4 mt-4 border-t border-[#F5E6D3]/10">
          <p className="font-serif text-[#F5E6D3] mb-2">
            A balanced chakra means:
          </p>
          <p className="italic">
            The energy is responding appropriately to life at this moment.
          </p>
        </div>
      </div> */}

      <div className="space-y-4 text-base md:text-lg lg:text-2xl text-[#F5E6D3]/80 bg-[#F5E6D3]/05 p-6 md:p-8 rounded-2xl border border-[#F5E6D3]/10 backdrop-blur-sm">
        <p>No prior understanding of chakras is needed.</p>
        <p>No right or wrong answers exist.</p>
        <p>Just choose what feels most true in the moment.</p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <label className="flex items-center gap-3 cursor-pointer text-[#F5E6D3]/80 hover:text-[#F5E6D3] transition-colors">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="w-5 h-5 rounded border-[#F5E6D3]/20 bg-[#F5E6D3]/5 text-[#27190B] focus:ring-[#F5E6D3]/50 cursor-pointer accent-[#F5E6D3]"
          />
          <span className="text-sm md:text-base select-none">
            I understand this is not medical advice.
          </span>
        </label>
      </div>

      <button
        onClick={onStart}
        disabled={!accepted}
        className={`group relative px-8 py-3 font-medium text-lg rounded-full transition-all duration-300 transform ${
          accepted
            ? "bg-[#F5E6D3] text-[#27190B] hover:bg-white hover:scale-105"
            : "bg-[#F5E6D3]/20 text-[#F5E6D3]/50 cursor-not-allowed"
        }`}
      >
        Begin
      </button>

      <p className="text-xs text-[#F5E6D3]/40">Takes 5–7 minutes</p>
    </motion.div>
  );
}

function QuestionStep({
  question,
  onAnswer,
  selectedAnswers,
  onBack,
  onNext,
  isFirst,
  isLast,
  currentCount,
  totalCount,
}: {
  question: Question;
  onAnswer: (answerIndex: number) => void;
  selectedAnswers: number[];
  onBack: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
  currentCount: number;
  totalCount: number;
}) {
  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-2xl mx-auto px-4 w-full"
    >
      <div className="mb-8 text-center">
        <span className="text-xs tracking-widest uppercase text-[#F5E6D3]/40">
          Question {currentCount} / {totalCount}
        </span>
        <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3] mt-4 leading-normal">
          {question.question}
        </h2>
        {question.multiSelect && (
          <p className="text-sm lg:text-lg text-[#F5E6D3]/40 mt-2 font-light italic">
            (Choose all that apply)
          </p>
        )}
      </div>

      <div className="space-y-3">
        {question.answers.map((answer, idx) => (
          <motion.button
            key={answer.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onAnswer(idx)}
            className={`w-full text-left p-4 md:p-5 rounded-xl border transition-all duration-200 group flex items-start gap-4 ${
              selectedAnswers.includes(idx)
                ? "border-[#F5E6D3] bg-[#F5E6D3]/20 shadow-[0_0_15px_rgba(245,230,211,0.1)]"
                : "border-[#F5E6D3]/10 bg-[#F5E6D3]/05 hover:bg-[#F5E6D3]/10 hover:border-[#F5E6D3]/30"
            }`}
          >
            <span
              className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-xs transition-colors ${
                selectedAnswers.includes(idx)
                  ? "border-[#F5E6D3] bg-[#F5E6D3] text-[#27190B]"
                  : "border-[#F5E6D3]/20 text-[#F5E6D3]/60 group-hover:border-[#F5E6D3]/40 group-hover:text-[#F5E6D3]"
              }`}
            >
              {selectedAnswers.includes(idx) ? "✓" : ""}
            </span>
            <span
              className={`font-light text-base md:text-lg transition-colors ${
                selectedAnswers.includes(idx)
                  ? "text-white"
                  : "text-[#F5E6D3]/90 group-hover:text-white"
              }`}
            >
              {answer.text}
            </span>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center mt-12">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-6 py-2 rounded-full border border-[#F5E6D3]/10 text-[#F5E6D3]/60 hover:text-[#F5E6D3] hover:border-[#F5E6D3]/30 transition-all ${
            isFirst ? "opacity-0 pointer-events-none" : ""
          }`}
        >
          <IoIosArrowBack /> Previous
        </button>

        <button
          onClick={onNext}
          disabled={selectedAnswers.length === 0}
          className={`flex items-center gap-2 px-8 py-2 rounded-full font-medium transition-all ${
            selectedAnswers.length > 0
              ? "bg-[#F5E6D3] text-[#27190B] hover:bg-white shadow-[0_0_20px_rgba(245,230,211,0.1)]"
              : "bg-[#F5E6D3]/10 text-[#F5E6D3]/30 cursor-not-allowed"
          }`}
        >
          {isLast ? "See Results" : "Next"} <IoIosArrowForward />
        </button>
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

function InfoModal({
  title,
  children,
  isOpen,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-[#1A1005] border border-[#F5E6D3]/20 p-6 md:p-8 rounded-3xl shadow-2xl text-left max-h-[85vh] overflow-y-auto"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#F5E6D3]/50 hover:text-[#F5E6D3] bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
            >
              ✕
            </button>
            <h4 className="text-xl md:text-2xl font-serif text-[#F5E6D3] mb-4 border-b border-[#F5E6D3]/10 pb-4">
              {title}
            </h4>
            <div className="text-[#F5E6D3]/80 text-xl font-light text-base space-y-4">
              {children}
            </div>
            <div className="mt-8">
              <button
                onClick={onClose}
                className="w-full py-3 bg-[#F5E6D3]/10 hover:bg-[#F5E6D3]/20 text-[#F5E6D3] rounded-xl transition-colors font-medium"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

const STABLE_INFO = (
  <>
    <p>
      Balanced chakra means that area of your life is functioning in a steady,
      natural way.
    </p>
    <p>
      Not dull.
      <br />
      Not dramatic.
      <br />
      Just… stable and healthy.
    </p>
    <p>Think of it like:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>A phone at 70% battery — fully usable, not stressed</li>
      <li>A calm flame — strong but not wild</li>
      <li>A muscle that’s trained — flexible, not tight, not weak</li>
    </ul>
  </>
);

const EXCESS_INFO = (
  <>
    <p>
      Excess chakra energy means that area of your life is working in overdrive.
    </p>
    <p>
      Not balanced. Not calm.
      <br />
      It’s like:
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>A fan spinning too fast</li>
      <li>A phone running too many apps at once</li>
      <li>A muscle that’s tense all the time</li>
    </ul>
    <p>It’s not “powerful” — it’s excess without control.</p>
  </>
);

const DEFICIT_INFO = (
  <>
    <p>
      “Deficit” chakra energy means that area of your life feels low, blocked,
      weak, or not fully active.
    </p>
    <p>Think of it like:</p>
    <ul className="list-disc pl-5 space-y-1">
      <li>A phone on 10% battery</li>
      <li>A muscle you haven’t used in a long time</li>
      <li>A light bulb that’s on, but very dim</li>
    </ul>
    <p>
      It doesn’t mean something is “wrong” with you.
      <br />
      It just means that particular emotional or psychological theme isn’t
      flowing strongly right now.
    </p>
  </>
);

function ResultStep({
  answers,
  questions,
}: {
  answers: number[][];
  questions: Question[];
}) {
  const [activeInfo, setActiveInfo] = useState<
    "stable" | "excess" | "deficit" | null
  >(null);

  const results = useMemo(() => {
    // Signed total per chakra — each answer contributes its weight directly
    const chakraTotals: Record<ChakraSlug, number> = {
      root: 0,
      sacral: 0,
      "solar-plexus": 0,
      heart: 0,
      throat: 0,
      "third-eye": 0,
      crown: 0,
    };
    // Track whether each chakra received at least one answer
    const chakraAnswered: Record<ChakraSlug, boolean> = {
      root: false,
      sacral: false,
      "solar-plexus": false,
      heart: false,
      throat: false,
      "third-eye": false,
      crown: false,
    };

    answers.forEach((selectedIndices, questionIndex) => {
      const question = questions[questionIndex];
      if (!question) return;
      selectedIndices.forEach((answerIndex) => {
        const answer = question.answers[answerIndex];
        if (answer) {
          chakraTotals[answer.chakra] += answer.weight ?? 1.0;
          chakraAnswered[answer.chakra] = true;
        }
      });
    });

    // Crown has 4 questions → threshold 1.2; all others have 3 → threshold 0.9
    const THRESHOLD: Record<ChakraSlug, number> = {
      root: 0.9,
      sacral: 0.9,
      "solar-plexus": 0.9,
      heart: 0.9,
      throat: 0.9,
      "third-eye": 0.9,
      crown: 1.2,
    };

    const chakraResults: ChakraResult[] = (
      Object.keys(chakraTotals) as ChakraSlug[]
    ).map((slug) => {
      const total = chakraTotals[slug];
      const threshold = THRESHOLD[slug];
      let state: "excess" | "deficit" | "stable";

      if (total > threshold) {
        state = "excess";
      } else if (total < threshold) {
        state = "deficit";
      } else {
        state = "stable";
      }

      return {
        name: chakraNames[slug],
        slug,
        state,
        score: total,
      };
    });

    // Only show chakras that were actually answered
    const activeChakras = chakraResults.filter((r) => chakraAnswered[r.slug]);

    const stableChakras = activeChakras.filter((r) => r.state === "stable");
    const excessChakras = activeChakras.filter((r) => r.state === "excess");
    const deficitChakras = activeChakras.filter((r) => r.state === "deficit");

    return { stableChakras, excessChakras, deficitChakras, activeChakras };
  }, [answers, questions]);

  const { stableChakras, excessChakras, deficitChakras } = results;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl mx-auto px-6 space-y-12"
    >
      {/* Opening */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-serif text-[#F5E6D3] leading-tight">
          Let's be clear.
        </h1>
        <p className="text-xl md:text-2xl text-[#F5E6D3]/80 font-light">
          No one is fully balanced all the time.
          <br />
          That's not failure — that's just being human.
        </p>
      </div>

      {/* Results Sections */}
      <div className="space-y-8">
        {/* Currently Stable */}
        {stableChakras.length > 0 && (
          <div className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3]">
                Currently Stable
              </h2>
              <button
                onClick={() => setActiveInfo("stable")}
                className="text-[#F5E6D3]/50 hover:text-[#F5E6D3] bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 p-1.5 rounded-full transition-colors focus:outline-none"
                aria-label="More info about Currently Stable"
              >
                <IoIosInformationCircleOutline className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <p className="text-[#F5E6D3]/80 font-light text-lg md:text-xl">
              These energies are cooperating with your life right now. Enjoy
              them. They will change — as they should.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {stableChakras.map((chakra) => (
                <span
                  key={chakra.slug}
                  className="px-4 py-2 rounded-full bg-[#F5E6D3]/10 text-[#F5E6D3] text-sm"
                >
                  {chakra.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Excess */}
        {excessChakras.length > 0 && (
          <div className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3]">
                Excess
              </h2>
              <button
                onClick={() => setActiveInfo("excess")}
                className="text-[#F5E6D3]/50 hover:text-[#F5E6D3] bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 p-1.5 rounded-full transition-colors focus:outline-none"
                aria-label="More info about Excess Energy"
              >
                <IoIosInformationCircleOutline className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <p className="text-[#F5E6D3]/80 font-light text-lg md:text-xl">
              This energy is running hot. Useful in bursts — but it's costing
              you. Pushing, controlling, clinging. It wants to move, not force.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {excessChakras.map((chakra) => (
                <span
                  key={chakra.slug}
                  className="px-4 py-2 rounded-full bg-orange-500/20 text-orange-200 text-sm md:text-base border border-orange-500/30"
                >
                  {chakra.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Deficit */}
        {deficitChakras.length > 0 && (
          <div className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3]">
                Deficit
              </h2>
              <button
                onClick={() => setActiveInfo("deficit")}
                className="text-[#F5E6D3]/50 hover:text-[#F5E6D3] bg-[#F5E6D3]/5 hover:bg-[#F5E6D3]/10 p-1.5 rounded-full transition-colors focus:outline-none"
                aria-label="More info about Deficit Energy"
              >
                <IoIosInformationCircleOutline className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
            <p className="text-[#F5E6D3]/80 font-light text-lg md:text-xl">
              This energy is withdrawing. Shutting down, going quiet, pulling
              inward. Not broken — just asking to be acknowledged.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {deficitChakras.map((chakra) => (
                <span
                  key={chakra.slug}
                  className="px-4 py-2 rounded-full bg-blue-500/20 text-blue-200 text-sm md:text-base border border-blue-500/30"
                >
                  {chakra.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* No Stable Message — absence of stable is expected and normal */}
        {stableChakras.length === 0 && (
          <div className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3]">
              No chakras are currently stable.
            </h2>
            <p className="text-[#F5E6D3]/80 font-light max-w-2xl mx-auto text-lg md:text-xl">
              That's not failure — that's honest. Life pulls energy where it's
              needed. The read just means there's movement happening.
              <br />
              Awareness is the first step.
            </p>
          </div>
        )}
      </div>

      {/* Journey Suggestion */}
      <div className="text-center space-y-6 pt-8 border-t border-[#F5E6D3]/10">
        <h3 className="text-xl font-serif text-[#F5E6D3]">Your Journey</h3>
        <p className="text-[#F5E6D3]/70 text-lg md:text-xl font-light max-w-2xl mx-auto">
          You may resonate with more than one journey. Balance is not linear.
          Life moves in phases.
        </p>
        <div className="pt-4">
          <Link
            href="/journey"
            className="inline-block px-10 py-4 bg-[#F5E6D3] text-[#27190B] font-medium text-lg rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-[0_0_20px_rgba(245,230,211,0.2)]"
          >
            Explore Journeys
          </Link>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="space-y-6 pt-8 border-t border-[#F5E6D3]/10 pb-20">
        <div className="text-center space-y-3">
          <p className="text-lg md:text-2xl font-medium text-[#F5E6D3]">
            Chakras were never meant to be "perfectly aligned."
            <br />
            They were meant to respond to life.
            <br />
            And life is messy.
          </p>
        </div>

        <p className="text-3xl md:text-4xl font-serif text-[#F5E6D3] text-center pt-8">
          Balance is temporary. Awareness is repeatable.
        </p>

        <p className="text-lg md:text-xl text-[#F5E6D3]/60 text-center pt-8 max-w-2xl mx-auto">
          This quiz is not medical or diagnostic. It is an invitation to
          observe—not label.
        </p>
      </div>

      {/* Info Modals */}
      <InfoModal
        title="What does 'Stable' mean?"
        isOpen={activeInfo === "stable"}
        onClose={() => setActiveInfo(null)}
      >
        {STABLE_INFO}
      </InfoModal>

      <InfoModal
        title="What does 'Excess' mean?"
        isOpen={activeInfo === "excess"}
        onClose={() => setActiveInfo(null)}
      >
        {EXCESS_INFO}
      </InfoModal>

      <InfoModal
        title="What does 'Deficit' mean?"
        isOpen={activeInfo === "deficit"}
        onClose={() => setActiveInfo(null)}
      >
        {DEFICIT_INFO}
      </InfoModal>
    </motion.div>
  );
}

export default function QuizPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "analyzing" | "result">(
    "intro",
  );
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[][]>([]);

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/quiz");
        const result = await res.json();
        const questionsData = result.data || [];
        setQuestions(questionsData);
        // Initialize answers array based on fetched questions count
        setAnswers(new Array(questionsData.length).fill([]).map(() => []));
      } catch (error) {
        console.error("Failed to load quiz questions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const handleStart = () => {
    setStep("quiz");
  };

  const handleAnswer = (answerIndex: number) => {
    const currentQuestion = questions[currentQuestionIndex];
    const newAnswers = [...answers];

    if (currentQuestion.multiSelect) {
      // Toggle selection for multi-select
      const currentSelections = newAnswers[currentQuestionIndex];
      if (currentSelections.includes(answerIndex)) {
        newAnswers[currentQuestionIndex] = currentSelections.filter(
          (i) => i !== answerIndex,
        );
      } else {
        newAnswers[currentQuestionIndex] = [...currentSelections, answerIndex];
      }
    } else {
      // Single selection
      newAnswers[currentQuestionIndex] = [answerIndex];
    }

    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setStep("analyzing");
      setTimeout(() => {
        setStep("result");
      }, 2000);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (loading && step !== "intro") {
    return (
      <div className="min-h-screen w-full bg-[#27190B] flex items-center justify-center">
        <ImSpinner8 className="w-12 h-12 animate-spin text-[#F5E6D3]/50" />
      </div>
    );
  }

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

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {step === "intro" && <IntroStep key="intro" onStart={handleStart} />}
          {step === "quiz" && questions.length > 0 && (
            <QuestionStep
              key={currentQuestionIndex}
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
              selectedAnswers={answers[currentQuestionIndex]}
              onNext={handleNext}
              onBack={handleBack}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questions.length - 1}
              currentCount={currentQuestionIndex + 1}
              totalCount={questions.length}
            />
          )}
          {step === "quiz" && !loading && questions.length === 0 && (
            <div className="text-center text-[#F5E6D3]/60">
              <p>No questions found. Please check back later.</p>
            </div>
          )}
          {step === "analyzing" && <AnalyzingStep key="analyzing" />}
          {step === "result" && (
            <ResultStep key="result" answers={answers} questions={questions} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Aurora from "@/components/ui/Aurora";
import { ImSpinner8 } from "react-icons/im";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// --- Data & Types ---

type ChakraSlug =
  | "root"
  | "sacral"
  | "solar-plexus"
  | "heart"
  | "throat"
  | "third-eye"
  | "crown";
type EnergyState = "over" | "under" | "balanced";

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
  state: "over" | "under" | "stable";
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
          <br />
          Where it is.
        </p>
      </div>

      <div className="space-y-4 text-base md:text-lg lg:text-xl text-[#F5E6D3]/80 bg-[#F5E6D3]/05 p-6 md:p-8 rounded-2xl border border-[#F5E6D3]/10 backdrop-blur-sm">
        <p className="font-medium text-[#F5E6D3]">
          Balance is not a personality trait.
        </p>
        <p>It is a moment.</p>
        <p>So yes — balanced chakras should be hard to "get".</p>
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
      </div>

      <div className="space-y-3 text-sm text-[#F5E6D3]/60">
        <p>No prior understanding of chakras is needed.</p>
        <p>No right or wrong answers exist.</p>
        <p>Just choose what feels most true in the moment.</p>
      </div>

      <button
        onClick={onStart}
        className="group relative px-8 py-3 bg-[#F5E6D3] text-[#27190B] font-medium text-lg rounded-full hover:bg-white transition-all duration-300 transform hover:scale-105"
      >
        Begin
      </button>

      <p className="text-xs text-[#F5E6D3]/40">Takes 3–4 minutes</p>
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

function ResultStep({
  answers,
  questions,
}: {
  answers: number[][];
  questions: Question[];
}) {
  const results = useMemo(() => {
    const chakraScores: Record<
      ChakraSlug,
      { over: number; under: number; balanced: number }
    > = {
      root: { over: 0, under: 0, balanced: 0 },
      sacral: { over: 0, under: 0, balanced: 0 },
      "solar-plexus": { over: 0, under: 0, balanced: 0 },
      heart: { over: 0, under: 0, balanced: 0 },
      throat: { over: 0, under: 0, balanced: 0 },
      "third-eye": { over: 0, under: 0, balanced: 0 },
      crown: { over: 0, under: 0, balanced: 0 },
    };

    // Calculate scores with weighted system from DB
    answers.forEach((selectedIndices, questionIndex) => {
      const question = questions[questionIndex];
      // Skip if for some reason question doesn't exist
      if (!question) return;

      selectedIndices.forEach((answerIndex) => {
        const answer = question.answers[answerIndex];
        if (answer) {
          // Use weight from DB, fallback to 1.0 if missing
          const weight = answer.weight || 1.0;
          chakraScores[answer.chakra][answer.state] += weight;
        }
      });
    });

    // Determine state for each chakra
    const chakraResults: ChakraResult[] = Object.entries(chakraScores).map(
      ([slug, scores]) => {
        const total = scores.over + scores.under + scores.balanced;
        let state: "over" | "under" | "stable";

        // Determine dominant state
        // Prioritize imbalance if it equals or exceeds balanced score
        if (scores.over > scores.under && scores.over >= scores.balanced) {
          state = "over";
        } else if (
          scores.under > scores.over &&
          scores.under >= scores.balanced
        ) {
          state = "under";
        } else {
          state = "stable";
        }

        return {
          name: chakraNames[slug as ChakraSlug],
          slug: slug as ChakraSlug,
          state,
          score: total,
        };
      },
    );

    // Filter out chakras with no responses/score
    const activeChakras = chakraResults.filter((r) => r.score > 0);

    const stableChakras = activeChakras.filter((r) => r.state === "stable");
    const overChakras = activeChakras.filter((r) => r.state === "over");
    const underChakras = activeChakras.filter((r) => r.state === "under");

    return { stableChakras, overChakras, underChakras, activeChakras };
  }, [answers, questions]);

  const { stableChakras, overChakras, underChakras } = results;

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
            <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3]">
              Currently Stable
            </h2>
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

        {/* Over-Energized */}
        {overChakras.length > 0 && (
          <div className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md space-y-4">
            <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3]">
              Over-Energized
            </h2>
            <p className="text-[#F5E6D3]/80 font-light text-lg md:text-xl">
              This energy is doing overtime. Useful. Powerful. Unsustainable if
              left unchecked.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {overChakras.map((chakra) => (
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

        {/* Under-Energized */}
        {underChakras.length > 0 && (
          <div className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md space-y-4">
            <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3]">
              Under-Energized
            </h2>
            <p className="text-[#F5E6D3]/80 font-light text-lg md:text-xl">
              This energy is conserving itself. Quiet. Present. Waiting for
              acknowledgement.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {underChakras.map((chakra) => (
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

        {/* No Balanced Message */}
        {stableChakras.length === 0 && (
          <div className="bg-[#F5E6D3]/05 border border-[#F5E6D3]/10 p-8 rounded-3xl backdrop-blur-md space-y-4 text-center">
            <h2 className="text-2xl md:text-3xl font-serif text-[#F5E6D3]">
              This is normal.
            </h2>
            <p className="text-[#F5E6D3]/80 font-light max-w-2xl mx-auto text-lg md:text-xl">
              Life pulls energy where it's needed most. Awareness brings it back
              — gently.
              <br />
              No panic. No "fix yourself".
            </p>
          </div>
        )}
      </div>

      {/* Journey Suggestion */}
      <div className="text-center space-y-6 pt-8 border-t border-[#F5E6D3]/10">
        <h3 className="text-xl font-serif text-[#F5E6D3]">Your Journey</h3>
        <p className="text-[#F5E6D3]/70 font-light max-w-2xl mx-auto">
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

        <p className="text-sm text-[#F5E6D3]/60 text-center pt-8 max-w-2xl mx-auto">
          This quiz is not medical or diagnostic. It is an invitation to
          observe—not label.
        </p>
      </div>
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

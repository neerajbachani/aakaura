
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const questions = [
  {
    question: "When faced with a decision, what happens most often?",
    multiSelect: true,
    order: 1,
    answers: [
      { text: "I trust my instincts and act calmly", chakra: "third-eye", state: "balanced", weight: 0.3 },
      { text: "I overthink, analyse, and replay scenarios", chakra: "third-eye", state: "over", weight: 1.0 },
      { text: "I avoid deciding and wait for clarity", chakra: "third-eye", state: "under", weight: -1.0 },
      { text: "I check in with my body and values", chakra: "heart", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "How do you usually express yourself?",
    multiSelect: true,
    order: 2,
    answers: [
      { text: "I communicate clearly and honestly", chakra: "throat", state: "balanced", weight: 0.3 },
      { text: "I speak too much or feel the need to explain myself", chakra: "throat", state: "over", weight: 1.0 },
      { text: "I hold back what I really want to say", chakra: "throat", state: "under", weight: -1.0 },
      { text: "I prefer silence over unnecessary words", chakra: "throat", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "How do you experience emotions?",
    multiSelect: true,
    order: 3,
    answers: [
      { text: "I feel deeply but recover naturally", chakra: "heart", state: "balanced", weight: 0.3 },
      { text: "I feel everything intensely, sometimes overwhelmingly", chakra: "heart", state: "over", weight: 1.0 },
      { text: "I feel emotionally numb or disconnected", chakra: "heart", state: "under", weight: -1.0 },
      { text: "I process emotions without judging them", chakra: "heart", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "What best describes your relationship with control and safety?",
    multiSelect: true,
    order: 4,
    answers: [
      { text: "I feel grounded and supported", chakra: "root", state: "balanced", weight: 0.3 },
      { text: "I worry constantly about security or the future", chakra: "root", state: "over", weight: 1.0 },
      { text: "I feel unanchored or restless", chakra: "root", state: "under", weight: -1.0 },
      { text: "I trust life but stay practical", chakra: "root", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "How do you relate to pleasure, creativity, and desire?",
    multiSelect: true,
    order: 5,
    answers: [
      { text: "I enjoy life without excess", chakra: "sacral", state: "balanced", weight: 0.3 },
      { text: "I seek stimulation constantly", chakra: "sacral", state: "over", weight: 1.0 },
      { text: "I suppress pleasure or creativity", chakra: "sacral", state: "under", weight: -1.0 },
      { text: "I create without attachment", chakra: "sacral", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "How do you experience personal power and ambition?",
    multiSelect: true,
    order: 6,
    answers: [
      { text: "I act confidently without forcing", chakra: "solar-plexus", state: "balanced", weight: 0.3 },
      { text: "I push myself relentlessly", chakra: "solar-plexus", state: "over", weight: 1.0 },
      { text: "I struggle with self-confidence", chakra: "solar-plexus", state: "under", weight: -1.0 },
      { text: "I take responsibility without control", chakra: "solar-plexus", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "What feels true about your mental state lately?",
    multiSelect: true,
    order: 7,
    answers: [
      { text: "My thoughts feel clear and steady", chakra: "crown", state: "balanced", weight: 0.3 },
      { text: "My mind feels overstimulated", chakra: "crown", state: "over", weight: 1.0 },
      { text: "I feel mentally foggy or disconnected", chakra: "crown", state: "under", weight: -1.0 },
      { text: "I enjoy silence and reflection", chakra: "crown", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "How do you handle giving and receiving?",
    multiSelect: true,
    order: 8,
    answers: [
      { text: "I give and receive comfortably", chakra: "heart", state: "balanced", weight: 0.3 },
      { text: "I give too much, often at my expense", chakra: "heart", state: "over", weight: 1.0 },
      { text: "I resist receiving support", chakra: "heart", state: "under", weight: -1.0 },
      { text: "I maintain healthy boundaries", chakra: "heart", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "How do you move through daily life?",
    multiSelect: true,
    order: 9,
    answers: [
      { text: "With presence and awareness", chakra: "root", state: "balanced", weight: 0.3 },
      { text: "Always rushing or multitasking", chakra: "crown", state: "over", weight: 1.0 },
      { text: "Feeling disconnected from routine", chakra: "root", state: "under", weight: -1.0 },
      { text: "Grounded yet curious", chakra: "root", state: "balanced", weight: 0.3 },
    ],
  },
  {
    question: "What feels most true right now?",
    multiSelect: true,
    order: 10,
    answers: [
      { text: "I feel aligned but curious", chakra: "crown", state: "balanced", weight: 0.3 },
      { text: "I feel mentally active but physically tired", chakra: "crown", state: "over", weight: 1.0 },
      { text: "I feel stable but uninspired", chakra: "root", state: "under", weight: -1.0 },
      { text: "I feel pulled in different directions", chakra: "heart", state: "over", weight: 1.0 },
    ],
  },
];

async function main() {
  console.log("Seeding quiz questions with updated weights...");
  console.log("Weights: Balanced=0.3, Over=1.0, Under=-1.0");

  // Clear existing questions to apply new weights cleanly
  await prisma.quizQuestion.deleteMany({});
  console.log("Cleared existing questions.");

  for (const q of questions) {
    await prisma.quizQuestion.create({
      data: {
        question: q.question,
        multiSelect: q.multiSelect,
        order: q.order,
        answers: {
          create: q.answers,
        },
      },
    });
  }

  console.log(`Seeded ${questions.length} questions successfully with new weights.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

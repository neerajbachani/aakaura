import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * V2 - 22-Question Chakra Diagnostic
 * Scoring: +1 (Excess), +0.5 (Mild Excess), +0.3 (Stable), -0.5 (Mild Deficit), -1 (Deficit)
 *
 * Thresholds:
 *   - 3-question chakras: Excess if total > 0.9, Deficit if total < 0.9, Stable if total === 0.9 (rare)
 *   - Crown (4 questions):  Excess if total > 1.2, Deficit if total < 1.2, Stable if total === 1.2 (rare)
 */

const questions = [
  // ── ROOT (Muladhara) ───────────────────────────────────────────────
  {
    question:
      "You hear a strong rumor that your main source of income may become unstable. You:",
    multiSelect: false,
    order: 1,
    answers: [
      { text: "My mind goes to worst-case survival scenarios.", chakra: "root", state: "deficit", weight: -1.0 },
      { text: "I try to control every possible variable immediately.", chakra: "root", state: "excess", weight: 1.0 },
      { text: "I feel concerned but begin planning steadily.", chakra: "root", state: "stable", weight: 0.3 },
      { text: "I avoid thinking about it and distract myself.", chakra: "root", state: "deficit", weight: -0.5 },
    ],
  },
  {
    question:
      "Someone you rely on becomes inconsistent. You:",
    multiSelect: false,
    order: 2,
    answers: [
      { text: "I feel unsafe and unsettled internally.", chakra: "root", state: "deficit", weight: -1.0 },
      { text: "I become more controlling to secure stability.", chakra: "root", state: "excess", weight: 1.0 },
      { text: "I feel discomfort but begin adjusting independently.", chakra: "root", state: "stable", weight: 0.3 },
      { text: "I emotionally pull back to avoid needing them.", chakra: "root", state: "deficit", weight: -0.5 },
    ],
  },

  // ── SACRAL (Swadhisthana) ─────────────────────────────────────────
  {
    question:
      "Someone close becomes less emotionally available. You:",
    multiSelect: false,
    order: 3,
    answers: [
      { text: "I shut down emotionally.", chakra: "sacral", state: "deficit", weight: -1.0 },
      { text: "I seek stimulation or intensity elsewhere.", chakra: "sacral", state: "excess", weight: 1.0 },
      { text: "I communicate and observe before reacting.", chakra: "sacral", state: "stable", weight: 0.3 },
      { text: "I act indifferent but feel restless inside.", chakra: "sacral", state: "excess", weight: 0.5 },
    ],
  },
  {
    question:
      "You strongly desire intimacy or pleasure, but it's unavailable. You:",
    multiSelect: false,
    order: 4,
    answers: [
      { text: "I suppress it and feel guilty for wanting.", chakra: "sacral", state: "deficit", weight: -1.0 },
      { text: "I obsess or overindulge in something else.", chakra: "sacral", state: "excess", weight: 1.0 },
      { text: "I acknowledge the desire without losing control.", chakra: "sacral", state: "stable", weight: 0.3 },
      { text: "I feel frustrated but do nothing about it.", chakra: "sacral", state: "deficit", weight: -0.5 },
    ],
  },

  // ── SOLAR PLEXUS (Manipura) ───────────────────────────────────────
  {
    question:
      "Someone criticizes you publicly. You:",
    multiSelect: false,
    order: 5,
    answers: [
      { text: "I shrink and replay it later.", chakra: "solar-plexus", state: "deficit", weight: -1.0 },
      { text: "I respond sharply to assert control.", chakra: "solar-plexus", state: "excess", weight: 1.0 },
      { text: "I respond firmly without escalation.", chakra: "solar-plexus", state: "stable", weight: 0.3 },
      { text: "I obsess internally afterward.", chakra: "solar-plexus", state: "excess", weight: 0.5 },
    ],
  },
  {
    question:
      "You must decide against others' opinions. You:",
    multiSelect: false,
    order: 6,
    answers: [
      { text: "I hesitate and doubt myself.", chakra: "solar-plexus", state: "deficit", weight: -1.0 },
      { text: "I become rigid and force my stance.", chakra: "solar-plexus", state: "excess", weight: 1.0 },
      { text: "I decide confidently but feel pressure.", chakra: "solar-plexus", state: "stable", weight: 0.3 },
      { text: "I delay to avoid tension.", chakra: "solar-plexus", state: "deficit", weight: -0.5 },
    ],
  },

  // ── HEART (Anahata) ───────────────────────────────────────────────
  {
    question:
      "During conflict, your partner stops replying. You:",
    multiSelect: false,
    order: 7,
    answers: [
      { text: "I spiral into abandonment fear.", chakra: "heart", state: "deficit", weight: -1.0 },
      { text: "I demand immediate response.", chakra: "heart", state: "excess", weight: 1.0 },
      { text: "I feel discomfort but wait before reacting.", chakra: "heart", state: "stable", weight: 0.3 },
      { text: "I emotionally shut down first.", chakra: "heart", state: "deficit", weight: -0.5 },
    ],
  },
  {
    question:
      "Someone expresses deep love for you. You:",
    multiSelect: false,
    order: 8,
    answers: [
      { text: "I feel undeserving.", chakra: "heart", state: "deficit", weight: -1.0 },
      { text: "I become overly attached quickly.", chakra: "heart", state: "excess", weight: 1.0 },
      { text: "I receive it but still remain grounded.", chakra: "heart", state: "stable", weight: 0.3 },
      { text: "I downplay it casually.", chakra: "heart", state: "deficit", weight: -0.5 },
    ],
  },

  // ── THROAT (Vishuddha) ────────────────────────────────────────────
  {
    question:
      "In a family disagreement where you're misunderstood, you:",
    multiSelect: false,
    order: 9,
    answers: [
      { text: "I stay silent to avoid escalation.", chakra: "throat", state: "deficit", weight: -1.0 },
      { text: "I speak harshly to correct them.", chakra: "throat", state: "excess", weight: 1.0 },
      { text: "I clarify calmly even if slightly irritated.", chakra: "throat", state: "stable", weight: 0.3 },
      { text: "I overtalk but still feel unheard.", chakra: "throat", state: "excess", weight: 0.5 },
    ],
  },
  {
    question:
      "You need to set a boundary with someone. You:",
    multiSelect: false,
    order: 10,
    answers: [
      { text: "I avoid saying it.", chakra: "throat", state: "deficit", weight: -1.0 },
      { text: "I demand bluntly.", chakra: "throat", state: "excess", weight: 1.0 },
      { text: "I express it clearly though uncomfortable.", chakra: "throat", state: "stable", weight: 0.3 },
      { text: "I hint instead of stating directly.", chakra: "throat", state: "deficit", weight: -0.5 },
    ],
  },

  // ── THIRD EYE (Ajna) ──────────────────────────────────────────────
  {
    question:
      "You sense something is off in a relationship without proof. You:",
    multiSelect: false,
    order: 11,
    answers: [
      { text: "I ignore the feeling.", chakra: "third-eye", state: "deficit", weight: -1.0 },
      { text: "I analyze it obsessively.", chakra: "third-eye", state: "excess", weight: 1.0 },
      { text: "I observe without jumping to conclusions.", chakra: "third-eye", state: "stable", weight: 0.3 },
      { text: "I assume the worst quickly.", chakra: "third-eye", state: "excess", weight: 0.5 },
    ],
  },
  {
    question:
      "Carefully made plans suddenly collapse. You:",
    multiSelect: false,
    order: 12,
    answers: [
      { text: "I feel lost and mentally scattered.", chakra: "third-eye", state: "deficit", weight: -1.0 },
      { text: "I try to mentally control every outcome.", chakra: "third-eye", state: "excess", weight: 1.0 },
      { text: "I adjust while reassessing clearly.", chakra: "third-eye", state: "stable", weight: 0.3 },
      { text: "I detach and say \"whatever.\"", chakra: "third-eye", state: "deficit", weight: -0.5 },
    ],
  },

  // ── CROWN (Sahasrara) — 4 questions ──────────────────────────────
  {
    question:
      "You feel unsure about your direction for weeks. You:",
    multiSelect: false,
    order: 13,
    answers: [
      { text: "I feel disconnected and heavy.", chakra: "crown", state: "deficit", weight: -1.0 },
      { text: "I escape into fantasy or \"higher meaning.\"", chakra: "crown", state: "excess", weight: 1.0 },
      { text: "I reflect but continue responsibilities.", chakra: "crown", state: "stable", weight: 0.3 },
      { text: "I become cynical.", chakra: "crown", state: "deficit", weight: -0.5 },
    ],
  },
  {
    question:
      "A strong belief you hold is questioned publicly. You:",
    multiSelect: false,
    order: 14,
    answers: [
      { text: "I feel destabilized.", chakra: "crown", state: "deficit", weight: -1.0 },
      { text: "I become rigid and defensive.", chakra: "crown", state: "excess", weight: 1.0 },
      { text: "I stay open but evaluate calmly.", chakra: "crown", state: "stable", weight: 0.3 },
      { text: "I dismiss the discussion.", chakra: "crown", state: "deficit", weight: -0.5 },
    ],
  },
  {
    question:
      "Love conflict, money stress, and confusion all hit at once. You:",
    multiSelect: false,
    order: 15,
    answers: [
      { text: "Survival fear dominates.", chakra: "crown", state: "deficit", weight: -1.0 },
      { text: "I try to control everything at once.", chakra: "crown", state: "excess", weight: 1.0 },
      { text: "I prioritize slowly and stay functional.", chakra: "crown", state: "stable", weight: 0.3 },
      { text: "I shut down emotionally.", chakra: "crown", state: "deficit", weight: -0.5 },
    ],
  },

  // ── PHYSICAL QUESTIONS (one per chakra) ───────────────────────────

  // Physical ROOT (Q16)
  {
    question:
      "During prolonged stress, I commonly experience:",
    multiSelect: false,
    order: 16,
    answers: [
      { text: "Lower back heaviness or leg fatigue.", chakra: "root", state: "deficit", weight: -1.0 },
      { text: "Chronic muscle tightness from bracing.", chakra: "root", state: "excess", weight: 1.0 },
      { text: "Stable posture with manageable tension.", chakra: "root", state: "stable", weight: 0.3 },
      { text: "Cold feet or instability sensations.", chakra: "root", state: "deficit", weight: -0.5 },
    ],
  },

  // Physical SACRAL (Q17)
  {
    question:
      "Under emotional stress, I notice:",
    multiSelect: false,
    order: 17,
    answers: [
      { text: "Lower abdominal dullness or numbness.", chakra: "sacral", state: "deficit", weight: -1.0 },
      { text: "Hormonal spikes or impulsive cravings.", chakra: "sacral", state: "excess", weight: 1.0 },
      { text: "Emotional waves but overall flow remains intact.", chakra: "sacral", state: "stable", weight: 0.3 },
      { text: "Pelvic tightness without clear emotion.", chakra: "sacral", state: "deficit", weight: -0.5 },
    ],
  },

  // Physical SOLAR PLEXUS (Q18)
  {
    question:
      "Under stress, I physically feel:",
    multiSelect: false,
    order: 18,
    answers: [
      { text: "Stomach knots or weak digestion.", chakra: "solar-plexus", state: "deficit", weight: -1.0 },
      { text: "Heat, acid reflux, or agitation.", chakra: "solar-plexus", state: "excess", weight: 1.0 },
      { text: "Strong but steady core energy.", chakra: "solar-plexus", state: "stable", weight: 0.3 },
      { text: "Shallow breathing.", chakra: "solar-plexus", state: "deficit", weight: -0.5 },
    ],
  },

  // Physical HEART (Q19)
  {
    question:
      "Under emotional stress, in my chest and upper body I feel:",
    multiSelect: false,
    order: 19,
    answers: [
      { text: "Chest heaviness.", chakra: "heart", state: "deficit", weight: -1.0 },
      { text: "Racing heartbeat and urgency.", chakra: "heart", state: "excess", weight: 1.0 },
      { text: "Open breathing despite emotion.", chakra: "heart", state: "stable", weight: 0.3 },
      { text: "Shoulder tightness with guarded posture.", chakra: "heart", state: "deficit", weight: -0.5 },
    ],
  },

  // Physical THROAT (Q20)
  {
    question:
      "In my throat and jaw, I frequently notice:",
    multiSelect: false,
    order: 20,
    answers: [
      { text: "Tight throat sensation.", chakra: "throat", state: "deficit", weight: -1.0 },
      { text: "Jaw clenching.", chakra: "throat", state: "excess", weight: 1.0 },
      { text: "Relaxed, steady voice.", chakra: "throat", state: "stable", weight: 0.3 },
      { text: "Frequent throat clearing.", chakra: "throat", state: "deficit", weight: -0.5 },
    ],
  },

  // Physical THIRD EYE (Q21)
  {
    question:
      "Under cognitive stress, I get:",
    multiSelect: false,
    order: 21,
    answers: [
      { text: "Forehead tension.", chakra: "third-eye", state: "excess", weight: 0.5 },
      { text: "Migraines or overstimulation.", chakra: "third-eye", state: "excess", weight: 1.0 },
      { text: "Clear but focused thinking.", chakra: "third-eye", state: "stable", weight: 0.3 },
      { text: "Eye strain with mental fog.", chakra: "third-eye", state: "deficit", weight: -1.0 },
    ],
  },

  // Physical CROWN (Q22)
  {
    question:
      "Under existential stress, I feel:",
    multiSelect: false,
    order: 22,
    answers: [
      { text: "Fatigue or heaviness.", chakra: "crown", state: "deficit", weight: -1.0 },
      { text: "Lightheaded or dissociated.", chakra: "crown", state: "excess", weight: 1.0 },
      { text: "Calm but reflective awareness.", chakra: "crown", state: "stable", weight: 0.3 },
      { text: "Pressure at top of head.", chakra: "crown", state: "excess", weight: 0.5 },
    ],
  },
];

async function main() {
  console.log("🌀 Starting Quiz V2 seed...");

  // 1. Wipe all existing questions (cascades to answers)
  const deleted = await prisma.quizQuestion.deleteMany({});
  console.log(`🗑️  Deleted ${deleted.count} existing question(s).`);

  // 2. Seed V2 questions
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

  console.log(`✅ Seeded ${questions.length} V2 questions successfully.`);
  console.log("   Scoring: +1 (Excess) | +0.5 (Mild Excess) | +0.3 (Stable) | -0.5 (Mild Deficit) | -1 (Deficit)");
  console.log("   Thresholds: 3-question chakras → 0.9 | Crown → 1.2");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export interface ChakraBalanceSheetContent {
  persona: string;
  tooLittle: string;
  tooMuch: string;
  balanced: string;
}

export const chakraBalanceSheetContent: Record<
  string,
  ChakraBalanceSheetContent
> = {
  grounding: {
    persona: "Someone who wants to feel safe and secure",
    tooLittle:
      "Constantly on edge, like something bad is always about to happen",
    tooMuch: "Rigid, controlling, afraid to change anything at all",
    balanced:
      "Balanced, it's just quiet safety — your body finally believing it's okay to rest.",
  },
  flow: {
    persona: "Someone who wants to feel alive and connected",
    tooLittle: "Numb, disconnected, going through the motions",
    tooMuch:
      "Emotions take over completely — mood swings, over-attachment, drama that doesn't need to be there",
    balanced:
      "Balanced, you feel things fully, without being ruled by them.",
  },
  power: {
    persona:
      "Someone who wants to feel confident and in control of their life",
    tooLittle:
      "Doubt yourself, shrink in rooms, let others decide for you",
    tooMuch: "Control, ego, needing to win every conversation",
    balanced:
      "Balanced, it's just quiet self-respect — you don't need to prove anything.",
  },
  love: {
    persona:
      "Someone who wants to love and be loved, without losing themselves",
    tooLittle:
      "Closed off, guarded, like love takes more than it gives back",
    tooMuch:
      "Overgive, lose your boundaries, get hurt by people who never asked you to carry that much",
    balanced:
      "Balanced, love moves through you instead of draining you.",
  },
  expression: {
    persona: "Someone who wants to speak their truth without fear",
    tooLittle:
      "Swallow what you actually want to say, over and over",
    tooMuch:
      "Talk over people, say things without thinking, mistake volume for honesty",
    balanced:
      "Balanced, your words finally match what you actually mean.",
  },
  insight: {
    persona: "Someone who wants to trust their own instincts",
    tooLittle:
      "Ignore your gut, stay confused, keep asking others what you already know",
    tooMuch:
      "Overthink every signal, see patterns that aren't even there",
    balanced: "Balanced, you just quietly trust yourself.",
  },
  expansion: {
    persona:
      "Someone who wants to feel connected to something bigger than themselves",
    tooLittle:
      "Cut off — from purpose, from a higher self, from anything beyond your own noisy thoughts",
    tooMuch:
      'Disappear into it, avoid real life by staying "too spiritual" for the everyday',
    balanced:
      "Balanced, you feel part of something bigger, without needing to escape where you actually are.",
  },
};

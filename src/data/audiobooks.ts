export type AudiobookSection = {
  title: string;
  body: string;
};

export type Audiobook = {
  slug: string;
  series: string;
  episode: string;
  title: string;
  subtitle: string;
  dek: string;
  description: string;
  intro: string[];
  sections: AudiobookSection[];
  takeaway: string;
  closing: string;
  /** Public path. Null until the recording is added, e.g. /audiobooks/episode-01.mp3 */
  audioSrc: string | null;
};

export const audiobooks: Audiobook[] = [
  {
    slug: "rooted-and-flowing",
    series: "Aakaura Speaks",
    episode: "01",
    title: "Rooted & Flowing",
    subtitle: "The Lower Matrix",
    dek: "Your energy journey starts from the ground up.",
    description:
      "Episode 01 decodes the Root, Sacral, and Solar Plexus chakras through everyday life, emotion, creativity, and personal power.",
    intro: [
      "In Episode 01, we decode the three lower chakras, Root, Sacral, and Solar Plexus, through the lens of everyday life, nervous-system responses, emotions, creativity, confidence, and personal power.",
      "Instead of treating chakras like an intimidating spiritual concept, this episode turns them into something surprisingly relatable: seven inner “software programs” that influence the way we experience and respond to life.",
    ],
    sections: [
      {
        title: "Root Chakra: Safety & Grounding",
        body: "Why feelings of anxiety, instability, or being constantly “on edge” can feel like your internal safety system is stuck in overdrive, and what grounding can look like in everyday life.",
      },
      {
        title: "Sacral Chakra: Flow & Creativity",
        body: "What happens when you feel emotionally numb, uninspired, bored, or disconnected from pleasure, and how play, movement, music, and creativity can help you reconnect with your natural flow.",
      },
      {
        title: "Solar Plexus: Power & Self-Trust",
        body: "The connection between stress, confidence, boundaries, and that unmistakable nervous feeling in your gut. Learn to recognise when your inner sense of power feels depleted, and how to reconnect with it.",
      },
      {
        title: "Ancient concepts, modern language",
        body: "Explore chakra philosophy alongside familiar ideas from neuroscience, stress responses, and the mind-body connection, without turning it into a lecture.",
      },
      {
        title: "From survival to self-expression",
        body: "Discover why grounding, creativity, and personal power are only the beginning. These three centres create the foundation for moving toward the heart, voice, intuition, and the rest of your energetic map.",
      },
    ],
    takeaway:
      "You don’t need to understand everything about chakras to begin. You simply need to notice yourself.",
    closing: "Root yourself. Find your flow. Reclaim your fire.",
    audioSrc: "/audiobooks/episode-01.mp3",
  },
];

export function getAudiobook(slug: string): Audiobook | undefined {
  return audiobooks.find((book) => book.slug === slug);
}

import Link from "next/link";
import AudiobookHero from "@/components/audiobook/AudiobookHero";
import fonts from "@/config/fonts";
import { audiobooks } from "@/data/audiobooks";
import { generateSEO } from "@/lib/seo";

export const metadata = generateSEO({
  title: "Audiobook | Aakaura Speaks",
  description:
    "Listen to Aakaura Speaks. Episode 01, Rooted & Flowing, walks the Root, Sacral, and Solar Plexus chakras in everyday language.",
  pathname: "/audiobooks",
});

export default function AudiobooksPage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige font-cormorant">
      <AudiobookHero
        eyebrow="Aakaura Speaks"
        title="Audiobook"
        subtitle="Episodes you can listen to, then read back in your own time."
      />

      <div className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:pb-28">
        <ul className="space-y-6">
          {audiobooks.map((book) => (
            <li key={book.slug}>
              <Link
                href={`/audiobooks/${book.slug}`}
                className="group block rounded-2xl border border-primaryBeige/10 bg-[#2f2214]/50 p-6 transition hover:border-[#BD9958]/50 sm:p-8"
              >
                <p className="text-xs tracking-[0.28em] uppercase text-[#BD9958]">
                  Episode {book.episode}
                </p>
                <h2
                  className={`${fonts.playfair} mt-3 text-3xl text-primaryBeige transition group-hover:text-[#BD9958] sm:text-4xl`}
                >
                  {book.title}
                </h2>
                <p className="mt-2 text-lg italic text-primaryBeige/70">
                  {book.subtitle}
                </p>
                <p className="mt-4 text-lg leading-relaxed text-primaryBeige/80">
                  {book.dek}
                </p>
                <span className="mt-6 inline-flex text-sm tracking-[0.22em] uppercase text-[#BD9958]">
                  Listen
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

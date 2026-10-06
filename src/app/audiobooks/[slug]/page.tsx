import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AudiobookHero from "@/components/audiobook/AudiobookHero";
import AudiobookPlayer from "@/components/audiobook/AudiobookPlayer";
import AudiobookSummary from "@/components/audiobook/AudiobookSummary";
import { audiobooks, getAudiobook } from "@/data/audiobooks";
import { generateSEO } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return audiobooks.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getAudiobook(slug);
  if (!book) {
    return generateSEO({
      title: "Audiobook | Aakaura",
      pathname: "/audiobooks",
    });
  }

  return generateSEO({
    title: `${book.title} | Aakaura Speaks`,
    description: book.description,
    pathname: `/audiobooks/${book.slug}`,
    type: "article",
  });
}

export default async function AudiobookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getAudiobook(slug);
  if (!book) notFound();

  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige font-cormorant">
      <AudiobookHero
        eyebrow={`${book.series} · Episode ${book.episode}`}
        title={book.title}
        subtitle={book.dek}
      />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-20 sm:px-6 lg:grid-cols-[minmax(280px,380px)_minmax(0,1fr)] lg:items-start lg:gap-14 lg:pb-28">
        <AudiobookPlayer
          slug={book.slug}
          title={book.title}
          subtitle={book.subtitle}
          episode={book.episode}
          audioSrc={book.audioSrc}
        />
        <AudiobookSummary book={book} />
      </div>
    </div>
  );
}

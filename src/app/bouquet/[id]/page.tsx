"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { DocumentDuplicateIcon, ShareIcon } from "@heroicons/react/24/outline";

const CHAKRAS_MAP: Record<string, { name: string; path: string }> = {
  "root-main": { name: "Root Chakra", path: "/bouquet/root-main.webp" },
  "root-1": { name: "Root Chakra", path: "/bouquet/root (1).webp" },
  "root-2": { name: "Root Chakra", path: "/bouquet/root (2).webp" },
  "sacral-main": { name: "Sacral Chakra", path: "/bouquet/sacral-main.webp" },
  "sacral-1": { name: "Sacral Chakra", path: "/bouquet/sacral (1).webp" },
  "sacral-2": { name: "Sacral Chakra", path: "/bouquet/sacral (2).webp" },
  "solar-plexus-main": {
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar-main.webp",
  },
  "solar-plexus-1": {
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar (3).webp",
  },
  "solar-plexus-2": {
    name: "Solar Plexus Chakra",
    path: "/bouquet/solar (4).webp",
  },
  "heart-main": { name: "Heart Chakra", path: "/bouquet/heart-main.webp" },
  "heart-1": { name: "Heart Chakra", path: "/bouquet/heart (1).webp" },
  "heart-2": { name: "Heart Chakra", path: "/bouquet/heart (2).webp" },
  "throat-main": { name: "Throat Chakra", path: "/bouquet/throat-main.webp" },
  "throat-1": { name: "Throat Chakra", path: "/bouquet/throat (6).webp" },
  "throat-2": { name: "Throat Chakra", path: "/bouquet/throat (7).webp" },
  "third-eye-main": {
    name: "Third Eye Chakra",
    path: "/bouquet/thirdeye-main.webp",
  },
  "third-eye-1": {
    name: "Third Eye Chakra",
    path: "/bouquet/thirdeye (1).webp",
  },
  "third-eye-2": {
    name: "Third Eye Chakra",
    path: "/bouquet/thirdeye (2).webp",
  },
  "crown-main": { name: "Crown Chakra", path: "/bouquet/crown-main.webp" },
  "crown-1": { name: "Crown Chakra", path: "/bouquet/crown (1).webp" },
  "crown-2": { name: "Crown Chakra", path: "/bouquet/crown (5).webp" },
};

export default function BouquetViewPage() {
  const params = useParams();
  const id = params?.id as string;
  const [bouquet, setBouquet] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/bouquet/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message || "Bouquet not found");
        setBouquet(data.bouquet);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#27190B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD9958]"></div>
      </div>
    );
  }

  if (error || !bouquet) {
    return (
      <div className="min-h-screen bg-[#27190B] text-white flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-cormorant text-[#BD9958] mb-4">
          Aura Not Found
        </h1>
        <p className="text-white/60 mb-8">
          {error || "This bouquet has withered away back to the source."}
        </p>
        <Link
          href="/bouquet"
          className="border border-[#BD9958] px-6 py-2 text-[#BD9958] uppercase tracking-widest font-cormorant hover:bg-[#BD9958] hover:text-black transition-colors"
        >
          Create A New Bouquet
        </Link>
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to your aura scroll!");
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Aakaura Bouquet",
          text: `A digital bouquet has been sent to you by ${bouquet.from}.`,
          url: url,
        });
      } catch (err) {
        console.error("Error sharing", err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-[#fff] text-white py-20 px-4 font-sans relative overflow-hidden flex flex-col items-center">
      {/* Mystical Background Lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-gradient-to-b from-amber-500/10 via-[#BD9958]/10 to-transparent blur-[100px] pointer-events-none rounded-full max-w-2xl" />

      <h1 className="text-4xl md:text-5xl text-center text-[#BD9958] font-cormorant mb-16 tracking-widest relative z-10">
        A Gift of Energy from Aakaura
      </h1>

      <div className="max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10 mb-20 px-0 md:px-8 xl:px-0">
        {/* LEFT COLUMN: The Bouquet */}
        <div className="flex flex-col w-full order-1">
          {bouquet.bouquetBase ? (
            <div className="relative z-10 w-full h-[65vh] lg:h-[75vh] mx-auto rounded-lg overflow-hidden border border-[#BD9958]/30 shadow-[0_0_30px_rgba(189,153,88,0.2)] bg-[#27190B]/5">
              <Image
                src={bouquet.bouquetBase}
                alt="Bouquet Background"
                fill
                priority
                className="object-cover pointer-events-none opacity-90"
              />
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                {bouquet.chakras.map((chakraId: string, idx: number) => {
                  const chakra = CHAKRAS_MAP[chakraId];
                  if (!chakra) return null;

                  const positionId = `${chakraId}-${idx}`;
                  const position = bouquet.flowerPositions?.[positionId];

                  return (
                    <div
                      key={positionId}
                      className="absolute w-24 h-24 md:w-32 md:h-32 hover:scale-110 duration-500 z-20"
                      style={{
                        transform: `translate(${position?.x || 0}px, ${position?.y || 0}px)`,
                      }}
                    >
                      <Image
                        src={chakra.path}
                        alt={chakra.name}
                        fill
                        className="object-contain drop-shadow-[0_0_15px_rgba(189,153,88,0.6)] pointer-events-none"
                      />
                    </div>
                  );
                })}
              </div>
              <Image
                src="/bouquet/bush-1-top.png"
                alt="Bouquet Overlay"
                fill
                priority
                className="object-cover pointer-events-none z-30"
              />
            </div>
          ) : (
            <div className="relative z-10 w-full flex flex-wrap justify-center items-end gap-x-2 gap-y-4 min-h-[250px] p-8">
              {bouquet.chakras.map((chakraId: string, idx: number) => {
                const chakra = CHAKRAS_MAP[chakraId];
                if (!chakra) return null;

                const offset =
                  idx % 2 === 0 ? "translate-y-4" : "-translate-y-4";
                const rotation =
                  idx % 3 === 0
                    ? "rotate-12"
                    : idx % 3 === 1
                      ? "-rotate-6"
                      : "rotate-0";
                const scale = 1 + (idx % 3) * 0.1;

                return (
                  <div
                    key={`${chakraId}-${idx}`}
                    className={`relative flex flex-col items-center transition-transform hover:scale-110 duration-500 ${offset} ${rotation}`}
                    style={{ transform: `scale(${scale})` }}
                  >
                    <div className="w-20 h-20 md:w-28 md:h-28 relative">
                      <Image
                        src={chakra.path}
                        alt={chakra.name}
                        fill
                        className="object-contain transition-opacity opacity-100 drop-shadow-[0_0_15px_rgba(189,153,88,0.6)] pointer-events-none"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: The Card */}
        <div className="flex flex-col w-full order-2">
          <div className="bg-[#fcf8f2] text-[#27190B] backdrop-blur-md border border-[#BD9958]/40 p-10 md:p-14 shadow-[0_15px_40px_rgba(189,153,88,0.15)] relative rounded-sm mx-auto w-full max-w-xl">
            {/* Premium Aesthetic Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#BD9958]/30 via-transparent to-transparent border-t border-r border-[#BD9958]/40" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#BD9958]/30 via-transparent to-transparent border-b border-l border-[#BD9958]/40" />
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-[#BD9958]/20 pointer-events-none" />

            <p className="text-[#BD9958] font-cormorant text-2xl md:text-3xl mb-8 md:mb-12 italic relative z-10 leading-snug">
              Dear {bouquet.to},
            </p>
            <p className="text-[#27190B]/80 font-light leading-relaxed whitespace-pre-wrap text-lg md:text-xl font-cormorant mb-12 md:mb-16 relative z-10 tracking-wide">
              {bouquet.message}
            </p>
            <p className="text-right text-[#BD9958] font-cormorant text-xl md:text-2xl italic relative z-10">
              - {bouquet.from}
            </p>
          </div>

          {/* Actions underneath the card */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-xl mx-auto">
            <button
              onClick={handleCopyLink}
              className="flex justify-center items-center px-6 py-3 border border-white/20 bg-black/40 hover:border-[#BD9958] hover:text-[#BD9958] transition-colors font-cormorant tracking-widest uppercase text-sm text-white w-full sm:w-auto"
            >
              <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
              Copy Link
            </button>
            <button
              onClick={handleShare}
              className="flex justify-center items-center px-6 py-3 bg-[#BD9958] text-black hover:bg-[#FFD700] hover:shadow-[0_0_15px_rgba(189,153,88,0.4)] transition-all font-cormorant tracking-widest uppercase text-sm font-semibold w-full sm:w-auto"
            >
              <ShareIcon className="w-4 h-4 mr-2" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="text-center pt-8 border-t border-white/10 w-full max-w-sm">
        <p className="text-white/40 text-sm font-light mb-4 text-center">
          A digital spiritual offering brought to you by Aakaura.
        </p>
        <Link
          href="/bouquet"
          className="text-[#BD9958] hover:text-white uppercase font-cormorant tracking-widest text-sm transition-colors border-b border-[#BD9958]/30 pb-1"
        >
          Make your own bouquet
        </Link>
      </div>
    </div>
    // </div>
  );
}

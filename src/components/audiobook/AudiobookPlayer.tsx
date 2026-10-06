"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "framer-motion";
import {
  BackwardIcon,
  ForwardIcon,
  PauseIcon,
  PlayIcon,
} from "@heroicons/react/24/solid";
import fonts from "@/config/fonts";

const BAR_COUNT = 20;
const RATES = [0.75, 1, 1.25, 1.5] as const;
const SKIP_SECONDS = 15;
const REST_SCALE = 0.16;

type AudiobookPlayerProps = {
  slug: string;
  title: string;
  subtitle: string;
  episode: string;
  audioSrc: string | null;
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function storageKey(slug: string) {
  return `aakaura-audiobook:${slug}`;
}

export default function AudiobookPlayer({
  slug,
  title,
  subtitle,
  episode,
  audioSrc,
}: AudiobookPlayerProps) {
  const reduceMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement>(null);
  const rangeRef = useRef<HTMLInputElement>(null);
  const currentLabelRef = useRef<HTMLSpanElement>(null);
  const durationLabelRef = useRef<HTMLSpanElement>(null);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const progressScale = useMotionValue(0);
  const smoothLevels = useRef<number[]>(Array(BAR_COUNT).fill(REST_SCALE));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const frequencyRef = useRef<Uint8Array | null>(null);
  const lastPersistRef = useRef(0);
  const tickRef = useRef<() => void>(() => {});
  const rateRef = useRef<(typeof RATES)[number]>(1);

  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [rate, setRate] = useState<(typeof RATES)[number]>(1);
  const [missing, setMissing] = useState(!audioSrc);

  const disabled = missing || !audioSrc;

  const paintBars = (levels: number[]) => {
    for (let index = 0; index < BAR_COUNT; index += 1) {
      const bar = barRefs.current[index];
      if (!bar) continue;
      bar.style.transform = `scaleY(${levels[index]})`;
    }
  };

  const paintRest = () => {
    smoothLevels.current = Array(BAR_COUNT).fill(REST_SCALE);
    paintBars(smoothLevels.current);
  };

  const persist = (time: number) => {
    if (!audioSrc) return;
    try {
      localStorage.setItem(storageKey(slug), String(time));
    } catch {
      /* private mode */
    }
  };

  tickRef.current = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    const current = audio.currentTime || 0;

    if (duration > 0) {
      progressScale.set(current / duration);
    }

    if (
      rangeRef.current &&
      document.activeElement !== rangeRef.current &&
      duration > 0
    ) {
      rangeRef.current.value = String(current);
    }

    if (currentLabelRef.current) {
      currentLabelRef.current.textContent = formatTime(current);
    }

    if (playing && current - lastPersistRef.current > 5) {
      lastPersistRef.current = current;
      persist(current);
    }

    if (reduceMotion || !playing || !analyserRef.current || !frequencyRef.current) {
      if (!playing) paintRest();
      return;
    }

    const analyser = analyserRef.current;
    const data = frequencyRef.current;
    analyser.getByteFrequencyData(data as Uint8Array<ArrayBuffer>);

    const next = smoothLevels.current;
    for (let index = 0; index < BAR_COUNT; index += 1) {
      const bin = Math.min(
        data.length - 1,
        Math.floor((index / BAR_COUNT) * 18),
      );
      const target = REST_SCALE + (data[bin] / 255) * (1 - REST_SCALE);
      next[index] = next[index] * 0.55 + target * 0.45;
    }
    paintBars(next);
  };

  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const loop = () => {
      tickRef.current();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  useEffect(() => {
    return () => {
      audioContextRef.current?.close().catch(() => undefined);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (disabled) return;
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          target.closest("input, textarea, select, button, a"))
      ) {
        return;
      }

      const audio = audioRef.current;
      if (!audio) return;

      if (event.code === "Space") {
        event.preventDefault();
        if (audio.paused) {
          void startPlayback();
        } else {
          audio.pause();
        }
        return;
      }

      if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        event.preventDefault();
        const delta = event.code === "ArrowLeft" ? -SKIP_SECONDS : SKIP_SECONDS;
        const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
        audio.currentTime = Math.min(
          Math.max(0, audio.currentTime + delta),
          duration || 0,
        );
        tickRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [disabled]);

  async function ensureGraph() {
    const audio = audioRef.current;
    if (!audio || reduceMotion) return;

    if (!audioContextRef.current) {
      const context = new AudioContext();
      const analyser = context.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.75;
      const source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      audioContextRef.current = context;
      analyserRef.current = analyser;
      sourceRef.current = source;
      frequencyRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume();
    }
  }

  async function startPlayback() {
    const audio = audioRef.current;
    if (!audio || disabled) return;
    await ensureGraph();
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  }

  function toggle() {
    const audio = audioRef.current;
    if (!audio || disabled) return;
    if (audio.paused) {
      void startPlayback();
    } else {
      audio.pause();
      persist(audio.currentTime);
      paintRest();
    }
  }

  function skip(delta: number) {
    const audio = audioRef.current;
    if (!audio || disabled) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    audio.currentTime = Math.min(
      Math.max(0, audio.currentTime + delta),
      duration || 0,
    );
    tickRef.current();
    persist(audio.currentTime);
  }

  const applyMetadata = () => {
    const audio = audioRef.current;
    if (!audio || audio.readyState < 1) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    if (rangeRef.current) {
      rangeRef.current.max = String(duration);
      if (document.activeElement !== rangeRef.current) {
        rangeRef.current.value = String(audio.currentTime || 0);
      }
    }
    if (durationLabelRef.current) {
      durationLabelRef.current.textContent = formatTime(duration);
    }

    try {
      const saved = Number(localStorage.getItem(storageKey(slug)));
      if (
        Number.isFinite(saved) &&
        saved > 1 &&
        saved < duration - 1 &&
        audio.currentTime < 1
      ) {
        audio.currentTime = saved;
      }
    } catch {
      /* ignore */
    }

    audio.playbackRate = rateRef.current;
    setReady(true);
    tickRef.current();
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;
    applyMetadata();
    audio.addEventListener("loadedmetadata", applyMetadata);
    return () => audio.removeEventListener("loadedmetadata", applyMetadata);
  }, [audioSrc, slug]);

  function chooseRate(next: (typeof RATES)[number]) {
    rateRef.current = next;
    setRate(next);
    if (audioRef.current) audioRef.current.playbackRate = next;
  }

  return (
    <section
      aria-label={`${title} player`}
      className="rounded-2xl border border-primaryBeige/10 bg-[#2f2214]/80 p-5 sm:p-6 lg:sticky lg:top-8"
    >
      <p className="text-xs sm:text-sm tracking-[0.28em] uppercase text-[#BD9958]">
        Episode {episode}
      </p>
      <h2
        className={`${fonts.playfair} mt-3 text-3xl sm:text-4xl text-primaryBeige leading-tight`}
      >
        {title}
      </h2>
      <p className="mt-2 text-lg text-primaryBeige/70 italic">{subtitle}</p>

      <div
        className="mt-8 flex h-16 items-end gap-1"
        aria-hidden="true"
      >
        {Array.from({ length: BAR_COUNT }, (_, index) => (
          <span
            key={index}
            ref={(node) => {
              barRefs.current[index] = node;
              if (node && !node.dataset.ready) {
                node.dataset.ready = "true";
                node.style.transform = `scaleY(${REST_SCALE})`;
              }
            }}
            className="block h-full flex-1 origin-bottom rounded-full bg-[#BD9958]/80"
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm tabular-nums text-primaryBeige/70">
        <span ref={currentLabelRef}>0:00</span>
        <span ref={durationLabelRef}>0:00</span>
      </div>

      <div className="relative mt-2 flex h-8 items-center">
        <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-primaryBeige/15">
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-[#BD9958]"
            style={{ scaleX: progressScale }}
          />
        </div>
        <input
          ref={rangeRef}
          type="range"
          min={0}
          max={0}
          step={0.1}
          defaultValue={0}
          disabled={disabled || !ready}
          aria-label="Seek"
          className="absolute inset-0 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          onChange={(event) => {
            const audio = audioRef.current;
            if (!audio) return;
            audio.currentTime = Number(event.target.value);
            tickRef.current();
          }}
        />
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => skip(-SKIP_SECONDS)}
          disabled={disabled}
          aria-label="Skip back 15 seconds"
          className="flex h-11 w-11 items-center justify-center rounded-full text-primaryBeige transition hover:text-[#BD9958] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <BackwardIcon className="h-6 w-6" />
        </button>
        <button
          type="button"
          onClick={toggle}
          disabled={disabled}
          aria-label={playing ? "Pause" : "Play"}
          aria-pressed={playing}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#BD9958] text-[#27190B] transition hover:bg-[#d4b06a] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {playing ? (
            <PauseIcon className="h-7 w-7" />
          ) : (
            <PlayIcon className="ml-0.5 h-7 w-7" />
          )}
        </button>
        <button
          type="button"
          onClick={() => skip(SKIP_SECONDS)}
          disabled={disabled}
          aria-label="Skip forward 15 seconds"
          className="flex h-11 w-11 items-center justify-center rounded-full text-primaryBeige transition hover:text-[#BD9958] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ForwardIcon className="h-6 w-6" />
        </button>
      </div>

      <div
        className="mt-5 flex items-center justify-center gap-2"
        role="group"
        aria-label="Playback speed"
      >
        {RATES.map((value) => {
          const active = rate === value;
          return (
            <button
              key={value}
              type="button"
              disabled={disabled}
              aria-pressed={active}
              onClick={() => chooseRate(value)}
              className={`rounded-full px-3 py-1 text-sm tabular-nums transition disabled:cursor-not-allowed disabled:opacity-40 ${
                active
                  ? "bg-[#BD9958] text-[#27190B]"
                  : "text-primaryBeige/70 hover:text-primaryBeige"
              }`}
            >
              {value === 1 ? "1×" : `${value}×`}
            </button>
          );
        })}
      </div>

      {disabled && (
        <p className="mt-5 text-center text-sm tracking-wide text-primaryBeige/60">
          Recording on its way
        </p>
      )}

      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          preload="metadata"
          onLoadedMetadata={applyMetadata}
          onPlay={() => setPlaying(true)}
          onPause={() => {
            setPlaying(false);
            paintRest();
            if (audioRef.current) persist(audioRef.current.currentTime);
          }}
          onEnded={() => {
            setPlaying(false);
            paintRest();
            progressScale.set(0);
            try {
              localStorage.removeItem(storageKey(slug));
            } catch {
              /* ignore */
            }
          }}
          onError={() => {
            setMissing(true);
            setPlaying(false);
          }}
        />
      )}
    </section>
  );
}

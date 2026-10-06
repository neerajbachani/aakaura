"use client";

import { motion, useReducedMotion } from "framer-motion";
import fonts from "@/config/fonts";
import type { Audiobook } from "@/data/audiobooks";

const ease = [0.16, 1, 0.3, 1] as const;

export default function AudiobookSummary({ book }: { book: Audiobook }) {
  const reduce = useReducedMotion();

  return (
    <div className="max-w-[68ch]">
      <p className="text-xs sm:text-sm tracking-[0.28em] uppercase text-[#BD9958]">
        Inside this episode
      </p>

      <div className="mt-6 space-y-5">
        {book.intro.map((paragraph) => (
          <p
            key={paragraph}
            className="text-lg md:text-xl leading-relaxed text-primaryBeige/85"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <ol className="mt-10 space-y-4">
        {book.sections.map((section, index) => (
          <motion.li
            key={section.title}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: reduce ? 0 : index * 0.06,
              ease,
            }}
            className="rounded-2xl border border-primaryBeige/10 bg-[#2f2214]/40 p-6 md:p-8"
          >
            <p className="text-[#BD9958] text-sm tracking-[0.18em] uppercase">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2
              className={`${fonts.playfair} mt-2 text-2xl md:text-3xl text-primaryBeige`}
            >
              {section.title}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-primaryBeige/80">
              {section.body}
            </p>
          </motion.li>
        ))}
      </ol>

      <motion.aside
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease }}
        className="mt-8 rounded-2xl border border-[#BD9958]/30 border-l-4 border-l-[#BD9958] bg-[#2f2214] p-6 md:p-8"
      >
        <p className="text-xs tracking-[0.28em] uppercase text-[#BD9958]">
          The takeaway
        </p>
        <p className="mt-4 text-lg md:text-xl leading-relaxed text-primaryBeige/90">
          {book.takeaway}
        </p>
        <p
          className={`${fonts.playfair} mt-6 text-2xl md:text-3xl text-primaryBeige`}
        >
          {book.closing}
        </p>
      </motion.aside>
    </div>
  );
}

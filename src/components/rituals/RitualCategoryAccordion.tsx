"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getRitualDocumentCount,
  RitualCategory,
  RitualGuideLink,
  RitualLanguage,
} from "@/data/ritualDocuments";
import {
  categoryLabelClass,
  guideTitleClass,
  linkPillClass,
} from "@/components/rituals/ritualsStyles";

const languageLabels: Record<RitualLanguage, string> = {
  hi: "Hindi",
  en: "English",
};

function GuideLink({ link }: { link: RitualGuideLink }) {
  const label = link.externalLabel ?? languageLabels[link.language];

  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-primaryBeige/30 text-base md:text-lg lg:text-xl text-secondaryBeige/70 hover:text-[#BD9958] hover:border-[#BD9958]/50 transition-colors italic"
      >
        {label}
      </a>
    );
  }

  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={linkPillClass}
    >
      {languageLabels[link.language]}
      <svg
        className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

function CategoryPanel({
  category,
  defaultOpen = false,
}: {
  category: RitualCategory;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const documentCount = getRitualDocumentCount(category);

  return (
    <div
      className={`rounded-xl overflow-hidden border transition-colors duration-300 ${
        isOpen
          ? "border-[#BD9958]/40 bg-[#2f2214]/60"
          : "border-primaryBeige/20 hover:border-primaryBeige/30"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="w-full p-5 md:p-6 lg:p-7 flex justify-between items-center gap-4 hover:bg-primaryBeige/5 transition-colors duration-300 text-left"
      >
        <div className="flex flex-wrap items-center gap-3">
          <h3 className={categoryLabelClass}>{category.label}</h3>
          <span className="text-sm md:text-base px-2.5 py-0.5 rounded-full border border-[#BD9958]/40 text-[#BD9958]">
            {documentCount}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-[#BD9958] shrink-0"
        >
          <svg
            className="w-5 h-5 lg:w-6 lg:h-6"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <ul className="px-5 md:px-6 lg:px-7 pb-5 md:pb-6 lg:pb-7 border-t border-primaryBeige/10">
              {category.guides.map((guideItem) => (
                <li
                  key={guideItem.title}
                  className="grid grid-cols-1 lg:grid-cols-[1fr_auto] lg:items-center gap-3 lg:gap-8 py-4 lg:py-5 border-b border-primaryBeige/10 last:border-0"
                >
                  <span className={guideTitleClass}>{guideItem.title}</span>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
                    {guideItem.links.map((link, index) => (
                      <GuideLink key={`${link.language}-${index}`} link={link} />
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RitualCategoryAccordion({
  categories,
}: {
  categories: RitualCategory[];
}) {
  return (
    <div className="space-y-4 lg:space-y-5">
      {categories.map((category, index) => (
        <CategoryPanel
          key={category.id}
          category={category}
          defaultOpen={index === 0}
        />
      ))}
    </div>
  );
}

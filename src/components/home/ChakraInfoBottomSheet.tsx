"use client";

import type { ChakraBalanceSheetContent } from "@/config/chakraBalanceSheet";

type ChakraInfoBottomSheetProps = {
  chakra: { name: string; slug: string };
  content: ChakraBalanceSheetContent;
  onDiscover: () => void;
};

function BalanceScale() {
  return (
    <div className="w-full mb-6">
      <div className="relative h-3 flex items-center">
        <div className="absolute inset-x-0 h-px bg-[#BD9958]" />
        <div className="absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#BD9958]" />
      </div>
      <div className="flex justify-between mt-2">
        <span className="text-[10px] tracking-[0.15em] uppercase text-[#BD9958]/45 font-medium">
          Too little
        </span>
        <span className="text-[10px] tracking-[0.15em] uppercase text-[#BD9958] font-semibold">
          Balanced
        </span>
        <span className="text-[10px] tracking-[0.15em] uppercase text-[#BD9958]/45 font-medium">
          Too much
        </span>
      </div>
    </div>
  );
}

function ImbalanceCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="flex-1 min-h-[8.5rem] rounded-xl bg-[#3d2e22] border border-[#BD9958]/10 p-3.5 text-left">
      <p className="text-sm text-[#BD9958] mb-2 font-medium">{title}</p>
      <p className="text-xs leading-relaxed text-[#f4f1ea]/80">{body}</p>
    </div>
  );
}

export default function ChakraInfoBottomSheet({
  chakra,
  content,
  onDiscover,
}: ChakraInfoBottomSheetProps) {
  return (
    <>
      <div className="w-12 h-1 bg-[#BD9958]/20 rounded-full mx-auto mb-6" />

      <div className="flex flex-col items-center text-center">
        <h3 className="text-xl font-bold tracking-widest uppercase text-[#BD9958] mb-1">
          {chakra.name}
        </h3>
        <p className="text-sm italic font-light text-[#BD9958] mb-6 max-w-xs">
          {content.persona}
        </p>

        <BalanceScale />

        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <ImbalanceCard title="Too little" body={content.tooLittle} />
          <ImbalanceCard title="Too much" body={content.tooMuch} />
        </div>

        <p className="text-sm italic leading-relaxed text-[#f4f1ea]/80 mb-8 max-w-sm px-1">
          {content.balanced}
        </p>

        <button
          type="button"
          onClick={onDiscover}
          className="w-full py-4 rounded-full bg-[#BD9958] text-[#27190b] font-bold uppercase tracking-widest text-sm shadow-lg transform active:scale-95 transition-all"
        >
          Discover {chakra.name} Journey
        </button>
      </div>
    </>
  );
}

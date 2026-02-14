"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import fonts from "@/config/fonts";

interface PriceRangeFilterProps {
  minPrice: string;
  maxPrice: string;
  onApply: (min: string, max: string) => void;
  className?: string;
}

export default function PriceRangeFilter({
  minPrice,
  maxPrice,
  onApply,
  className = "",
}: PriceRangeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync with props when dropdown opens or props change
  useEffect(() => {
    setLocalMin(minPrice);
    setLocalMax(maxPrice);
  }, [minPrice, maxPrice, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleApply = () => {
    onApply(localMin, localMax);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onApply("", "");
    setLocalMin("");
    setLocalMax("");
    setIsOpen(false);
  };

  const hasActiveFilter = minPrice !== "" || maxPrice !== "";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-[#27190b]/20 rounded-lg text-[#27190b] hover:border-[#27190b]/40 transition-colors ${fonts.mulish} text-sm focus:outline-none focus:ring-1 focus:ring-[#27190b]/20`}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="opacity-60">Price:</span>
          <span className="font-medium truncate">
            {hasActiveFilter
              ? `${minPrice ? "₹" + minPrice : "Min"} - ${
                  maxPrice ? "₹" + maxPrice : "Max"
                }`
              : "Any"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {hasActiveFilter && (
            <div
              onClick={handleClear}
              className="p-0.5 rounded-full hover:bg-[#27190b]/10 transition-colors mr-1"
            >
              <XMarkIcon className="w-3.5 h-3.5" />
            </div>
          )}
          <ChevronDownIcon
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-[280px] mt-2 right-0 bg-white border border-[#27190b]/10 rounded-lg shadow-xl p-4"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#27190b]/60 font-medium ml-1">
                    Min (₹)
                  </label>
                  <input
                    type="number"
                    value={localMin}
                    onChange={(e) => setLocalMin(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-[#27190b]/5 border border-[#27190b]/10 rounded-md text-sm focus:outline-none focus:border-[#27190b]/30 text-[#27190b]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#27190b]/60 font-medium ml-1">
                    Max (₹)
                  </label>
                  <input
                    type="number"
                    value={localMax}
                    onChange={(e) => setLocalMax(e.target.value)}
                    placeholder="10000"
                    className="w-full px-3 py-2 bg-[#27190b]/5 border border-[#27190b]/10 rounded-md text-sm focus:outline-none focus:border-[#27190b]/30 text-[#27190b]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setLocalMin("");
                    setLocalMax("");
                  }}
                  className="flex-1 px-3 py-2 text-sm text-[#27190b]/60 hover:text-[#27190b] hover:bg-[#27190b]/5 rounded-md transition-colors"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 px-3 py-2 bg-[#27190b] text-white text-sm font-medium rounded-md hover:bg-[#27190b]/90 transition-colors shadow-sm"
                >
                  Apply
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

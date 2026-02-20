"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import fonts from "@/config/fonts";
import { FiArrowRight } from "react-icons/fi";

interface CategoryCardProps {
  id: string;
  name: string;
  images: string[];
  onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  name,
  images,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Ensure we have at least one image, use placeholder if not
  const mainImage = images[0] || "/images/placeholder.png";
  // Get up to 3 additional images for the strip
  const stripImages = images.slice(1, 4);

  return (
    <motion.div
      className="group cursor-pointer flex flex-col gap-4"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4 }}
    >
      {/* Main Image Container */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-[#BD9958]/20 bg-[#27190b]/40">
        <Image
          src={mainImage}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#27190b]/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Category Name & Action */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col gap-2">
          <h3
            className={`${fonts.cormorant} text-3xl text-[#ffe5b6] font-medium tracking-wide drop-shadow-md`}
          >
            {name}
          </h3>

          <div className="flex items-center gap-2 text-[#BD9958] text-sm tracking-widest uppercase font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <span>Explore Collection</span>
            <FiArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Small Image Strip */}
      {stripImages.length > 0 && (
        <div className="grid grid-cols-3 gap-2 h-20">
          {stripImages.map((img, index) => (
            <div
              key={index}
              className="relative h-full overflow-hidden rounded-lg border border-[#BD9958]/10 bg-[#27190b]/20"
            >
              <Image
                src={img || "/images/placeholder.png"}
                alt={`${name} preview ${index + 1}`}
                fill
                className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                sizes="(max-width: 768px) 33vw, 10vw"
              />
            </div>
          ))}
          {
            // Fill empty slots if less than 3 strip images but at least 1 exists
            [...Array(3 - stripImages.length)].map((_, i) => (
              <div
                key={`empty-${i}`}
                className="relative h-full rounded-lg border border-[#BD9958]/5 bg-[#27190b]/10"
              />
            ))
          }
        </div>
      )}
    </motion.div>
  );
};

export default CategoryCard;

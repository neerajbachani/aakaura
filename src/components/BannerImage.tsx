"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import fonts from "@/config/fonts";

interface BannerImageProps {
  heading: string | React.ReactNode;
  subheading: string;
  src: string;
  height?: "small" | "medium" | "large";
  buttonText?: string;
  buttonHref?: string;
}

export default function BannerImage({
  heading,
  subheading,
  src,
  height = "medium",
  buttonText,
  buttonHref,
}: BannerImageProps) {
  const heightClasses = {
    small: "h-[40vh] md:h-[50vh]",
    medium: "h-[60vh] md:h-[70vh]",
    large: "h-[80vh] md:h-[90vh]",
  };

  return (
    <div className={`relative w-full ${heightClasses[height]}`}>
      {/* Image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt={heading as string}
          fill
          className="object-cover"
          priority
          quality={100}
        />
        <div className="absolute inset-0 bg-primaryBrown/30 backdrop-blur-[2px]" />
      </div>

      {/* Text Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1
            className={`${fonts.specialElite} text-3xl md:text-5xl lg:text-6xl text-primaryBeige mb-4 md:mb-6`}
          >
            {heading}
          </h1>
          <div
            className={`${fonts.dekko} text-lg md:text-xl lg:text-2xl text-secondaryBeige max-w-2xl mx-auto leading-relaxed`}
          >
            {subheading}
          </div>
          
          {buttonText && buttonHref && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8"
            >
              <Link
                href={buttonHref}
                className="inline-block px-8 py-3 bg-primaryRed hover:bg-primaryRed/90 text-primaryBeige font-medium rounded-lg transition-colors duration-300 shadow-lg hover:shadow-xl"
              >
                {buttonText}
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <div className="w-16 h-[1px] bg-primaryBeige/60" />
          {/* Sacred Symbol with red accent */}
          <div className="relative w-4 h-4 rotate-45">
            <div className="absolute inset-0 border border-primaryBeige/40" />
            <div className="absolute inset-[3px] border border-primaryRed/30" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

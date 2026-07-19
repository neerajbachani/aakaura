import Link from "next/link";
import fonts from "@/config/fonts";
import { ISTART_RAJASTHAN_URL } from "@/config/partners";

interface BackedByIStartProps {
  className?: string;
}

export default function BackedByIStart({ className = "" }: BackedByIStartProps) {
  return (
    <p
      className={`text-[10px] md:text-xs ${fonts.merriweather} ${className}`}
    >
      Backed by{" "}
      <Link
        href={ISTART_RAJASTHAN_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:opacity-80 transition-opacity"
      >
        iStart Rajasthan
      </Link>
    </p>
  );
}

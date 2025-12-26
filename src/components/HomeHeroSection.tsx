"use client";
import Navbar from "@/components/Navbar";
import BannerImage from "@/components/BannerImage";
import Galaxy from "@/components/ui/Galaxy";

export default function HomeHeroSection() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Galaxy Background - Covers navbar + hero section */}
      {/* <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <Galaxy
          mouseInteraction={false}
          mouseRepulsion={false}
          density={0.3}
          glowIntensity={0.2}
          saturation={0.2}
          hueShift={150}
          twinkleIntensity={0.3}
          rotationSpeed={0.1}
          starSpeed={0.9}
          speed={0.8}
          transparent={true}
        />
      </div> */}

      {/* Content Layer */}
      <div className="">
        <div className="relative z-50">
        <Navbar className="bg-transparent" />
        </div>
        <div className="relative z-10">
        <BannerImage />
        </div>
      </div>
    </div>
  );
}

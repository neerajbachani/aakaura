import RitualAwarenessGuide from "@/components/rituals/RitualAwarenessGuide";
import RitualsHero from "@/components/rituals/RitualsHero";
import { pageContainerClass } from "@/components/rituals/ritualsStyles";

export default function RitualAwarenessGuidePage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige font-cormorant">
      <RitualsHero />

      <div
        className={`${pageContainerClass} px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28`}
      >
        <RitualAwarenessGuide />
      </div>
    </div>
  );
}

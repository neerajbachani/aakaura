import Link from "next/link";
import RitualCategoryAccordion from "@/components/rituals/RitualCategoryAccordion";
import RitualGuidesHero from "@/components/rituals/RitualGuidesHero";
import {
  bodyTextClass,
  pageContainerClass,
} from "@/components/rituals/ritualsStyles";
import { ritualCategories } from "@/data/ritualDocuments";

const linkClass =
  "text-[#BD9958] hover:text-primaryRed underline underline-offset-4 transition-colors";

export default function RitualsPage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige font-cormorant">
      <RitualGuidesHero />

      <div
        className={`${pageContainerClass} px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28`}
      >
        <p className={`${bodyTextClass} mb-8 lg:mb-10 text-primaryBeige/80`}>
          Before using these ritual PDFs, please read and agree to our{" "}
          <Link href="/rituals/awareness-guide" className={linkClass}>
            Ritual Interaction Terms &amp; Awareness Guide
          </Link>
          .
        </p>

        <RitualCategoryAccordion categories={ritualCategories} />
      </div>
    </div>
  );
}

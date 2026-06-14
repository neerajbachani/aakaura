import Link from "next/link";
import RitualCategoryAccordion from "@/components/rituals/RitualCategoryAccordion";
import RitualsHero from "@/components/rituals/RitualsHero";
import {
  bodyTextClass,
  faqCalloutClass,
  pageContainerClass,
  sectionCardClass,
  sectionHeadingClass,
  sectionNumberClass,
} from "@/components/rituals/ritualsStyles";
import fonts from "@/config/fonts";
import { ritualCategories } from "@/data/ritualDocuments";

function NoteSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className={sectionCardClass}>
      <div className="flex items-start gap-4 md:gap-6 mb-4 md:mb-6">
        <span
          className={`${sectionNumberClass} ${fonts.playfair} font-semibold shrink-0 pt-1`}
        >
          {number}
        </span>
        <h2
          className={`${sectionHeadingClass} ${fonts.playfair} border-b border-primaryBeige/20 pb-2 md:pb-3 flex-1`}
        >
          {title}
        </h2>
      </div>
      <div className={bodyTextClass}>{children}</div>
    </section>
  );
}

const linkClass =
  "text-[#BD9958] hover:text-primaryRed underline underline-offset-4 transition-colors";

export default function RitualsPage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige font-cormorant">
      <RitualsHero />

      <div className={`${pageContainerClass} px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28`}>
        <div className={faqCalloutClass}>
          <div className={`${bodyTextClass} space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-10`}>
            <div>
              <p className="font-semibold text-primaryBeige mb-2 md:mb-3">
                Will it &ldquo;activate the particular chakra&rdquo;?
              </p>
              <p>No measurable proof.</p>
            </div>
            <div>
              <p className="font-semibold text-primaryBeige mb-2 md:mb-3">
                Will it:
              </p>
              <ul className="list-disc pl-6 space-y-1 marker:text-primaryRed mb-2 md:mb-3">
                <li>calm someone down</li>
                <li>help them pause</li>
                <li>improve self-awareness</li>
              </ul>
              <p>Yes; when designed and used correctly.</p>
            </div>
          </div>
          <p className={`${bodyTextClass} mt-6 lg:mt-10 lg:col-span-2`}>
            We are not here to &lsquo;help&rsquo; you in your life. There is
            nothing wrong so we can&apos;t fix anything for you when nothing is
            broken-these are rituals and products that work beautifully for us to
            live a present life with awareness of diseased energy and energy
            blockages-it doesn&apos;t make us shrink into with fear, but expand
            with faith in the divine within us all, make us more compassionate
            towards ourselves, our journey and hence others and their soul
            journeys respectively.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:gap-16">
          <NoteSection number="01" title="Foundational Awareness">
            <p className="mb-4">
              During every Aakaura ritual or interaction, hold this awareness:
              you are the universe, experiencing itself.
            </p>
            <p className="mb-4">
              There is no competition. No comparison. No right or wrong way. No
              audience.
            </p>
            <p>There is only your way. It is all you.</p>
          </NoteSection>

          <NoteSection
            number="02"
            title='On the Use of "Ritual" and "Interaction"'
          >
            <p className="mb-4">
              Within Aakaura, the terms ritual and interaction are used
              interchangeably.
            </p>
            <p className="mb-4">
              &ldquo;Ritual&rdquo; reflects depth, intention, and presence.
              &ldquo;Interaction&rdquo; brings ease, lightness, and a sense of
              natural flow.
            </p>
            <p>
              This balance is intentional- allowing the experience to feel both
              meaningful and <span lang="hi">सहज</span> (effortless), rather
              than rigid or performative.
            </p>
          </NoteSection>

          <NoteSection number="03" title="On Sound & Vibrational Consistency">
            <p className="mb-4">
              Across all Aakaura rituals, a single sound vibration has been used
              intentionally.
            </p>
            <p className="mb-4">
              Rather than only assigning different seed syllables to individual
              chakras, we have chosen a unified approach to maintain energetic
              balance across the system.
            </p>
            <p>
              This ensures that no single center is overstimulated, and the
              experience remains stable, grounded, and integrative.
            </p>
          </NoteSection>

          <NoteSection number="05" title="Use of english numbering in the rituals">
            <p>
              English numbering is used intentionally within our ritual guides to
              keep the practice accessible, repeatable, and easy to follow during
              everyday interaction with your Aakaura product.
            </p>
          </NoteSection>

          <NoteSection
            number="06"
            title="Might feel uneasy but try and sit through it"
          >
            <p>
              It is very freeing after sometime and do not mug up the rituals-
              just remember how to interact with the product and slowly make it
              an everyday thing in your day ; Simple = repeatable; Repeatable =
              effective ; neuroscientifically backed more than you think
            </p>
          </NoteSection>

          <NoteSection
            number="07"
            title="A behavioral conditioning tool disguised as a spiritual artifact"
          >
            <p>
              Don&apos;t mock it- be receptive. It is okay to feel like it is
              something magical or that it doesnt happen like this- get informed
              but be curious- not judgemental or it wont work of course. breathe
            </p>
          </NoteSection>

          <NoteSection number="08" title="Deepening Your Understanding">
            <p className="mb-4">
              For those who wish to explore further, Aakaura offers additional
              insights into chakras, sound vibrations, and energetic awareness.
            </p>
            <p className="mb-4">
              You may access our{" "}
              <Link href="/blogs" className={linkClass}>
                informative pages
              </Link>{" "}
              or explore{" "}
              <Link href="/journey" className={linkClass}>
                your journey
              </Link>
              , and connect with us directly through our{" "}
              <a
                href="https://www.instagram.com/aakaura.in?igsh=ZjY3aTc0dzJ2czN6"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Instagram
              </a>
              ,{" "}
              <a
                href="https://wa.me/918619029656"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WhatsApp
              </a>
              , and other social platforms via our{" "}
              <a
                href="https://linktr.ee/aakaura.in"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Linktree
              </a>
              .
            </p>
            <p>
              We welcome your curiosity - feel free to ask, explore, and engage
              at your own pace.
            </p>
          </NoteSection>

          <NoteSection number="09" title="Further Guidance">
            <p>
              For any additional information, clarification, or support, please
              contact the Aakaura team directly at{" "}
              <a href="tel:+918619029656" className={linkClass}>
                +91 8619029656
              </a>
              .
            </p>
          </NoteSection>

          <NoteSection
            number="10"
            title="Made by humans and healing practitioners, not AI"
          >
            <p>
              These rituals, notes, and product interactions are crafted by
              human hands and human awareness-not generated by artificial
              intelligence.
            </p>
          </NoteSection>

          <NoteSection number="11" title="Subject to change every 5-6 months">
            <p>
              This page and its ritual guides are subject to change every 5-6
              months due to changes in information, experiences and energetic
              balances etc.
            </p>
          </NoteSection>

          <section>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#BD9958] to-transparent mb-8 lg:mb-10" />
            <h2
              className={`${fonts.playfair} text-3xl md:text-4xl lg:text-5xl text-primaryBeige font-semibold mb-3 lg:mb-4`}
            >
              Ritual Guides
            </h2>
            <p className={`${bodyTextClass} mb-8 lg:mb-10 text-primaryBeige/80 italic`}>
              Select your product category, then open Hindi or English.
            </p>
            <RitualCategoryAccordion categories={ritualCategories} />
          </section>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import RitualCategoryAccordion from "@/components/rituals/RitualCategoryAccordion";
import RitualsHero from "@/components/rituals/RitualsHero";
import {
  bodyTextClass,
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

const listClass =
  "list-disc pl-6 space-y-1 marker:text-primaryRed mb-4 md:mb-5";

export default function RitualsPage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige font-cormorant">
      <RitualsHero />

      <div className={`${pageContainerClass} px-4 sm:px-6 lg:px-8 pb-20 lg:pb-28`}>
        <div className="grid grid-cols-1 gap-12 lg:gap-16">
          <NoteSection number="01" title="What This Is (And What It Isn't)">
            <p className="mb-4">
              Aakaura products are tools for awareness, presence, and personal
              reflection.
            </p>
            <p className="mb-4">
              They are not medical, psychological, or therapeutic treatments,
              and are not intended to diagnose, treat, cure, or prevent any
              physical or mental health condition.
            </p>
            <p className="mb-2 md:mb-3">We do not claim that any product:</p>
            <ul className={listClass}>
              <li>
                Activates specific chakras in a measurable or medically proven
                way
              </li>
              <li>Removes &ldquo;blockages&rdquo; in a clinical sense</li>
              <li>Produces guaranteed outcomes</li>
            </ul>
            <p className="mb-2 md:mb-3">
              However, when used with intention and consistency, these
              interactions may:
            </p>
            <ul className={listClass}>
              <li>Encourage calmness exponentially</li>
              <li>Improve self-awareness multifold</li>
              <li>
                Support mindful pauses in daily life leading to a healthier,
                informed and relaxed nervous system regulation
              </li>
            </ul>
          </NoteSection>

          <NoteSection
            number="02"
            title="The Only Thing You Need to Remember"
          >
            <p className="mb-4">
              During every Aakaura interaction, hold this awareness:
            </p>
            <p className="mb-4">
              You are not separate from the universe. You are the universe,
              experiencing itself.
            </p>
            <p className="mb-2 md:mb-3">There is:</p>
            <ul className={listClass}>
              <li>No competition</li>
              <li>No comparison</li>
              <li>No &ldquo;correct&rdquo; way to do this</li>
            </ul>
            <p className="mb-4">There is only your way.</p>
            <p>
              These rituals are about experiencing yourself more consciously.
            </p>
          </NoteSection>

          <NoteSection
            number="03"
            title="Ritual… Interaction… Same Thing, Relax"
          >
            <p className="mb-4">
              Within Aakaura, the words ritual and interaction are used
              interchangeably.
            </p>
            <p className="mb-4">
              &ldquo;Ritual&rdquo; represents intention and depth
            </p>
            <p className="mb-4">
              &ldquo;Interaction&rdquo; represents ease and natural flow
            </p>
            <p>
              Nothing here is meant to feel rigid, forced, or performative. This
              very balance is intentional.
            </p>
          </NoteSection>

          <NoteSection
            number="04"
            title="No Miracles. Just Awareness, and that's more powerful than you think."
          >
            <p className="mb-4">
              Aakaura does not &ldquo;help&rdquo; or &ldquo;fix&rdquo; your
              life.
            </p>
            <p className="mb-2 md:mb-3">We operate from the understanding that:</p>
            <ul className={listClass}>
              <li>Nothing is inherently broken</li>
              <li>There is nothing to repair</li>
              <li>Only awareness to deepen</li>
            </ul>
            <p className="mb-2 md:mb-3">
              Any experience you have with the product depends on:
            </p>
            <ul className={listClass}>
              <li>Your openness/ receptivity</li>
              <li>Your consistency</li>
              <li>Your mental and emotional state</li>
            </ul>
            <p>No specific result is guaranteed.</p>
          </NoteSection>

          <NoteSection
            number="05"
            title="Why We Don't Jump Chakras Like Playlists"
          >
            <p className="mb-4">
              Aakaura uses a unified sound vibration approach across rituals.
            </p>
            <p className="mb-2 md:mb-3">
              Instead of stimulating isolated energy centers individually, we
              maintain:
            </p>
            <ul className={listClass}>
              <li>Balance across the system</li>
              <li>Stability in experience</li>
              <li>A grounded, integrative effect</li>
            </ul>
            <p>
              This avoids overstimulation and supports a more cohesive internal
              state.
            </p>
          </NoteSection>

          <NoteSection number="06" title="Don't Perform It. Experience It.">
            <p className="mb-4">
              This isn&apos;t a test. Please do not treat it as one
              (unconsciously).
            </p>
            <ul className={listClass}>
              <li>Do not try to memorize rituals mechanically</li>
              <li>
                Focus on understanding the interaction, not performing it
                perfectly
              </li>
              <li>Keep it simple and repeatable</li>
            </ul>
            <p className="mb-4 font-semibold text-primaryBeige">
              Simple → Repeatable → Effective
            </p>
            <p className="mb-2 md:mb-3">Some users may initially feel:</p>
            <ul className={listClass}>
              <li>Unease</li>
              <li>Restlessness</li>
              <li>Emotional surfacing</li>
            </ul>
            <p className="mb-4">
              This is a normal response to stillness and awareness.
            </p>
            <p>If comfortable, allow yourself to sit through it.</p>
          </NoteSection>

          <NoteSection number="07" title="This Only Works If You Let It">
            <p className="mb-4">
              Your mindset is the real switch. Aakaura products function as:
            </p>
            <p className="mb-4">
              Behavioral conditioning tools, presented through physical and
              symbolic forms
            </p>
            <p className="mb-4">Your receptivity matters.</p>
            <p className="mb-2 md:mb-3">If approached with:</p>
            <ul className={listClass}>
              <li>Mockery</li>
              <li>Resistance</li>
              <li>Constant judgment</li>
            </ul>
            <p className="mb-4">
              …the experience will naturally feel ineffective.
            </p>
            <p className="mb-2 md:mb-3">If approached with:</p>
            <ul className={listClass}>
              <li>Curiosity</li>
              <li>Openness</li>
              <li>Willing participation</li>
            </ul>
            <p>…the interaction becomes significantly more impactful.</p>
          </NoteSection>

          <NoteSection
            number="08"
            title="We're Not Your Therapist (Respectfully)"
          >
            <p>
              And that&apos;s important to understand. You are your own divine,
              own help and own guide. We are, however, in this, together forever.{" "}
              &lt;3
            </p>
          </NoteSection>

          <NoteSection
            number="09"
            title="You're in Charge Here. Always have been."
          >
            <p className="mb-2 md:mb-3">By proceeding, you acknowledge that:</p>
            <ul className={listClass}>
              <li>You are voluntarily engaging with the product</li>
              <li>
                You are responsible for your interpretation and experience
              </li>
              <li>
                Aakaura is not liable for individual emotional or psychological
                responses
              </li>
            </ul>
          </NoteSection>

          <NoteSection
            number="10"
            title="Handmade Means Human (And That's the Point)"
          >
            <p className="mb-4">
              These are not machine-perfect objects or generic instructions,
              and that is intentional.
            </p>
            <p className="mb-2 md:mb-3">All Aakaura products are:</p>
            <ul className={listClass}>
              <li>Handmade</li>
              <li>Created by human artisans and practitioners</li>
              <li>Subject to natural variations</li>
            </ul>
            <p className="mb-2 md:mb-3">
              In addition, all rituals, guides, and PDFs are:
            </p>
            <ul className={listClass}>
              <li>
                Carefully written, proofread, and intentionally curated
              </li>
              <li>Developed with input from energy practitioners</li>
              <li>
                Informed by individuals who study neuroscience, science, and
                related disciplines
              </li>
            </ul>
          </NoteSection>

          <NoteSection number="11" title="This Will Evolve (Like You Should)">
            <p className="mb-4">
              Aakaura is a continuously evolving system.
            </p>
            <p className="mb-2 md:mb-3">
              Rituals, instructions, and interpretations may change
            </p>
            <p className="mb-2 md:mb-3">
              Updates may occur every 5–6 months based on:
            </p>
            <ul className={listClass}>
              <li>New insights</li>
              <li>User experiences</li>
              <li>
                Evolving understanding of energy and behavior
              </li>
            </ul>
          </NoteSection>

          <NoteSection number="12" title="Language, But Make It Easy">
            <p className="mb-4">
              Rituals may use English numbering for clarity
            </p>
            <p className="mb-4">
              Content may be available in multiple languages (including Hindi
              and English)
            </p>
            <p>
              You are encouraged to engage in the format most natural to you
            </p>
          </NoteSection>

          <NoteSection number="13" title="Curious? Good.">
            <p className="mb-4">That&apos;s exactly the point.</p>
            <p className="mb-2 md:mb-3">For deeper understanding, you may:</p>
            <ul className={listClass}>
              <li>
                Explore our{" "}
                <Link href="/blogs" className={linkClass}>
                  informational pages
                </Link>
              </li>
              <li>
                Reach out via{" "}
                <a
                  href="https://wa.me/918619029656"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  WhatsApp
                </a>
                ,{" "}
                <a
                  href="https://www.instagram.com/aakaura.in?igsh=ZjY3aTc0dzJ2czN6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Instagram
                </a>
                , or other official channels via our{" "}
                <a
                  href="https://linktr.ee/aakaura.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Linktree
                </a>
              </li>
            </ul>
            <p className="mb-4">Curiosity is welcome.</p>
            <p>Blind belief is not required.</p>
          </NoteSection>

          <NoteSection number="14" title="If You've Read This, You're In">
            <p className="mb-4">
              And that already sets you apart.
            </p>
            <p className="mb-2 md:mb-3">
              By entering your password and accessing the ritual content, you
              confirm that:
            </p>
            <ul className={listClass}>
              <li>You have read and understood this document</li>
              <li>
                You accept the nature and limitations of the product
              </li>
              <li>You take full responsibility for your experience</li>
            </ul>
          </NoteSection>

          <section className={`${sectionCardClass} text-center`}>
            <p className={`${bodyTextClass} mb-4 md:mb-6`}>
              Proceed with awareness. Not expectation. Thank you for being you.
              Let&apos;s hold hands and do this together.
            </p>
            <p className={`${bodyTextClass} text-[#BD9958] italic`}>
              Welcome to the Aakaura World, your inner world.
            </p>
          </section>

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

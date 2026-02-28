import React from "react";

export default function DisclaimersPage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige py-20 px-4 sm:px-6 lg:px-8 font-cormorant">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primaryBeige tracking-wide">
          DISCLAIMERS & NOTICES
        </h1>

        <div className="grid grid-cols-1 gap-12 text-lg md:text-xl leading-relaxed text-secondaryBeige">
          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              SPIRITUAL & ENERGY DISCLAIMER
            </h2>
            <p className="mb-4">
              Aakaura products are created for personal, spiritual, aesthetic,
              and lifestyle purposes only.
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-primaryRed">
              <li>
                They are not medical devices and are not intended to diagnose,
                treat, cure, or prevent any disease or condition.
              </li>
              <li>
                Energy, chakra, and spiritual experiences are subjective and
                vary from individual to individual. No guaranteed results are
                promised.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              NO MEDICAL ADVICE DISCLAIMER
            </h2>
            <p className="mb-2">
              Any information provided on this website—whether related to
              energy, chakras, rituals, or practices—is for informational
              purposes only.
            </p>
            <p>
              It is not a substitute for professional medical, psychological, or
              therapeutic advice. Always consult a qualified professional for
              health-related concerns.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              QUIZ DISCLAIMER
            </h2>
            <p>
              The &lsquo;Welcome Home&rsquo; quiz is for educational and
              self-awareness purposes only. It does not diagnose, treat, cure,
              or prevent any medical or psychological condition. If you are
              experiencing health concerns, please consult a licensed healthcare
              professional.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              RESULTS MAY VARY DISCLAIMER
            </h2>
            <p className="mb-2">
              Each individual experiences energy, art, and symbolism
              differently.
            </p>
            <p>
              Outcomes, perceptions, and effects may vary and are not
              guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              HANDCRAFTED & NATURAL VARIATION DISCLAIMER
            </h2>
            <p className="mb-4">
              Our products are handcrafted using natural materials such as
              terracotta, wood, yarn, metal, and fabric.
            </p>
            <p className="mb-2">Minor variations in:</p>
            <ul className="list-disc pl-6 space-y-1 mb-4 marker:text-primaryRed">
              <li>Color</li>
              <li>Texture</li>
              <li>Shape</li>
              <li>Finish</li>
            </ul>
            <p>are natural characteristics, not defects.</p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              PRODUCT CARE DISCLAIMER
            </h2>
            <p className="mb-2">
              Improper handling, exposure to water, chemicals, excessive heat,
              or rough use may affect product longevity.
            </p>
            <p>
              Aakaura is not responsible for damage caused after delivery due to
              misuse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              INTELLECTUAL PROPERTY & DESIGN NOTICE
            </h2>
            <p className="mb-2">
              All Aakaura designs, concepts, and creative expressions are
              proprietary.
            </p>
            <p className="mb-2">
              Unauthorized copying, imitation, or reproduction—whether physical
              or digital—may invite legal action.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              PAYMENT DISCLAIMER
            </h2>
            <p className="mb-2">
              Payments are processed through secure third-party gateways.
            </p>
            <p>
              Aakaura is not responsible for payment failures, delays, or errors
              caused by external service providers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              PRICING & AVAILABILITY DISCLAIMER
            </h2>
            <p className="mb-2">
              Prices and availability are subject to change without prior
              notice.
            </p>
            <p>
              Limited-edition and handcrafted products may not be restocked.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              FORCE MAJEURE
            </h2>
            <p>
              Aakaura shall not be held liable for delays or failures caused by
              events beyond reasonable control, including natural disasters,
              strikes, government restrictions, or logistics disruptions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              TESTIMONIALS & REVIEWS DISCLAIMER
            </h2>
            <p className="mb-2">
              Testimonials reflect individual experiences and perceptions.
            </p>
            <p>They do not guarantee similar results for all users.</p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              POLICY UPDATES
            </h2>
            <p>
              Aakaura reserves the right to modify these policies at any time.
              Continued use of the website implies acceptance of updated terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

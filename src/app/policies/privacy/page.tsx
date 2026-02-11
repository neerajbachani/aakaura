import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige py-20 px-4 sm:px-6 lg:px-8 font-cormorant">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primaryBeige tracking-wide">
          PRIVACY POLICY
        </h1>

        <div className="space-y-10 text-lg md:text-xl leading-relaxed text-secondaryBeige">
          <section>
            <p className="text-xl md:text-2xl italic mb-4 text-primaryBeige/90">
              At Aakaura, your privacy is respected like your personal
              energy—handled carefully and never misused.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              Information We Collect
            </h2>
            <p className="mb-4">We may collect:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-primaryRed">
              <li>Name, email, phone number</li>
              <li>Shipping and billing address</li>
              <li>
                Payment details (processed securely via third-party gateways)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-primaryRed">
              <li>To process and deliver orders</li>
              <li>To communicate order updates</li>
              <li>To improve user experience</li>
            </ul>
            <p>We do not sell or trade your personal data.</p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              Data Security
            </h2>
            <p>
              Your information is stored securely and shared only with essential
              service providers such as payment gateways and logistics partners.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              Cookies
            </h2>
            <p>
              We may use cookies to enhance website performance and user
              experience.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              Your Rights
            </h2>
            <p>
              You may request access, correction, or deletion of your data by
              contacting us.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

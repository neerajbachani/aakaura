import Link from "next/link";
import {
  GUIDANCE_CALL,
  GUIDANCE_CALL_GUIDELINES,
  COUPON_POLICY,
  CALL_FLOW,
  SESSION_GUIDELINES,
  PACKAGE_DETAILS,
} from "@/config/guidance";
import { PackageType } from "@prisma/client";
import PractitionerProfiles from "@/components/guidance/PractitionerProfiles";

const PACKAGE_ORDER: PackageType[] = ["PACKAGE_I", "PACKAGE_II", "PACKAGE_III"];

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-[#F5E6D3]/10 backdrop-blur rounded-2xl p-6 md:p-8 border border-[#BD9958]/20 ${className}`}
    >
      <h2 className="text-2xl md:text-3xl font-cormorant text-[#BD9958] mb-4">{title}</h2>
      {children}
    </section>
  );
}

export default function GuidanceCallDetails() {
  return (
    <div className="space-y-6">
      {/* Hero summary */}
      <SectionCard title="Demo Guidance Call">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-[#F5E6D3]/70 text-base lg:text-lg">Price</p>
            <p className="text-2xl lg:text-3xl font-semibold text-[#F5E6D3]">₹{GUIDANCE_CALL.price}</p>
          </div>
          <div>
            <p className="text-[#F5E6D3]/70 text-base lg:text-lg">Duration</p>
            <p className="text-2xl lg:text-3xl font-semibold text-[#F5E6D3]">{GUIDANCE_CALL.durationMinutes} Minutes</p>
          </div>
        </div>
        <p className="text-[#F5E6D3]/90 text-base lg:text-lg leading-relaxed">
          Your first step with an Aakaura practitioner; understand your concerns, learn chakra basics,
          discover sacred symbols, and receive clear recommendations for your ritual journey.
        </p>
      </SectionCard>

      <PractitionerProfiles />

      {/* Guidelines */}
      {/* <SectionCard title="Important Guidelines">
        <ul className="space-y-2">
          {GUIDANCE_CALL_GUIDELINES.map((rule) => (
            <li key={rule} className="flex gap-2 text-[#F5E6D3]/95 text-base lg:text-lg">
              <span className="text-[#BD9958] shrink-0">•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </SectionCard> */}

      {/* Coupon */}
      <SectionCard title={COUPON_POLICY.title}>
        <ul className="space-y-2">
          {COUPON_POLICY.points.map((point) => (
            <li key={point} className="flex gap-2 text-[#F5E6D3]/95 text-base lg:text-lg">
              <span className="text-[#BD9958] shrink-0">•</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* What to expect */}
      {/* <SectionCard title="What to Expect During Your Call">
        <div className="space-y-5">
          {CALL_FLOW.map((block) => (
            <div key={block.duration}>
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <span className="text-[#BD9958] text-base lg:text-lg font-medium">{block.duration}</span>
                <span className="text-[#F5E6D3] text-base lg:text-lg font-medium">{block.title}</span>
              </div>
              <ul className="ml-4 space-y-1.5">
                {block.points.map((point) => (
                  <li key={point} className="text-[#F5E6D3]/90 text-base lg:text-lg flex gap-2">
                    <span className="text-[#BD9958]/60">–</span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </SectionCard> */}

      {/* Session guidelines */}
      <SectionCard title="Session Guidelines">
        <ul className="space-y-2">
          {SESSION_GUIDELINES.map((rule) => (
            <li key={rule} className="flex gap-2 text-[#F5E6D3]/95 text-base lg:text-lg">
              <span className="text-[#BD9958] shrink-0">•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* Packages overview */}
      <SectionCard title="Ritual Support Packages">
        <p className="text-[#F5E6D3]/85 text-base lg:text-lg mb-6">
          Your journey doesn&apos;t end with the Guidance Call, it continues from here. Packages II and III open up once you&apos;ve made a purchase. And if your order crosses ₹999, a complimentary Ritual Package I coupon comes your way from Aakaura&apos;s side, valid for 3 months.
        </p>
        <div className="space-y-6">
          {PACKAGE_ORDER.map((type) => {
            const pkg = PACKAGE_DETAILS[type];
            return (
              <div
                key={type}
                className="rounded-xl border border-[#BD9958]/20 bg-[#27190B]/40 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="text-xl lg:text-2xl font-cormorant text-[#BD9958]">
                      {pkg.label}
                      {pkg.postPurchase && (
                        <span className="ml-2 text-sm lg:text-base font-sans text-[#F5E6D3]/60">(Post Purchase)</span>
                      )}
                    </h3>
                    <p className="text-[#F5E6D3]/90 text-base lg:text-lg">{pkg.subtitle}</p>
                  </div>
                  <p className="text-xl lg:text-2xl font-semibold text-[#F5E6D3]">₹{pkg.price}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-base lg:text-lg text-[#F5E6D3]/85 mb-3">
                  <p>
                    <span className="text-[#F5E6D3]/50">Calls: </span>
                    {pkg.calls} × {pkg.durationMinutes} min
                  </p>
                  {pkg.validityLabel && (
                    <p>
                      <span className="text-[#F5E6D3]/50">Validity: </span>
                      {pkg.validityLabel}
                    </p>
                  )}
                </div>

                {pkg.scheduling && (
                  <p className="text-base lg:text-lg text-[#F5E6D3]/85 mb-3">
                    <span className="text-[#F5E6D3]/50">Scheduling: </span>
                    {pkg.scheduling}
                  </p>
                )}

                {pkg.includes.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm lg:text-base uppercase tracking-wide text-[#BD9958]/90 mb-2">What&apos;s included</p>
                    <ul className="space-y-1.5">
                      {pkg.includes.map((item) => (
                        <li key={item} className="text-base lg:text-lg text-[#F5E6D3]/90 flex gap-2">
                          <span className="text-[#BD9958]">✔</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {pkg.inheritsFrom && (
                  <p className="text-base lg:text-lg text-[#F5E6D3]/85 mb-2">
                    Everything from {pkg.inheritsFrom}, plus:
                  </p>
                )}

                {pkg.plusIncludes && pkg.plusIncludes.length > 0 && (
                  <ul className="space-y-1.5">
                    {pkg.plusIncludes.map((item) => (
                      <li key={item} className="text-base lg:text-lg text-[#F5E6D3]/90 flex gap-2">
                        <span className="text-[#BD9958]">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
        <Link
          href="/ritual-packages"
          className="inline-block mt-6 text-[#BD9958] hover:underline text-base lg:text-lg"
        >
          View & purchase ritual packages →
        </Link>
      </SectionCard>
    </div>
  );
}

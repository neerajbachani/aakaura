import Image from "next/image";
import { GUIDANCE_PRACTITIONERS } from "@/config/guidance";

export default function PractitionerProfiles() {
  return (
    <section className="bg-[#F5E6D3]/10 backdrop-blur rounded-2xl p-6 md:p-8 border border-[#BD9958]/20">
      <h2 className="text-2xl md:text-3xl font-cormorant text-[#BD9958] mb-2">
        Meet Your Practitioners
      </h2>
      <p className="text-[#F5E6D3]/85 text-base lg:text-lg mb-6 leading-relaxed">
        Your guidance call may be with one of our certified Pranic healers.
      </p>

      <div className="space-y-8">
        {GUIDANCE_PRACTITIONERS.map((practitioner) => (
          <div
            key={practitioner.name}
            className="flex flex-col md:flex-row gap-5 md:gap-6 items-center md:items-start"
          >
            <div className="shrink-0 w-40 h-40 md:w-44 md:h-44 relative rounded-2xl overflow-hidden border border-[#BD9958]/30">
              <Image
                src={practitioner.imageUrl}
                alt={practitioner.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 160px, 176px"
              />
            </div>
            <div className="flex-1 text-center md:text-left min-w-0">
              <h3 className="text-xl lg:text-2xl font-cormorant text-[#F5E6D3]">
                {practitioner.name}
              </h3>
              <p className="text-[#BD9958] text-base lg:text-lg mt-1 mb-3">
                {practitioner.title}
              </p>
              <div className="space-y-3">
                {practitioner.bio.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="text-[#F5E6D3]/90 text-base lg:text-lg leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

import React from "react";

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige py-20 px-4 sm:px-6 lg:px-8 font-cormorant">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primaryBeige tracking-wide">
          SHIPPING & DELIVERY POLICY
        </h1>

        <div className="space-y-10 text-lg md:text-xl leading-relaxed text-secondaryBeige">
          <section>
            <p className="text-xl md:text-2xl italic mb-6 text-primaryBeige/90">
              All Aakaura products are prepared with care and intention.
            </p>
            <ul className="list-disc pl-6 space-y-4 marker:text-primaryRed">
              <li>Orders are typically dispatched within 3-7 working days</li>
              <li>Delivery timelines may vary based on location</li>
              <li>
                Delays due to logistics, weather, or unforeseen events are
                beyond our control
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

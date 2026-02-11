import React from "react";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-[#27190B] text-primaryBeige py-20 px-4 sm:px-6 lg:px-8 font-cormorant">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-12 text-center text-primaryBeige tracking-wide">
          REFUND, RETURN & CANCELLATION POLICY
        </h1>

        <div className="space-y-10 text-lg md:text-xl leading-relaxed text-secondaryBeige">
          <section>
            <p className="text-xl md:text-2xl italic mb-4 text-primaryBeige/90">
              We believe in fairness—both ways.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              Returns
            </h2>
            <p className="mb-4">Returns are accepted only if:</p>
            <ul className="list-disc pl-6 space-y-2 mb-6 marker:text-primaryRed">
              <li>The product is damaged or defective</li>
              <li>The issue is reported within 72 hours of delivery</li>
            </ul>
            <p className="bg-primaryBrown/20 p-4 border-l-2 border-primaryRed">
              Handcrafted and customized items are not eligible for return
              unless damaged.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              Refunds
            </h2>
            <p>
              Approved refunds will be processed within 7–10 working days to the
              original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-primaryBeige border-b border-primaryBeige/20 pb-2">
              Cancellations
            </h2>
            <p>Orders can be cancelled before dispatch only.</p>
          </section>
        </div>
      </div>
    </div>
  );
}

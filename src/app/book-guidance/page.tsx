"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuthStatus } from "@/hooks/useAuth";
import {
  GUIDANCE_CALL,
  GUIDANCE_COMPLIMENTARY_PROMO,
  GUIDANCE_PRACTITIONERS,
  PRACTITIONER_PREFERENCE_ANY,
  isComplimentaryPromoStarted,
} from "@/config/guidance";
import GuidanceCallDetails from "@/components/guidance/GuidanceCallDetails";
import GuidancePromoBanner from "@/components/guidance/GuidancePromoBanner";
import GuidanceIntakeFields, {
  validateGuidanceIntake,
  type GuidanceIntakeFormValues,
} from "@/components/guidance/GuidanceIntakeFields";
import { HERO_GUIDANCE } from "@/config/homeHero";
import fonts from "@/config/fonts";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void; on: (event: string, cb: (r: { error: { description: string } }) => void) => void };
  }
}

export default function BookGuidancePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuthStatus();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferredDate: "",
    preferredTime: "",
    preferredPractitioner: "",
    timezone: "Asia/Kolkata",
    notes: "",
    lifeArea: "",
    lifeAreaFeeling: "",
    lifeAreaFeelingOther: "",
    onMindDuration: "",
  });

  const promoStarted = isComplimentaryPromoStarted();

  const intakeValues: GuidanceIntakeFormValues = {
    lifeArea: form.lifeArea,
    lifeAreaFeeling: form.lifeAreaFeeling,
    lifeAreaFeelingOther: form.lifeAreaFeelingOther,
    onMindDuration: form.onMindDuration,
  };

  const handleIntakeChange = (field: keyof GuidanceIntakeFormValues, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const bookingPayload = () => ({
    name: form.name,
    email: form.email,
    phone: form.phone,
    preferredDate: form.preferredDate,
    preferredTime: form.preferredTime,
    preferredPractitioner: form.preferredPractitioner,
    timezone: form.timezone,
    notes: form.notes,
    intake: {
      lifeArea: form.lifeArea,
      lifeAreaFeeling: form.lifeAreaFeeling,
      lifeAreaFeelingOther: form.lifeAreaFeelingOther || undefined,
      onMindDuration: form.onMindDuration,
    },
  });

  const finalizeComplimentaryBooking = async () => {
    const bookRes = await fetch("/api/guidance/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...bookingPayload(),
        complimentary: true,
      }),
    });
    const result = await bookRes.json();
    if (!bookRes.ok) {
      toast.error(result.error || "Booking failed");
      return;
    }
    toast.success("Complimentary booking received! We'll confirm your slot shortly.");
    router.push(`/booking/${result.booking.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone) {
      toast.error("Please fill in all required fields");
      return;
    }

    const intakeError = validateGuidanceIntake(intakeValues);
    if (intakeError) {
      toast.error(intakeError);
      return;
    }

    setSubmitting(true);
    try {
      const createRes = await fetch("/api/guidance/razorpay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "guidance",
          customerInfo: { name: form.name, email: form.email, phone: form.phone },
        }),
      });
      const rzpData = await createRes.json();
      if (!createRes.ok) {
        toast.error(rzpData.error || "Failed to initialize payment");
        return;
      }

      if (rzpData.free && rzpData.complimentary) {
        await finalizeComplimentaryBooking();
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: rzpData.amount,
        currency: rzpData.currency,
        name: "Aakaura",
        description: `Guidance Call · ₹${GUIDANCE_CALL.price}`,
        order_id: rzpData.id,
        handler: async (paymentResponse: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const bookRes = await fetch("/api/guidance/book", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...bookingPayload(),
                razorpayPaymentId: paymentResponse.razorpay_payment_id,
                razorpayOrderId: paymentResponse.razorpay_order_id,
                razorpaySignature: paymentResponse.razorpay_signature,
              }),
            });
            const result = await bookRes.json();
            if (!bookRes.ok) {
              toast.error(result.error || "Booking failed");
              return;
            }
            toast.success("Booking received! We'll confirm your slot shortly.");
            router.push(`/booking/${result.booking.id}`);
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#BD9958" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (r) => toast.error(r.error.description || "Payment failed"));
      rzp.open();
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#27190B] flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD9958]" />
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-[#27190B] py-12 ">
        <div className="max-w-6xl mx-auto px-4">
          <header className="text-center mb-10">
            <GuidancePromoBanner className="mb-8 max-w-3xl mx-auto" />
            <p className="text-[#BD9958]/90 text-sm lg:text-base uppercase tracking-widest mb-2">Guidance Call</p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-cormorant text-[#BD9958] mb-5">
              Book Your Demo Guidance Call
            </h1>
            <p className="text-[#F5E6D3]/90 text-base lg:text-xl max-w-6xl mx-auto leading-relaxed">
              {HERO_GUIDANCE.description}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            {/* Content */}
            <div className="lg:col-span-3 order-2 lg:order-1">
              <GuidanceCallDetails />
            </div>

            {/* Booking form: sticky on desktop */}
            <div className="lg:col-span-2 order-1 lg:order-2 lg:sticky lg:top-28">
              <form
                onSubmit={handleSubmit}
                className="bg-[#F5E6D3]/10 backdrop-blur rounded-2xl p-6 md:p-8 space-y-4 border border-[#BD9958]/30 shadow-lg shadow-black/20"
              >
                <div className="mb-2">
                  <h2 className="text-2xl lg:text-3xl font-cormorant text-[#BD9958]">Book Now</h2>
                  <p className="text-[#F5E6D3]/85 text-base lg:text-lg mt-1">
                    {promoStarted ? (
                      <>Complimentary · {GUIDANCE_CALL.durationMinutes} minutes</>
                    ) : (
                      <>
                        ₹{GUIDANCE_CALL.price} · {GUIDANCE_CALL.durationMinutes} minutes
                      </>
                    )}
                  </p>
                  {promoStarted && (
                    <p className={`${fonts.mulish} text-[#F5E6D3]/65 text-sm mt-1 leading-relaxed not-italic`}>
                      Complimentary for early bookings from {GUIDANCE_COMPLIMENTARY_PROMO.startLabel}
                      . After the first {GUIDANCE_COMPLIMENTARY_PROMO.limit} calls, bookings are ₹
                      {GUIDANCE_CALL.price}.
                    </p>
                  )}
                </div>

                <input
                  required
                  name="name"
                  placeholder="Full Name *"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full bg-white/90 rounded-lg px-4 py-3 text-[#27190B] text-base lg:text-lg"
                />
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full bg-white/90 rounded-lg px-4 py-3 text-[#27190B] text-base lg:text-lg"
                />
                <input
                  required
                  name="phone"
                  placeholder="Phone Number *"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full bg-white/90 rounded-lg px-4 py-3 text-[#27190B] text-base lg:text-lg"
                />
                <GuidanceIntakeFields values={intakeValues} onChange={handleIntakeChange} />
                <select
                  name="timezone"
                  value={form.timezone}
                  onChange={handleChange}
                  className="w-full bg-white/90 rounded-lg px-4 py-3 text-[#27190B] text-base lg:text-lg"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                  <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                </select>
                <select
                  name="preferredPractitioner"
                  value={form.preferredPractitioner}
                  onChange={handleChange}
                  className="w-full bg-white/90 rounded-lg px-4 py-3 text-[#27190B] text-base lg:text-lg"
                >
                  <option value="">Practitioner preference (optional)</option>
                  <option value={PRACTITIONER_PREFERENCE_ANY}>Any practitioner</option>
                  {GUIDANCE_PRACTITIONERS.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    name="preferredDate"
                    value={form.preferredDate}
                    onChange={handleChange}
                    className="bg-white/90 rounded-lg px-3 py-3 text-[#27190B] text-base lg:text-lg"
                  />
                  <input
                    type="time"
                    name="preferredTime"
                    value={form.preferredTime}
                    onChange={handleChange}
                    className="bg-white/90 rounded-lg px-3 py-3 text-[#27190B] text-base lg:text-lg"
                  />
                </div>
                <textarea
                  name="notes"
                  placeholder="Notes (optional): share your concerns"
                  value={form.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-white/90 rounded-lg px-4 py-3 text-[#27190B] text-base lg:text-lg"
                />
                <p className={`${fonts.mulish} text-[#F5E6D3]/60 text-xs md:text-sm text-center leading-relaxed not-italic`}>
                  All guidance calls are confidential.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#BD9958] text-[#27190B] text-base lg:text-lg font-semibold rounded-lg hover:bg-[#BD9958]/90 disabled:opacity-50 transition-colors"
                >
                  {submitting
                    ? "Processing..."
                    : promoStarted
                      ? "Book a call"
                      : `Pay ₹${GUIDANCE_CALL.price} & Book`}
                </button>
                <p className="text-sm lg:text-base text-[#F5E6D3]/75 text-center leading-relaxed">
                  Your booking request will be reviewed. Our team will confirm your meeting shortly.
                  After your call, purchasing Aakaura products worth above ₹999 may make you eligible
                  for a Ritual Package I coupon.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

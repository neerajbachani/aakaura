"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

const STATUS_MESSAGES: Record<string, { title: string; description: string }> = {
  PENDING: {
    title: "Booking Request Received",
    description:
      "Your booking request has been received. Our team will review your preferred slot and confirm your meeting shortly.",
  },
  CONFIRMED: {
    title: "Your Call is Confirmed",
    description: "Your Guidance Call has been confirmed. Check the details below.",
  },
  COMPLETED: {
    title: "Call Completed",
    description: "Thank you for attending your Guidance Call.",
  },
  CANCELLED: {
    title: "Booking Cancelled",
    description: "This booking has been cancelled.",
  },
  RESCHEDULED: {
    title: "Reschedule Pending",
    description: "Your booking is being rescheduled. Our team will confirm the new slot shortly.",
  },
  NO_SHOW: {
    title: "No Show",
    description: "This session was marked as a no-show. Please contact us to reschedule.",
  },
};

export default function BookingStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [booking, setBooking] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guidance/booking/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setBooking(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#27190B] flex items-center justify-center pt-24">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BD9958]" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#27190B] flex items-center justify-center pt-24 text-[#F5E6D3]">
        Booking not found
      </div>
    );
  }

  const status = booking.status as string;
  const msg = STATUS_MESSAGES[status] || STATUS_MESSAGES.PENDING;

  return (
    <div className="min-h-screen bg-[#27190B] py-12 pt-28">
      <div className="max-w-xl mx-auto px-4">
        <div className="bg-[#F5E6D3]/10 backdrop-blur rounded-2xl p-8 border border-[#BD9958]/20 text-[#F5E6D3]">
          <h1 className="text-2xl font-cormorant text-[#BD9958] mb-2">{msg.title}</h1>
          <p className="text-[#F5E6D3]/80 mb-6">{msg.description}</p>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#F5E6D3]/60">Status</span>
              <span className="font-medium">{status}</span>
            </div>
            {Boolean(booking.preferredDate) && (
              <div className="flex justify-between">
                <span className="text-[#F5E6D3]/60">Preferred</span>
                <span>{String(booking.preferredDate)} {booking.preferredTime ? `at ${String(booking.preferredTime)}` : ""}</span>
              </div>
            )}
            {Boolean(booking.meetingDateTime) && (
              <div className="flex justify-between">
                <span className="text-[#F5E6D3]/60">Scheduled</span>
                <span>{new Date(String(booking.meetingDateTime)).toLocaleString("en-IN")}</span>
              </div>
            )}
            {Boolean(booking.meetingLink) && (
              <div>
                <span className="text-[#F5E6D3]/60 block mb-1">Meeting Link</span>
                <a href={String(booking.meetingLink)} target="_blank" rel="noopener noreferrer" className="text-[#BD9958] break-all hover:underline">
                  {String(booking.meetingLink)}
                </a>
              </div>
            )}
            {booking.coupon && typeof booking.coupon === "object" && booking.coupon !== null && "code" in booking.coupon ? (
              <div className="mt-4 p-4 bg-[#BD9958]/20 rounded-lg">
                <p className="text-[#BD9958] font-medium">Your Ritual Package I Coupon</p>
                <p className="text-2xl font-mono mt-1">{(booking.coupon as { code: string }).code}</p>
                <p className="text-xs text-[#F5E6D3]/60 mt-1">
                  Redeemable on Ritual Package I (₹399) only.
                  {Boolean((booking.coupon as { validTill?: string }).validTill) &&
                    ` Valid till ${new Date(String((booking.coupon as { validTill?: string }).validTill)).toLocaleDateString("en-IN")}.`}
                </p>
                <Link href="/ritual-packages" className="inline-block mt-3 text-[#BD9958] hover:underline text-sm">
                  Redeem on Ritual Package I →
                </Link>
              </div>
            ) : status === "COMPLETED" ? (
              <div className="mt-4 p-4 bg-[#BD9958]/10 rounded-lg border border-[#BD9958]/20">
                <p className="text-[#BD9958] font-medium">Unlock a Ritual Package I Coupon</p>
                <p className="text-xs text-[#F5E6D3]/70 mt-1">
                  Purchase Aakaura products from our website with an order total above ₹999 to become
                  eligible. Once we verify your purchase, our team will email you a coupon valid for 3 months.
                </p>
                <Link href="/products" className="inline-block mt-3 text-[#BD9958] hover:underline text-sm">
                  Explore Aakaura products →
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

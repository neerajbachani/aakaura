"use client";
import { use, useEffect, useState } from "react";
import Link from "next/link";
import AdminTabs from "@/components/ui/AdminTabs";
import BookingStatusBadge from "@/components/admin/Bookings/BookingStatusBadge";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";
import {
  useAdminBooking,
  useConfirmBooking,
  useRescheduleBooking,
  useCancelBooking,
  useScheduleSession,
  useIssueCoupon,
  useCouponSettings,
  useCompleteBookingAdmin,
  useNoShowBookingAdmin,
} from "@/hooks/admin/useAdminBookings";
import { useAdminPractitioners } from "@/hooks/admin/useAdminPractitioners";
import { getPractitionerPreferenceLabel } from "@/config/guidance";
import GuidanceIntakeSummary from "@/components/guidance/GuidanceIntakeSummary";

export default function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: booking, isLoading } = useAdminBooking(id);
  const { data: practitionersData } = useAdminPractitioners();
  const confirmBooking = useConfirmBooking();
  const rescheduleBooking = useRescheduleBooking();
  const cancelBooking = useCancelBooking();
  const scheduleSession = useScheduleSession();
  const issueCoupon = useIssueCoupon();
  const completeBookingAdmin = useCompleteBookingAdmin();
  const noShowBookingAdmin = useNoShowBookingAdmin();
  const { data: couponSettings } = useCouponSettings();

  const [form, setForm] = useState({
    practitionerId: "",
    meetingLink: "",
    meetingDate: "",
    meetingTime: "",
  });

  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "PERCENT",
    discountValue: "25",
  });

  useEffect(() => {
    if (couponSettings) {
      setCouponForm((prev) => ({
        ...prev,
        discountType: couponSettings.discountType ?? prev.discountType,
        discountValue:
          couponSettings.discountValue != null
            ? String(couponSettings.discountValue)
            : prev.discountValue,
      }));
    }
  }, [couponSettings]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">Booking not found</p>
      </div>
    );
  }

  const practitioners = practitionersData?.practitioners || [];

  const handleConfirm = () => {
    if (!form.practitionerId || !form.meetingLink || !form.meetingDate || !form.meetingTime) {
      return;
    }
    const meetingDateTime = new Date(`${form.meetingDate}T${form.meetingTime}`).toISOString();
    confirmBooking.mutate({
      bookingId: id,
      practitionerId: form.practitionerId,
      meetingLink: form.meetingLink,
      meetingDateTime,
    });
  };

  const handleReschedule = () => {
    if (!form.meetingDate || !form.meetingTime) return;
    const meetingDateTime = new Date(`${form.meetingDate}T${form.meetingTime}`).toISOString();
    rescheduleBooking.mutate({
      bookingId: id,
      meetingDateTime,
      meetingLink: form.meetingLink || undefined,
      practitionerId: form.practitionerId || undefined,
    });
  };

  const handleIssueCoupon = () => {
    if (!couponForm.code.trim() || !couponForm.discountValue) return;
    issueCoupon.mutate({
      bookingId: id,
      code: couponForm.code.trim().toUpperCase(),
      discountType: couponForm.discountType,
      discountValue: parseFloat(couponForm.discountValue),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <AdminTabs activeTab="bookings" />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
            <BookingStatusBadge status={booking.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Customer</p>
              <p className="font-medium">{booking.user?.name || booking.user?.email}</p>
              <p className="text-gray-600">{booking.user?.email}</p>
              <p className="text-gray-600">{booking.user?.phone}</p>
            </div>
            <div>
              <p className="text-gray-500">Type</p>
              <p className="font-medium">
                {booking.bookingType === "PACKAGE_SESSION" ? "Package Session" : "Guidance Call"}
              </p>
              {booking.packageLabel && <p className="text-gray-600">{booking.packageLabel}</p>}
            </div>
            <div>
              <p className="text-gray-500">Preferred Slot</p>
              <p>{booking.preferredDate || "-"} {booking.preferredTime ? `at ${booking.preferredTime}` : ""}</p>
              <p className="text-gray-500 mt-1">Timezone: {booking.timezone}</p>
            </div>
            <div>
              <p className="text-gray-500">Preferred Practitioner</p>
              <p>{getPractitionerPreferenceLabel(booking.preferredPractitioner)}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment</p>
              <p className="flex flex-wrap items-center gap-2">
                <span>
                  {booking.paymentStatus} · ₹{booking.amount}
                </span>
                {booking.bookingType === "GUIDANCE_CALL" && booking.amount === 0 && (
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Complimentary
                  </span>
                )}
              </p>
            </div>
            {booking.notes && (
              <div className="md:col-span-2">
                <p className="text-gray-500">Notes</p>
                <p>{booking.notes}</p>
              </div>
            )}
            {booking.intakeResponses && (
              <div className="md:col-span-2">
                <GuidanceIntakeSummary intakeResponses={booking.intakeResponses} />
              </div>
            )}
            {booking.meetingDateTime && (
              <div>
                <p className="text-gray-500">Scheduled</p>
                <p>{new Date(booking.meetingDateTime).toLocaleString("en-IN")}</p>
              </div>
            )}
            {booking.meetingLink && (
              <div>
                <p className="text-gray-500">Meeting Link</p>
                <a href={booking.meetingLink} target="_blank" rel="noopener noreferrer" className="text-primaryRed break-all">
                  {booking.meetingLink}
                </a>
              </div>
            )}
          </div>

          {booking.bookingType === "PACKAGE_SESSION" && booking.packageProgress && (
            <div className="rounded-lg bg-primaryBeige/40 border border-primaryBrown/20 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-gray-700">
                Package progress:{" "}
                <span className="font-medium">
                  {booking.packageProgress.completedSessions}/{booking.packageProgress.totalCalls} completed
                </span>
                {" · "}
                {booking.packageProgress.remainingCalls} remaining
              </p>
              <Link
                href={`/admin/packages/${booking.packageProgress.packagePurchaseId}`}
                className="text-primaryRed hover:text-primaryRed/80 text-sm font-medium"
              >
                View full package →
              </Link>
            </div>
          )}

          {(booking.status === "PENDING" || booking.status === "RESCHEDULED") && (
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-lg font-semibold">Confirm Booking</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={form.practitionerId}
                  onChange={(e) => setForm({ ...form, practitionerId: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Practitioner</option>
                  {practitioners.filter((p: { active: boolean }) => p.active).map((p: { id: string; name: string }) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <input
                  type="url"
                  placeholder="Google Meet Link"
                  value={form.meetingLink}
                  onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  type="date"
                  value={form.meetingDate}
                  onChange={(e) => setForm({ ...form, meetingDate: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
                <input
                  type="time"
                  value={form.meetingTime}
                  onChange={(e) => setForm({ ...form, meetingTime: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <button
                onClick={handleConfirm}
                disabled={confirmBooking.isPending}
                className="px-4 py-2 bg-primaryRed text-white rounded-lg hover:bg-primaryRed/90 disabled:opacity-50"
              >
                Confirm Booking
              </button>
            </div>
          )}

          {booking.status === "CONFIRMED" && (
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-lg font-semibold">Reschedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="date" value={form.meetingDate} onChange={(e) => setForm({ ...form, meetingDate: e.target.value })} className="border rounded-lg px-3 py-2" />
                <input type="time" value={form.meetingTime} onChange={(e) => setForm({ ...form, meetingTime: e.target.value })} className="border rounded-lg px-3 py-2" />
              </div>
              <button onClick={handleReschedule} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Reschedule</button>
            </div>
          )}

          {(booking.status === "CONFIRMED" || booking.status === "RESCHEDULED") && (
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-lg font-semibold">Session Outcome</h2>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => completeBookingAdmin.mutate(id)}
                  disabled={completeBookingAdmin.isPending}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Mark Completed
                </button>
                <button
                  onClick={() => noShowBookingAdmin.mutate(id)}
                  disabled={noShowBookingAdmin.isPending}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Mark No Show
                </button>
              </div>
            </div>
          )}

          {booking.status !== "CANCELLED" && booking.status !== "COMPLETED" && (
            <button
              onClick={() => cancelBooking.mutate(id)}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              Cancel Booking
            </button>
          )}

          {booking.status === "COMPLETED" && booking.bookingType === "GUIDANCE_CALL" && (
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-lg font-semibold">Coupon Management</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Call Completed</p>
                  <p>{booking.completedAt ? new Date(booking.completedAt).toLocaleString("en-IN") : "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Product Order</p>
                  {booking.qualifyingOrder ? (
                    <p>
                      {booking.qualifyingOrder.orderNumber} · ₹{booking.qualifyingOrder.total}
                      {booking.qualifyingOrder.orderDate
                        ? ` (${new Date(booking.qualifyingOrder.orderDate).toLocaleDateString("en-IN")})`
                        : ""}
                    </p>
                  ) : (
                    <p className="text-gray-600">No qualifying order (above ₹999) yet</p>
                  )}
                </div>
              </div>

              {booking.coupon ? (
                <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm">
                  <p className="text-green-800 font-medium">Coupon issued</p>
                  <p className="font-mono text-lg">{booking.coupon.code}</p>
                  <p className="text-green-700">
                    {booking.coupon.discountType === "PERCENT"
                      ? `${booking.coupon.discountValue}% off`
                      : `₹${booking.coupon.discountValue} off`}{" "}
                    · Valid till {new Date(booking.coupon.validTill).toLocaleDateString("en-IN")}
                    {" "}· {booking.coupon.used ? "Used" : "Unused"}
                  </p>
                </div>
              ) : booking.couponEligible ? (
                <div className="space-y-4">
                  <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
                    This customer is eligible for a Package I coupon. Enter a code below to issue and email it.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Coupon code (e.g. AAKAURA10)"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                      className="border border-gray-300 rounded-lg px-3 py-2 font-mono uppercase"
                    />
                    <select
                      value={couponForm.discountType}
                      onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="PERCENT">Percent Off</option>
                      <option value="FIXED">Fixed Amount Off</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Discount value"
                      value={couponForm.discountValue}
                      onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                      className="border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Coupon applies only to Ritual Package I and is valid for 90 days from issue.
                  </p>
                  <button
                    onClick={handleIssueCoupon}
                    disabled={issueCoupon.isPending || !couponForm.code.trim()}
                    className="px-4 py-2 bg-primaryRed text-white rounded-lg hover:bg-primaryRed/90 disabled:opacity-50"
                  >
                    Issue Coupon & Email Customer
                  </button>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-sm text-gray-600">
                  Awaiting product order. The customer becomes eligible once they place a website order above ₹999.
                </div>
              )}
            </div>
          )}

          {booking.packagePurchase && booking.packagePurchase.remainingCalls > 0 && (
            <div className="border-t pt-6">
              <p className="text-sm text-gray-600 mb-2">
                Package has {booking.packagePurchase.remainingCalls} remaining call(s)
              </p>
              <button
                onClick={() =>
                  scheduleSession.mutate({ packagePurchaseId: booking.packagePurchase.id })
                }
                className="px-4 py-2 bg-primaryBrown text-white rounded-lg"
              >
                Schedule Next Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

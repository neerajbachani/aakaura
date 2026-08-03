"use client";
import { use, useState } from "react";
import Link from "next/link";
import AdminTabs from "@/components/ui/AdminTabs";
import BookingStatusBadge from "@/components/admin/Bookings/BookingStatusBadge";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";
import { useAdminPackage, useSchedulePackageSession } from "@/hooks/admin/useAdminPackages";
import { useAdminPractitioners } from "@/hooks/admin/useAdminPractitioners";

interface Session {
  id: string;
  status: string;
  practitionerName: string | null;
  meetingDateTime?: string;
  meetingLink?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  completedAt?: string;
  createdAt: string;
}

export default function AdminPackageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: pkg, isLoading } = useAdminPackage(id);
  const { data: practitionersData } = useAdminPractitioners();
  const scheduleSession = useSchedulePackageSession();

  const [form, setForm] = useState({
    practitionerId: "",
    meetingLink: "",
    meetingDate: "",
    meetingTime: "",
    notes: "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <p className="text-red-600">Package not found</p>
      </div>
    );
  }

  const practitioners = practitionersData?.practitioners || [];
  const canSchedule = pkg.status === "ACTIVE" && pkg.remainingCalls > 0;

  const handleSchedule = () => {
    const confirmNow = form.practitionerId && form.meetingLink && form.meetingDate && form.meetingTime;
    const meetingDateTime = confirmNow
      ? new Date(`${form.meetingDate}T${form.meetingTime}`).toISOString()
      : undefined;

    scheduleSession.mutate(
      {
        packagePurchaseId: id,
        notes: form.notes || undefined,
        practitionerId: form.practitionerId || undefined,
        meetingLink: form.meetingLink || undefined,
        meetingDateTime,
      },
      {
        onSuccess: () =>
          setForm({ practitionerId: "", meetingLink: "", meetingDate: "", meetingTime: "", notes: "" }),
      },
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <AdminTabs activeTab="packages" />
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{pkg.packageLabel}</h1>
              <p className="text-gray-600">{pkg.customer?.name || pkg.customer?.email}</p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pkg.status === "ACTIVE"
                  ? "bg-blue-100 text-blue-800"
                  : pkg.status === "COMPLETED"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {pkg.status}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Progress</p>
              <p className="font-medium">{pkg.completedSessions} / {pkg.totalCalls} completed</p>
            </div>
            <div>
              <p className="text-gray-500">Remaining Calls</p>
              <p className="font-medium">{pkg.remainingCalls}</p>
            </div>
            <div>
              <p className="text-gray-500">Scheduled</p>
              <p className="font-medium">{pkg.scheduledSessions}</p>
            </div>
            <div>
              <p className="text-gray-500">Payment</p>
              <p className="font-medium">{pkg.paymentStatus} · ₹{pkg.amount}</p>
            </div>
            <div>
              <p className="text-gray-500">Customer Email</p>
              <p className="font-medium break-all">{pkg.customer?.email}</p>
            </div>
            {pkg.customer?.phone && (
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{pkg.customer.phone}</p>
              </div>
            )}
            <div>
              <p className="text-gray-500">Expiry</p>
              <p className="font-medium">
                {pkg.expiryDate ? new Date(pkg.expiryDate).toLocaleDateString("en-IN") : "No expiry"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Purchased</p>
              <p className="font-medium">{new Date(pkg.createdAt).toLocaleDateString("en-IN")}</p>
            </div>
          </div>

          {/* Sessions */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold mb-3">Sessions</h2>
            {pkg.sessions.length === 0 ? (
              <p className="text-gray-500 text-sm">No sessions scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {pkg.sessions.map((session: Session, index: number) => (
                  <div
                    key={session.id}
                    className="flex flex-wrap items-center justify-between gap-2 border border-gray-200 rounded-lg px-4 py-3"
                  >
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">
                        Call {index + 1}
                        {session.practitionerName ? ` · ${session.practitionerName}` : ""}
                      </p>
                      <p className="text-gray-600">
                        {session.meetingDateTime
                          ? new Date(session.meetingDateTime).toLocaleString("en-IN")
                          : session.preferredDate
                          ? `Preferred: ${session.preferredDate} ${session.preferredTime || ""}`
                          : "Not scheduled"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <BookingStatusBadge status={session.status} />
                      <Link
                        href={`/admin/bookings/${session.id}`}
                        className="text-primaryRed hover:text-primaryRed/80 text-sm"
                      >
                        Manage
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Schedule new session */}
          {canSchedule && (
            <div className="border-t pt-6 space-y-4">
              <h2 className="text-lg font-semibold">Schedule Session</h2>
              <p className="text-sm text-gray-600">
                Fill practitioner, meeting link, date and time to confirm immediately, or leave them
                blank to create a pending session you can confirm later.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                  value={form.practitionerId}
                  onChange={(e) => setForm({ ...form, practitionerId: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Practitioner</option>
                  {practitioners
                    .filter((p: { active: boolean }) => p.active)
                    .map((p: { id: string; name: string }) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
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
                <input
                  type="text"
                  placeholder="Notes (optional)"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 md:col-span-2"
                />
              </div>
              <button
                onClick={handleSchedule}
                disabled={scheduleSession.isPending}
                className="px-4 py-2 bg-primaryRed text-white rounded-lg hover:bg-primaryRed/90 disabled:opacity-50"
              >
                {scheduleSession.isPending ? "Scheduling..." : "Schedule Session"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

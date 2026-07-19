"use client";
import {
  usePractitionerBookings,
  useCompleteBooking,
  useNoShowBooking,
  useRescheduleBookingPractitioner,
} from "@/hooks/usePractitionerBookings";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";

function BookingSection({
  title,
  filter,
}: {
  title: string;
  filter: "today" | "tomorrow" | "upcoming";
}) {
  const { data, isLoading } = usePractitionerBookings(filter);
  const completeBooking = useCompleteBooking();
  const noShowBooking = useNoShowBooking();
  const rescheduleBooking = useRescheduleBookingPractitioner();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const bookings = data?.bookings || [];

  return (
    <section className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-sm">No calls scheduled</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking: {
            id: string;
            customerName: string;
            customerEmail: string;
            customerPhone?: string;
            notes?: string;
            packageLabel: string;
            meetingLink?: string;
            meetingDateTime?: string;
            duration: number;
          }) => (
            <div key={booking.id} className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{booking.customerName}</p>
                  <p className="text-sm text-gray-600">{booking.customerEmail}</p>
                  {booking.customerPhone && <p className="text-sm text-gray-600">{booking.customerPhone}</p>}
                </div>
                <span className="text-xs bg-primaryBeige text-primaryBrown px-2 py-1 rounded-full">
                  {booking.packageLabel}
                </span>
              </div>
              {booking.meetingDateTime && (
                <p className="text-sm">
                  {new Date(booking.meetingDateTime).toLocaleString("en-IN", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                  {" "}({booking.duration} min)
                </p>
              )}
              {booking.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">Notes: {booking.notes}</p>
              )}
              {booking.meetingLink && (
                <a
                  href={booking.meetingLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-primaryRed hover:underline"
                >
                  Join Google Meet
                </a>
              )}
              <p className="text-xs text-gray-400 italic">
                Phone numbers must NOT be exchanged during the call.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => completeBooking.mutate(booking.id)}
                  disabled={completeBooking.isPending}
                  className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg"
                >
                  Completed
                </button>
                <button
                  onClick={() => rescheduleBooking.mutate(booking.id)}
                  className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => noShowBooking.mutate(booking.id)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg"
                >
                  No Show
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default function PractitionerDashboard() {
  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Schedule</h1>
      <BookingSection title="Today's Calls" filter="today" />
      <BookingSection title="Tomorrow" filter="tomorrow" />
      <BookingSection title="Upcoming Calls" filter="upcoming" />
    </div>
  );
}

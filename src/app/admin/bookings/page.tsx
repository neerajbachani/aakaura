import AdminTabs from "@/components/ui/AdminTabs";
import BookingsTable from "@/components/admin/Bookings/BookingsTable";

export default function AdminBookingsPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="bookings" />
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Guidance Bookings</h1>
          <p className="text-gray-600 mt-1">Manage guidance calls and ritual support sessions</p>
        </div>
        <BookingsTable />
      </div>
    </div>
  );
}

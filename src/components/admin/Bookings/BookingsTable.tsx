"use client";
import { useState } from "react";
import Link from "next/link";
import { useAdminBookings } from "@/hooks/admin/useAdminBookings";
import BookingStatusBadge from "./BookingStatusBadge";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { FaEye, FaSearch } from "react-icons/fa";
import { getPractitionerPreferenceLabel } from "@/config/guidance";

const STATUS_TABS = ["all", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED", "RESCHEDULED"];
const TYPE_TABS: { value: string; label: string }[] = [
  { value: "all", label: "All Types" },
  { value: "GUIDANCE_CALL", label: "Guidance Call" },
  { value: "PACKAGE_SESSION", label: "Package Session" },
];

const BOOKING_TYPE_LABELS: Record<string, string> = {
  GUIDANCE_CALL: "Guidance Call",
  PACKAGE_SESSION: "Package Session",
};

function CouponBadge({
  booking,
}: {
  booking: { status: string; bookingType: string; couponEligible?: boolean; couponIssued?: boolean; couponCode?: string | null };
}) {
  if (booking.bookingType !== "GUIDANCE_CALL" || booking.status !== "COMPLETED") {
    return <span className="text-gray-400 text-sm">-</span>;
  }
  if (booking.couponIssued) {
    return (
      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Coupon issued
      </span>
    );
  }
  if (booking.couponEligible) {
    return (
      <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
        Eligible for coupon
      </span>
    );
  }
  return (
    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
      Awaiting product order
    </span>
  );
}

export default function BookingsTable() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "all",
    bookingType: "all",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const { data, isLoading, error } = useAdminBookings(filters);

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : (value as number),
    }));
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-red-600">
        Failed to load bookings
      </div>
    );
  }

  const { bookings, pagination } = data!;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200 space-y-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange("status", tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.status === tab
                  ? "bg-primaryRed text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab === "all" ? "All" : tab.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => handleFilterChange("bookingType", tab.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.bookingType === tab.value
                  ? "bg-primaryBrown text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primaryRed focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preferred Slot</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preferred Practitioner</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booked</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((booking: {
              id: string;
              customerName: string;
              customerEmail: string;
              preferredDate?: string;
              preferredTime?: string;
              preferredPractitioner?: string | null;
              status: string;
              bookingType: string;
              paymentStatus: string;
              amount: number;
              couponEligible?: boolean;
              couponIssued?: boolean;
              couponCode?: string | null;
              packageLabel?: string | null;
              createdAt: string;
            }) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                  <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <div>{BOOKING_TYPE_LABELS[booking.bookingType] || booking.bookingType}</div>
                  {booking.packageLabel && (
                    <div className="text-xs text-gray-500">{booking.packageLabel}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.preferredDate || "-"}
                  {booking.preferredTime ? ` at ${booking.preferredTime}` : ""}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {booking.preferredPractitioner
                    ? getPractitionerPreferenceLabel(booking.preferredPractitioner)
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  <BookingStatusBadge status={booking.status} />
                </td>
                <td className="px-6 py-4">
                  <CouponBadge booking={booking} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <div>{booking.paymentStatus}</div>
                  {booking.bookingType === "GUIDANCE_CALL" && booking.amount === 0 && (
                    <span className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      Complimentary
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {booking.amount === 0 ? "₹0" : formatCurrency(booking.amount)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(booking.createdAt)}</td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="inline-flex items-center gap-1 text-primaryRed hover:text-primaryRed/80 text-sm"
                  >
                    <FaEye /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalCount} total)
          </p>
          <div className="flex gap-2">
            <button
              disabled={!pagination.hasPrev}
              onClick={() => handleFilterChange("page", filters.page - 1)}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={!pagination.hasNext}
              onClick={() => handleFilterChange("page", filters.page + 1)}
              className="px-3 py-1 border rounded-lg text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

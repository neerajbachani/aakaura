"use client";
import { useState } from "react";
import Link from "next/link";
import { useAdminPackages } from "@/hooks/admin/useAdminPackages";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { FaEye, FaSearch } from "react-icons/fa";

const STATUS_TABS = ["all", "ACTIVE", "COMPLETED", "EXPIRED", "CANCELLED"];
const TYPE_TABS = ["all", "PACKAGE_I", "PACKAGE_II", "PACKAGE_III"];

const packageStatusStyles: Record<string, string> = {
  ACTIVE: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
  EXPIRED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-red-100 text-red-800",
};

interface PackageRow {
  id: string;
  customerName: string;
  customerEmail: string;
  packageType: string;
  packageLabel: string;
  status: string;
  amount: number;
  expiryDate?: string;
  remainingCalls: number;
  totalCalls: number;
  completedSessions: number;
  scheduledSessions: number;
  createdAt: string;
}

export default function PackagesTable() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: "all",
    packageType: "all",
    search: "",
  });

  const { data, isLoading, error } = useAdminPackages(filters);

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
        Failed to load packages
      </div>
    );
  }

  const { packages, pagination } = data!;

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
              {tab === "all" ? "All Status" : tab}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {TYPE_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => handleFilterChange("packageType", tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filters.packageType === tab
                  ? "bg-primaryBrown text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab === "all" ? "All Packages" : tab.replace("_", " ")}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {packages.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  No packages found
                </td>
              </tr>
            ) : (
              packages.map((pkg: PackageRow) => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{pkg.customerName}</div>
                    <div className="text-sm text-gray-500">{pkg.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{pkg.packageLabel}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-medium text-gray-900">
                      {pkg.completedSessions}/{pkg.totalCalls}
                    </span>{" "}
                    <span className="text-gray-500">done</span>
                    {pkg.scheduledSessions > 0 && (
                      <div className="text-xs text-gray-500">{pkg.scheduledSessions} scheduled</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        packageStatusStyles[pkg.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {pkg.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {pkg.expiryDate ? formatDate(pkg.expiryDate) : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm">{formatCurrency(pkg.amount)}</td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/packages/${pkg.id}`}
                      className="inline-flex items-center gap-1 text-primaryRed hover:text-primaryRed/80 text-sm"
                    >
                      <FaEye /> Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
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

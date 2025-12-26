"use client";

import { useState } from "react";
import { useAdminWaitlist } from "@/hooks/admin/useAdminWaitlist";
import AdminTabs from "@/components/ui/AdminTabs";
import { motion } from "framer-motion";

export default function AdminWaitlistPage() {
  const { data, isLoading, error } = useAdminWaitlist();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="waitlist" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-4 text-gray-600">Loading waitlist data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="waitlist" />
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-red-600">Error loading waitlist data</p>
              <p className="text-sm text-gray-500 mt-2">{(error as Error).message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { groupedByProduct = [], totalItems = 0 } = data || {};

  // Filter products based on journey
  const filteredProducts = groupedByProduct.filter((item) => {
    if (filter === "all") return true;
    return item.journeySlug === filter;
  });

  // Further filter by search
  const searchedProducts = filteredProducts.filter((item) => {
    if (!search) return true;
    return (
      item.productName.toLowerCase().includes(search.toLowerCase()) ||
      item.journeySlug.toLowerCase().includes(search.toLowerCase()) ||
      item.users.some((user) => 
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.name?.toLowerCase().includes(search.toLowerCase())
      )
    );
  });

  // Get unique journeys for filter
  const journeys = Array.from(new Set(groupedByProduct.map((item) => item.journeySlug)));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="waitlist" />
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Waitlist Management</h1>
          <p className="text-gray-600">
            View and manage user waitlist entries across all journeys
          </p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 font-medium">
              Total Waitlist Entries: <span className="font-bold">{totalItems}</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Journey Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Journey
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Journeys</option>
                {journeys.map((journey) => (
                  <option key={journey} value={journey}>
                    {journey.charAt(0).toUpperCase() + journey.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by product, user, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Waitlist Items */}
        <div className="space-y-6">
          {searchedProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500">No waitlist items found</p>
            </div>
          ) : (
            searchedProducts.map((item, index) => (
              <motion.div
                key={`${item.journeySlug}-${item.productId}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                {/* Product Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{item.productName}</h3>
                      <div className="flex gap-4 text-sm">
                        <span className="bg-white/20 px-3 py-1 rounded-full">
                          {item.journeySlug.charAt(0).toUpperCase() + item.journeySlug.slice(1)} Journey
                        </span>
                        <span className="bg-white/20 px-3 py-1 rounded-full">
                          {item.clientType === "soul-luxury" ? "Soul Luxury" : "Energy Curious"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{item.totalCount}</div>
                      <div className="text-sm opacity-90">Interested Users</div>
                    </div>
                  </div>
                </div>

                {/* Users List */}
                <div className="p-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    Waitlist Users
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phone
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Added On
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {item.users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name || "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">{user.email}</div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {user.phone || "N/A"}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                {new Date(user.addedAt).toLocaleDateString()}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

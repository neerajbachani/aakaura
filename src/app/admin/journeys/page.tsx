"use client";

import { useAdminJourneys } from "@/hooks/admin/useAdminJourney";
import AdminTabs from "@/components/ui/AdminTabs";
import LoadingSpinner from "@/components/admin/Shared/LoadingSpinner";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";

export default function AdminJourneysPage() {
  const { data, isLoading, error } = useAdminJourneys();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="journeys" />
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <AdminTabs activeTab="journeys" />
          <div className="text-center py-12">
            <p className="text-red-600">Failed to load journeys</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <AdminTabs activeTab="journeys" />

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Journey Management</h1>
            <p className="text-gray-600 mt-2">Manage content for Chakra Journeys.</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadowoverflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tone
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.journeys.map((journey) => (
                  <tr key={journey.slug} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div 
                          className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-xl"
                          style={{ backgroundColor: journey.colors.light, color: journey.colors.primary }}
                        >
                          {journey.symbol}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{journey.name}</div>
                          <div className="text-sm text-gray-500">{journey.sanskritName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {journey.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span 
                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        style={{ backgroundColor: journey.colors.light, color: journey.colors.dark }}
                      >
                        {journey.tone}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link 
                        href={`/admin/journeys/${journey.slug}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

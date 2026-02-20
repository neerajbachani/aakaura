import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { FaEdit, FaLayerGroup } from "react-icons/fa";
import { BiCalendarAlt } from "react-icons/bi";
import { Combo } from "@/types/Combo";
import AdminTabs from "@/components/ui/AdminTabs";
import { getAllCombos } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function CombosAdmin() {
  const combos = await getAllCombos();
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondaryBeige to-secondaryBeige/50 p-3 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-8 gap-6 md:gap-0">
          <div>
            <h1 className="text-4xl font-bold text-primaryBrown mb-2">
              Combo Management
            </h1>
            <p className="text-primaryBrown/60">
              Manage your product combos and sets
            </p>
          </div>

          <Link
            href="/admin/combos/new"
            className="inline-flex items-center gap-2 bg-primaryRed text-white px-6 py-3 rounded-lg hover:bg-primaryRed/90 transition-all duration-300 font-medium shadow-sm hover:shadow-md active:scale-[0.98]"
          >
            <FiPlus className="text-xl" />
            New Combo
          </Link>
        </div>

        {/* Admin Tabs - assuming logic to handle new tab or just hardcode for now */}
        {/* We might need to update AdminTabs component to include 'combos' tab or just render it differently */}
        <AdminTabs activeTab="combos" />

        {/* Content Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mt-6">
          {!combos || combos.length === 0 ? (
            <div className="p-8 text-center text-primaryBrown/70">
              <p className="text-lg">No combos found.</p>
              <p className="mt-2">Create your first combo to get started!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] sm:min-w-full">
                <thead>
                  <tr className="border-b border-primaryBeige/30">
                    <th className="px-4 sm:px-6 py-4 text-left text-primaryBrown font-medium">
                      Combo
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-primaryBrown font-medium">
                      Tier
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-primaryBrown font-medium">
                      Chakras
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-primaryBrown font-medium">
                      Items
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-primaryBrown font-medium">
                      Created
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-right text-primaryBrown font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {combos.map((combo: Combo) => (
                    <tr
                      key={combo.id}
                      className="border-b border-primaryBeige/10 hover:bg-primaryBeige/5 transition-colors text-sm sm:text-base"
                    >
                      {/* Combo Column */}
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            {combo.images && combo.images.length > 0 ? (
                              <Image
                                src={combo.images[0]}
                                alt={combo.name}
                                fill
                                className="object-cover hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-primaryBrown/20">
                                <FaLayerGroup size={24} />
                              </div>
                            )}
                          </div>
                          <div className="max-w-[150px] sm:max-w-none">
                            <Link
                              href={`/admin/combos/${combo.id}`}
                              className="text-primaryBrown font-medium hover:text-primaryRed transition-colors line-clamp-2"
                            >
                              {combo.name}
                            </Link>
                            <p className="text-xs text-primaryBrown/60 mt-1 line-clamp-1">
                              {combo.tagline}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Tier Column */}
                      <td className="px-4 sm:px-6 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold
                          ${
                            combo.tier === "PREMIUM"
                              ? "bg-purple-100 text-purple-800"
                              : combo.tier === "CORE"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          {combo.tier}
                        </span>
                      </td>

                      {/* Chakras Column */}
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex flex-wrap gap-1">
                          {combo.chakras.map((chakra) => (
                            <span
                              key={chakra}
                              className="text-xs bg-primaryAntigravity/10 px-2 py-0.5 rounded capitalize"
                            >
                              {chakra}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Items Column */}
                      <td className="px-4 sm:px-6 py-3">
                        <span className="text-sm font-medium">
                          {combo.products?.length || 0} Items
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-1 sm:gap-2 text-primaryBrown/70">
                          <BiCalendarAlt className="text-base sm:text-lg" />
                          <span className="text-xs sm:text-sm">
                            {new Date(combo.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/combos/${combo.id}`}
                            className="p-2 text-primaryBrown/70 hover:text-primaryRed hover:bg-primaryRed/10 rounded-lg transition-colors"
                          >
                            <FaEdit className="text-base sm:text-lg" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

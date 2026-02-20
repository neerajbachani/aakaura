"use client";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  FaNewspaper,
  FaBox,
  FaHome,
  FaShoppingBag,
  FaUsers,
  FaMapSigns,
  FaClipboardList,
  FaCog,
  FaLayerGroup,
} from "react-icons/fa";

interface AdminTabsProps {
  activeTab:
    | "dashboard"
    | "orders"
    | "users"
    | "products"
    | "blogs"
    | "analytics"
    | "journeys"
    | "waitlist"
    | "products-settings"
    | "combos"
    | "quiz";
}

export default function AdminTabs({ activeTab }: AdminTabsProps) {
  const tabs = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: FaHome,
      active: activeTab === "dashboard",
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: FaShoppingBag,
      active: activeTab === "orders",
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: FaUsers,
      active: activeTab === "users",
    },
    // {
    //   name: "Products",
    //   href: "/admin/products",
    //   icon: FaBox,
    //   active: activeTab === "products",
    // },
    {
      name: "Blogs",
      href: "/admin/blogs",
      icon: FaNewspaper,
      active: activeTab === "blogs",
    },
    // {
    //   name: "Journeys",
    //   href: "/admin/journeys",
    //   icon: FaMapSigns,
    //   active: activeTab === "journeys",
    // },
    {
      name: "Waitlist",
      href: "/admin/waitlist",
      icon: FaClipboardList,
      active: activeTab === "waitlist",
    },
    {
      name: "Product Settings",
      href: "/admin/products-settings",
      icon: FaCog,
      active: activeTab === "products-settings",
    },
    {
      name: "Combos",
      href: "/admin/combos",
      icon: FaLayerGroup,
      active: activeTab === "combos",
    },
    {
      name: "Quiz",
      href: "/admin/quiz",
      icon: QuestionMarkCircleIcon,
      active: activeTab === "quiz",
    },
    // {
    //   name: "Analytics",
    //   href: "/admin/analytics",
    //   icon: FaChartBar,
    //   active: activeTab === "analytics",
    // },
  ];

  return (
    <div className="mb-8 flex justify-end">
      <div className="flex space-x-1 bg-white w-fit rounded-lg p-1 shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                tab.active
                  ? "bg-primaryRed text-white shadow-sm"
                  : "text-primaryBrown hover:text-primaryRed hover:bg-primaryRed/10"
              }`}
            >
              <Icon className="text-base" />
              {tab.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

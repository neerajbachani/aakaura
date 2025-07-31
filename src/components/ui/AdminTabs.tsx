"use client";
import Link from "next/link";
import { FaNewspaper, FaBox } from "react-icons/fa";

interface AdminTabsProps {
  activeTab: "blogs" | "products";
}

export default function AdminTabs({ activeTab }: AdminTabsProps) {
  const tabs = [
    {
      name: "Blogs",
      href: "/admin",
      icon: FaNewspaper,
      active: activeTab === "blogs",
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: FaBox,
      active: activeTab === "products",
    },
  ];

  return (
    <div className="mb-8 flex justify-end">
      <div className="flex space-x-1 bg-white w-fit rounded-lg p-1 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
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

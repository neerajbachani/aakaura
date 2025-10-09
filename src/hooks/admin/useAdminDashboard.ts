"use client";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  stats: {
    revenue: { current: number; change: number };
    orders: { current: number; change: number };
    users: { current: number; change: number };
    products: { total: number; inStock: number; outOfStock: number };
  };
  pendingOrders: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    status: string;
    itemsCount: number;
    createdAt: string;
  }>;
}

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/admin/dashboard", {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });
}
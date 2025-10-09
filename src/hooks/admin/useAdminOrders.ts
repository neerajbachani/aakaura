"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface OrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  itemsCount: number;
  createdAt: string;
  shippingAddress: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function useOrders(filters: OrderFilters = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery<OrdersResponse>({
    queryKey: ["admin", "orders", filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/orders?${queryParams}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      return response.json();
    },
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["admin", "orders", orderId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch order");
      }
      
      return response.json();
    },
    enabled: !!orderId,
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, status, trackingNumber, adminNotes, paymentStatus }: {
      orderId: string;
      status?: string;
      trackingNumber?: string;
      adminNotes?: string;
      paymentStatus?: string;
    }) => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status, trackingNumber, adminNotes, paymentStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      // Update the specific order cache
      queryClient.invalidateQueries({ queryKey: ["admin", "orders", variables.orderId] });
      // Update dashboard stats
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      
      toast.success("Order updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update order");
      console.error("Update order error:", error);
    },
  });
}
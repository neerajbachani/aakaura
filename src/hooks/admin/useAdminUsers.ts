"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface UserFilters {
  page?: number;
  limit?: number;
  status?: string;
  role?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  totalOrders: number;
  totalSpent: number;
  lastLoginAt?: string;
  createdAt: string;
  _count: {
    orders: number;
  };
}

interface UsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function useUsers(filters: UserFilters = {}) {
  const queryParams = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery<UsersResponse>({
    queryKey: ["admin", "users", filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users?${queryParams}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      
      return response.json();
    },
  });
}

export function useUser(userId: string) {
  return useQuery({
    queryKey: ["admin", "users", userId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        credentials: "include"
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      
      return response.json();
    },
    enabled: !!userId,
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ isActive }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      // Update the specific user cache
      queryClient.invalidateQueries({ queryKey: ["admin", "users", variables.userId] });
      
      toast.success(`User ${variables.isActive ? "activated" : "deactivated"} successfully`);
    },
    onError: (error) => {
      toast.error("Failed to update user status");
      console.error("Update user status error:", error);
    },
  });
}
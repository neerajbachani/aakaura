"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface PackageFilters {
  page?: number;
  limit?: number;
  status?: string;
  packageType?: string;
  search?: string;
}

export function useAdminPackages(filters: PackageFilters = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery({
    queryKey: ["admin", "packages", filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/packages?${queryParams}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch packages");
      return response.json();
    },
  });
}

export function useAdminPackage(packageId: string) {
  return useQuery({
    queryKey: ["admin", "packages", packageId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/packages/${packageId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch package");
      return response.json();
    },
    enabled: !!packageId,
  });
}

export function useSchedulePackageSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      packagePurchaseId: string;
      preferredDate?: string;
      preferredTime?: string;
      notes?: string;
      practitionerId?: string;
      meetingLink?: string;
      meetingDateTime?: string;
    }) => {
      const response = await fetch("/api/admin/bookings/schedule-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to schedule session");
      }
      return response.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "packages", vars.packagePurchaseId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success("Session scheduled");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

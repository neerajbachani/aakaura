"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

interface BookingFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useAdminBookings(filters: BookingFilters = {}) {
  const queryParams = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  return useQuery({
    queryKey: ["admin", "bookings", filters],
    queryFn: async () => {
      const response = await fetch(`/api/admin/bookings?${queryParams}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return response.json();
    },
  });
}

export function useAdminBooking(bookingId: string) {
  return useQuery({
    queryKey: ["admin", "bookings", bookingId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch booking");
      return response.json();
    },
    enabled: !!bookingId,
  });
}

export function useConfirmBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, ...data }: { bookingId: string; [key: string]: unknown }) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to confirm booking");
      }
      return response.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings", vars.bookingId] });
      toast.success("Booking confirmed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useRescheduleBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, ...data }: { bookingId: string; [key: string]: unknown }) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}/reschedule`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to reschedule");
      return response.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings", vars.bookingId] });
      toast.success("Booking rescheduled");
    },
    onError: () => toast.error("Failed to reschedule"),
  });
}

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to cancel");
      return response.json();
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings", bookingId] });
      toast.success("Booking cancelled");
    },
    onError: () => toast.error("Failed to cancel booking"),
  });
}

export function useScheduleSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { packagePurchaseId: string; preferredDate?: string; preferredTime?: string; notes?: string }) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      toast.success("Session scheduled");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCompleteBookingAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}/complete`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to complete booking");
      }
      return response.json();
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings", bookingId] });
      queryClient.invalidateQueries({ queryKey: ["admin", "packages"] });
      toast.success("Booking marked completed");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useNoShowBookingAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}/no-show`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to mark no-show");
      }
      return response.json();
    },
    onSuccess: (_, bookingId) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings", bookingId] });
      toast.success("Booking marked as no-show");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useIssueCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      bookingId,
      ...data
    }: {
      bookingId: string;
      code: string;
      discountType: string;
      discountValue: number;
    }) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}/issue-coupon`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to issue coupon");
      }
      return response.json();
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "bookings", vars.bookingId] });
      toast.success("Coupon issued and emailed to the customer");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useCouponSettings() {
  return useQuery({
    queryKey: ["admin", "coupon-settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings/coupon", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });
}

export function useUpdateCouponSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { discountType: string; discountValue: number }) => {
      const response = await fetch("/api/admin/settings/coupon", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update settings");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "coupon-settings"] });
      toast.success("Coupon settings updated");
    },
    onError: () => toast.error("Failed to update settings"),
  });
}

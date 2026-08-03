"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function usePractitionerBookings(filter: "today" | "tomorrow" | "upcoming") {
  return useQuery({
    queryKey: ["practitioner", "bookings", filter],
    queryFn: async () => {
      const response = await fetch(`/api/practitioner/bookings?filter=${filter}`, {
        credentials: "include",
      });
      if (response.status === 401) throw new Error("Unauthorized");
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return response.json();
    },
  });
}

export function useCompleteBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/practitioner/bookings/${bookingId}/complete`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to complete booking");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practitioner", "bookings"] });
      toast.success("Call marked as completed");
    },
    onError: () => toast.error("Failed to complete booking"),
  });
}

export function useNoShowBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/practitioner/bookings/${bookingId}/no-show`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to mark no-show");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practitioner", "bookings"] });
      toast.success("Marked as no-show");
    },
    onError: () => toast.error("Failed to update booking"),
  });
}

export function useRescheduleBookingPractitioner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await fetch(`/api/practitioner/bookings/${bookingId}/reschedule`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to request reschedule");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practitioner", "bookings"] });
      toast.success("Reschedule requested. Admin will confirm new slot");
    },
    onError: () => toast.error("Failed to request reschedule"),
  });
}

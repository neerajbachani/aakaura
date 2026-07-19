"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export function useAdminPractitioners() {
  return useQuery({
    queryKey: ["admin", "practitioners"],
    queryFn: async () => {
      const response = await fetch("/api/admin/practitioners", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch practitioners");
      return response.json();
    },
  });
}

export function useCreatePractitioner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone?: string;
      specialization?: string;
      password: string;
    }) => {
      const response = await fetch("/api/admin/practitioners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create practitioner");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practitioners"] });
      toast.success("Practitioner created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdatePractitioner() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string; [key: string]: unknown }) => {
      const response = await fetch(`/api/admin/practitioners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update practitioner");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "practitioners"] });
      toast.success("Practitioner updated");
    },
    onError: () => toast.error("Failed to update practitioner"),
  });
}

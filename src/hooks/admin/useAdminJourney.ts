"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChakraData } from "@/data/chakras";

interface JourneysResponse {
    journeys: ChakraData[];
    count: number;
}

export function useAdminJourneys() {
    return useQuery<JourneysResponse>({
        queryKey: ["admin", "journeys"],
        queryFn: async () => {
            const response = await fetch("/api/admin/journeys", {
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch journeys");
            }

            return response.json();
        },
    });
}

export function useAdminJourney(slug: string) {
    return useQuery<ChakraData>({
        queryKey: ["admin", "journeys", slug],
        queryFn: async () => {
            // Since we don't have a specific ID-based endpoint yet, we'll fetch all and filter
            // In a real app, this would be /api/admin/journeys/${slug}
            const response = await fetch("/api/admin/journeys", {
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error("Failed to fetch journey");
            }

            const data: JourneysResponse = await response.json();
            const journey = data.journeys.find(j => j.slug === slug);

            if (!journey) {
                throw new Error("Journey not found");
            }

            return journey;
        },
        enabled: !!slug,
    });
}

export function useUpdateJourney() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ slug, data }: { slug: string; data: Partial<ChakraData> }) => {
            const response = await fetch(`/api/admin/journeys/${slug}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error("Failed to update journey");
            }

            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "journeys"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "journeys", variables.slug] });
        },
    });
}

// Product CRUD Hooks
export function useAddJourneyProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            slug,
            clientType,
            product
        }: {
            slug: string;
            clientType: 'soul-luxury' | 'energy-curious';
            product: any;
        }) => {
            const response = await fetch(`/api/admin/journeys/${slug}/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ clientType, product }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to add product");
            }

            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "journeys"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "journeys", variables.slug] });
        },
    });
}

export function useUpdateJourneyProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            slug,
            clientType,
            productId,
            product
        }: {
            slug: string;
            clientType: 'soul-luxury' | 'energy-curious';
            productId: string;
            product: any;
        }) => {
            const response = await fetch(`/api/admin/journeys/${slug}/products`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ clientType, productId, product }),
                
            });
            console.log(response)

            if (!response.ok) {
                const error = await response.json();
                console.log(error);
                throw new Error(error.error || "Failed to update product");
            }

            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "journeys"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "journeys", variables.slug] });
        },
    });
}

export function useDeleteJourneyProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            slug,
            clientType,
            productId
        }: {
            slug: string;
            clientType: 'soul-luxury' | 'energy-curious';
            productId: string;
        }) => {
            const response = await fetch(`/api/admin/journeys/${slug}/products`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ clientType, productId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to delete product");
            }

            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["admin", "journeys"] });
            queryClient.invalidateQueries({ queryKey: ["admin", "journeys", variables.slug] });
        },
    });
}

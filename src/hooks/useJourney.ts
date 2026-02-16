import { useQuery } from "@tanstack/react-query";
import { ChakraData } from "@/data/chakras";

async function fetchJourney(slug: string): Promise<ChakraData> {
  const response = await fetch(`/api/journeys/${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch journey");
  }
  return response.json();
}

export function useJourney(slug: string, initialData?: ChakraData) {
  return useQuery({
    queryKey: ["journey", slug],
    queryFn: () => fetchJourney(slug),
    initialData: initialData,
    // Refetch on window focus to get instant updates from admin changes
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // Consider data stale after 1 minute, but still refetch on focus
  });
}

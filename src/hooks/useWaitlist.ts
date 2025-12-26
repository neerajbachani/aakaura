import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/lib/queryClient';

export interface WaitlistItem {
    id: string;
    userId: string;
    journeySlug: string;
    productId: string;
    productName: string;
    clientType: 'soul-luxury' | 'energy-curious';
    createdAt: string;
}

export interface AddToWaitlistInput {
    journeySlug: string;
    productId: string;
    productName: string;
    clientType: 'soul-luxury' | 'energy-curious';
}

export interface RemoveFromWaitlistInput {
    journeySlug: string;
    productId: string;
    clientType: 'soul-luxury' | 'energy-curious';
}

// API functions
const fetchWaitlist = async (): Promise<WaitlistItem[]> => {
    const response = await fetch('/api/waitlist');

    if (response.status === 401) {
        return []; // Not authenticated, return empty array
    }

    if (!response.ok) {
        throw new Error('Failed to fetch waitlist');
    }

    const data = await response.json();
    return data.waitlistItems;
};

const addToWaitlist = async (input: AddToWaitlistInput): Promise<WaitlistItem> => {
    const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to waitlist');
    }

    const data = await response.json();
    return data.waitlistItem;
};

const removeFromWaitlist = async (input: RemoveFromWaitlistInput): Promise<void> => {
    const params = new URLSearchParams({
        journeySlug: input.journeySlug,
        productId: input.productId,
        clientType: input.clientType,
    });

    const response = await fetch(`/api/waitlist?${params}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove from waitlist');
    }
};

// Custom hooks
export const useWaitlist = () => {
    return useQuery<WaitlistItem[]>({
        queryKey: queryKeys.waitlist,
        queryFn: fetchWaitlist,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useAddToWaitlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addToWaitlist,
        onMutate: async (newItem) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.waitlist });

            // Snapshot the previous value
            const previousWaitlist = queryClient.getQueryData<WaitlistItem[]>(queryKeys.waitlist);

            // Optimistically update to the new value
            if (previousWaitlist) {
                queryClient.setQueryData<WaitlistItem[]>(queryKeys.waitlist, (old = []) => [
                    ...old,
                    {
                        id: 'temp-' + Date.now(),
                        userId: 'temp',
                        ...newItem,
                        createdAt: new Date().toISOString(),
                    },
                ]);
            }

            return { previousWaitlist };
        },
        onError: (error, newItem, context) => {
            // Rollback on error
            if (context?.previousWaitlist) {
                queryClient.setQueryData(queryKeys.waitlist, context.previousWaitlist);
            }
            toast.error(error.message || 'Failed to add to waitlist');
        },
        onSuccess: () => {
            toast.success('Added to waitlist!');
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: queryKeys.waitlist });
        },
    });
};

export const useRemoveFromWaitlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeFromWaitlist,
        onMutate: async (removeItem) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({ queryKey: queryKeys.waitlist });

            // Snapshot the previous value
            const previousWaitlist = queryClient.getQueryData<WaitlistItem[]>(queryKeys.waitlist);

            // Optimistically remove the item
            if (previousWaitlist) {
                queryClient.setQueryData<WaitlistItem[]>(queryKeys.waitlist, (old = []) =>
                    old.filter(
                        (item) =>
                            !(
                                item.journeySlug === removeItem.journeySlug &&
                                item.productId === removeItem.productId &&
                                item.clientType === removeItem.clientType
                            )
                    )
                );
            }

            return { previousWaitlist };
        },
        onError: (error, removeItem, context) => {
            // Rollback on error
            if (context?.previousWaitlist) {
                queryClient.setQueryData(queryKeys.waitlist, context.previousWaitlist);
            }
            toast.error(error.message || 'Failed to remove from waitlist');
        },
        onSuccess: () => {
            toast.success('Removed from waitlist');
        },
        onSettled: () => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: queryKeys.waitlist });
        },
    });
};

// Helper hook to check if an item is in the waitlist
export const useIsInWaitlist = (
    journeySlug: string,
    productId: string,
    clientType: 'soul-luxury' | 'energy-curious'
) => {
    const { data: waitlist = [] } = useWaitlist();

    return waitlist.some(
        (item) =>
            item.journeySlug === journeySlug &&
            item.productId === productId &&
            item.clientType === clientType
    );
};

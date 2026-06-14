import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/lib/queryClient';

export interface WishlistItem {
    id: string;
    userId: string;
    journeySlug: string;
    productId: string;
    productName: string;
    clientType: 'soul-luxury' | 'energy-curious';
    createdAt: string;
}

export interface AddToWishlistInput {
    journeySlug: string;
    productId: string;
    productName: string;
    clientType: 'soul-luxury' | 'energy-curious';
}

export interface RemoveFromWishlistInput {
    journeySlug: string;
    productId: string;
    clientType: 'soul-luxury' | 'energy-curious';
}

const fetchWishlist = async (): Promise<WishlistItem[]> => {
    const response = await fetch('/api/wishlist');

    if (response.status === 401) {
        return [];
    }

    if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
    }

    const data = await response.json();
    return data.wishlistItems;
};

const addToWishlist = async (input: AddToWishlistInput): Promise<WishlistItem> => {
    const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add to wishlist');
    }

    const data = await response.json();
    return data.wishlistItem;
};

const removeFromWishlist = async (input: RemoveFromWishlistInput): Promise<void> => {
    const params = new URLSearchParams({
        journeySlug: input.journeySlug,
        productId: input.productId,
        clientType: input.clientType,
    });

    const response = await fetch(`/api/wishlist?${params}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove from wishlist');
    }
};

export const useWishlist = () => {
    return useQuery<WishlistItem[]>({
        queryKey: queryKeys.wishlist,
        queryFn: fetchWishlist,
        staleTime: 1000 * 60 * 5,
    });
};

export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addToWishlist,
        onMutate: async (newItem) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.wishlist });

            const previousWishlist = queryClient.getQueryData<WishlistItem[]>(queryKeys.wishlist);

            if (previousWishlist) {
                queryClient.setQueryData<WishlistItem[]>(queryKeys.wishlist, (old = []) => [
                    ...old,
                    {
                        id: 'temp-' + Date.now(),
                        userId: 'temp',
                        ...newItem,
                        createdAt: new Date().toISOString(),
                    },
                ]);
            }

            return { previousWishlist };
        },
        onError: (error, _newItem, context) => {
            if (context?.previousWishlist) {
                queryClient.setQueryData(queryKeys.wishlist, context.previousWishlist);
            }
            toast.error(error.message || 'Failed to add to wishlist');
        },
        onSuccess: () => {
            toast.success('Added to wishlist!');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
        },
    });
};

export const useRemoveFromWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: removeFromWishlist,
        onMutate: async (removeItem) => {
            await queryClient.cancelQueries({ queryKey: queryKeys.wishlist });

            const previousWishlist = queryClient.getQueryData<WishlistItem[]>(queryKeys.wishlist);

            if (previousWishlist) {
                queryClient.setQueryData<WishlistItem[]>(queryKeys.wishlist, (old = []) =>
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

            return { previousWishlist };
        },
        onError: (error, _removeItem, context) => {
            if (context?.previousWishlist) {
                queryClient.setQueryData(queryKeys.wishlist, context.previousWishlist);
            }
            toast.error(error.message || 'Failed to remove from wishlist');
        },
        onSuccess: () => {
            toast.success('Removed from wishlist');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.wishlist });
        },
    });
};

export const useIsInWishlist = (
    journeySlug: string,
    productId: string,
    clientType: 'soul-luxury' | 'energy-curious'
) => {
    const { data: wishlist = [] } = useWishlist();

    return wishlist.some(
        (item) =>
            item.journeySlug === journeySlug &&
            item.productId === productId &&
            item.clientType === clientType
    );
};

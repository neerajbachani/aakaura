import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/lib/queryClient';

export interface WishlistItemWithUser {
    id: string;
    userId: string;
    journeySlug: string;
    productId: string;
    productName: string;
    clientType: string;
    createdAt: string;
    user: {
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
    };
}

export interface GroupedWishlistItem {
    journeySlug: string;
    productId: string;
    productName: string;
    clientType: string;
    users: Array<{
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        addedAt: string;
    }>;
    totalCount: number;
}

export interface AdminWishlistResponse {
    wishlistItems: WishlistItemWithUser[];
    groupedByProduct: GroupedWishlistItem[];
    totalItems: number;
}

export interface ProductSettings {
    isWaitlist?: boolean;
    isWishlistOnly?: boolean;
    updatedAt?: string;
    updatedBy?: string;
}

export interface UpdateProductSettingsInput {
    slug: string;
    productId: string;
    isWaitlist: boolean;
}

const fetchAdminWishlist = async (): Promise<AdminWishlistResponse> => {
    const response = await fetch('/api/admin/wishlist');

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch wishlist data');
    }

    return response.json();
};

const fetchJourneyProductSettings = async (slug: string) => {
    const response = await fetch(`/api/admin/journeys/${slug}/products`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch product settings');
    }

    return response.json();
};

const updateProductSettings = async (input: UpdateProductSettingsInput) => {
    const { slug, productId, isWaitlist } = input;

    const response = await fetch(`/api/admin/journeys/${slug}/products`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, isWaitlist }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update product settings');
    }

    return response.json();
};

export const useAdminWishlist = () => {
    return useQuery<AdminWishlistResponse>({
        queryKey: queryKeys.adminWishlist,
        queryFn: fetchAdminWishlist,
        staleTime: 1000 * 60 * 2,
    });
};

export const useJourneyProductSettings = (slug: string) => {
    return useQuery({
        queryKey: queryKeys.adminJourneyProducts(slug),
        queryFn: () => fetchJourneyProductSettings(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5,
    });
};

export const useUpdateProductSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProductSettings,
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({
                queryKey: queryKeys.adminJourneyProducts(variables.slug),
            });

            toast.success(
                variables.isWaitlist
                    ? 'Product set to wishlist-only'
                    : 'Product available for purchase'
            );
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update product settings');
        },
    });
};

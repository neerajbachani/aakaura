import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { queryKeys } from '@/lib/queryClient';

export interface WaitlistItemWithUser {
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

export interface GroupedWaitlistItem {
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

export interface AdminWaitlistResponse {
    waitlistItems: WaitlistItemWithUser[];
    groupedByProduct: GroupedWaitlistItem[];
    totalItems: number;
}

export interface ProductSettings {
    isWaitlist: boolean;
    updatedAt?: string;
    updatedBy?: string;
}

export interface UpdateProductSettingsInput {
    slug: string;
    productId: string;
    isWaitlist: boolean;
}

// API functions
const fetchAdminWaitlist = async (): Promise<AdminWaitlistResponse> => {
    const response = await fetch('/api/admin/waitlist');

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch waitlist data');
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

// Custom hooks
export const useAdminWaitlist = () => {
    return useQuery<AdminWaitlistResponse>({
        queryKey: queryKeys.adminWaitlist,
        queryFn: fetchAdminWaitlist,
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
};

export const useJourneyProductSettings = (slug: string) => {
    return useQuery({
        queryKey: queryKeys.adminJourneyProducts(slug),
        queryFn: () => fetchJourneyProductSettings(slug),
        enabled: !!slug,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useUpdateProductSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateProductSettings,
        onSuccess: (data, variables) => {
            // Invalidate the specific journey's product settings
            queryClient.invalidateQueries({
                queryKey: queryKeys.adminJourneyProducts(variables.slug),
            });

            toast.success(
                `Product ${variables.isWaitlist ? 'set to waitlist' : 'available for purchase'}`
            );
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update product settings');
        },
    });
};

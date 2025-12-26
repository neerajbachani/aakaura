import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryClient';
import {
  Cart,
  AddToCartRequest,
  UpdateCartItemRequest,
  RemoveFromCartRequest,
  CreateOrderRequest,
  Order,
  GuestCartItem
} from '@/types/Cart';
import { toast } from 'react-hot-toast';
import { useAuthStatus } from '@/hooks/useAuth';
import {
  getGuestCart,
  addToGuestCart as addToGuestCartUtil,
  removeFromGuestCart as removeFromGuestCartUtil,
  updateGuestCartItem as updateGuestCartItemUtil,
  clearGuestCart as clearGuestCartUtil
} from '@/lib/guestCart';

// API functions
const fetchCart = async (): Promise<Cart> => {
  const response = await fetch('/api/cart');
  if (!response.ok) {
    throw new Error('Failed to fetch cart');
  }
  return response.json();
};

const addToCart = async (data: AddToCartRequest) => {
  const response = await fetch('/api/cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to add to cart');
  }
  return response.json();
};

const updateCartItem = async (data: UpdateCartItemRequest) => {
  const response = await fetch('/api/cart/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update cart item');
  }
  return response.json();
};

const removeFromCart = async (data: RemoveFromCartRequest) => {
  const response = await fetch('/api/cart/remove', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to remove from cart');
  }
  return response.json();
};

const clearCart = async () => {
  const response = await fetch('/api/cart/clear', {
    method: 'DELETE',
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to clear cart');
  }
  return response.json();
};

const createOrder = async (data: CreateOrderRequest): Promise<Order> => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }
  return response.json();
};

// Custom hooks
export const useCart = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();

  return useQuery({
    queryKey: queryKeys.cart,
    queryFn: async () => {
      if (isAuthenticated) {
        return fetchCart();
      } else {
        // Return guest cart formatted as Cart object
        const guestCart = getGuestCart();
        return {
          items: [],
          totalItems: guestCart.items.reduce((sum, item) => sum + item.quantity, 0),
          totalPrice: 0, // We don't have price info in guest cart
          totalOfferPrice: undefined,
        };
      }
    },
    enabled: !authLoading, // Don't run until we know auth status
    staleTime: 1000 * 60 * 2, // 2 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.message?.includes('Unauthorized')) return false;
      return failureCount < 3;
    },
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStatus();

  return useMutation({
    mutationFn: async (data: AddToCartRequest) => {
      if (isAuthenticated) {
        return addToCart(data);
      } else {
        // Add to guest cart
        addToGuestCartUtil({
          productId: data.productId,
          variationId: data.variationId,
          quantity: data.quantity,
        });
        return { success: true };
      }
    },
    onMutate: async (newItem) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      // Snapshot previous value
      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart);

      // Optimistically update cart
      if (previousCart) {
        const existingItemIndex = previousCart.items.findIndex(
          item => item.productId === newItem.productId &&
            item.variationId === newItem.variationId
        );

        let updatedItems;
        if (existingItemIndex >= 0) {
          // Update existing item
          updatedItems = [...previousCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + newItem.quantity,
          };
        } else {
          // Add new item (we'll need to fetch product details)
          updatedItems = previousCart.items;
        }

        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        queryClient.setQueryData<Cart>(queryKeys.cart, {
          ...previousCart,
          items: updatedItems,
          totalItems: newTotalItems,
        });
      }

      return { previousCart };
    },
    onError: (error, newItem, context) => {
      // Rollback on error
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
      toast.error(error.message || 'Failed to add item to cart');
    },
    onSuccess: () => {
      toast.success('Item added to cart');
      // Refetch to get accurate data
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartItem,
    onMutate: async (updatedItem) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart);

      if (previousCart) {
        const updatedItems = previousCart.items.map(item =>
          item.id === updatedItem.cartItemId
            ? { ...item, quantity: updatedItem.quantity }
            : item
        );

        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        queryClient.setQueryData<Cart>(queryKeys.cart, {
          ...previousCart,
          items: updatedItems,
          totalItems: newTotalItems,
        });
      }

      return { previousCart };
    },
    onError: (error, updatedItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
      toast.error(error.message || 'Failed to update cart item');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeFromCart,
    onMutate: async (removedItem) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart);

      if (previousCart) {
        const updatedItems = previousCart.items.filter(
          item => item.id !== removedItem.cartItemId
        );

        const newTotalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0);

        queryClient.setQueryData<Cart>(queryKeys.cart, {
          ...previousCart,
          items: updatedItems,
          totalItems: newTotalItems,
        });
      }

      return { previousCart };
    },
    onError: (error, removedItem, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
      toast.error(error.message || 'Failed to remove item from cart');
    },
    onSuccess: () => {
      toast.success('Item removed from cart');
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart });

      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart);

      queryClient.setQueryData<Cart>(queryKeys.cart, {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });

      return { previousCart };
    },
    onError: (error, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart, context.previousCart);
      }
      toast.error(error.message || 'Failed to clear cart');
    },
    onSuccess: () => {
      toast.success('Cart cleared');
      queryClient.invalidateQueries({ queryKey: queryKeys.cart });
    },
  });
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success('Order created successfully');
      // Clear cart cache since order creation clears the cart
      queryClient.setQueryData<Cart>(queryKeys.cart, {
        items: [],
        totalItems: 0,
        totalPrice: 0,
      });
      // Invalidate orders to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.orders });
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create order');
    },
  });
};

// Guest cart hooks (for non-authenticated users)
export const useGuestCart = () => {
  const addToGuestCart = (item: GuestCartItem) => {
    addToGuestCartUtil(item);
    toast.success('Item added to cart');
  };

  const removeFromGuestCart = (productId: string, variationId?: string) => {
    removeFromGuestCartUtil(productId, variationId);
    toast.success('Item removed from cart');
  };

  const updateGuestCartQuantity = (productId: string, variationId: string | undefined, quantity: number) => {
    updateGuestCartItemUtil(productId, variationId, quantity);
  };

  const clearGuestCartItems = () => {
    clearGuestCartUtil();
    toast.success('Cart cleared');
  };

  return {
    guestCart: getGuestCart().items,
    addToGuestCart,
    removeFromGuestCart,
    updateGuestCartQuantity,
    clearGuestCart: clearGuestCartItems,
  };
};
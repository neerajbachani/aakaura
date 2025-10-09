export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  variationId?: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    images: string[];
    price: number;
    offerPrice?: number;
  };
  variation?: {
    id: string;
    name: string;
    price?: number;
    offerPrice?: number;
    inStock: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  totalOfferPrice?: number;
}

export interface AddToCartRequest {
  productId: string;
  variationId?: string;
  quantity: number;
}

export interface UpdateCartItemRequest {
  cartItemId: string;
  quantity: number;
}

export interface RemoveFromCartRequest {
  cartItemId: string;
}

export interface GuestCartItem {
  productId: string;
  variationId?: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    variationId?: string;
    quantity: number;
    price: number;
  }[];
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variationId?: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
  };
  variation?: {
    id: string;
    name: string;
  };
}
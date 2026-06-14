import { Combo } from "@/types/Combo";

export interface CartItem {
  id: string;
  userId: string;
  productId?: string | null;
  comboId?: string | null;
  variationId?: string | null;
  quantity: number;
  product?: {
    id: string;
    name: string;
    images: string[];
    price: number;
    offerPrice?: number | null;
    category?: { name: string };
  } | null;
  combo?: {
    id: string;
    name: string;
    images: string[];
    price?: number | null;
    offerPrice?: number | null;
    products?: {
      quantity: number;
      product: { price: number; offerPrice?: number | null };
      variation?: { price?: number | null; offerPrice?: number | null } | null;
    }[];
  } | null;
  variation?: {
    id: string;
    name: string;
    price?: number | null;
    offerPrice?: number | null;
    inStock: boolean;
  } | null;
  /** Resolved at API layer for combo rows */
  comboPricing?: {
    original: number;
    effective: number;
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
  productId?: string;
  comboId?: string;
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
  productId?: string;
  comboId?: string;
  variationId?: string;
  quantity: number;
}

export interface CreateOrderRequest {
  items: {
    productId?: string;
    comboId?: string;
    variationId?: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  items: OrderItem[];
  createdAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string | null;
  comboId?: string | null;
  variationId?: string | null;
  quantity: number;
  price: number;
  comboName?: string | null;
  comboImage?: string | null;
  product?: {
    id: string;
    name: string;
    images: string[];
  } | null;
  combo?: Combo | null;
  variation?: {
    id: string;
    name: string;
  } | null;
}

export interface GuestCartItem {
  productId: string;
  variationId?: string;
  quantity: number;
  addedAt: string;
}

export interface GuestCart {
  items: GuestCartItem[];
  updatedAt: string;
}

const GUEST_CART_KEY = 'aakaura_guest_cart';
const CART_EXPIRY_DAYS = 30;

// Get guest cart from localStorage
export const getGuestCart = (): GuestCart => {
  if (typeof window === 'undefined') {
    return { items: [], updatedAt: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) {
      return { items: [], updatedAt: new Date().toISOString() };
    }

    const cart: GuestCart = JSON.parse(stored);
    
    // Check if cart is expired
    const updatedAt = new Date(cart.updatedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
    
    if (daysDiff > CART_EXPIRY_DAYS) {
      clearGuestCart();
      return { items: [], updatedAt: new Date().toISOString() };
    }

    return cart;
  } catch (error) {
    console.error('Error reading guest cart:', error);
    return { items: [], updatedAt: new Date().toISOString() };
  }
};

// Save guest cart to localStorage
export const setGuestCart = (cart: GuestCart): void => {
  if (typeof window === 'undefined') return;

  try {
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving guest cart:', error);
  }
};

// Add item to guest cart
export const addToGuestCart = (item: Omit<GuestCartItem, 'addedAt'>): void => {
  const cart = getGuestCart();
  const existingIndex = cart.items.findIndex(
    cartItem => 
      cartItem.productId === item.productId && 
      cartItem.variationId === item.variationId
  );

  if (existingIndex >= 0) {
    // Update existing item
    cart.items[existingIndex].quantity += item.quantity;
  } else {
    // Add new item
    cart.items.push({
      ...item,
      addedAt: new Date().toISOString(),
    });
  }

  setGuestCart(cart);
};

// Update item quantity in guest cart
export const updateGuestCartItem = (
  productId: string, 
  variationId: string | undefined, 
  quantity: number
): void => {
  const cart = getGuestCart();
  const itemIndex = cart.items.findIndex(
    item => item.productId === productId && item.variationId === variationId
  );

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    setGuestCart(cart);
  }
};

// Remove item from guest cart
export const removeFromGuestCart = (productId: string, variationId?: string): void => {
  const cart = getGuestCart();
  cart.items = cart.items.filter(
    item => !(item.productId === productId && item.variationId === variationId)
  );
  setGuestCart(cart);
};

// Clear guest cart
export const clearGuestCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_CART_KEY);
};

// Get cart item count
export const getGuestCartItemCount = (): number => {
  const cart = getGuestCart();
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};

// Convert guest cart to API format for merging
export const formatGuestCartForAPI = () => {
  const cart = getGuestCart();
  return cart.items.map(item => ({
    productId: item.productId,
    variationId: item.variationId,
    quantity: item.quantity,
  }));
};

// Check if guest cart has items
export const hasGuestCartItems = (): boolean => {
  const cart = getGuestCart();
  return cart.items.length > 0;
};
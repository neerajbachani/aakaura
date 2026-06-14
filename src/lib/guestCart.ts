export interface GuestCartItem {
  productId?: string;
  comboId?: string;
  variationId?: string;
  quantity: number;
  addedAt: string;
}

export interface GuestCart {
  items: GuestCartItem[];
  updatedAt: string;
}

const GUEST_CART_KEY = "aakaura_guest_cart";
const CART_EXPIRY_DAYS = 30;

function sameGuestItem(
  a: Pick<GuestCartItem, "productId" | "comboId" | "variationId">,
  b: Pick<GuestCartItem, "productId" | "comboId" | "variationId">,
) {
  if (a.comboId && b.comboId) return a.comboId === b.comboId;
  return a.productId === b.productId && a.variationId === b.variationId;
}

// Get guest cart from localStorage
export const getGuestCart = (): GuestCart => {
  if (typeof window === "undefined") {
    return { items: [], updatedAt: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    if (!stored) {
      return { items: [], updatedAt: new Date().toISOString() };
    }

    const cart: GuestCart = JSON.parse(stored);

    const updatedAt = new Date(cart.updatedAt);
    const now = new Date();
    const daysDiff =
      (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysDiff > CART_EXPIRY_DAYS) {
      clearGuestCart();
      return { items: [], updatedAt: new Date().toISOString() };
    }

    return cart;
  } catch (error) {
    console.error("Error reading guest cart:", error);
    return { items: [], updatedAt: new Date().toISOString() };
  }
};

export const setGuestCart = (cart: GuestCart): void => {
  if (typeof window === "undefined") return;

  try {
    cart.updatedAt = new Date().toISOString();
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving guest cart:", error);
  }
};

export const addToGuestCart = (
  item: Omit<GuestCartItem, "addedAt">,
): void => {
  const cart = getGuestCart();
  const existingIndex = cart.items.findIndex((cartItem) =>
    sameGuestItem(cartItem, item),
  );

  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity += item.quantity;
  } else {
    cart.items.push({
      ...item,
      addedAt: new Date().toISOString(),
    });
  }

  setGuestCart(cart);
};

export const updateGuestCartItem = (
  key: { productId?: string; comboId?: string; variationId?: string },
  quantity: number,
): void => {
  const cart = getGuestCart();
  const itemIndex = cart.items.findIndex((item) => sameGuestItem(item, key));

  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    setGuestCart(cart);
  }
};

export const removeFromGuestCart = (key: {
  productId?: string;
  comboId?: string;
  variationId?: string;
}): void => {
  const cart = getGuestCart();
  cart.items = cart.items.filter((item) => !sameGuestItem(item, key));
  setGuestCart(cart);
};

export const clearGuestCart = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
};

export const getGuestCartItemCount = (): number => {
  const cart = getGuestCart();
  return cart.items.reduce((total, item) => total + item.quantity, 0);
};

export const formatGuestCartForAPI = () => {
  const cart = getGuestCart();
  return cart.items.map((item) => ({
    productId: item.productId,
    comboId: item.comboId,
    variationId: item.variationId,
    quantity: item.quantity,
  }));
};

export const hasGuestCartItems = (): boolean => {
  const cart = getGuestCart();
  return cart.items.length > 0;
};

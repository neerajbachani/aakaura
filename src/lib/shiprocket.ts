import { Order, OrderItem, Product } from '@prisma/client';

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

/**
 * Authenticates with Shiprocket and returns a bearer token.
 * Tokens are cached in memory for up to 9 days (Shiprocket tokens expire in 10 days).
 */
export async function getShiprocketToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('Shiprocket credentials are not configured in environment variables.');
  }

  try {
    const response = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shiprocket Auth Failed: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    cachedToken = data.token;
    
    // Set expiry to 9 days from now to be safe
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 9);
    tokenExpiry = expiry;

    return cachedToken as string;
  } catch (error) {
    console.error('Error fetching Shiprocket token:', error);
    throw error;
  }
}

// Define the full order type expected from the database with relations
export type CompleteOrder = Order & {
  items: (OrderItem & {
    product: { id: string; name: string; images: string[] };
  })[];
  user: { name: string | null; email: string; phone: string | null } | null;
};

/**
 * Creates an order in Shiprocket.
 * Maps our internal Order format to Shiprocket's Custom Order format.
 */
export async function createShiprocketOrder(order: CompleteOrder) {
  try {
    const token = await getShiprocketToken();

    // Map order items to Shiprocket format
    const orderItems = order.items.map((item) => ({
      name: item.productName || item.product.name,
      sku: item.productId, // Using productId as SKU
      units: item.quantity,
      selling_price: item.price,
      discount: 0,
      tax: 0,
      hsn: '',
    }));

    // Shiprocket expects length, breadth, height in cm and weight in kg.
    // User provided dimensions: 33 * 19 * 70 inch (converting to cm)
    // 33 inch = 83.82 cm, 19 inch = 48.26 cm, 70 inch = 177.8 cm
    // Weight provided: 450 grams = 0.45 kg
    const payload = {
      order_id: order.orderNumber,
      order_date: order.createdAt.toISOString().split('T')[0],
      pickup_location: 'Primary', // Using the primary default location
      billing_customer_name: order.shippingName.split(' ')[0] || order.user?.name || 'Customer',
      billing_last_name: order.shippingName.split(' ').slice(1).join(' ') || '',
      billing_address: order.shippingAddress,
      billing_city: order.shippingCity,
      billing_pincode: order.shippingPincode,
      billing_state: order.shippingState,
      billing_country: 'India',
      billing_email: order.user?.email || '',
      billing_phone: order.shippingPhone || order.user?.phone || '',
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: 'Prepaid', // Assuming all Razorpay orders are prepaid
      shipping_charges: order.shippingFee,
      giftwrap_charges: 0,
      transaction_charges: 0,
      total_discount: order.discount,
      sub_total: order.subtotal,
      length: 33, // cm
      breadth: 19, // cm
      height: 70, // cm
      weight: 0.45, // 450 grams
    };

    const response = await fetch(`${SHIPROCKET_API_BASE}/orders/create/adhoc`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Shiprocket order creation failed:', responseData);
      throw new Error(`Shiprocket Error: ${responseData.message || 'Failed to create order'}`);
    }

    return responseData;
  } catch (error) {
    console.error('Error creating order in Shiprocket:', error);
    throw error;
  }
}

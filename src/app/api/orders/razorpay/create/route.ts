import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createRazorpayOrderSchema = z.object({
  total: z.number().min(1),
  items: z.array(z.any()).optional(),
  customerInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
  }).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET!);

    const body = await request.json();
    const { total, items, customerInfo } = createRazorpayOrderSchema.parse(body);

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options: any = {
      amount: Math.round(total * 100), // amount in the smallest currency unit
      currency: 'INR',
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    if (items || customerInfo) {
      options.notes = {
        customer_name: customerInfo?.name || 'N/A',
        customer_email: customerInfo?.email || 'N/A',
        customer_phone: customerInfo?.phone || 'N/A',
        item_count: items?.length?.toString() || '0',
        items_summary: items?.map((i: any) => `${i.productId}(${i.quantity})`).join(', ').substring(0, 250) || 'N/A',
      };
    }

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
    }, { status: 200 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

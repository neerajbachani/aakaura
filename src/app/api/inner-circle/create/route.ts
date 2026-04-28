import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Fixed ₹5 entry fee for the Aakaura Inner Circle WhatsApp community
const INNER_CIRCLE_FEE_INR = 5;

export async function POST() {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Payment gateway configuration error' },
        { status: 500 },
      );
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: INNER_CIRCLE_FEE_INR * 100, // 500 paise = ₹5
      currency: 'INR',
      receipt: `inner_circle_${Date.now()}`,
      notes: {
        purpose: 'Aakaura Inner Circle entry fee',
      },
    });

    return NextResponse.json(
      { id: order.id, amount: order.amount, currency: order.currency },
      { status: 200 },
    );
  } catch (error) {
    console.error('[inner-circle/create] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

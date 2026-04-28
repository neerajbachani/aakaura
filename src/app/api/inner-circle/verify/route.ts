import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { z } from 'zod';

const verifySchema = z.object({
  razorpay_payment_id: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
      verifySchema.parse(body);

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Payment gateway configuration error' },
        { status: 500 },
      );
    }

    // HMAC-SHA256 signature verification
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed — invalid signature' },
        { status: 400 },
      );
    }

    // Signature is valid — return the WhatsApp community link (server-side only, never in client bundle)
    const whatsappUrl = process.env.WHATSAPP_COMMUNITY_URL;
    if (!whatsappUrl) {
      console.error('[inner-circle/verify] WHATSAPP_COMMUNITY_URL not configured');
      return NextResponse.json(
        { success: false, error: 'Community link not configured' },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, redirectUrl: whatsappUrl }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }
    console.error('[inner-circle/verify] Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

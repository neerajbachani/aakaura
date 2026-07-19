import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { GUIDANCE_CALL } from '@/config/guidance';
import { findOrCreateGuidanceUser } from '@/lib/guidance-user';
import { sendBookingReceivedEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret) {
      const signature = request.headers.get('x-razorpay-signature');
      const rawBody = JSON.stringify(body);
      const expected = crypto
        .createHmac('sha256', secret)
        .update(rawBody)
        .digest('hex');
      if (signature !== expected) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const event = body.event;
    if (event !== 'payment.captured') {
      return NextResponse.json({ received: true });
    }

    const payment = body.payload?.payment?.entity;
    if (!payment) {
      return NextResponse.json({ received: true });
    }

    const orderId = payment.order_id;
    const paymentId = payment.id;
    const notes = payment.notes || {};

    const existingBooking = await prisma.guidanceBooking.findUnique({
      where: { razorpayPaymentId: paymentId },
    });
    const existingPackage = await prisma.packagePurchase.findUnique({
      where: { razorpayPaymentId: paymentId },
    });
    if (existingBooking || existingPackage) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (notes.type === 'guidance' || notes.bookingType === 'GUIDANCE_CALL') {
      const email = notes.customerEmail;
      if (!email) return NextResponse.json({ received: true });

      const user = await findOrCreateGuidanceUser({
        email,
        name: email.split('@')[0],
        phone: '0000000000',
      });

      const booking = await prisma.guidanceBooking.create({
        data: {
          userId: user.id,
          bookingType: 'GUIDANCE_CALL',
          status: 'PENDING',
          timezone: 'Asia/Kolkata',
          duration: GUIDANCE_CALL.durationMinutes,
          amount: GUIDANCE_CALL.price,
          paymentStatus: 'PAID',
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId,
        },
      });

      await sendBookingReceivedEmail({
        userEmail: user.email,
        userName: user.name || email,
        bookingId: booking.id,
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhooks/razorpay]', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

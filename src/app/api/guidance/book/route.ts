import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { findOrCreateGuidanceUser } from '@/lib/guidance-user';
import { GUIDANCE_CALL, PRACTITIONER_PREFERENCE_VALUES } from '@/config/guidance';
import { sendBookingReceivedEmail } from '@/lib/email';

const bookSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  preferredPractitioner: z
    .enum([...PRACTITIONER_PREFERENCE_VALUES] as [string, ...string[]])
    .or(z.literal(''))
    .optional(),
  timezone: z.string().default('Asia/Kolkata'),
  notes: z.string().optional(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookSchema.parse(body);

    if (!verifyRazorpaySignature(data.razorpayOrderId, data.razorpayPaymentId, data.razorpaySignature)) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const existing = await prisma.guidanceBooking.findUnique({
      where: { razorpayPaymentId: data.razorpayPaymentId },
    });
    if (existing) {
      return NextResponse.json({ booking: existing });
    }

    const user = await findOrCreateGuidanceUser({
      email: data.email,
      name: data.name,
      phone: data.phone,
    });

    const booking = await prisma.guidanceBooking.create({
      data: {
        userId: user.id,
        bookingType: 'GUIDANCE_CALL',
        status: 'PENDING',
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        preferredPractitioner: data.preferredPractitioner || null,
        timezone: data.timezone,
        duration: GUIDANCE_CALL.durationMinutes,
        amount: GUIDANCE_CALL.price,
        paymentStatus: 'PAID',
        notes: data.notes,
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
      },
    });

    await sendBookingReceivedEmail({
      userEmail: user.email,
      userName: user.name || data.name,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      bookingId: booking.id,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('[guidance/book]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

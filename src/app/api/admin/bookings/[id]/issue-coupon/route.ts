import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CouponDiscountType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { createManualCoupon } from '@/lib/coupon';
import { sendCouponIssuedEmail } from '@/lib/email';

const issueSchema = z.object({
  code: z.string().min(3).max(40),
  discountType: z.nativeEnum(CouponDiscountType),
  discountValue: z.number().positive(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const data = issueSchema.parse(body);

    const booking = await prisma.guidanceBooking.findUnique({
      where: { id },
      include: { user: true, coupon: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.bookingType !== 'GUIDANCE_CALL' || booking.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Coupons can only be issued for completed guidance calls' },
        { status: 400 },
      );
    }

    if (!booking.couponEligible) {
      return NextResponse.json(
        { error: 'This customer is not yet eligible for a coupon' },
        { status: 400 },
      );
    }

    if (booking.coupon) {
      return NextResponse.json(
        { error: 'A coupon has already been issued for this booking' },
        { status: 400 },
      );
    }

    const normalizedCode = data.code.trim().toUpperCase();
    const existingCode = await prisma.coupon.findUnique({
      where: { code: normalizedCode },
    });
    if (existingCode) {
      return NextResponse.json(
        { error: 'This coupon code already exists. Choose another code.' },
        { status: 400 },
      );
    }

    const coupon = await createManualCoupon({
      bookingId: booking.id,
      userId: booking.userId,
      code: normalizedCode,
      discountType: data.discountType,
      discountValue: data.discountValue,
    });

    await prisma.guidanceBooking.update({
      where: { id: booking.id },
      data: {
        couponIssuedAt: new Date(),
        couponIssuedBy: admin.email || 'admin',
      },
    });

    await sendCouponIssuedEmail({
      userEmail: booking.user.email,
      userName: booking.user.name || booking.user.email,
      couponCode: coupon.code,
      validTill: coupon.validTill,
    });

    return NextResponse.json({ coupon });
  } catch (error) {
    console.error('[admin/bookings/issue-coupon]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

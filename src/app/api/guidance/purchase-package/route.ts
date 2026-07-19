import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PackageType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { findOrCreateGuidanceUser } from '@/lib/guidance-user';
import { PACKAGES } from '@/config/guidance';
import { calculateDiscountedPrice, validateCoupon } from '@/lib/coupon';
import { sendPackagePurchaseEmail } from '@/lib/email';

const purchaseSchema = z.object({
  packageType: z.nativeEnum(PackageType),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  couponCode: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpayPaymentId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = purchaseSchema.parse(body);

    const user = await findOrCreateGuidanceUser({
      email: data.email,
      name: data.name,
      phone: data.phone,
    });

    const pkg = PACKAGES[data.packageType];
    let amount = pkg.price;
    let couponId: string | undefined;

    if (data.couponCode) {
      if (data.packageType !== 'PACKAGE_I') {
        return NextResponse.json(
          { error: 'This coupon is valid for Package I (Guidance & Ritual Support) only' },
          { status: 400 },
        );
      }
      const validation = await validateCoupon(data.couponCode, user.id, data.packageType);
      if (!validation.valid || !validation.coupon) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }
      amount = calculateDiscountedPrice(
        amount,
        validation.coupon.discountType,
        validation.coupon.discountValue,
      );
      couponId = validation.coupon.id;
    }

    const isFree = amount <= 0;

    if (isFree) {
      // Only a valid coupon can bring a package to ₹0; guard against a free
      // purchase being requested without one.
      if (!couponId) {
        return NextResponse.json({ error: 'A valid coupon is required for a free purchase' }, { status: 400 });
      }
    } else {
      if (!data.razorpayOrderId || !data.razorpayPaymentId || !data.razorpaySignature) {
        return NextResponse.json({ error: 'Payment details are required' }, { status: 400 });
      }
      if (!verifyRazorpaySignature(data.razorpayOrderId, data.razorpayPaymentId, data.razorpaySignature)) {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }

      const existing = await prisma.packagePurchase.findUnique({
        where: { razorpayPaymentId: data.razorpayPaymentId },
      });
      if (existing) {
        return NextResponse.json({ packagePurchase: existing });
      }
    }

    const expiryDate = pkg.validityDays
      ? new Date(Date.now() + pkg.validityDays * 24 * 60 * 60 * 1000)
      : null;

    const packagePurchase = await prisma.$transaction(async (tx) => {
      const purchase = await tx.packagePurchase.create({
        data: {
          userId: user.id,
          packageType: data.packageType,
          remainingCalls: pkg.calls,
          expiryDate,
          status: 'ACTIVE',
          amount,
          paymentStatus: 'PAID',
          razorpayOrderId: isFree ? null : data.razorpayOrderId,
          razorpayPaymentId: isFree ? null : data.razorpayPaymentId,
          razorpaySignature: isFree ? null : data.razorpaySignature,
          couponId,
        },
      });

      if (couponId) {
        await tx.coupon.update({
          where: { id: couponId },
          data: { used: true, usedAt: new Date() },
        });
      }

      return purchase;
    });

    await sendPackagePurchaseEmail({
      userEmail: user.email,
      userName: user.name || data.name,
      packageLabel: pkg.label,
      remainingCalls: pkg.calls,
    });

    return NextResponse.json({ packagePurchase }, { status: 201 });
  } catch (error) {
    console.error('[guidance/purchase-package]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

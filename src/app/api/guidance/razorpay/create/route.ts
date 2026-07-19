import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PackageType } from '@prisma/client';
import { getRazorpayInstance } from '@/lib/razorpay';
import { GUIDANCE_CALL, PACKAGES } from '@/config/guidance';
import { calculateDiscountedPrice, validateCoupon } from '@/lib/coupon';
import { findOrCreateGuidanceUser } from '@/lib/guidance-user';

const createOrderSchema = z.object({
  type: z.enum(['guidance', 'package']),
  packageType: z.nativeEnum(PackageType).optional(),
  customerInfo: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(10),
  }),
  couponCode: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = createOrderSchema.parse(body);

    let amount: number;
    let receipt: string;
    const notes: Record<string, string> = {
      type: data.type,
      customerEmail: data.customerInfo.email,
    };

    if (data.type === 'guidance') {
      amount = GUIDANCE_CALL.price;
      receipt = `guidance_${Date.now()}`;
      notes.bookingType = 'GUIDANCE_CALL';
    } else {
      if (!data.packageType) {
        return NextResponse.json({ error: 'Package type required' }, { status: 400 });
      }
      const pkg = PACKAGES[data.packageType];
      amount = pkg.price;
      receipt = `package_${data.packageType}_${Date.now()}`;
      notes.packageType = data.packageType;

      if (data.couponCode) {
        if (data.packageType !== 'PACKAGE_I') {
          return NextResponse.json(
            { error: 'This coupon is valid for Package I (Guidance & Ritual Support) only' },
            { status: 400 },
          );
        }
        const user = await findOrCreateGuidanceUser(data.customerInfo);
        const validation = await validateCoupon(data.couponCode, user.id, data.packageType);
        if (!validation.valid || !validation.coupon) {
          return NextResponse.json({ error: validation.error }, { status: 400 });
        }
        amount = calculateDiscountedPrice(
          amount,
          validation.coupon.discountType,
          validation.coupon.discountValue,
        );
        notes.couponCode = data.couponCode.toUpperCase();
      }
    }

    // A coupon can reduce Package I to ₹0. Razorpay rejects amounts below its
    // ₹1 minimum, so a fully-discounted order is completed without Razorpay.
    if (amount <= 0) {
      return NextResponse.json({ free: true, displayAmount: 0 });
    }

    const razorpay = getRazorpayInstance();
    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt,
      notes,
    });

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      displayAmount: amount,
    });
  } catch (error) {
    console.error('[guidance/razorpay/create]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

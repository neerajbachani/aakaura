import crypto from 'crypto';
import { CouponDiscountType, PackageType } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import {
  APP_SETTING_KEYS,
  COUPON_APPLICABLE_PACKAGE,
  COUPON_VALIDITY_DAYS,
  DEFAULT_COUPON_SETTINGS,
} from '@/config/guidance';

export async function getDefaultCouponSettings(): Promise<{
  discountType: CouponDiscountType;
  discountValue: number;
}> {
  const settings = await prisma.appSetting.findMany({
    where: {
      key: {
        in: [
          APP_SETTING_KEYS.couponDiscountType,
          APP_SETTING_KEYS.couponDiscountValue,
        ],
      },
    },
  });

  const typeSetting = settings.find(
    (s) => s.key === APP_SETTING_KEYS.couponDiscountType,
  );
  const valueSetting = settings.find(
    (s) => s.key === APP_SETTING_KEYS.couponDiscountValue,
  );

  const discountType =
    (typeSetting?.value as CouponDiscountType) || DEFAULT_COUPON_SETTINGS.type;
  const discountValue = valueSetting
    ? parseFloat(valueSetting.value)
    : DEFAULT_COUPON_SETTINGS.value;

  return { discountType, discountValue };
}

export async function generateUniqueCouponCode(): Promise<string> {
  for (let i = 0; i < 10; i++) {
    const suffix = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 5);
    const code = `AAKAURA${suffix}`;
    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error('Failed to generate unique coupon code');
}

export async function createManualCoupon(params: {
  bookingId: string;
  userId: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
}) {
  const validTill = new Date();
  validTill.setDate(validTill.getDate() + COUPON_VALIDITY_DAYS);

  return prisma.coupon.create({
    data: {
      userId: params.userId,
      bookingId: params.bookingId,
      code: params.code.trim().toUpperCase(),
      discountType: params.discountType,
      discountValue: params.discountValue,
      applicablePackageType: COUPON_APPLICABLE_PACKAGE,
      validTill,
    },
  });
}

export async function validateCoupon(
  code: string,
  userId: string,
  packageType?: PackageType,
): Promise<{
  valid: boolean;
  coupon?: {
    id: string;
    discountType: CouponDiscountType;
    discountValue: number;
  };
  error?: string;
}> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!coupon) {
    return { valid: false, error: 'Invalid coupon code' };
  }

  if (coupon.userId !== userId) {
    return { valid: false, error: 'This coupon is not valid for your account' };
  }

  if (coupon.used) {
    return { valid: false, error: 'This coupon has already been used' };
  }

  if (new Date() > coupon.validTill) {
    return { valid: false, error: 'This coupon has expired' };
  }

  if (packageType && packageType !== coupon.applicablePackageType) {
    return {
      valid: false,
      error: 'This coupon is valid for Package I (Guidance & Ritual Support) only',
    };
  }

  return {
    valid: true,
    coupon: {
      id: coupon.id,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    },
  };
}

export function calculateDiscountedPrice(
  price: number,
  discountType: CouponDiscountType,
  discountValue: number,
): number {
  if (discountType === 'PERCENT') {
    return Math.max(0, Math.round(price * (1 - discountValue / 100)));
  }
  return Math.max(0, Math.round(price - discountValue));
}

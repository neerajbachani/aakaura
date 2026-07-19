import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { APP_SETTING_KEYS } from '@/config/guidance';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.appSetting.findMany({
      where: {
        key: {
          in: [APP_SETTING_KEYS.couponDiscountType, APP_SETTING_KEYS.couponDiscountValue],
        },
      },
    });

    const typeSetting = settings.find((s) => s.key === APP_SETTING_KEYS.couponDiscountType);
    const valueSetting = settings.find((s) => s.key === APP_SETTING_KEYS.couponDiscountValue);

    return NextResponse.json({
      discountType: typeSetting?.value || 'PERCENT',
      discountValue: valueSetting ? parseFloat(valueSetting.value) : 25,
    });
  } catch (error) {
    console.error('[admin/settings/coupon]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { discountType, discountValue } = body;

    if (!discountType || discountValue == null) {
      return NextResponse.json({ error: 'discountType and discountValue required' }, { status: 400 });
    }

    await Promise.all([
      prisma.appSetting.upsert({
        where: { key: APP_SETTING_KEYS.couponDiscountType },
        create: { key: APP_SETTING_KEYS.couponDiscountType, value: discountType },
        update: { value: discountType },
      }),
      prisma.appSetting.upsert({
        where: { key: APP_SETTING_KEYS.couponDiscountValue },
        create: { key: APP_SETTING_KEYS.couponDiscountValue, value: String(discountValue) },
        update: { value: String(discountValue) },
      }),
    ]);

    return NextResponse.json({ discountType, discountValue });
  } catch (error) {
    console.error('[admin/settings/coupon]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

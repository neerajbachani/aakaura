import { NextRequest, NextResponse } from 'next/server';
import { verifyUserToken } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { PACKAGES } from '@/config/guidance';

export async function GET(request: NextRequest) {
  try {
    const user = await verifyUserToken(request);
    if (!user) {
      return NextResponse.json({ packages: [] });
    }

    const packages = await prisma.packagePurchase.findMany({
      where: {
        userId: user.id,
        status: { in: ['ACTIVE', 'COMPLETED'] },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      packages: packages.map((p) => ({
        id: p.id,
        packageType: p.packageType,
        label: PACKAGES[p.packageType].label,
        remainingCalls: p.remainingCalls,
        expiryDate: p.expiryDate,
        status: p.status,
        createdAt: p.createdAt,
      })),
    });
  } catch (error) {
    console.error('[guidance/packages]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

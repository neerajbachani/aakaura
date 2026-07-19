import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { PACKAGES } from '@/config/guidance';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.guidanceBooking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        assignedPractitioner: true,
        packagePurchase: true,
        coupon: true,
        qualifyingOrder: { select: { orderNumber: true, total: true, orderDate: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    let packageProgress = null;
    if (booking.packagePurchase) {
      const sessions = await prisma.guidanceBooking.count({
        where: {
          packagePurchaseId: booking.packagePurchase.id,
          status: 'COMPLETED',
        },
      });
      packageProgress = {
        packagePurchaseId: booking.packagePurchase.id,
        totalCalls: PACKAGES[booking.packagePurchase.packageType].calls,
        completedSessions: sessions,
        remainingCalls: booking.packagePurchase.remainingCalls,
        status: booking.packagePurchase.status,
      };
    }

    return NextResponse.json({
      ...booking,
      packageLabel: booking.packagePurchase
        ? PACKAGES[booking.packagePurchase.packageType].label
        : null,
      packageProgress,
    });
  } catch (error) {
    console.error('[admin/bookings/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

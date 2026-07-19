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

    const pkg = await prisma.packagePurchase.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        bookings: {
          orderBy: { createdAt: 'asc' },
          include: {
            assignedPractitioner: { select: { name: true } },
          },
        },
      },
    });

    if (!pkg) {
      return NextResponse.json({ error: 'Package not found' }, { status: 404 });
    }

    const totalCalls = PACKAGES[pkg.packageType].calls;
    const completedSessions = pkg.bookings.filter((b) => b.status === 'COMPLETED').length;
    const scheduledSessions = pkg.bookings.filter(
      (b) => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'RESCHEDULED',
    ).length;

    return NextResponse.json({
      id: pkg.id,
      packageType: pkg.packageType,
      packageLabel: PACKAGES[pkg.packageType].label,
      status: pkg.status,
      amount: pkg.amount,
      paymentStatus: pkg.paymentStatus,
      expiryDate: pkg.expiryDate,
      remainingCalls: pkg.remainingCalls,
      totalCalls,
      completedSessions,
      scheduledSessions,
      createdAt: pkg.createdAt,
      customer: {
        id: pkg.user.id,
        name: pkg.user.name,
        email: pkg.user.email,
        phone: pkg.user.phone,
      },
      sessions: pkg.bookings.map((b) => ({
        id: b.id,
        status: b.status,
        practitionerName: b.assignedPractitioner?.name || null,
        meetingDateTime: b.meetingDateTime,
        meetingLink: b.meetingLink,
        preferredDate: b.preferredDate,
        preferredTime: b.preferredTime,
        notes: b.notes,
        completedAt: b.completedAt,
        createdAt: b.createdAt,
      })),
    });
  } catch (error) {
    console.error('[admin/packages/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

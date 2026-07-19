import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPractitionerToken } from '@/middleware/auth';
import { PACKAGES } from '@/config/guidance';

function getDateBounds(filter: string | null) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart);
  todayEnd.setDate(todayEnd.getDate() + 1);

  const tomorrowStart = new Date(todayEnd);
  const tomorrowEnd = new Date(tomorrowStart);
  tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

  if (filter === 'today') {
    return { gte: todayStart, lt: todayEnd };
  }
  if (filter === 'tomorrow') {
    return { gte: tomorrowStart, lt: tomorrowEnd };
  }
  return { gte: now };
}

export async function GET(request: NextRequest) {
  try {
    const practitioner = await verifyPractitionerToken(request);
    if (!practitioner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    const dateFilter = getDateBounds(filter);

    const bookings = await prisma.guidanceBooking.findMany({
      where: {
        assignedPractitionerId: practitioner.id,
        status: { in: ['CONFIRMED', 'RESCHEDULED'] },
        meetingDateTime: dateFilter,
      },
      include: {
        user: { select: { name: true, email: true, phone: true } },
        packagePurchase: { select: { packageType: true, remainingCalls: true } },
      },
      orderBy: { meetingDateTime: 'asc' },
    });

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        id: b.id,
        customerName: b.user.name || b.user.email,
        customerEmail: b.user.email,
        customerPhone: b.user.phone,
        notes: b.notes,
        bookingType: b.bookingType,
        packageType: b.packagePurchase?.packageType,
        packageLabel: b.packagePurchase
          ? PACKAGES[b.packagePurchase.packageType].label
          : 'Guidance Call',
        meetingLink: b.meetingLink,
        meetingDateTime: b.meetingDateTime,
        timezone: b.timezone,
        duration: b.duration,
        status: b.status,
      })),
    });
  } catch (error) {
    console.error('[practitioner/bookings]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

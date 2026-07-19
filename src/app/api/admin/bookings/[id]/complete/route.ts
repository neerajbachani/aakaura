import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { completeBooking } from '@/lib/booking-actions';

export async function PATCH(
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
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'CONFIRMED' && booking.status !== 'RESCHEDULED') {
      return NextResponse.json(
        { error: 'Only confirmed bookings can be marked completed' },
        { status: 400 },
      );
    }

    const result = await completeBooking(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[admin/bookings/complete]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

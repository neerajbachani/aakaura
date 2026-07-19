import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPractitionerToken } from '@/middleware/auth';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const practitioner = await verifyPractitionerToken(request);
    if (!practitioner) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.guidanceBooking.findUnique({
      where: { id },
    });

    if (!booking || booking.assignedPractitionerId !== practitioner.id) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updated = await prisma.guidanceBooking.update({
      where: { id },
      data: { status: 'RESCHEDULED' },
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('[practitioner/bookings/reschedule]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

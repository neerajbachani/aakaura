import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPractitionerToken } from '@/middleware/auth';
import { completeBooking } from '@/lib/booking-actions';

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

    const result = await completeBooking(id);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[practitioner/bookings/complete]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

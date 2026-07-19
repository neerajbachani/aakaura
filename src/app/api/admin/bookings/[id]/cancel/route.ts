import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { sendBookingCancelledEmail } from '@/lib/email';

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
      include: { user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const updated = await prisma.guidanceBooking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await sendBookingCancelledEmail({
      userEmail: booking.user.email,
      userName: booking.user.name || booking.user.email,
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('[admin/bookings/cancel]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

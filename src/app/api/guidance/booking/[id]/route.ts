import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const booking = await prisma.guidanceBooking.findUnique({
      where: { id },
      include: {
        user: { select: { name: true, email: true } },
        assignedPractitioner: { select: { name: true } },
        coupon: { select: { code: true, validTill: true, used: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: booking.id,
      status: booking.status,
      bookingType: booking.bookingType,
      preferredDate: booking.preferredDate,
      preferredTime: booking.preferredTime,
      meetingDateTime: booking.meetingDateTime,
      meetingLink: booking.status === 'CONFIRMED' || booking.status === 'COMPLETED' ? booking.meetingLink : null,
      timezone: booking.timezone,
      duration: booking.duration,
      paymentStatus: booking.paymentStatus,
      notes: booking.notes,
      customerName: booking.user.name,
      practitionerName: booking.assignedPractitioner?.name,
      coupon: booking.coupon,
      couponEligible: booking.couponEligible,
      createdAt: booking.createdAt,
    });
  } catch (error) {
    console.error('[guidance/booking/[id]]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

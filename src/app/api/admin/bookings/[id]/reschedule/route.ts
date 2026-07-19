import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { sendBookingRescheduledEmail } from '@/lib/email';

const rescheduleSchema = z.object({
  meetingDateTime: z.string().datetime(),
  meetingLink: z.string().url().optional(),
  practitionerId: z.string().optional(),
});

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
    const body = await request.json();
    const data = rescheduleSchema.parse(body);

    const booking = await prisma.guidanceBooking.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const meetingDateTime = new Date(data.meetingDateTime);
    const meetingLink = data.meetingLink || booking.meetingLink;

    const updated = await prisma.guidanceBooking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        meetingDateTime,
        meetingLink,
        assignedPractitionerId: data.practitionerId || booking.assignedPractitionerId,
        reminderSentAt: Prisma.DbNull,
      },
    });

    if (meetingLink) {
      await sendBookingRescheduledEmail({
        userEmail: booking.user.email,
        userName: booking.user.name || booking.user.email,
        meetingDateTime,
        meetingLink,
        timezone: booking.timezone,
      });
    }

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('[admin/bookings/reschedule]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

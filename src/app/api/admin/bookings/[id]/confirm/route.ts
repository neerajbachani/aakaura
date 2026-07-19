import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import {
  sendBookingConfirmedEmail,
  sendPractitionerAssignmentEmail,
} from '@/lib/email';

const confirmSchema = z.object({
  practitionerId: z.string(),
  meetingLink: z.string().url(),
  meetingDateTime: z.string().datetime(),
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
    const data = confirmSchema.parse(body);

    const booking = await prisma.guidanceBooking.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const practitioner = await prisma.practitioner.findUnique({
      where: { id: data.practitionerId },
    });

    if (!practitioner || !practitioner.active) {
      return NextResponse.json({ error: 'Invalid practitioner' }, { status: 400 });
    }

    const meetingDateTime = new Date(data.meetingDateTime);

    const updated = await prisma.guidanceBooking.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        assignedPractitionerId: data.practitionerId,
        meetingLink: data.meetingLink,
        meetingDateTime,
      },
    });

    await sendBookingConfirmedEmail({
      userEmail: booking.user.email,
      userName: booking.user.name || booking.user.email,
      meetingDateTime,
      meetingLink: data.meetingLink,
      timezone: booking.timezone,
    });

    await sendPractitionerAssignmentEmail({
      practitionerEmail: practitioner.email,
      practitionerName: practitioner.name,
      customerName: booking.user.name || booking.user.email,
      meetingDateTime,
      meetingLink: data.meetingLink,
      timezone: booking.timezone,
    });

    return NextResponse.json({ booking: updated });
  } catch (error) {
    console.error('[admin/bookings/confirm]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

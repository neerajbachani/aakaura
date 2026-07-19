import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { PACKAGES } from '@/config/guidance';
import {
  sendBookingConfirmedEmail,
  sendPractitionerAssignmentEmail,
} from '@/lib/email';

const scheduleSessionSchema = z.object({
  packagePurchaseId: z.string(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  notes: z.string().optional(),
  practitionerId: z.string().optional(),
  meetingLink: z.string().url().optional(),
  meetingDateTime: z.string().datetime().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = scheduleSessionSchema.parse(body);

    const pkg = await prisma.packagePurchase.findUnique({
      where: { id: data.packagePurchaseId },
    });

    if (!pkg || pkg.status !== 'ACTIVE' || pkg.remainingCalls <= 0) {
      return NextResponse.json({ error: 'No remaining calls in package' }, { status: 400 });
    }

    if (pkg.expiryDate && new Date() > pkg.expiryDate) {
      return NextResponse.json({ error: 'This package has expired' }, { status: 400 });
    }

    const pkgConfig = PACKAGES[pkg.packageType];

    // Confirm in one step when practitioner, link and datetime are all provided.
    const confirmNow = Boolean(
      data.practitionerId && data.meetingLink && data.meetingDateTime,
    );

    let practitioner = null;
    if (confirmNow) {
      practitioner = await prisma.practitioner.findUnique({
        where: { id: data.practitionerId },
      });
      if (!practitioner || !practitioner.active) {
        return NextResponse.json({ error: 'Invalid practitioner' }, { status: 400 });
      }
    }

    const meetingDateTime = confirmNow ? new Date(data.meetingDateTime!) : null;

    const booking = await prisma.guidanceBooking.create({
      data: {
        userId: pkg.userId,
        bookingType: 'PACKAGE_SESSION',
        status: confirmNow ? 'CONFIRMED' : 'PENDING',
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        notes: data.notes,
        packagePurchaseId: pkg.id,
        duration: pkgConfig.durationMinutes,
        amount: 0,
        paymentStatus: 'PAID',
        assignedPractitionerId: confirmNow ? data.practitionerId : undefined,
        meetingLink: confirmNow ? data.meetingLink : undefined,
        meetingDateTime,
      },
      include: { user: true },
    });

    if (confirmNow && practitioner && meetingDateTime) {
      await sendBookingConfirmedEmail({
        userEmail: booking.user.email,
        userName: booking.user.name || booking.user.email,
        meetingDateTime,
        meetingLink: data.meetingLink!,
        timezone: booking.timezone,
      });

      await sendPractitionerAssignmentEmail({
        practitionerEmail: practitioner.email,
        practitionerName: practitioner.name,
        customerName: booking.user.name || booking.user.email,
        meetingDateTime,
        meetingLink: data.meetingLink!,
        timezone: booking.timezone,
      });
    }

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('[admin/bookings/schedule-session]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

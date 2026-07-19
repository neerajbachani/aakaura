import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  sendBookingReminderEmail,
  sendPackageExpiryReminderEmail,
  sendPractitionerScheduleEmail,
} from '@/lib/email';
import { PACKAGES } from '@/config/guidance';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const oneHourWindow = new Date(now.getTime() + 65 * 60 * 1000);
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const twentyFourWindow = new Date(now.getTime() + 24 * 60 * 60 * 1000 + 30 * 60 * 1000);

    const confirmedBookings = await prisma.guidanceBooking.findMany({
      where: {
        status: 'CONFIRMED',
        meetingDateTime: { not: null },
        meetingLink: { not: null },
      },
      include: {
        user: true,
        assignedPractitioner: true,
      },
    });

    let remindersSent = 0;

    for (const booking of confirmedBookings) {
      if (!booking.meetingDateTime || !booking.meetingLink) continue;

      const reminders = (booking.reminderSentAt as Record<string, string>) || {};

      if (
        booking.meetingDateTime >= oneHourLater &&
        booking.meetingDateTime <= oneHourWindow &&
        !reminders['1h']
      ) {
        await sendBookingReminderEmail({
          userEmail: booking.user.email,
          userName: booking.user.name || booking.user.email,
          meetingDateTime: booking.meetingDateTime,
          meetingLink: booking.meetingLink,
          timezone: booking.timezone,
          hoursBefore: 1,
        });

        if (booking.assignedPractitioner) {
          await sendPractitionerScheduleEmail({
            practitionerEmail: booking.assignedPractitioner.email,
            practitionerName: booking.assignedPractitioner.name,
            bookings: [{
              customerName: booking.user.name || booking.user.email,
              meetingDateTime: booking.meetingDateTime,
              meetingLink: booking.meetingLink,
            }],
            timezone: booking.timezone,
            label: '1-Hour Reminder',
          });
        }

        await prisma.guidanceBooking.update({
          where: { id: booking.id },
          data: { reminderSentAt: { ...reminders, '1h': now.toISOString() } },
        });
        remindersSent++;
      }

      if (
        booking.meetingDateTime >= twentyFourHoursLater &&
        booking.meetingDateTime <= twentyFourWindow &&
        !reminders['24h']
      ) {
        await sendBookingReminderEmail({
          userEmail: booking.user.email,
          userName: booking.user.name || booking.user.email,
          meetingDateTime: booking.meetingDateTime,
          meetingLink: booking.meetingLink,
          timezone: booking.timezone,
          hoursBefore: 24,
        });

        await prisma.guidanceBooking.update({
          where: { id: booking.id },
          data: { reminderSentAt: { ...reminders, '24h': now.toISOString() } },
        });
        remindersSent++;
      }
    }

    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const eightDaysFromNow = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000);

    const expiringPackages = await prisma.packagePurchase.findMany({
      where: {
        status: 'ACTIVE',
        expiryDate: { gte: sevenDaysFromNow, lte: eightDaysFromNow },
        remainingCalls: { gt: 0 },
      },
      include: { user: true },
    });

    for (const pkg of expiringPackages) {
      if (!pkg.expiryDate) continue;
      await sendPackageExpiryReminderEmail({
        userEmail: pkg.user.email,
        userName: pkg.user.name || pkg.user.email,
        packageLabel: PACKAGES[pkg.packageType].label,
        expiryDate: pkg.expiryDate,
        remainingCalls: pkg.remainingCalls,
      });
    }

    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrowEnd = new Date(tomorrowStart);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    const practitioners = await prisma.practitioner.findMany({ where: { active: true } });

    for (const practitioner of practitioners) {
      const tomorrowBookings = await prisma.guidanceBooking.findMany({
        where: {
          assignedPractitionerId: practitioner.id,
          status: 'CONFIRMED',
          meetingDateTime: { gte: tomorrowStart, lt: tomorrowEnd },
          meetingLink: { not: null },
        },
        include: { user: true },
      });

      if (tomorrowBookings.length > 0) {
        await sendPractitionerScheduleEmail({
          practitionerEmail: practitioner.email,
          practitionerName: practitioner.name,
          bookings: tomorrowBookings.map((b) => ({
            customerName: b.user.name || b.user.email,
            meetingDateTime: b.meetingDateTime!,
            meetingLink: b.meetingLink!,
          })),
          timezone: 'Asia/Kolkata',
          label: "Tomorrow's",
        });
      }
    }

    return NextResponse.json({
      success: true,
      remindersSent,
      expiringPackagesNotified: expiringPackages.length,
    });
  } catch (error) {
    console.error('[cron/booking-reminders]', error);
    return NextResponse.json({ error: 'Cron failed' }, { status: 500 });
  }
}

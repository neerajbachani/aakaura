import { prisma } from '@/lib/prisma';
import { sendCallCompletedEmail } from '@/lib/email';

export async function completeBooking(bookingId: string) {
  const booking = await prisma.guidanceBooking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      packagePurchase: true,
    },
  });

  if (!booking) throw new Error('Booking not found');
  if (booking.status === 'COMPLETED') return booking;

  const updated = await prisma.guidanceBooking.update({
    where: { id: bookingId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
    },
  });

  if (booking.bookingType === 'GUIDANCE_CALL') {
    // Coupons are no longer auto-issued here. A guidance-call customer becomes
    // eligible only after a qualifying website order (> ₹999); an admin then
    // issues the coupon manually. Send a thank-you email with eligibility info.
    await sendCallCompletedEmail({
      userEmail: booking.user.email,
      userName: booking.user.name || booking.user.email,
    });
  } else if (booking.packagePurchaseId && booking.packagePurchase) {
    const remaining = booking.packagePurchase.remainingCalls - 1;
    const newStatus = remaining <= 0 ? 'COMPLETED' : 'ACTIVE';

    await prisma.packagePurchase.update({
      where: { id: booking.packagePurchaseId },
      data: {
        remainingCalls: Math.max(0, remaining),
        status: newStatus,
      },
    });

    await sendCallCompletedEmail({
      userEmail: booking.user.email,
      userName: booking.user.name || booking.user.email,
    });
  }

  return { booking: updated, coupon: null };
}

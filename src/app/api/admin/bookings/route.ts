import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { PACKAGES } from '@/config/guidance';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const bookingType = searchParams.get('bookingType');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status;
    }
    if (bookingType && bookingType !== 'all') {
      where.bookingType = bookingType;
    }
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { user: { phone: { contains: search } } },
      ];
    }

    const [bookings, totalCount] = await Promise.all([
      prisma.guidanceBooking.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          assignedPractitioner: { select: { name: true } },
          coupon: { select: { code: true } },
          packagePurchase: { select: { id: true, packageType: true } },
        },
      }),
      prisma.guidanceBooking.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      bookings: bookings.map((b) => ({
        id: b.id,
        customerName: b.user.name || b.user.email,
        customerEmail: b.user.email,
        customerPhone: b.user.phone,
        preferredDate: b.preferredDate,
        preferredTime: b.preferredTime,
        preferredPractitioner: b.preferredPractitioner,
        status: b.status,
        paymentStatus: b.paymentStatus,
        bookingType: b.bookingType,
        amount: b.amount,
        practitionerName: b.assignedPractitioner?.name,
        meetingDateTime: b.meetingDateTime,
        couponEligible: b.couponEligible,
        couponIssued: !!b.coupon,
        couponCode: b.coupon?.code || null,
        packagePurchaseId: b.packagePurchase?.id || null,
        packageLabel: b.packagePurchase ? PACKAGES[b.packagePurchase.packageType].label : null,
        createdAt: b.createdAt,
      })),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('[admin/bookings]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

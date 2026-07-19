import { NextRequest, NextResponse } from 'next/server';
import { PackageStatus, PackageType } from '@prisma/client';
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
    const packageType = searchParams.get('packageType');
    const search = searchParams.get('search');
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status as PackageStatus;
    }
    if (packageType && packageType !== 'all') {
      where.packageType = packageType as PackageType;
    }
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { phone: { contains: search } },
        ],
      };
    }

    const [packages, totalCount] = await Promise.all([
      prisma.packagePurchase.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true, phone: true } },
          bookings: { select: { status: true } },
        },
      }),
      prisma.packagePurchase.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      packages: packages.map((p) => {
        const totalCalls = PACKAGES[p.packageType].calls;
        const completedSessions = p.bookings.filter((b) => b.status === 'COMPLETED').length;
        const scheduledSessions = p.bookings.filter(
          (b) => b.status === 'PENDING' || b.status === 'CONFIRMED' || b.status === 'RESCHEDULED',
        ).length;

        return {
          id: p.id,
          customerName: p.user.name || p.user.email,
          customerEmail: p.user.email,
          customerPhone: p.user.phone,
          packageType: p.packageType,
          packageLabel: PACKAGES[p.packageType].label,
          status: p.status,
          amount: p.amount,
          paymentStatus: p.paymentStatus,
          expiryDate: p.expiryDate,
          remainingCalls: p.remainingCalls,
          totalCalls,
          completedSessions,
          scheduledSessions,
          createdAt: p.createdAt,
        };
      }),
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('[admin/packages]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

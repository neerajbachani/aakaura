import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/admin/waitlist - Get all waitlist items with user information
export async function GET(request: NextRequest) {
    try {
        console.log('[Auth Debug] Admin Journeys - All cookies:',
            Array.from(request.cookies.getAll()).map(c => `${c.name}=${c.value.substring(0, 20)}...`));
        const user = await requireAuth(request);

        // Check if user is admin
        if (user.role === 'admin') {
            // Environment-based admin
        } else if (user.userId) {
            const userRecord = await prisma.user.findUnique({
                where: { id: user.userId },
                select: { role: true },
            });

            if (userRecord?.role !== 'ADMIN') {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 403 }
                );
            }
        } else {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }

        // Get all waitlist items with user details
        const waitlistItems = await prisma.waitlistItem.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        phone: true,
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Group by product for easier admin viewing
        const groupedByProduct: Record<string, any> = {};

        waitlistItems.forEach((item) => {
            const key = `${item.journeySlug}-${item.productId}-${item.clientType}`;

            if (!groupedByProduct[key]) {
                groupedByProduct[key] = {
                    journeySlug: item.journeySlug,
                    productId: item.productId,
                    productName: item.productName,
                    clientType: item.clientType,
                    users: [],
                    totalCount: 0,
                };
            }

            groupedByProduct[key].users.push({
                id: item.user.id,
                email: item.user.email,
                name: item.user.name,
                phone: item.user.phone,
                addedAt: item.createdAt,
            });

            groupedByProduct[key].totalCount++;
        });

        return NextResponse.json({
            waitlistItems,
            groupedByProduct: Object.values(groupedByProduct),
            totalItems: waitlistItems.length,
        });
    } catch (error: any) {
        console.error('Error fetching admin waitlist:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch waitlist data' },
            { status: 500 }
        );
    }
}

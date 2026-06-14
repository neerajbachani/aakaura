import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from "@/middleware/auth";

// GET /api/admin/wishlist - Get all wishlist items with user information
export async function GET(request: NextRequest) {
    try {
        const adminUser = await verifyAdminToken(request);
        if (!adminUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const wishlistItems = await prisma.wishlistItem.findMany({
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

        const groupedByProduct: Record<string, any> = {};

        wishlistItems.forEach((item) => {
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
            wishlistItems,
            groupedByProduct: Object.values(groupedByProduct),
            totalItems: wishlistItems.length,
        });
    } catch (error: any) {
        console.error('Error fetching admin wishlist:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch wishlist data' },
            { status: 500 }
        );
    }
}

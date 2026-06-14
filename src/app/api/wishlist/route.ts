import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { sendWishlistEmail } from '@/lib/email';

// GET /api/wishlist - Get current user's wishlist items
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request);

        if (!user.userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        const userId = user.userId;

        const wishlistItems = await prisma.wishlistItem.findMany({
            where: {
                userId: userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ wishlistItems });
    } catch (error: any) {
        console.error('Error fetching wishlist:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch wishlist' },
            { status: 500 }
        );
    }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        const body = await request.json();

        const { journeySlug, productId, productName, clientType } = body;

        if (!user.userId || !journeySlug || !productId || !productName || !clientType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const userId = user.userId;

        if (!['soul-luxury', 'energy-curious'].includes(clientType)) {
            return NextResponse.json(
                { error: 'Invalid client type' },
                { status: 400 }
            );
        }

        const wishlistItem = await prisma.wishlistItem.upsert({
            where: {
                userId_journeySlug_productId_clientType: {
                    userId: userId,
                    journeySlug,
                    productId,
                    clientType,
                },
            },
            update: {
                productName,
            },
            create: {
                userId: userId,
                journeySlug,
                productId,
                productName,
                clientType,
            },
        });

        if (user.email) {
            sendWishlistEmail({
                userEmail: user.email,
                productName,
            }).catch(console.error);
        }

        return NextResponse.json({
            message: 'Added to wishlist',
            wishlistItem,
        });
    } catch (error: any) {
        console.error('Error adding to wishlist:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to add to wishlist' },
            { status: 500 }
        );
    }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        const { searchParams } = new URL(request.url);

        const journeySlug = searchParams.get('journeySlug');
        const productId = searchParams.get('productId');
        const clientType = searchParams.get('clientType');

        if (!user.userId || !journeySlug || !productId || !clientType) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        const userId = user.userId;

        await prisma.wishlistItem.delete({
            where: {
                userId_journeySlug_productId_clientType: {
                    userId: userId,
                    journeySlug,
                    productId,
                    clientType,
                },
            },
        });

        return NextResponse.json({
            message: 'Removed from wishlist',
        });
    } catch (error: any) {
        console.error('Error removing from wishlist:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Item not found in wishlist' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to remove from wishlist' },
            { status: 500 }
        );
    }
}

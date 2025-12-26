import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// GET /api/waitlist - Get current user's waitlist items
export async function GET(request: NextRequest) {
    try {
        const user = await requireAuth(request);

        const waitlistItems = await prisma.waitlistItem.findMany({
            where: {
                userId: user.userId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ waitlistItems });
    } catch (error: any) {
        console.error('Error fetching waitlist:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch waitlist' },
            { status: 500 }
        );
    }
}

// POST /api/waitlist - Add item to waitlist
export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        const body = await request.json();

        const { journeySlug, productId, productName, clientType } = body;

        // Validate required fields
        if (!journeySlug || !productId || !productName || !clientType) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate clientType
        if (!['soul-luxury', 'energy-curious'].includes(clientType)) {
            return NextResponse.json(
                { error: 'Invalid client type' },
                { status: 400 }
            );
        }

        // Create or update waitlist item (upsert to handle duplicates gracefully)
        const waitlistItem = await prisma.waitlistItem.upsert({
            where: {
                userId_journeySlug_productId_clientType: {
                    userId: user.userId,
                    journeySlug,
                    productId,
                    clientType,
                },
            },
            update: {
                productName, // Update product name in case it changed
            },
            create: {
                userId: user.userId,
                journeySlug,
                productId,
                productName,
                clientType,
            },
        });

        return NextResponse.json({
            message: 'Added to waitlist',
            waitlistItem
        });
    } catch (error: any) {
        console.error('Error adding to waitlist:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to add to waitlist' },
            { status: 500 }
        );
    }
}

// DELETE /api/waitlist - Remove item from waitlist
export async function DELETE(request: NextRequest) {
    try {
        const user = await requireAuth(request);
        const { searchParams } = new URL(request.url);

        const journeySlug = searchParams.get('journeySlug');
        const productId = searchParams.get('productId');
        const clientType = searchParams.get('clientType');

        if (!journeySlug || !productId || !clientType) {
            return NextResponse.json(
                { error: 'Missing required parameters' },
                { status: 400 }
            );
        }

        // Delete the waitlist item
        await prisma.waitlistItem.delete({
            where: {
                userId_journeySlug_productId_clientType: {
                    userId: user.userId,
                    journeySlug,
                    productId,
                    clientType,
                },
            },
        });

        return NextResponse.json({
            message: 'Removed from waitlist'
        });
    } catch (error: any) {
        console.error('Error removing from waitlist:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // Handle case where item doesn't exist
        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: 'Item not found in waitlist' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to remove from waitlist' },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

// PATCH /api/admin/journeys/[slug]/products - Update product settings
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await requireAuth(request);

        // Check if user is admin
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

        const { slug } = await params;
        const body = await request.json();
        const { productId, isWaitlist } = body;

        if (!productId || typeof isWaitlist !== 'boolean') {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Get the journey
        const journey = await prisma.journey.findUnique({
            where: { slug },
        });

        if (!journey) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }

        // Update product settings
        const currentSettings = (journey.productSettings as Record<string, any>) || {};

        currentSettings[productId] = {
            isWaitlist,
            updatedAt: new Date().toISOString(),
            updatedBy: user.userId,
        };

        const updatedJourney = await prisma.journey.update({
            where: { slug },
            data: {
                productSettings: currentSettings,
            },
        });

        return NextResponse.json({
            message: 'Product settings updated',
            journey: updatedJourney,
        });
    } catch (error: any) {
        console.error('Error updating product settings:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to update product settings' },
            { status: 500 }
        );
    }
}

// GET /api/admin/journeys/[slug]/products - Get product settings
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await requireAuth(request);

        // Check if user is admin
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

        const { slug } = await params;

        const journey = await prisma.journey.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                name: true,
                content: true,
                productSettings: true,
            },
        });

        if (!journey) {
            return NextResponse.json(
                { error: 'Journey not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ journey });
    } catch (error: any) {
        console.error('Error fetching product settings:', error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to fetch product settings' },
            { status: 500 }
        );
    }
}

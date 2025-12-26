import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        // Require authentication
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

        const journeys = await prisma.journey.findMany({
            orderBy: { createdAt: 'asc' } // Or by a specific order field if added
        });

        return NextResponse.json({
            journeys,
            count: journeys.length
        });
    } catch (error: any) {
        console.error("Error fetching journeys:", error);

        if (error.message === 'Authentication required') {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch journeys" },
            { status: 500 }
        );
    }
}

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/middleware/auth";

export async function GET(request: NextRequest) {
    try {
        // Debug: Log all cookies received
        console.log('[Auth Debug] Admin Journeys - All cookies:',
            Array.from(request.cookies.getAll()).map(c => `${c.name}=${c.value.substring(0, 20)}...`));


        // Check for admin token
        const adminUser = await verifyAdminToken(request);
        if (!adminUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
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

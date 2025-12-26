import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ slug: string }> } // Fix types for Next.js 15
) {
    try {
        const { slug } = await params;
        const body = await request.json();

        const journey = await prisma.journey.update({
            where: { slug },
            data: body,
        });

        return NextResponse.json({
            success: true,
            data: journey
        });
    } catch (error) {
        console.error("Error updating journey:", error);
        return NextResponse.json(
            { error: "Failed to update journey" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const journey = await prisma.journey.findUnique({
            where: { slug }
        });

        if (!journey) {
            return NextResponse.json(
                { error: "Journey not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(journey);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch journey" },
            { status: 500 }
        );
    }
}


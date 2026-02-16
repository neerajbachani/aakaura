import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
        console.error("Error fetching journey:", error);
        return NextResponse.json(
            { error: "Failed to fetch journey" },
            { status: 500 }
        );
    }
}

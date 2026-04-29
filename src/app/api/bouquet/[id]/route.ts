import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const bouquet = await prisma.bouquet.findUnique({
      where: { id },
    });

    if (!bouquet) {
      return NextResponse.json({ message: "Bouquet not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, bouquet }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching bouquet:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

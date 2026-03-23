import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chakras, to, message, from } = body;

    if (!chakras || !Array.isArray(chakras) || chakras.length < 6 || chakras.length > 10) {
      return NextResponse.json(
        { message: "You must select between 6 and 10 chakras." },
        { status: 400 }
      );
    }

    if (!to || !message || !from) {
      return NextResponse.json(
        { message: "To, Message, and From fields are required." },
        { status: 400 }
      );
    }

    const bouquet = await prisma.bouquet.create({
      data: {
        chakras,
        to,
        message,
        from,
      },
    });

    return NextResponse.json({ success: true, bouquet }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bouquet:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

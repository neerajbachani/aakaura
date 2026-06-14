import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createRazorpayOrderSchema = z.object({
  total: z.number().min(1),
  items: z.array(z.any()).optional(),
  customerInfo: z
    .object({
      name: z.string(),
      email: z.string(),
      phone: z.string(),
      zipCode: z.string().optional(),
    })
    .optional(),
});

async function cartItemsHaveBonsai(items: any[]): Promise<boolean> {
  const productIds = items
    .filter((i) => i.productId)
    .map((i) => i.productId as string);
  const comboIds = items
    .filter((i) => i.comboId)
    .map((i) => i.comboId as string);

  const [products, combos] = await Promise.all([
    productIds.length
      ? prisma.product.findMany({
          where: { id: { in: productIds } },
          include: { category: true },
        })
      : Promise.resolve([]),
    comboIds.length
      ? prisma.combo.findMany({
          where: { id: { in: comboIds } },
          include: {
            products: {
              include: {
                product: { include: { category: true } },
              },
            },
          },
        })
      : Promise.resolve([]),
  ]);

  if (
    products.some((p) => p.category?.name?.toLowerCase() === "bonsai")
  ) {
    return true;
  }

  return combos.some((combo) =>
    combo.products.some(
      (cp) => cp.product.category?.name?.toLowerCase() === "bonsai",
    ),
  );
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    jwt.verify(token, process.env.JWT_SECRET!);

    const body = await request.json();
    const { total, items, customerInfo } =
      createRazorpayOrderSchema.parse(body);

    if (items && items.length > 0) {
      const hasBonsai = await cartItemsHaveBonsai(items);
      if (hasBonsai) {
        const zipCode = customerInfo?.zipCode || "";
        if (!zipCode.startsWith("302") && !zipCode.startsWith("303")) {
          return NextResponse.json(
            {
              error:
                "Bonsai products are only available for delivery in Jaipur (Pincodes 302* and 303*).",
            },
            { status: 400 },
          );
        }
      }
    }

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway configuration error" },
        { status: 500 },
      );
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options: any = {
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    if (items || customerInfo) {
      options.notes = {
        customer_name: customerInfo?.name || "N/A",
        customer_email: customerInfo?.email || "N/A",
        customer_phone: customerInfo?.phone || "N/A",
        item_count: items?.length?.toString() || "0",
        items_summary:
          items
            ?.map((i: any) =>
              i.comboId
                ? `combo:${i.comboId}(${i.quantity})`
                : `${i.productId}(${i.quantity})`,
            )
            .join(", ")
            .substring(0, 250) || "N/A",
      };
    }

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

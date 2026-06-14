import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { resolveComboPricing } from "@/lib/comboPricing";

const orderItemSchema = z
  .object({
    productId: z.string().min(1).optional(),
    comboId: z.string().min(1).optional(),
    variationId: z.string().nullable().optional(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })
  .refine((data) => Boolean(data.productId) !== Boolean(data.comboId), {
    message: "Each order item must have either productId or comboId",
  });

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  total: z.number().min(0),
  shippingDetails: z
    .object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
      country: z.string().optional(),
      phone: z.string().optional(),
    })
    .optional(),
  razorpayPaymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

function getProductEffectivePrice(
  product: { price: number; offerPrice?: number | null },
  variation?: { price?: number | null; offerPrice?: number | null } | null,
): number {
  const regular = variation?.price ?? product.price;
  const offer = variation?.offerPrice ?? product.offerPrice;
  if (offer != null && offer < regular) return offer;
  return regular;
}

async function orderHasBonsai(
  items: z.infer<typeof orderItemSchema>[],
): Promise<boolean> {
  const productIds = items
    .filter((i) => i.productId)
    .map((i) => i.productId!);
  const comboIds = items.filter((i) => i.comboId).map((i) => i.comboId!);

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

  const directBonsai = products.some(
    (p) => p.category?.name?.toLowerCase() === "bonsai",
  );
  const comboBonsai = combos.some((combo) =>
    combo.products.some(
      (cp) => cp.product.category?.name?.toLowerCase() === "bonsai",
    ),
  );
  return directBonsai || comboBonsai;
}

// Create order from cart
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const body = await request.json();

    const validatedData = createOrderSchema.parse(body);
    const {
      items,
      total,
      shippingDetails,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
    } = validatedData;

    let paymentStatus: "PENDING" | "PAID" = "PENDING";

    if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json(
          { error: "Payment gateway configuration error" },
          { status: 500 },
        );
      }

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest("hex");

      if (expectedSignature === razorpaySignature) {
        paymentStatus = "PAID";
      } else {
        return NextResponse.json(
          { error: "Invalid payment signature" },
          { status: 400 },
        );
      }
    }

    const productIds = items
      .filter((i) => i.productId)
      .map((i) => i.productId!);
    const comboIds = items.filter((i) => i.comboId).map((i) => i.comboId!);

    const [products, combos] = await Promise.all([
      productIds.length
        ? prisma.product.findMany({
            where: { id: { in: productIds } },
            include: { variations: true, category: true },
          })
        : Promise.resolve([]),
      comboIds.length
        ? prisma.combo.findMany({
            where: { id: { in: comboIds } },
            include: {
              products: {
                include: {
                  product: { select: { price: true, offerPrice: true } },
                  variation: { select: { price: true, offerPrice: true } },
                },
              },
            },
          })
        : Promise.resolve([]),
    ]);

    let serverSubtotal = 0;
    for (const item of items) {
      if (item.comboId) {
        const combo = combos.find((c) => c.id === item.comboId);
        if (!combo) {
          return NextResponse.json({ error: "Combo not found" }, { status: 404 });
        }
        const expected = resolveComboPricing(combo).effective;
        if (Math.abs(item.price - expected) > 0.01) {
          return NextResponse.json(
            { error: "Combo price mismatch" },
            { status: 400 },
          );
        }
        serverSubtotal += expected * item.quantity;
        continue;
      }

      const prod = products.find((p) => p.id === item.productId);
      if (!prod) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      const variation = prod.variations?.find((v) => v.id === item.variationId);
      const expected = getProductEffectivePrice(prod, variation);
      if (Math.abs(item.price - expected) > 0.01) {
        return NextResponse.json(
          { error: "Product price mismatch" },
          { status: 400 },
        );
      }
      serverSubtotal += expected * item.quantity;
    }

    if (Math.abs(total - serverSubtotal) > 0.01) {
      return NextResponse.json({ error: "Order total mismatch" }, { status: 400 });
    }

    if (await orderHasBonsai(items)) {
      const zipCode = shippingDetails?.zipCode || "";
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

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
          userId: decoded.userId,
          subtotal: serverSubtotal,
          total,
          status: "PENDING",
          paymentStatus,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          shippingName: shippingDetails
            ? `${shippingDetails.firstName || ""} ${shippingDetails.lastName || ""}`.trim()
            : "",
          shippingPhone: shippingDetails?.phone || "",
          shippingAddress: shippingDetails?.address || "",
          shippingCity: shippingDetails?.city || "",
          shippingState: shippingDetails?.state || "",
          shippingPincode: shippingDetails?.zipCode || "",
        },
      });

      const orderItems = await Promise.all(
        items.map((item) => {
          if (item.comboId) {
            const combo = combos.find((c) => c.id === item.comboId)!;
            return tx.orderItem.create({
              data: {
                orderId: newOrder.id,
                comboId: item.comboId,
                quantity: item.quantity,
                price: item.price,
                productName: combo.name,
                productImage: combo.images?.[0] || "/images/placeholder.png",
                comboName: combo.name,
                comboImage: combo.images?.[0] || "/images/placeholder.png",
                total: item.quantity * item.price,
              },
            });
          }

          const prod = products.find((p) => p.id === item.productId)!;
          const variation = prod.variations?.find(
            (v) => v.id === item.variationId,
          );

          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId!,
              variationId: item.variationId,
              quantity: item.quantity,
              price: item.price,
              productName: prod.name,
              productImage: prod.images?.[0] || "/images/placeholder.png",
              variationName: variation?.name || undefined,
              total: item.quantity * item.price,
            },
          });
        }),
      );

      await tx.cartItem.deleteMany({
        where: { userId: decoded.userId },
      });

      return { ...newOrder, items: orderItems };
    });

    const completeOrder = await prisma.order.findUnique({
      where: { id: order.id },
      include: {
        user: { select: { email: true, name: true } },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
                category: { select: { name: true } },
              },
            },
            combo: {
              select: { id: true, name: true, images: true },
            },
            variation: {
              select: { id: true, name: true },
            },
          },
        },
      },
    });

    if (completeOrder && completeOrder.user) {
      await sendOrderConfirmationEmail(
        completeOrder,
        completeOrder.user.email,
        completeOrder.user.name || "",
      );
    }

    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Get user orders
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const orders = await prisma.order.findMany({
      where: { userId: decoded.userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
            combo: {
              select: { id: true, name: true, images: true },
            },
            variation: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

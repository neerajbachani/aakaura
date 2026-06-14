import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { resolveComboPricing } from "@/lib/comboPricing";

function getItemRegularPrice(item: {
  combo?: Parameters<typeof resolveComboPricing>[0] | null;
  product?: { price: number } | null;
  variation?: { price?: number | null } | null;
}): number {
  if (item.combo) {
    return resolveComboPricing(item.combo).original;
  }
  return item.variation?.price ?? item.product?.price ?? 0;
}

function getItemEffectivePrice(item: {
  combo?: Parameters<typeof resolveComboPricing>[0] | null;
  product?: { price: number; offerPrice?: number | null } | null;
  variation?: {
    price?: number | null;
    offerPrice?: number | null;
  } | null;
}): number {
  if (item.combo) {
    return resolveComboPricing(item.combo).effective;
  }
  const regular = item.variation?.price ?? item.product?.price ?? 0;
  const offer = item.variation?.offerPrice ?? item.product?.offerPrice;
  if (offer != null && offer < regular) return offer;
  return regular;
}

// Get user cart
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

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: decoded.userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
            offerPrice: true,
            category: { select: { name: true } },
          },
        },
        combo: {
          select: {
            id: true,
            name: true,
            images: true,
            price: true,
            offerPrice: true,
      products: {
        include: {
          product: {
            select: {
              price: true,
              offerPrice: true,
              category: { select: { name: true } },
            },
          },
          variation: { select: { price: true, offerPrice: true } },
        },
      },
          },
        },
        variation: {
          select: {
            id: true,
            name: true,
            price: true,
            offerPrice: true,
            inStock: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const items = cartItems.map((item) => {
      if (!item.combo) return item;
      const comboPricing = resolveComboPricing(item.combo);
      return { ...item, comboPricing };
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    const totalPrice = items.reduce(
      (sum, item) => sum + getItemRegularPrice(item) * item.quantity,
      0,
    );

    const totalOfferPrice = items.reduce(
      (sum, item) => sum + getItemEffectivePrice(item) * item.quantity,
      0,
    );

    const cart = {
      items,
      totalItems,
      totalPrice,
      totalOfferPrice:
        totalOfferPrice !== totalPrice ? totalOfferPrice : undefined,
    };

    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

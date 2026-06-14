import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { resolveComboPricing } from "@/lib/comboPricing";

const db = prisma as any;

const addToCartSchema = z
  .object({
    productId: z.string().min(1).optional(),
    comboId: z.string().min(1).optional(),
    variationId: z.string().min(1).optional(),
    quantity: z.number().int().min(1).max(99),
  })
  .refine((data) => Boolean(data.productId) !== Boolean(data.comboId), {
    message: "Provide either productId or comboId, not both",
  });

const cartInclude = {
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
} as const;

function attachComboPricing(item: any) {
  if (!item.combo) return item;
  const comboPricing = resolveComboPricing(item.combo);
  return { ...item, comboPricing };
}

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
    const validatedData = addToCartSchema.parse(body);
    const { productId, comboId, variationId, quantity } = validatedData;

    if (comboId) {
      const combo = await db.combo.findUnique({
        where: { id: comboId },
        include: {
          products: {
            include: {
              product: { select: { price: true, offerPrice: true } },
              variation: { select: { price: true, offerPrice: true } },
            },
          },
        },
      });

      if (!combo) {
        return NextResponse.json({ error: "Combo not found" }, { status: 404 });
      }

      const existingComboItem = await db.cartItem.findFirst({
        where: {
          userId: decoded.userId,
          comboId,
        },
      });

      let cartItem;
      if (existingComboItem) {
        cartItem = await db.cartItem.update({
          where: { id: existingComboItem.id },
          data: { quantity: existingComboItem.quantity + quantity },
          include: cartInclude,
        });
      } else {
        cartItem = await db.cartItem.create({
          data: {
            userId: decoded.userId,
            comboId,
            quantity,
          },
          include: cartInclude,
        });
      }

      return NextResponse.json(attachComboPricing(cartItem), { status: 201 });
    }

    // Product flow (unchanged)
    const product = await prisma.product.findUnique({
      where: { id: productId! },
      include: { variations: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (variationId) {
      const variation = product.variations.find((v) => v.id === variationId);
      if (!variation) {
        return NextResponse.json(
          { error: "Product variation not found" },
          { status: 404 },
        );
      }
      if (!variation.inStock) {
        return NextResponse.json(
          { error: "Product variation is out of stock" },
          { status: 400 },
        );
      }
    }

    const existingCartItem = variationId
      ? await prisma.cartItem.findUnique({
          where: {
            userId_productId_variationId: {
              userId: decoded.userId,
              productId: productId!,
              variationId,
            },
          },
        })
      : await prisma.cartItem.findFirst({
          where: {
            userId: decoded.userId,
            productId: productId!,
            variationId: null,
          },
        });

    let cartItem;
    if (existingCartItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: cartInclude,
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId: decoded.userId,
          productId: productId!,
          variationId: variationId ?? null,
          quantity,
        },
        include: cartInclude,
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 },
      );
    }

    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

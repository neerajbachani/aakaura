import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';



const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variationId: z.string().uuid().optional(),
  quantity: z.number().int().min(1).max(99),
});

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const body = await request.json();
    
    const validatedData = addToCartSchema.parse(body);
    const { productId, variationId, quantity } = validatedData;

    // Verify product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        variations: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // If variation is specified, verify it exists and is in stock
    if (variationId) {
      const variation = product.variations.find((v: any) => v.id === variationId);
      if (!variation) {
        return NextResponse.json({ error: 'Product variation not found' }, { status: 404 });
      }
      if (!variation.inStock) {
        return NextResponse.json({ error: 'Product variation is out of stock' }, { status: 400 });
      }
    }

    // Check if item already exists in cart
    // Check if item already exists in cart
const existingCartItem = variationId
  ? await prisma.cartItem.findUnique({
      where: {
        userId_productId_variationId: {
          userId: decoded.userId,
          productId,
          variationId,
        },
      },
    })
  : await prisma.cartItem.findFirst({
      where: {
        userId: decoded.userId,
        productId,
        variationId: null,
      },
    });

    let cartItem;

    if (existingCartItem) {
      // Update existing cart item
      cartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              offerPrice: true,
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
      });
    } else {
      // Create new cart item
      cartItem = await prisma.cartItem.create({
        data: {
          userId: decoded.userId,
          productId,
          variationId: variationId ?? null,
          quantity,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              images: true,
              price: true,
              offerPrice: true,
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
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
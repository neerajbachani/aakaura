import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateCartSchema = z.object({
  cartItemId: z.string().uuid(),
  quantity: z.number().int().min(1).max(99),
});

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const body = await request.json();
    
    const validatedData = updateCartSchema.parse(body);
    const { cartItemId, quantity } = validatedData;

    // Verify cart item belongs to user
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        id: cartItemId,
        userId: decoded.userId,
      },
    });

    if (!existingCartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 });
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
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

    return NextResponse.json(updatedCartItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
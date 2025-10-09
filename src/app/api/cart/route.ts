import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

// Get user cart
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    
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
      orderBy: { createdAt: 'desc' },
    });

    // Calculate totals
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    const totalPrice = cartItems.reduce((sum, item) => {
      const itemPrice = item.variation?.price || item.product.price;
      return sum + (itemPrice * item.quantity);
    }, 0);

    const totalOfferPrice = cartItems.reduce((sum, item) => {
      const itemOfferPrice = item.variation?.offerPrice || item.product.offerPrice;
      if (itemOfferPrice) {
        return sum + (itemOfferPrice * item.quantity);
      }
      const itemPrice = item.variation?.price || item.product.price;
      return sum + (itemPrice * item.quantity);
    }, 0);

    const cart = {
      items: cartItems,
      totalItems,
      totalPrice,
      totalOfferPrice: totalOfferPrice !== totalPrice ? totalOfferPrice : undefined,
    };

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
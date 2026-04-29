import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { z } from 'zod';
import crypto from 'crypto';
import { sendOrderConfirmationEmail } from '@/lib/email';

import { prisma } from "@/lib/prisma";

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    variationId: z.string().min(1).optional(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })),
  total: z.number().min(0),
  shippingDetails: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  razorpayPaymentId: z.string().optional(),
  razorpayOrderId: z.string().optional(),
  razorpaySignature: z.string().optional(),
});

// Create order from cart
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const body = await request.json();
    
    const validatedData = createOrderSchema.parse(body);
    const { items, total, shippingDetails, razorpayPaymentId, razorpayOrderId, razorpaySignature } = validatedData;

    // If razorpay details are present, verify signature
    let paymentStatus: 'PENDING' | 'PAID' = 'PENDING';
    
    if (razorpayPaymentId && razorpayOrderId && razorpaySignature) {
      if (!process.env.RAZORPAY_KEY_SECRET) {
        return NextResponse.json({ error: 'Payment gateway configuration error' }, { status: 500 });
      }

      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpayOrderId}|${razorpayPaymentId}`)
        .digest('hex');

      if (expectedSignature === razorpaySignature) {
        paymentStatus = 'PAID';
      } else {
        return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
      }
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber: `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
          userId: decoded.userId,
          total,
          status: 'PENDING',
          paymentStatus,
          razorpayOrderId,
          razorpayPaymentId,
          razorpaySignature,
          shippingName: shippingDetails ? `${shippingDetails.firstName || ''} ${shippingDetails.lastName || ''}`.trim() : '',
          shippingPhone: shippingDetails?.phone || '',
          shippingAddress: shippingDetails?.address || '',
          shippingCity: shippingDetails?.city || '',
          shippingState: shippingDetails?.state || '',
          shippingPincode: shippingDetails?.zipCode || '',
        },
      });

      // Get product details for snapshot
      const products = await tx.product.findMany({
        where: { id: { in: items.map(i => i.productId) } },
        include: { variations: true }
      });

      // Create order items
      const orderItems = await Promise.all(
        items.map(item => {
          const prod = products.find(p => p.id === item.productId);
          const variation = prod?.variations?.find(v => v.id === item.variationId);
          
          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              variationId: item.variationId,
              quantity: item.quantity,
              price: item.price,
              productName: prod?.name || 'Unknown Product',
              productImage: prod?.images?.[0] || '/images/placeholder.png',
              variationName: variation?.name || undefined,
              total: item.quantity * item.price,
            },
          });
        })
      );

      // Clear the user's cart
      await tx.cartItem.deleteMany({
        where: { userId: decoded.userId },
      });

      return { ...newOrder, items: orderItems };
    });

    // Fetch the complete order with relations
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
              },
            },
            variation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (completeOrder && completeOrder.user) {
      await sendOrderConfirmationEmail(completeOrder, completeOrder.user.email, completeOrder.user.name || '');
    }

    return NextResponse.json(completeOrder, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Get user orders
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };

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
            variation: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { signupSchema } from '@/lib/validations/auth';
import { hashPassword, generateToken, setAuthCookie } from '@/lib/auth';


const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validatedData = signupSchema.parse(body);
    const { name, email, phone, password } = validatedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        createdAt: true,
      },
    });

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Set auth cookie
    await setAuthCookie(token);

    // Handle guest cart migration if provided
    const guestCartItems = body.guestCart;
    if (guestCartItems && Array.isArray(guestCartItems) && guestCartItems.length > 0) {
      try {
        // Add guest cart items to user's cart
        for (const item of guestCartItems) {
          if (item.comboId) {
            const existingCombo = await prisma.cartItem.findFirst({
              where: { userId: user.id, comboId: item.comboId },
            });
            if (existingCombo) {
              await prisma.cartItem.update({
                where: { id: existingCombo.id },
                data: { quantity: { increment: item.quantity } },
              });
            } else {
              await prisma.cartItem.create({
                data: {
                  userId: user.id,
                  comboId: item.comboId,
                  quantity: item.quantity,
                },
              });
            }
            continue;
          }

          if (!item.productId) continue;

          const existingProductItem = item.variationId
            ? await prisma.cartItem.findUnique({
                where: {
                  userId_productId_variationId: {
                    userId: user.id,
                    productId: item.productId,
                    variationId: item.variationId,
                  },
                },
              })
            : await prisma.cartItem.findFirst({
                where: {
                  userId: user.id,
                  productId: item.productId,
                  variationId: null,
                },
              });

          if (existingProductItem) {
            await prisma.cartItem.update({
              where: { id: existingProductItem.id },
              data: { quantity: { increment: item.quantity } },
            });
          } else {
            await prisma.cartItem.create({
              data: {
                userId: user.id,
                productId: item.productId,
                variationId: item.variationId ?? null,
                quantity: item.quantity,
              },
            });
          }
        }
      } catch (cartError) {
        console.error('Error migrating guest cart:', cartError);
        // Don't fail signup if cart migration fails
      }
    }

    return NextResponse.json({
      user,
      message: 'Account created successfully',
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
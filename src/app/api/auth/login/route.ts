import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { loginSchema } from '@/lib/validations/auth';
import { verifyPassword, generateToken, setAuthCookie } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = loginSchema.parse(body);
    const { email, password } = validatedData;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Set auth cookie
    await setAuthCookie(token);
    console.log('[Auth Debug] Login successful - Cookie set for user:', user.email);

    // Handle guest cart migration if provided
    const guestCartItems = body.guestCart;
    if (guestCartItems && Array.isArray(guestCartItems) && guestCartItems.length > 0) {
      try {
        // Merge guest cart items with user's existing cart
        for (const item of guestCartItems) {
          await prisma.cartItem.upsert({
            where: {
              userId_productId_variationId: {
                userId: user.id,
                productId: item.productId,
                variationId: item.variationId ?? null,
              },
            },
            update: {
              quantity: {
                increment: item.quantity,
              },
            },
            create: {
              userId: user.id,
              productId: item.productId,
              variationId: item.variationId ?? null,
              quantity: item.quantity,
            },
          });
        }
      } catch (cartError) {
        console.error('Error migrating guest cart:', cartError);
        // Don't fail login if cart migration fails
      }
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful',
    });

  } catch (error) {
    console.error('Login error:', error);

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
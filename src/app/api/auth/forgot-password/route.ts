import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { forgotPasswordSchema } from '@/lib/validations/auth';
import { generatePasswordResetToken } from '@/lib/auth';
import { sendPasswordResetEmail } from '@/lib/email';

const prisma = new PrismaClient();

const SUCCESS_MESSAGE =
  "If an account exists with that email, we've sent reset instructions.";

const getAppUrl = () =>
  process.env.NEXT_PUBLIC_APP_URL || 'https://aakaura.in';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (user?.isActive) {
      const { rawToken, hashedToken, expiresAt } = generatePasswordResetToken();

      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: hashedToken,
          passwordResetExpires: expiresAt,
        },
      });

      const resetUrl = `${getAppUrl()}/auth/reset-password?token=${rawToken}`;

      sendPasswordResetEmail({
        userEmail: user.email,
        userName: user.name,
        resetUrl,
      }).catch((error) => {
        console.error('Failed to send password reset email:', error);
      });
    }

    return NextResponse.json({ message: SUCCESS_MESSAGE });
  } catch (error) {
    console.error('Forgot password error:', error);

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

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyAdminToken } from '@/middleware/auth';
import { hashPassword } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const practitioners = await prisma.practitioner.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ practitioners });
  } catch (error) {
    console.error('[admin/practitioners]', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  password: z.string().min(8),
});

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createSchema.parse(body);
    const email = data.email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
    }

    const hashedPassword = await hashPassword(data.password);

    const practitioner = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: data.name,
          phone: data.phone,
          role: 'PRACTITIONER',
        },
      });

      return tx.practitioner.create({
        data: {
          userId: user.id,
          name: data.name,
          email,
          phone: data.phone,
          specialization: data.specialization,
        },
      });
    });

    return NextResponse.json({ practitioner }, { status: 201 });
  } catch (error) {
    console.error('[admin/practitioners POST]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

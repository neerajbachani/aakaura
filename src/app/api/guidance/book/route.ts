import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { findOrCreateGuidanceUser } from '@/lib/guidance-user';
import { assertComplimentaryEligibleInTx } from '@/lib/guidance-complimentary';
import {
  GUIDANCE_CALL,
  PRACTITIONER_PREFERENCE_VALUES,
  GUIDANCE_INTAKE_LIFE_AREAS,
  GUIDANCE_INTAKE_LIFE_FEELINGS,
  GUIDANCE_INTAKE_ON_MIND_DURATIONS,
  GUIDANCE_INTAKE_SOMETHING_ELSE,
} from '@/config/guidance';
import { sendBookingReceivedEmail } from '@/lib/email';

const intakeSchema = z
  .object({
    lifeArea: z.enum(GUIDANCE_INTAKE_LIFE_AREAS),
    lifeAreaFeeling: z.enum(GUIDANCE_INTAKE_LIFE_FEELINGS),
    lifeAreaFeelingOther: z.string().optional(),
    onMindDuration: z.enum(GUIDANCE_INTAKE_ON_MIND_DURATIONS),
  })
  .superRefine((data, ctx) => {
    if (
      data.lifeAreaFeeling === GUIDANCE_INTAKE_SOMETHING_ELSE &&
      !data.lifeAreaFeelingOther?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please describe how this area feels',
        path: ['lifeAreaFeelingOther'],
      });
    }
  });

const baseBookFields = {
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(10),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  preferredPractitioner: z
    .enum([...PRACTITIONER_PREFERENCE_VALUES] as [string, ...string[]])
    .or(z.literal(''))
    .optional(),
  timezone: z.string().default('Asia/Kolkata'),
  notes: z.string().optional(),
  intake: intakeSchema,
};

const paidBookSchema = z.object({
  ...baseBookFields,
  complimentary: z.literal(true).optional(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  razorpaySignature: z.string(),
});

const complimentaryBookSchema = z.object({
  ...baseBookFields,
  complimentary: z.literal(true),
  razorpayOrderId: z.undefined().optional(),
  razorpayPaymentId: z.undefined().optional(),
  razorpaySignature: z.undefined().optional(),
});

const bookSchema = z.union([complimentaryBookSchema, paidBookSchema]);

function buildIntakeResponses(intake: z.infer<typeof intakeSchema>) {
  return {
    lifeArea: intake.lifeArea,
    lifeAreaFeeling: intake.lifeAreaFeeling,
    ...(intake.lifeAreaFeelingOther?.trim()
      ? { lifeAreaFeelingOther: intake.lifeAreaFeelingOther.trim() }
      : {}),
    onMindDuration: intake.onMindDuration,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = bookSchema.parse(body);
    const isComplimentary = data.complimentary === true;

    if (isComplimentary) {
      const user = await findOrCreateGuidanceUser({
        email: data.email,
        name: data.name,
        phone: data.phone,
      });

      const booking = await prisma.$transaction(async (tx) => {
        const check = await assertComplimentaryEligibleInTx(tx, data.email);
        if (!check.ok) {
          throw Object.assign(new Error('COMPLIMENTARY_NOT_ELIGIBLE'), {
            reason: check.reason,
          });
        }

        return tx.guidanceBooking.create({
          data: {
            userId: user.id,
            bookingType: 'GUIDANCE_CALL',
            status: 'PENDING',
            preferredDate: data.preferredDate,
            preferredTime: data.preferredTime,
            preferredPractitioner: data.preferredPractitioner || null,
            timezone: data.timezone,
            duration: GUIDANCE_CALL.durationMinutes,
            amount: 0,
            paymentStatus: 'PAID',
            notes: data.notes,
            intakeResponses: buildIntakeResponses(data.intake),
            razorpayOrderId: null,
            razorpayPaymentId: null,
            razorpaySignature: null,
          },
        });
      });

      await sendBookingReceivedEmail({
        userEmail: user.email,
        userName: user.name || data.name,
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        bookingId: booking.id,
      });

      return NextResponse.json({ booking, complimentary: true }, { status: 201 });
    }

    if (
      !data.razorpayOrderId ||
      !data.razorpayPaymentId ||
      !data.razorpaySignature
    ) {
      return NextResponse.json({ error: 'Payment details are required' }, { status: 400 });
    }

    if (
      !verifyRazorpaySignature(
        data.razorpayOrderId,
        data.razorpayPaymentId,
        data.razorpaySignature,
      )
    ) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    const existing = await prisma.guidanceBooking.findUnique({
      where: { razorpayPaymentId: data.razorpayPaymentId },
    });
    if (existing) {
      return NextResponse.json({ booking: existing });
    }

    const user = await findOrCreateGuidanceUser({
      email: data.email,
      name: data.name,
      phone: data.phone,
    });

    const booking = await prisma.guidanceBooking.create({
      data: {
        userId: user.id,
        bookingType: 'GUIDANCE_CALL',
        status: 'PENDING',
        preferredDate: data.preferredDate,
        preferredTime: data.preferredTime,
        preferredPractitioner: data.preferredPractitioner || null,
        timezone: data.timezone,
        duration: GUIDANCE_CALL.durationMinutes,
        amount: GUIDANCE_CALL.price,
        paymentStatus: 'PAID',
        notes: data.notes,
        intakeResponses: buildIntakeResponses(data.intake),
        razorpayOrderId: data.razorpayOrderId,
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
      },
    });

    await sendBookingReceivedEmail({
      userEmail: user.email,
      userName: user.name || data.name,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      bookingId: booking.id,
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error) {
    console.error('[guidance/book]', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    if (
      error instanceof Error &&
      error.message === 'COMPLIMENTARY_NOT_ELIGIBLE'
    ) {
      return NextResponse.json(
        {
          error:
            'Complimentary slots are no longer available for this booking. Please complete payment to continue.',
          reason: (error as Error & { reason?: string }).reason,
        },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

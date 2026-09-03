import { prisma } from '@/lib/prisma';
import {
  GUIDANCE_COMPLIMENTARY_PROMO,
  getComplimentaryPromoStartDate,
  isComplimentaryPromoStarted,
} from '@/config/guidance';

export type ComplimentaryIneligibilityReason =
  | 'disabled'
  | 'before_start'
  | 'slots_exhausted'
  | 'already_used';

export type ComplimentaryEligibility = {
  eligible: boolean;
  reason?: ComplimentaryIneligibilityReason;
  usedSlots: number;
  limit: number;
};

export { getComplimentaryPromoStartDate, isComplimentaryPromoStarted };

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

async function countComplimentaryBookings(client: typeof prisma | TxClient) {
  return client.guidanceBooking.count({
    where: {
      bookingType: 'GUIDANCE_CALL',
      amount: 0,
      paymentStatus: 'PAID',
      createdAt: { gte: getComplimentaryPromoStartDate() },
    },
  });
}

async function hasComplimentaryBookingForEmail(
  client: typeof prisma | TxClient,
  email: string,
) {
  const existing = await client.guidanceBooking.findFirst({
    where: {
      bookingType: 'GUIDANCE_CALL',
      amount: 0,
      paymentStatus: 'PAID',
      user: { email: { equals: email, mode: 'insensitive' } },
    },
    select: { id: true },
  });
  return Boolean(existing);
}

/**
 * Server-side eligibility for a complimentary guidance call.
 * Does not reserve a slot — call again inside a transaction before create.
 */
export async function getComplimentaryEligibility(params: {
  email: string;
  now?: Date;
}): Promise<ComplimentaryEligibility> {
  const { email, now = new Date() } = params;
  const limit = GUIDANCE_COMPLIMENTARY_PROMO.limit;

  if (!GUIDANCE_COMPLIMENTARY_PROMO.enabled) {
    return { eligible: false, reason: 'disabled', usedSlots: 0, limit };
  }

  if (!isComplimentaryPromoStarted(now)) {
    return { eligible: false, reason: 'before_start', usedSlots: 0, limit };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const [usedSlots, alreadyUsed] = await Promise.all([
    countComplimentaryBookings(prisma),
    hasComplimentaryBookingForEmail(prisma, normalizedEmail),
  ]);

  if (alreadyUsed) {
    return { eligible: false, reason: 'already_used', usedSlots, limit };
  }

  if (usedSlots >= limit) {
    return { eligible: false, reason: 'slots_exhausted', usedSlots, limit };
  }

  return { eligible: true, usedSlots, limit };
}

/**
 * Re-check eligibility inside a transaction immediately before creating
 * a complimentary booking (guards race on the last slots).
 */
export async function assertComplimentaryEligibleInTx(
  tx: TxClient,
  email: string,
  now = new Date(),
): Promise<{ ok: true } | { ok: false; reason: ComplimentaryIneligibilityReason }> {
  const limit = GUIDANCE_COMPLIMENTARY_PROMO.limit;

  if (!GUIDANCE_COMPLIMENTARY_PROMO.enabled) {
    return { ok: false, reason: 'disabled' };
  }
  if (!isComplimentaryPromoStarted(now)) {
    return { ok: false, reason: 'before_start' };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const alreadyUsed = await hasComplimentaryBookingForEmail(tx, normalizedEmail);
  if (alreadyUsed) {
    return { ok: false, reason: 'already_used' };
  }

  const usedSlots = await countComplimentaryBookings(tx);
  if (usedSlots >= limit) {
    return { ok: false, reason: 'slots_exhausted' };
  }

  return { ok: true };
}

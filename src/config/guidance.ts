import { PackageType } from '@prisma/client';

export const GUIDANCE_CALL = {
  price: 333,
  durationMinutes: 20,
} as const;

/** First-N complimentary guidance calls promo (server-enforced). */
export const GUIDANCE_COMPLIMENTARY_PROMO = {
  enabled: true,
  /** Midnight IST on this calendar day. */
  startDate: '2026-09-01',
  limit: 50,
  startLabel: 'September 1',
} as const;

/** Promo start as Date: midnight IST on startDate (YYYY-MM-DD). */
export function getComplimentaryPromoStartDate(): Date {
  return new Date(`${GUIDANCE_COMPLIMENTARY_PROMO.startDate}T00:00:00+05:30`);
}

export function isComplimentaryPromoStarted(now = new Date()): boolean {
  return (
    GUIDANCE_COMPLIMENTARY_PROMO.enabled && now >= getComplimentaryPromoStartDate()
  );
}

export const PACKAGES: Record<
  PackageType,
  {
    label: string;
    price: number;
    calls: number;
    durationMinutes: number;
    validityDays: number | null;
    description: string;
  }
> = {
  PACKAGE_I: {
    label: 'Guidance Support Call',
    price: 399,
    calls: 1,
    durationMinutes: 25,
    validityDays: null,
    description: 'Start-to-end ritual support with guidance throughout your ritual.',
  },
  PACKAGE_II: {
    label: 'Ritual Follow-up Package',
    price: 999,
    calls: 3,
    durationMinutes: 25,
    validityDays: 30,
    description: '3 calls within 1 month with customized ritual steps and rescheduling.',
  },
  PACKAGE_III: {
    label: 'Premium Ritual Support',
    price: 1499,
    calls: 5,
    durationMinutes: 25,
    validityDays: 45,
    description: '5 calls over 1.5 months with Inner Circle tips and extended support.',
  },
};

export const COUPON_VALIDITY_DAYS = 90;
export const COUPON_VALIDITY_MONTHS = 3;

// A guidance-call customer becomes eligible for a manual coupon only after
// placing a website product order whose total exceeds this amount (in ₹).
export const COUPON_MIN_ORDER_TOTAL = 999;

// Manually issued coupons are redeemable on this package only.
export const COUPON_APPLICABLE_PACKAGE: PackageType = 'PACKAGE_I';

export const GUIDANCE_CALL_GUIDELINES = [
  'Phone numbers must NOT be exchanged during the call.',
] as const;

export const GUIDANCE_INTAKE_LIFE_AREAS = [
  'Career',
  'Health',
  'Relationships',
  'Money',
  'Nothing specific- just exploring/ curious',
] as const;

export const GUIDANCE_INTAKE_LIFE_FEELINGS = [
  'Anxious/ Fearful/ Tensed',
  'Numb or distant',
  'On edge',
  'Hopeful or excited',
  'Something else',
] as const;

export const GUIDANCE_INTAKE_SOMETHING_ELSE = 'Something else' as const;

export const GUIDANCE_INTAKE_ON_MIND_DURATIONS = [
  'Just started (days to a couple weeks)',
  'A few months (1-6 months)',
  'Over a year (1-3 years)',
  'As long as I can remember (3+ years / most of my life)',
] as const;

export type GuidanceIntakeResponses = {
  lifeArea: (typeof GUIDANCE_INTAKE_LIFE_AREAS)[number];
  lifeAreaFeeling: (typeof GUIDANCE_INTAKE_LIFE_FEELINGS)[number];
  lifeAreaFeelingOther?: string;
  onMindDuration: (typeof GUIDANCE_INTAKE_ON_MIND_DURATIONS)[number];
};

export const GUIDANCE_PRACTITIONERS = [
  {
    slug: 'sunaina',
    name: 'Sunaina Aggarwal',
    title: 'Certified Pranic Healer | Energy Practitioner',
    bio: [
      'Sunaina is a Certified Pranic Healer with over a decade of experience, trained by the Institute for Inner Studies under the World Pranic Healing Foundation. Her advanced training includes Clairvoyance and Arhatic Yoga (Level 3.1) under the Master Choa Kok Sui system.',
      "She brings technical precision and genuine presence to every guidance call, whether your energy feels stuck, a chakra needs attention, or you want to work with what you're feeling.",
    ],
    imageUrl:
      'https://res.cloudinary.com/dix9x012c/image/upload/v1784492903/practioner-1_mi9t6g.png',
  },
  {
    slug: 'richa',
    name: 'Richa Hapawat',
    title: 'Pranic Healing Practitioner',
    bio: [
      'Richa has practiced pranic healing since 2016, with certifications in Psychic Self Defense and Pranic Crystal Healing under the World Pranic Healing Foundation.',
      'She brings a grounded, practical approach to energy work, helpful for protecting your energy and understanding your own energetic body.',
    ],
    imageUrl:
      'https://res.cloudinary.com/dix9x012c/image/upload/v1784492903/practioner-2_uf4ddk.png',
  },
] as const;

export const PRACTITIONER_PREFERENCE_ANY = 'any';

export const PRACTITIONER_PREFERENCE_VALUES = [
  PRACTITIONER_PREFERENCE_ANY,
  ...GUIDANCE_PRACTITIONERS.map((p) => p.slug),
] as const;

export function getPractitionerPreferenceLabel(preference?: string | null) {
  if (!preference || preference === PRACTITIONER_PREFERENCE_ANY) return 'Any practitioner';
  return GUIDANCE_PRACTITIONERS.find((p) => p.slug === preference)?.name ?? preference;
}

export const COUPON_POLICY = {
  title: 'Product Purchase Coupon',
  points: [
    "After your Guidance Call, when you choose to bring an Aakaura piece home with a purchase of ₹999 or more, our team will personally send you a complimentary Ritual Package I coupon; our way of walking this next part of the journey with you.",
    "The coupon is issued by hand from Aakaura's side, once your purchase has been reviewed and verified; never automated, always a real person on our end making sure it reaches you.",
    "It stays valid for 3 months from the day it's issued, giving you space to begin your ritual practice whenever you feel ready.",
    'This coupon is redeemable exclusively toward Ritual Package I (₹399), our first step of guided support as you settle into your piece.',
  ],
} as const;

export const CALL_FLOW = [
  {
    duration: '0–5 Minutes',
    title: 'Welcome & Chakra Basics',
    points: [
      'Welcome the customer and build rapport',
      'Introduce chakra basics',
      'Explain what chakras are',
    ],
  },
  {
    duration: '5–12 Minutes',
    title: 'Understanding Your Concerns',
    points: [
      "Understand the customer's concerns",
      'Identify which chakra(s) need attention',
      'Explain why those chakras are important',
    ],
  },
  {
    duration: '12–15 Minutes',
    title: 'Sacred Symbols',
    points: [
      'Introduce Sacred Symbols',
      'Explain their purpose',
      'Explain how they are used during rituals',
    ],
  },
  {
    duration: '15–20 Minutes',
    title: 'Conclusion & Next Steps',
    points: [
      'Summarize the discussion',
      'Recommend the appropriate ritual/product',
      'Inform about the Product Purchase Coupon',
      'Explain the next steps',
      'End the call professionally',
    ],
  },
] as const;

export const SESSION_GUIDELINES = [
  'All guidance calls are confidential.',
  'Practitioner exchange of personal contact information (phone numbers, personal social media, etc.) is strictly prohibited and is not sanctioned by Aakaura.',
  'We keep every conversation focused on you and your guidance.',
  'Everything is explained simply. No jargon, just clarity.',
  'Every session is held with care and professionalism.',
  'Ritual support is only introduced once your guidance call feels complete.',
  "If you choose a piece above ₹999 afterward, a complimentary Ritual Package I coupon comes your way from Aakaura's side, valid for 3 months.",
] as const;

export const PACKAGE_DETAILS: Record<
  PackageType,
  {
    label: string;
    subtitle: string;
    price: number;
    calls: number;
    durationMinutes: number;
    validityDays: number | null;
    validityLabel: string | null;
    scheduling: string | null;
    includes: string[];
    plusIncludes?: string[];
    inheritsFrom?: string;
    postPurchase?: boolean;
  }
> = {
  PACKAGE_I: {
    label: 'Package I',
    subtitle: 'Guidance & Ritual Support',
    price: 399,
    calls: 1,
    durationMinutes: 25,
    validityDays: null,
    validityLabel: null,
    scheduling: null,
    includes: [
      'Complete support, start to end, through your ritual',
      'A real person to guide you through any part of the ritual that feels unclear',
      'Understanding why this ritual matters, not just how to do it',
      'The science behind the practice, explained simply',
      'A little more clarity, a little more awareness; carried with you after the call',
    ],
  },
  PACKAGE_II: {
    label: 'Package II',
    subtitle: 'Ritual Follow-up Package',
    price: 999,
    calls: 3,
    durationMinutes: 25,
    validityDays: 30,
    validityLabel: '1 Month',
    scheduling:
      "across 3 different days within the month, worked around your practitioner's availability",
    includes: [],
    inheritsFrom: 'Package I',
    plusIncludes: [
      'Simpler, easier-to-follow ritual steps',
      'Guidance shaped more closely around you',
    ],
    postPurchase: true,
  },
  PACKAGE_III: {
    label: 'Package III',
    subtitle: 'Premium Ritual Support',
    price: 1499,
    calls: 5,
    durationMinutes: 25,
    validityDays: 45,
    validityLabel: '1.5 Months',
    scheduling: 'across 5 different days, spread over 1.5 months',
    includes: [],
    inheritsFrom: 'Package II',
    plusIncludes: ['Practical tips straight from the Aakaura Inner Circle'],
    postPurchase: true,
  },
};

export const DEFAULT_COUPON_SETTINGS = {
  type: 'PERCENT' as const,
  value: 25,
};

export const APP_SETTING_KEYS = {
  couponDiscountType: 'default_coupon_discount_type',
  couponDiscountValue: 'default_coupon_discount_value',
} as const;

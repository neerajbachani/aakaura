import { PackageType } from '@prisma/client';

export const GUIDANCE_CALL = {
  price: 333,
  durationMinutes: 20,
} as const;

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
    price: 2999,
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

export const GUIDANCE_CALL_AGENDA = [
  { duration: '0–5 mins', topic: 'Chakra understanding (Basic)' },
  { duration: '5–12 mins', topic: 'Which chakra to work on?' },
  { duration: '12–15 mins', topic: 'What are sacred symbols?' },
  { duration: '15–20 mins', topic: 'Conclusion' },
] as const;

export const GUIDANCE_CALL_GUIDELINES = [
  'Phone numbers must NOT be exchanged during the call.',
] as const;

export const GUIDANCE_PRACTITIONERS = [
  {
    slug: 'sunaina',
    name: 'Sunaina Aggarwal',
    title: 'Certified Pranic Healer | Energy Practitioner',
    bio: [
      'We here at Aakaura love talking to Sunaina about her experiences with energy! Sunaina is a Certified Pranic Healer, trained and certified by the Institute for Inner Studies under the World Pranic Healing Foundation, Manila. Her journey into energy work spans over a decade, including advanced training in Clairvoyance and Arhatic Yoga (Level 3.1) under the Master Choa Kok Sui system—a practice rooted in refining perception, energy sensitivity, and inner discipline.',
      "With this depth of training, Sunaina brings both technical precision and genuine presence to every guidance call. She's someone you can talk to about where your energy feels stuck, which chakra might need attention, and how to actually work with, not just around, what you're feeling.",
    ],
    imageUrl:
      'https://res.cloudinary.com/dix9x012c/image/upload/v1784492903/practioner-1_mi9t6g.png',
  },
  {
    slug: 'richa',
    name: 'Richa Hapawat',
    title: 'Pranic Healing Practitioner',
    bio: [
      "Richa's journey into energy work began in 2016 with the Master Choa Kok Sui Basic Pranic Healing Course in Jaipur, and has since grown into a well-rounded practice; including certifications in Psychic Self Defense and Pranic Crystal Healing under the World Pranic Healing Foundation, Manila. She is so cool when it comes to talking to the Gen Zs of Aakaura.",
      'With nearly a decade of training across foundational and specialized pranic healing techniques, Richa brings a grounded, practical approach to energy work; someone you can talk to about protecting your energy, understanding the basics of your own energetic body.',
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
    'After your Guidance Call, if you purchase Aakaura products from our website with an order total above ₹999, you may receive a Ritual Package I coupon from our team.',
    'The coupon is issued manually by Aakaura once your qualifying purchase is verified.',
    'It is valid for 3 months from the date it is issued.',
    'The coupon is applicable only on Ritual Package I (₹399).',
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
  'Keep the discussion focused on guidance.',
  'Concepts are explained in simple, accessible language.',
  'Sessions are conducted with professionalism throughout.',
  'Ritual support packages are introduced after the guidance call is complete.',
  'A Ritual Package I coupon may be issued after a qualifying product purchase above ₹999, valid for 3 months from issuance.',
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
      'Start-to-end ritual support',
      'Support for any help or guidance during the ritual',
      'Importance of the ritual',
      'Science behind the ritual',
      'Better clarity and awareness',
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
    scheduling: '3 different days within the month, according to practitioner calendar availability',
    includes: [],
    inheritsFrom: 'Package I',
    plusIncludes: [
      'Easier ritual steps',
      'More customized guidance',
      'Option to reschedule',
      'Option to skip a session if required',
    ],
    postPurchase: true,
  },
  PACKAGE_III: {
    label: 'Package III',
    subtitle: 'Premium Ritual Support',
    price: 2999,
    calls: 5,
    durationMinutes: 25,
    validityDays: 45,
    validityLabel: '1.5 Months',
    scheduling: '5 different days across 1.5 months',
    includes: [],
    inheritsFrom: 'Package II',
    plusIncludes: [
      'Aakaura Inner Circle practical tips',
      'Product-related guidance',
      'Extended practitioner support',
    ],
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

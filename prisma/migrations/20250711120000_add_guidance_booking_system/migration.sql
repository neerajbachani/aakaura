-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'PRACTITIONER';

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('GUIDANCE_CALL', 'PACKAGE_SESSION');
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED', 'NO_SHOW');
CREATE TYPE "PackageType" AS ENUM ('PACKAGE_I', 'PACKAGE_II', 'PACKAGE_III');
CREATE TYPE "PackageStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'EXPIRED', 'CANCELLED');
CREATE TYPE "CouponDiscountType" AS ENUM ('PERCENT', 'FIXED');

-- CreateTable
CREATE TABLE "Practitioner" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "specialization" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Practitioner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuidanceBooking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingType" "BookingType" NOT NULL DEFAULT 'GUIDANCE_CALL',
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "preferredDate" TEXT,
    "preferredTime" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    "meetingDateTime" TIMESTAMP(3),
    "meetingLink" TEXT,
    "assignedPractitionerId" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 20,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "packagePurchaseId" TEXT,
    "couponDiscountType" "CouponDiscountType",
    "couponDiscountValue" DOUBLE PRECISION,
    "reminderSentAt" JSONB,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuidanceBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "CouponDiscountType" NOT NULL,
    "discountValue" DOUBLE PRECISION NOT NULL,
    "validTill" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PackagePurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "packageType" "PackageType" NOT NULL,
    "remainingCalls" INTEGER NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "status" "PackageStatus" NOT NULL DEFAULT 'ACTIVE',
    "amount" DOUBLE PRECISION NOT NULL,
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "razorpayOrderId" TEXT,
    "razorpayPaymentId" TEXT,
    "razorpaySignature" TEXT,
    "couponId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PackagePurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AppSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Practitioner_userId_key" ON "Practitioner"("userId");
CREATE UNIQUE INDEX "GuidanceBooking_razorpayPaymentId_key" ON "GuidanceBooking"("razorpayPaymentId");
CREATE INDEX "GuidanceBooking_userId_idx" ON "GuidanceBooking"("userId");
CREATE INDEX "GuidanceBooking_status_idx" ON "GuidanceBooking"("status");
CREATE INDEX "GuidanceBooking_assignedPractitionerId_idx" ON "GuidanceBooking"("assignedPractitionerId");
CREATE INDEX "GuidanceBooking_meetingDateTime_idx" ON "GuidanceBooking"("meetingDateTime");
CREATE UNIQUE INDEX "Coupon_bookingId_key" ON "Coupon"("bookingId");
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
CREATE INDEX "Coupon_userId_idx" ON "Coupon"("userId");
CREATE INDEX "Coupon_code_idx" ON "Coupon"("code");
CREATE UNIQUE INDEX "PackagePurchase_razorpayPaymentId_key" ON "PackagePurchase"("razorpayPaymentId");
CREATE INDEX "PackagePurchase_userId_idx" ON "PackagePurchase"("userId");
CREATE INDEX "PackagePurchase_status_idx" ON "PackagePurchase"("status");
CREATE UNIQUE INDEX "AppSetting_key_key" ON "AppSetting"("key");

-- AddForeignKey
ALTER TABLE "Practitioner" ADD CONSTRAINT "Practitioner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuidanceBooking" ADD CONSTRAINT "GuidanceBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GuidanceBooking" ADD CONSTRAINT "GuidanceBooking_assignedPractitionerId_fkey" FOREIGN KEY ("assignedPractitionerId") REFERENCES "Practitioner"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GuidanceBooking" ADD CONSTRAINT "GuidanceBooking_packagePurchaseId_fkey" FOREIGN KEY ("packagePurchaseId") REFERENCES "PackagePurchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "GuidanceBooking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "PackagePurchase" ADD CONSTRAINT "PackagePurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Seed default coupon settings
INSERT INTO "AppSetting" ("id", "key", "value", "createdAt", "updatedAt")
VALUES (gen_random_uuid()::text, 'default_coupon_discount_type', 'PERCENT', NOW(), NOW())
ON CONFLICT ("key") DO NOTHING;

INSERT INTO "AppSetting" ("id", "key", "value", "createdAt", "updatedAt")
VALUES (gen_random_uuid()::text, 'default_coupon_discount_value', '25', NOW(), NOW())
ON CONFLICT ("key") DO NOTHING;

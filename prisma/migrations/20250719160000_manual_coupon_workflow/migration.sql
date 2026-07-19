-- AlterTable: GuidanceBooking coupon-eligibility tracking
ALTER TABLE "GuidanceBooking" ADD COLUMN     "qualifyingOrderId" TEXT;
ALTER TABLE "GuidanceBooking" ADD COLUMN     "qualifyingOrderAt" TIMESTAMP(3);
ALTER TABLE "GuidanceBooking" ADD COLUMN     "couponEligible" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "GuidanceBooking" ADD COLUMN     "couponIssuedAt" TIMESTAMP(3);
ALTER TABLE "GuidanceBooking" ADD COLUMN     "couponIssuedBy" TEXT;

-- AlterTable: Coupon applicable package restriction
ALTER TABLE "Coupon" ADD COLUMN     "applicablePackageType" "PackageType" NOT NULL DEFAULT 'PACKAGE_I';

-- CreateIndex
CREATE INDEX "GuidanceBooking_qualifyingOrderId_idx" ON "GuidanceBooking"("qualifyingOrderId");

-- AddForeignKey
ALTER TABLE "GuidanceBooking" ADD CONSTRAINT "GuidanceBooking_qualifyingOrderId_fkey" FOREIGN KEY ("qualifyingOrderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

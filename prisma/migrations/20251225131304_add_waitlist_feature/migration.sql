-- AlterTable
ALTER TABLE "Journey" ADD COLUMN     "productSettings" JSONB;

-- CreateTable
CREATE TABLE "WaitlistItem" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journeySlug" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "clientType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WaitlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WaitlistItem_userId_idx" ON "WaitlistItem"("userId");

-- CreateIndex
CREATE INDEX "WaitlistItem_journeySlug_idx" ON "WaitlistItem"("journeySlug");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistItem_userId_journeySlug_productId_clientType_key" ON "WaitlistItem"("userId", "journeySlug", "productId", "clientType");

-- AddForeignKey
ALTER TABLE "WaitlistItem" ADD CONSTRAINT "WaitlistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Safe additive migration: no tables dropped, existing rows preserved.

-- Combo admin pricing (nullable overrides)
ALTER TABLE "Combo" ADD COLUMN IF NOT EXISTS "price" DOUBLE PRECISION;
ALTER TABLE "Combo" ADD COLUMN IF NOT EXISTS "offerPrice" DOUBLE PRECISION;

-- Cart: support combo line items alongside existing product rows
ALTER TABLE "CartItem" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "CartItem" ADD COLUMN IF NOT EXISTS "comboId" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'CartItem_comboId_fkey'
  ) THEN
    ALTER TABLE "CartItem"
      ADD CONSTRAINT "CartItem_comboId_fkey"
      FOREIGN KEY ("comboId") REFERENCES "Combo"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS "CartItem_userId_comboId_key"
  ON "CartItem"("userId", "comboId")
  WHERE "comboId" IS NOT NULL;

-- Orders: support combo line items; existing product orders unchanged
ALTER TABLE "OrderItem" ALTER COLUMN "productId" DROP NOT NULL;
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "comboId" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "comboName" TEXT;
ALTER TABLE "OrderItem" ADD COLUMN IF NOT EXISTS "comboImage" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'OrderItem_comboId_fkey'
  ) THEN
    ALTER TABLE "OrderItem"
      ADD CONSTRAINT "OrderItem_comboId_fkey"
      FOREIGN KEY ("comboId") REFERENCES "Combo"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

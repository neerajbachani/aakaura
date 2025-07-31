/*
  Warnings:

  - You are about to drop the column `stock` on the `ProductVariation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."ProductVariation" DROP COLUMN "stock",
ADD COLUMN     "inStock" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "Journey" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "sanskritName" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "mantra" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "colors" JSONB NOT NULL,
    "crystals" TEXT[],
    "benefits" TEXT[],
    "products" JSONB NOT NULL,
    "content" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Journey_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Journey_slug_key" ON "Journey"("slug");

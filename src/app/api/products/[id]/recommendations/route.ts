import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/types/Product";
import { prisma } from "@/config/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id)
    return NextResponse.json({ error: "Missing product id" }, { status: 400 });

  // Fetch the product
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true, variations: true },
  });
  if (!product)
    return NextResponse.json({ error: "Product not found" }, { status: 404 });

  // Fetch featured products (excluding current)
  const featured = await prisma.product.findMany({
    where: { isFeatured: true, id: { not: id } },
    include: { category: true, variations: true },
    take: 8,
  });

  // Fetch same-category products (excluding current)
  const sameCategory = await prisma.product.findMany({
    where: { categoryId: product.categoryId, id: { not: id } },
    include: { category: true, variations: true },
    take: 8,
  });

  // Merge, dedupe, and limit
  const recommendationsMap = new Map<string, Product>();
  [...featured, ...sameCategory].forEach((p) => {
    if (p.id !== id) recommendationsMap.set(p.id, p as unknown as Product);
  });
  const recommendations = Array.from(recommendationsMap.values()).slice(0, 8);

  return NextResponse.json(recommendations);
}

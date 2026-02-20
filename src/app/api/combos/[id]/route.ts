
import { prisma } from "@/config/prisma";
import { authenticate } from "@/middleware/auth";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";
// Cast prisma to any to avoid "Property 'combo' does not exist" type errors
// which persist even after prisma generate in some dev environments
const db = prisma as any;

// Next.js 15+ params are promises (or awaitable)
export const GET = errorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  // Try finding by ID or Slug
  const combo = await db.combo.findFirst({
    where: {
      OR: [
        { id },
        { slug: id },
      ],
    },
    include: {
      products: {
        include: {
          product: {
            include: {
              variations: true,
            },
          },
          variation: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!combo) {
    throw new ApiError("Combo not found", 404);
  }

  return successResponse("Combo fetched successfully", combo);
});

export const PUT = errorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await authenticate(req); // Ensure user is admin
  const { id } = await params;
  const body = await req.json();

  const { 
    name, 
    slug, 
    tier, 
    tagline, 
    description, 
    chakras, 
    images, 
    externalLinks, 
    products 
  } = body;

  const existingCombo = await db.combo.findUnique({
    where: { id },
  });

  if (!existingCombo) {
    throw new ApiError("Combo not found", 404);
  }

  // If slug is changing, verify uniqueness
  if (slug && slug !== existingCombo.slug) {
    const slugCheck = await db.combo.findUnique({
      where: { slug },
    });
    if (slugCheck) {
      throw new ApiError("Slug already exists", 400);
    }
  }

  // Update combo and products (delete all existing relations and recreate for simplicity)
  // Or update if possible. Deleting and recreating is easier for ordering.
  
  // First, delete existing combo products
  await db.comboProduct.deleteMany({
    where: { comboId: id },
  });

  const updatedCombo = await db.combo.update({
    where: { id },
    data: {
      name,
      slug,
      tier,
      tagline,
      description,
      chakras,
      images,
      externalLinks,
      products: {
        create: products.map((p: {
          productId: string;
          variationId?: string;
          quantity?: number;
          order?: number;
          detail?: string;
        }, index: number) => ({
          productId: p.productId,
          variationId: p.variationId || null,
          quantity: p.quantity || 1,
          order: p.order || index,
          detail: p.detail || null,
        })),
      },
    },
    include: {
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  return successResponse("Combo updated successfully", updatedCombo);
});

export const DELETE = errorHandler(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await authenticate(req); // Ensure user is admin
  const { id } = await params;

  await db.combo.delete({
    where: { id },
  });

  return successResponse("Combo deleted successfully");
});

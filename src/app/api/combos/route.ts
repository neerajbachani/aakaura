
import { prisma } from "@/config/prisma";
import { authenticate } from "@/middleware/auth";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";
// Cast prisma to any to avoid "Property 'combo' does not exist" type errors
// which persist even after prisma generate in some dev environments
const db = prisma as any;

export const GET = errorHandler(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get("tier");
  const chakra = searchParams.get("chakra");
  const limit = parseInt(searchParams.get("limit") || "50");
  const page = parseInt(searchParams.get("page") || "1");

  const where: any = {};

  if (tier) {
    where.tier = tier as "ENTRY" | "CORE" | "PREMIUM";
  }

  if (chakra) {
    where.chakras = {
      has: chakra,
    };
  }

  const combos = await db.combo.findMany({
    where,
    include: {
      products: {
        include: {
          product: true,
          variation: true,
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: (page - 1) * limit,
  });

  const total = await db.combo.count({ where });

  return successResponse("Combos fetched successfully", {
    combos,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const POST = errorHandler(async (req: Request) => {
  await authenticate(req); // Ensure user is admin

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

  if (!name || !slug || !tier || !description) {
    throw new ApiError("Missing required fields", 400);
  }

  // Validate slug uniqueness
  const existingCombo = await db.combo.findUnique({
    where: { slug },
  });

  if (existingCombo) {
    throw new ApiError("Slug already exists", 400);
  }

  // Use transaction to create combo and products
  const newCombo = await db.combo.create({
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

  return successResponse("Combo created successfully", newCombo, 201);
});

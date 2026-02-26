import { prisma } from "@/config/prisma";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";
import { Prisma } from "@prisma/client";

export const GET = errorHandler(async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const categoryId = searchParams.get("categoryId");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "12");
    const page = parseInt(searchParams.get("page") || "1");

    // Build where clause for filtering
    const where: Prisma.ProductWhereInput = {};

    // Search filter - search in name and description
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    // Category filter
    if (categoryId) {
      if (categoryId.length === 36) {
        where.categoryId = categoryId;
      } else {
        where.category = { name: { equals: categoryId, mode: "insensitive" } };
      }
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.OR = [
        // Check main product price
        {
          price: {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          },
        },
        // Check variations price
        {
          variations: {
            some: {
              price: {
                ...(minPrice && { gte: parseFloat(minPrice) }),
                ...(maxPrice && { lte: parseFloat(maxPrice) }),
              },
            },
          },
        },
      ];
    }

    // Featured filter
    if (featured === "true") {
      where.isFeatured = true;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch products with filters and pagination
    const products = await prisma.product.findMany({
      where,
      include: {
        variations: true,
        category: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
    });

    // Get total count for pagination
    const total = await prisma.product.count({ where });

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return successResponse("Products fetched successfully", {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPreviousPage,
        nextPage: hasNextPage ? page + 1 : null,
        previousPage: hasPreviousPage ? page - 1 : null,
      },
      filters: {
        search,
        categoryId,
        minPrice,
        maxPrice,
        featured: featured === "true",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    } else {
      throw new ApiError("An unknown error occurred", 500);
    }
  }
});

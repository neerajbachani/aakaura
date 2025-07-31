import { prisma } from "@/config/prisma";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

export const GET = errorHandler(async () => {
  try {
    const featuredProducts = await prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        variations: true,
      },
      orderBy: { createdAt: "desc" },
      take: 6, // Limit to 6 featured products for home page
    });

    return successResponse(
      "Featured products fetched successfully",
      featuredProducts
    );
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    } else {
      throw new ApiError("An unknown error occurred", 500);
    }
  }
});

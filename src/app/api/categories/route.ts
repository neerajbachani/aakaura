import { prisma } from "@/config/prisma";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

export const GET = errorHandler(async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        products: {
          select: {
            images: true,
          },
          take: 4,
        },
      },
    });

    return successResponse("Categories fetched successfully", categories);
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    } else {
      throw new ApiError("An unknown error occurred", 500);
    }
  }
});

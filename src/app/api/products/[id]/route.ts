import { prisma } from "@/config/prisma";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

export const GET = errorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      const { id } = await params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          variations: true,
        },
      });

      if (!product) {
        throw new ApiError("Product not found", 404);
      }

      return successResponse("Product fetched successfully", product);
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      } else {
        throw new ApiError("An unknown error occurred", 500);
      }
    }
  }
);

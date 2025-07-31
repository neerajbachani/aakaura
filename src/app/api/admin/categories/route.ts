import { prisma } from "@/config/prisma";
import { authenticate } from "@/middleware/auth";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { successResponse } from "@/utils/response";

export const POST = errorHandler(async (req: Request) => {
  try {
    await authenticate(req); // Ensure user is admin

    const { name } = await req.json();

    if (!name || name.trim().length === 0) {
      throw new ApiError("Category name is required", 400);
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findUnique({
      where: { name: name.trim() },
    });

    if (existingCategory) {
      throw new ApiError("Category already exists", 400);
    }

    const newCategory = await prisma.category.create({
      data: {
        name: name.trim(),
      },
    });

    return successResponse("Category created successfully", newCategory, 201);
  } catch (error) {
    if (error instanceof Error) {
      throw new ApiError(error.message, 500);
    } else {
      throw new ApiError("An unknown error occurred", 500);
    }
  }
});

export const GET = errorHandler(async (req: Request) => {
  try {
    await authenticate(req); // Ensure user is admin

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
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

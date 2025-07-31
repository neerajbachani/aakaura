import { prisma } from "@/config/prisma";
import { authenticate } from "@/middleware/auth";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { productSchema } from "@/types/productSchema";
import { successResponse } from "@/utils/response";
import { uploadToCloudinary } from "@/utils/upload";
import { Prisma } from "@prisma/client";

export const POST = errorHandler(async (req: Request) => {
  try {
    await authenticate(req); // Ensure user is admin

    const formData = await req.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const offerPrice = formData.get("offerPrice")
      ? parseFloat(formData.get("offerPrice") as string)
      : undefined;
    const categoryId = formData.get("categoryId") as string;
    const isFeatured = formData.get("isFeatured") === "true";
    const variations = JSON.parse(
      (formData.get("variations") as string) || "[]"
    );

    // Handle multiple image uploads
    const imageFiles = formData.getAll("images") as Blob[];

    if (!name || !description || !price || !categoryId) {
      throw new ApiError(
        "Name, description, price, and category are required",
        400
      );
    }

    if (imageFiles.length === 0) {
      throw new ApiError("At least one image is required", 400);
    }

    // Upload all images to Cloudinary
    const imageUrls = await Promise.all(
      imageFiles.map(async (file) => {
        if (!(file instanceof Blob)) {
          throw new ApiError("Invalid image file", 400);
        }
        return await uploadToCloudinary(file, "products");
      })
    );

    const validation = productSchema.safeParse({
      name,
      description,
      images: imageUrls,
      price,
      offerPrice,
      categoryId,
      variations,
      isFeatured,
    });

    if (!validation.success) {
      throw new ApiError(validation.error.errors[0].message, 400);
    }

    // Clean up variations data for Prisma (include offerPrice)
    const cleanVariations = variations.map(
      (variation: {
        name: string;
        price?: string;
        offerPrice?: string;
        inStock: boolean;
      }) => ({
        name: variation.name,
        price: variation.price ? parseFloat(variation.price) : null,
        offerPrice: variation.offerPrice
          ? parseFloat(variation.offerPrice)
          : null,
        inStock: variation.inStock,
      })
    );

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        images: imageUrls,
        price,
        offerPrice,
        categoryId,
        isFeatured,
        variations: {
          create: cleanVariations,
        },
      },
      include: {
        category: true,
        variations: true,
      },
    });

    return successResponse("Product created successfully", newProduct, 201);
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

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "50");
    const page = parseInt(searchParams.get("page") || "1");

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (featured === "true") {
      where.isFeatured = true;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        variations: true,
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.product.count({ where });

    return successResponse("Products fetched successfully", {
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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

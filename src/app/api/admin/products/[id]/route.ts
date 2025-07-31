import { prisma } from "@/config/prisma";
import { authenticate } from "@/middleware/auth";
import { ApiError, errorHandler } from "@/middleware/errorHandler";
import { productSchema } from "@/types/productSchema";
import { successResponse } from "@/utils/response";
import { uploadToCloudinary } from "@/utils/upload";

export const PUT = errorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      await authenticate(req); // Ensure user is admin

      const { id } = await params;
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
      // Handle image updates
      const imageFiles = formData.getAll("images") as Blob[];
      const existingImages = JSON.parse(
        (formData.get("existingImages") as string) || "[]"
      );

      if (!name || !description || !price || !categoryId) {
        throw new ApiError(
          "Name, description, price, and category are required",
          400
        );
      }

      // Upload new images if provided
      let imageUrls = existingImages;
      if (imageFiles.length > 0) {
        const newImageUrls = await Promise.all(
          imageFiles.map(async (file) => {
            if (!(file instanceof Blob)) {
              throw new ApiError("Invalid image file", 400);
            }
            return await uploadToCloudinary(file, "products");
          })
        );
        imageUrls = [...existingImages, ...newImageUrls];
      }

      if (imageUrls.length === 0) {
        throw new ApiError("At least one image is required", 400);
      }

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
          price?: string | number;
          offerPrice?: string | number;
          inStock: boolean;
        }) => ({
          name: variation.name,
          price: variation.price
            ? parseFloat(variation.price.toString())
            : null,
          offerPrice: variation.offerPrice
            ? parseFloat(variation.offerPrice.toString())
            : null,
          inStock: variation.inStock,
        })
      );

      // Update product and its variations
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          images: imageUrls,
          price,
          offerPrice,
          categoryId,
          isFeatured,
          variations: {
            deleteMany: {},
            create: cleanVariations,
          },
        },
        include: {
          category: true,
          variations: true,
        },
      });

      return successResponse("Product updated successfully", updatedProduct);
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      } else {
        throw new ApiError("An unknown error occurred", 500);
      }
    }
  }
);

export const DELETE = errorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      await authenticate(req); // Ensure user is admin

      const { id } = await params;

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new ApiError("Product not found", 404);
      }

      await prisma.product.delete({
        where: { id },
      });

      return successResponse("Product deleted successfully", null);
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(error.message, 500);
      } else {
        throw new ApiError("An unknown error occurred", 500);
      }
    }
  }
);

export const GET = errorHandler(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
      await authenticate(req); // Ensure user is admin

      const { id } = await params;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
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

import { z } from "zod";

export const productVariationSchema = z.object({
  name: z
    .string({ required_error: "Variation name is required" })
    .min(1, { message: "Variation name must be at least 1 character" }),
  price: z.number().optional(),
  offerPrice: z.number().nullable().optional(),
  inStock: z.boolean({ required_error: "inStock is required" }).default(true),
});

export const productSchema = z.object({
  name: z
    .string({ required_error: "Product name is required" })
    .min(3, { message: "Product name must be at least 3 characters" }),

  description: z
    .string({ required_error: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters" }),

  images: z
    .array(z.string().url({ message: "Invalid image URL format" }))
    .min(1, { message: "At least one image is required" }),

  price: z
    .number({ required_error: "Price is required" })
    .positive({ message: "Price must be positive" }),

  offerPrice: z
    .number()
    .positive({ message: "Offer price must be positive" })
    .optional(),

  categoryId: z
    .string({ required_error: "Category is required" })
    .min(1, { message: "Category is required" }),

  variations: z.array(productVariationSchema).default([]),

  isFeatured: z
    .boolean({ required_error: "isFeatured is required" })
    .default(false),
});

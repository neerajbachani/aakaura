import env from "@/config/env";
import { ApiResponse } from "@/types/Api";
import { Blog } from "@/types/Blog";
import { Product } from "@/types/Product";

export const getBlogById = async (id: string) => {
  try {
    const res = await fetch(`${env.WEB_CLIENT_URL}/api/blogs/${id}`);
    const result: ApiResponse<Blog> = await res.json();

    if (!res.ok) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
};

export const getAllBlogs = async (seriesId: string = "") => {
  try {
    const res = await fetch(
      `${env.WEB_CLIENT_URL}/api/blogs?seriesId=${seriesId}`
    );
    const result: ApiResponse<Blog[]> = await res.json();
    if (!res.ok) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return null;
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await fetch(`${env.WEB_CLIENT_URL}/api/products/${id}`);
    const result: ApiResponse<Product> = await res.json();

    if (!res.ok) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const getAllProducts = async () => {
  try {
    const res = await fetch(`${env.WEB_CLIENT_URL}/api/products`);
    const result: ApiResponse<{
      products: Product[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        nextPage: number | null;
        previousPage: number | null;
      };
    }> = await res.json();

    if (!res.ok) throw new Error(result.message);
    return result.data.products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
};

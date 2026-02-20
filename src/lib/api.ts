import env from "@/config/env";
import { ApiResponse } from "@/types/Api";
import { Blog } from "@/types/Blog";
import { Product } from "@/types/Product";
import { Combo } from "@/types/Combo";

export const getComboById = async (id: string) => {
  try {
    const res = await fetch(`${env.WEB_CLIENT_URL}/api/combos/${id}`);
    const result: ApiResponse<Combo> = await res.json();

    if (!res.ok) throw new Error(result.message);
    return result.data;
  } catch (error) {
    console.error("Error fetching combo:", error);
    return null;
  }
};

export const getAllCombos = async (filters?: { tier?: string; chakra?: string }) => {
  try {
    const params = new URLSearchParams();
    if (filters?.tier) params.append("tier", filters.tier);
    if (filters?.chakra) params.append("chakra", filters.chakra);

    const res = await fetch(`${env.WEB_CLIENT_URL}/api/combos?${params.toString()}`, {
       next: { revalidate: 0 } // Ensure fresh data for now
    });
    const result: ApiResponse<{
      combos: Combo[];
      pagination: any;
    }> = await res.json();

    if (!res.ok) throw new Error(result.message);
    return result.data.combos;
  } catch (error) {
    console.error("Error fetching combos:", error);
    return null;
  }
};

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

export const getAllProducts = async (limitOrArgs?: number) => {
  // Default to large limit if explicitly requested via argument, otherwise API defaults
  const limitParam = typeof limitOrArgs === 'number' ? limitOrArgs : 12;
  try {
    const res = await fetch(`${env.WEB_CLIENT_URL}/api/products?limit=${limitParam}`, {
      next: { revalidate: 0 }
    });
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


import { Product, ProductVariation } from "@/types/Product";

export interface Combo {
  id: string;
  slug: string;
  name: string;
  tier: "ENTRY" | "CORE" | "PREMIUM";
  tagline: string;
  description: string;
  chakras: string[];
  images: string[];
  externalLinks?: { label: string; url: string }[];
  products: ComboProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface ComboProduct {
  id: string;
  comboId: string;
  productId: string;
  product: Product;
  variationId?: string | null;
  variation?: ProductVariation | null;
  quantity: number;
  order: number;
  detail?: string | null;
}

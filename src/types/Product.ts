export interface Category {
  id: string;
  name: string;
  createdAt: string;
  products?: { images: string[] }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  offerPrice?: number;
  categoryId: string;
  category: Category;
  variations: ProductVariation[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariation {
  id: string;
  name: string;
  price?: number;
  offerPrice?: number | null;
  inStock: boolean;
}

'use server';

import { prisma } from '@/lib/prisma';
import { getUniqueCategories } from './get-categories';

export type CategoryWithImages = {
  id: string;
  name: string;
  images: string[];
};

export async function getCategoriesWithImages(): Promise<CategoryWithImages[]> {
  try {
    const categoryNames = await getUniqueCategories();
    
    // For each unique category name, look up the DB category to get product images
    const categoriesWithImages = await Promise.all(
      categoryNames.map(async (name) => {
        // Find category in the database
        const dbCategory = await prisma.category.findFirst({
          where: { 
            name: { 
              equals: name, 
              // Prisma with PostgreSQL doesn't always support insensitive mode depending on provider settings,
              // but assuming it does based on route.ts
              mode: 'insensitive' 
            } 
          },
          include: {
            products: {
              select: { images: true },
              take: 4,
            },
          },
        });

        let images: string[] = [];
        let id: string = name; // Default id to name 

        if (dbCategory) {
          id = dbCategory.id;
          if (dbCategory.products) {
            images = dbCategory.products.flatMap((p) => p.images || []).slice(0, 4);
          }
        } else {
            // Fallback: If category doesn't exist in the Category table, try to find products directly
            const products = await prisma.product.findMany({
                where: {
                    category: {
                        name: {
                            equals: name,
                            mode: 'insensitive'
                        }
                    }
                },
                select: { images: true },
                take: 4
            });
            images = products.flatMap((p) => p.images || []).slice(0, 4);
        }

        return {
          id,
          name,
          images,
        };
      })
    );

    return categoriesWithImages;
  } catch (error) {
    console.error('Failed to fetch categories with images:', error);
    return [];
  }
}

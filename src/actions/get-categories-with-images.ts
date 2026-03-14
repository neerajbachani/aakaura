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
    // Fetch all journeys to extract categories and their images from active journey products
    const journeys = await prisma.journey.findMany();
    
    // Map to track active images per category
    const categoryImagesMap = new Map<string, Set<string>>();
    
    journeys.forEach((journey) => {
      const content = journey.content as any;
      if (!content) return;
      
      (['soul-luxury', 'energy-curious'] as const).forEach((clientType) => {
        const products = content[clientType] || [];
        products.forEach((p: any) => {
          const catName = p.category?.trim();
          if (catName) {
            if (!categoryImagesMap.has(catName)) {
              categoryImagesMap.set(catName, new Set());
            }
            
            // Add images if present
            if (p.images && Array.isArray(p.images)) {
              const currentImages = categoryImagesMap.get(catName)!;
              p.images.forEach((img: string) => {
                if (img && currentImages.size < 4) {
                  currentImages.add(img);
                }
              });
            }
          }
        });
      });
    });

    const categoryNames = Array.from(categoryImagesMap.keys()).sort();
    
    // For each unique category name, look up the DB category to get its ID (important for routing/references)
    const categoriesWithImages = await Promise.all(
      categoryNames.map(async (name) => {
        // Find category in the database
        const dbCategory = await prisma.category.findFirst({
          where: { 
            name: { 
              equals: name, 
              mode: 'insensitive' 
            } 
          },
          select: { id: true }
        });

        const id = dbCategory ? dbCategory.id : name;
        const images = Array.from(categoryImagesMap.get(name) || []).slice(0, 4);

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

'use server';

import { prisma } from '@/lib/prisma';

export async function getUniqueCategories() {
  try {
    const journeys = await prisma.journey.findMany();
    const categories = new Set<string>();

    journeys.forEach((journey) => {
      const content = journey.content as any;
      (['soul-luxury', 'energy-curious'] as const).forEach((clientType) => {
        const products = content[clientType] || [];
        products.forEach((p: any) => {
          if (p.category) {
            categories.add(p.category);
          }
        });
      });
    });

    return Array.from(categories).sort();
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

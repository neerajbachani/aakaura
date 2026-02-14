
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function parsePrice(priceStr: string | undefined): number {
    if (!priceStr) return 0;
    // Remove "₹", ",", and whitespace
    const cleaned = priceStr.replace(/[₹,\s]/g, '');
    const floatVal = parseFloat(cleaned);
    return isNaN(floatVal) ? 0 : floatVal;
}

async function main() {
    try {
        console.log('🚀 Migrating Journey Products to Product Table...\n');

        // 1. Clean existing data (Optional: comment out if you want to keep existing)
        console.log('🗑️ Cleaning existing Product/Category data...');
        await prisma.cartItem.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.productVariation.deleteMany();
        await prisma.product.deleteMany();
        // Don't delete categories if they are used elsewhere, but getting unique constraints is hard otherwise
        // Just delete categories that are linked to products? 
        // We will just find-or-create categories.
        
        const journeys = await prisma.journey.findMany();
        
        // Map to store created categories to avoid duplicates in this run
        const categoryMap = new Map<string, string>(); // Name -> ID

        // Pre-fetch existing categories
        const existingCats = await prisma.category.findMany();
        for (const c of existingCats) {
            categoryMap.set(c.name.toLowerCase(), c.id);
        }

        let productCount = 0;

        for (const journey of journeys) {
            console.log(`Processing journey: ${journey.name}`);
            const content = journey.content as any;

            const processList = async (listKey: 'soul-luxury' | 'energy-curious') => {
                const products = content[listKey] || [];
                
                for (const p of products) {
                    // Extract data
                    const name = p.name || "Unknown Product";
                    const description = p.description || "";
                    const price = parsePrice(p.price);
                    const categoryName = p.category || "Uncategorized";
                    const images = p.images || [];
                    const isFeatured = false; // Default

                    // Find or Create Category
                    let categoryId = categoryMap.get(categoryName.toLowerCase());
                    if (!categoryId) {
                        // Create
                        const newCat = await prisma.category.create({
                            data: { name: categoryName }
                        });
                        categoryId = newCat.id;
                        categoryMap.set(categoryName.toLowerCase(), categoryId);
                        console.log(`   + Created Category: ${categoryName}`);
                    }

                    // Create Product
                    const productData = {
                        name,
                        description,
                        price,
                        offerPrice: null, // Journey doesn't have offer price logic usually?
                        images,
                        categoryId,
                        isFeatured,
                        variations: {
                            create: (p.variants || []).map((v: any) => ({
                                name: v.name,
                                price: null, // Inherit
                                inStock: true
                            }))
                        }
                    };

                    const createdProduct = await prisma.product.create({
                        data: productData
                    });

                    productCount++;
                    // console.log(`   + Created Product: ${name}`);
                }
            };

            await processList('soul-luxury');
            await processList('energy-curious');
        }

        console.log(`\n🎉 Migration complete! Created ${productCount} products.`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

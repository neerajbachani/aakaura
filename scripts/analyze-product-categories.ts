import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🚀 Analyzing Products in Database...\n');

        const journeys = await prisma.journey.findMany();
        const allProducts: any[] = [];

        for (const journey of journeys) {
            const content = journey.content as any;
            
            (['soul-luxury', 'energy-curious'] as const).forEach((clientType) => {
                const products = content[clientType] || [];
                products.forEach((p: any) => {
                    allProducts.push({
                        id: p.id,
                        name: p.name,
                        category: p.category || "UNKNOWN",
                        journey: journey.slug,
                        clientType
                    });
                });
            });
        }

        // console.log(JSON.stringify(allProducts, null, 2));
        
        const unknownProducts = allProducts.filter(p => p.category === "UNKNOWN");
        console.log("UNKNOWN PRODUCT NAMES:");
        unknownProducts.forEach(p => console.log(`- ${p.name} (ID: ${p.id})`));
        
        // Group by category
        const categories = allProducts.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + 1;
            return acc;
        }, {});
        
        console.log('\nCategory Distribution:');
        console.log(JSON.stringify(categories, null, 2));

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

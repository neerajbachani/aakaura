import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const slugs = ['power', 'flow', 'grounding'];
        
        for (const slug of slugs) {
            console.log(`\n🔎 Journey: ${slug}`);
            const journey = await prisma.journey.findUnique({
                where: { slug },
            });

            if (!journey) {
                console.error(`❌ Journey "${slug}" not found`);
                continue;
            }

            const content = journey.content as any;
            const slProducts = content['soul-luxury'] || [];
            
            console.log(`Soul-Luxury Products:`);
            slProducts.forEach((p: any) => console.log(`- ${p.id}: ${p.name}`));
        }

    } catch (error: any) {
        console.error('Error:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

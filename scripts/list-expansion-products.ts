import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const slug = 'expansion';
        const journey = await prisma.journey.findUnique({
            where: { slug },
        });

        if (!journey) {
            console.error(`❌ Journey "${slug}" not found`);
            return;
        }

        const content = journey.content as any;
        const slProducts = content['soul-luxury'] || [];
        const ecProducts = content['energy-curious'] || [];

        console.log(`Soul-Luxury Products:`);
        slProducts.forEach((p: any) => console.log(`- ${p.id}: ${p.name}`));
        
        console.log(`Energy-Curious Products:`);
        ecProducts.forEach((p: any) => console.log(`- ${p.id}: ${p.name}`));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const slug = 'grounding';
        console.log(`\n🔎 Inspecting Journey: ${slug}`);
        const journey = await prisma.journey.findUnique({
            where: { slug },
        });

        if (!journey) {
            console.error(`❌ Journey "${slug}" not found`);
            return;
        }

        const content = journey.content as any;
        
        console.log('\n--- Soul-Luxury Products ---');
        const sl = content['soul-luxury'] || [];
        sl.forEach((p: any) => console.log(`[SL] ID: "${p.id}" | Name: "${p.name}"`));

        console.log('\n--- Energy-Curious Products ---');
        const ec = content['energy-curious'] || [];
        ec.forEach((p: any) => console.log(`[EC] ID: "${p.id}" | Name: "${p.name}"`));

    } catch (error: any) {
        console.error('Error:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

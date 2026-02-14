
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🧐 Listing Insight Products...\n');
        const slug = 'insight';
        const journey = await prisma.journey.findUnique({ where: { slug } });

        if (!journey) {
            console.error(`❌ Journey "${slug}" not found`);
            return;
        }


        const content = journey.content as any;
        const sl = content['soul-luxury'] || [];
        const ec = content['energy-curious'] || [];

        console.log(`SL Count: ${sl.length}`);
        console.log(`EC Count: ${ec.length}`);

        console.log('--- Soul Luxury IDs ---');
        sl.forEach((p: any) => {
             if (p.id.includes('ajna')) console.log(`FOUND: ${p.id}`);
        });

        console.log('\n--- Energy Curious IDs ---');
        ec.forEach((p: any) => {
             if (p.id.includes('ajna')) console.log(`FOUND: ${p.id}`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const slug = 'grounding';
        const journey = await prisma.journey.findUnique({ where: { slug } });
        
        if (!journey) {
            console.log('Journey not found');
            return;
        }

        const content = journey.content as any;
        const sl = content['soul-luxury'] || [];
        const ec = content['energy-curious'] || [];

        const expectedIds = [
            'grounding-wall-hanging-sl',
            'grounding-bonsai-sl',
            'grounding-wall-hanging-ec',
            'grounding-bonsai-ec'
        ];

        console.log('--- Checking Expected IDs ---');
        expectedIds.forEach(id => {
            const foundSl = sl.find((p: any) => p.id === id);
            const foundEc = ec.find((p: any) => p.id === id);
            
            if (foundSl) console.log(`✅ Found in SL: ${id}`);
            else if (id.endsWith('-sl')) console.log(`❌ Missing in SL: ${id}`);

            if (foundEc) console.log(`✅ Found in EC: ${id}`);
            else if (id.endsWith('-ec')) console.log(`❌ Missing in EC: ${id}`);
        });

        console.log('\n--- All Actual IDs ---');
        sl.forEach((p:any) => console.log(`SL: ${p.id}`));
        ec.forEach((p:any) => console.log(`EC: ${p.id}`));

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

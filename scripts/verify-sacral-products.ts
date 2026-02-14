import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const journey = await prisma.journey.findUnique({
            where: { slug: 'flow' },
        });

        if (!journey) {
            console.error('❌ Journey "flow" not found');
            return;
        }

        const content = journey.content as any;
        const slProducts = content['soul-luxury'] || [];
        const ecProducts = content['energy-curious'] || [];

        console.log(`\n🔎 Found ${slProducts.length} Soul-Luxury products`);
        slProducts.forEach((p: any) => {
            console.log(`   - ${p.id}: ${p.name}`);
            if (p.additionalSection) {
                console.log(`     ✅ Has additionalSection: "${p.additionalSection.title}"`);
            } else {
                console.log(`     ❌ Missing additionalSection`);
            }
            if (!p.whenToUse) {
                console.log(`     ✅ correctly removed whenToUse`);
            } else {
                console.log(`     ❌ Still has whenToUse`);
            }
        });

        console.log(`\n🔎 Found ${ecProducts.length} Energy-Curious products`);
        ecProducts.forEach((p: any) => {
            console.log(`   - ${p.id}: ${p.name}`);
             if (p.additionalSection) {
                console.log(`     ✅ Has additionalSection: "${p.additionalSection.title}"`);
            } else {
                console.log(`     ❌ Missing additionalSection`);
            }
            if (!p.whenToUse) {
                console.log(`     ✅ correctly removed whenToUse`);
            } else {
                console.log(`     ❌ Still has whenToUse`);
            }
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

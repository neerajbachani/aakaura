import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const slug = 'grounding';
        console.log(`\n🔎 Verifying journey: ${slug}`);
        const journey = await prisma.journey.findUnique({
            where: { slug },
        });

        if (!journey) {
            console.error(`  ❌ Journey "${slug}" not found`);
            return;
        }

        const content = journey.content as any;
        const slProducts = content['soul-luxury'] || [];
        const ecProducts = content['energy-curious'] || [];

        console.log(`  found ${slProducts.length} Soul-Luxury products`);
        slProducts.forEach((p: any) => {
            console.log(`   - ${p.id}: ${p.name}`);
            if (p.designBreakdown) {
                    console.log(`     ✅ Has designBreakdown (${Array.isArray(p.designBreakdown) ? 'Array' : 'String'})`);
            } else {
                    console.log(`     ❌ Missing designBreakdown`);
            }
        });

        console.log(`  found ${ecProducts.length} Energy-Curious products`);
        ecProducts.forEach((p: any) => {
                console.log(`   - ${p.id}: ${p.name}`);
                if (p.designBreakdown) {
                    console.log(`     ✅ Has designBreakdown (${Array.isArray(p.designBreakdown) ? 'Array' : 'String'})`);
                } else {
                    console.log(`     ❌ Missing designBreakdown`);
                }
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

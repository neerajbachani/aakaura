import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const journeysToVerify = ['power', 'flow', 'grounding'];

        for (const slug of journeysToVerify) {
            console.log(`\n🔎 Verifying journey: ${slug}`);
            const journey = await prisma.journey.findUnique({
                where: { slug },
            });

            if (!journey) {
                console.error(`  ❌ Journey "${slug}" not found`);
                continue;
            }

            const content = journey.content as any;
            const slProducts = content['soul-luxury'] || [];
            
            console.log(`  found ${slProducts.length} Soul-Luxury products`);
            slProducts.forEach((p: any) => {
                // Check if it's a bonsai product (using ID convention or name)
                if (p.id.includes('bonsai') || p.name.includes('Bonsai')) {
                    console.log(`   - ${p.id}: ${p.name}`);
                    if (p.designBreakdown && p.designBreakdown.length > 0) {
                         console.log(`     ✅ Bonsai has designBreakdown (${p.designBreakdown.length} items)`);
                    } else {
                         console.log(`     ❌ Bonsai missing designBreakdown`);
                    }
                }
            });
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

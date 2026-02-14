import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const journeysToVerify = ['power', 'love'];

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
            const ecProducts = content['energy-curious'] || [];

            console.log(`  found ${slProducts.length} Soul-Luxury products`);
            slProducts.forEach((p: any) => {
                console.log(`   - ${p.id}: ${p.name}`);
                if (p.additionalSection && p.additionalSection.title.toLowerCase().includes('when to')) {
                     console.log(`     ✅ Has additionalSection: "${p.additionalSection.title}"`);
                } else {
                     console.log(`     ❌ Missing or incorrect additionalSection`);
                }
            });

            console.log(`  found ${ecProducts.length} Energy-Curious products`);
            ecProducts.forEach((p: any) => {
                 console.log(`   - ${p.id}: ${p.name}`);
                 if (p.additionalSection && p.additionalSection.title.toLowerCase().includes('when to')) {
                     console.log(`     ✅ Has additionalSection: "${p.additionalSection.title}"`);
                } else {
                     console.log(`     ❌ Missing or incorrect additionalSection`);
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

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const journeys = ['grounding', 'flow', 'power', 'love', 'expression', 'insight', 'expansion'];

async function main() {
    try {
        console.log('🧐 Verifying Aamvaraah Mufflers...\n');
        
        for (const slug of journeys) {
            const journey = await prisma.journey.findUnique({ where: { slug } });
            if (!journey) {
                console.error(`❌ Journey "${slug}" not found`);
                continue;
            }

            const content = journey.content as any;
            const sl = content['soul-luxury'] || [];
            const ec = content['energy-curious'] || [];

            // Check SL
            const mufflerSL = sl.find((p: any) => p.name.includes("Muffler"));
            if (mufflerSL) {
                console.log(`✅ [${slug}] Found SL Muffler: "${mufflerSL.name}"`);
                // Check color detail
                const colorDetail = mufflerSL.designBreakdown.find((d: any) => d.title.includes("Color Science"));
                if (colorDetail) {
                    console.log(`   - Verified Color Detail: "${colorDetail.title}"`);
                } else {
                    console.error(`   ❌ Missing Color Detail in SL!`);
                }
            } else {
                console.error(`❌ [${slug}] SL Muffler NOT FOUND`);
            }

            // Check EC
            const mufflerEC = ec.find((p: any) => p.name.includes("Muffler"));
            if (mufflerEC) {
                console.log(`✅ [${slug}] Found EC Muffler: "${mufflerEC.name}"`);
            } else {
                console.error(`❌ [${slug}] EC Muffler NOT FOUND`);
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

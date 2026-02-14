import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🧐 Verifying Ajna Products (Third Eye)...\n');
        
        const slug = 'insight';
        const journey = await prisma.journey.findUnique({ where: { slug } });

        if (!journey) {
            console.error(`❌ Journey "${slug}" not found`);
            return;
        }

        const content = journey.content as any;
        const sl = content['soul-luxury'] || [];
        const ec = content['energy-curious'] || [];

        const checkProduct = (list: any[], id: string, name: string) => {
            const product = list.find((p: any) => p.id === id);
            if (product) {
                console.log(`✅ Found ${id} (${name})`);
                if (product.designBreakdown && product.designBreakdown.length >= 6) {
                    console.log(`   - detailed design breakdown present (${product.designBreakdown.length} items)`);
                } else {
                    console.error(`   ❌ Missing or incomplete design breakdown`);
                }
            } else {
                console.error(`❌ Missing ${id}`);
            }
        };

        console.log('--- Soul Luxury ---');
        checkProduct(sl, 'ajna-drishti-sl', 'Ajna Drishti');
        checkProduct(sl, 'ajna-anchor-sl', 'Ajna Anchor');

        console.log('\n--- Energy Curious ---');
        checkProduct(ec, 'ajna-drishti-ec', 'Ajna Drishti');
        checkProduct(ec, 'ajna-anchor-ec', 'Ajna Anchor');

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

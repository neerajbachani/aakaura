import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🧐 Verifying Heart Jewelry...\n');
        
        const slug = 'love';
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
                if (product.designBreakdown && product.designBreakdown.length > 5) {
                    console.log(`   - detailed design breakdown present (${product.designBreakdown.length} items)`);
                } else {
                    console.error(`   ❌ Missing detailed design breakdown`);
                }
            } else {
                console.error(`❌ Missing ${id}`);
            }
        };

        console.log('--- Soul Luxury ---');
        checkProduct(sl, 'aamoria-earrings-sl', 'Earrings');
        checkProduct(sl, 'aamoria-necklace-sl', 'Necklace');

        console.log('\n--- Energy Curious ---');
        checkProduct(ec, 'aamoria-earrings-ec', 'Earrings');
        checkProduct(ec, 'aamoria-necklace-ec', 'Necklace');

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

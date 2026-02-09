import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample product images - you can replace these with actual image URLs
const productImages = [
    '/images/products/root-chakra-wall-hanging-1.jpg',  // Main front view
    '/images/products/root-chakra-wall-hanging-2.jpg',  // Close-up of mandala
    '/images/products/root-chakra-wall-hanging-3.jpg',  // Detail of bells
    '/images/products/root-chakra-wall-hanging-4.jpg',  // Side angle view
    '/images/products/root-chakra-wall-hanging-5.jpg',  // Wooden inscription detail
];

async function main() {
    try {
        console.log('🎨 Adding product images to Root Chakra Wall Hanging...\n');

        // Get the grounding journey
        const journey = await prisma.journey.findUnique({
            where: { slug: 'grounding' },
        });

        if (!journey) {
            console.error('❌ Journey "grounding" not found');
            process.exit(1);
        }

        const currentContent = journey.content as any;
        let updated = false;

        // Update Soul-Luxury product
        if (currentContent['soul-luxury']) {
            const soulLuxuryProducts = currentContent['soul-luxury'];
            const rootProduct = soulLuxuryProducts.find((p: any) => p.id === 'root-wall-hanging-sl');

            if (rootProduct) {
                rootProduct.images = productImages;
                console.log('✅ Added images to Soul-Luxury product');
                updated = true;
            } else {
                console.log('⚠️  Soul-Luxury Root Chakra product not found');
            }
        }

        // Update Energy-Curious product
        if (currentContent['energy-curious']) {
            const energyCuriousProducts = currentContent['energy-curious'];
            const rootProduct = energyCuriousProducts.find((p: any) => p.id === 'root-wall-hanging-ec');

            if (rootProduct) {
                rootProduct.images = productImages;
                console.log('✅ Added images to Energy-Curious product');
                updated = true;
            } else {
                console.log('⚠️  Energy-Curious Root Chakra product not found');
            }
        }

        if (updated) {
            // Update the journey in database
            await prisma.journey.update({
                where: { slug: 'grounding' },
                data: {
                    content: currentContent,
                },
            });

            console.log('\n🎉 Product images successfully added to database!');
            console.log('\n📸 Images added:');
            productImages.forEach((img, i) => {
                console.log(`   ${i + 1}. ${img}`);
            });
            console.log('\n🌐 View the gallery at: http://localhost:3000/journey/grounding');
            console.log('   Click on the product → VIEW DESCRIPTION → See the image gallery!\n');
        } else {
            console.log('\n❌ No products were updated');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

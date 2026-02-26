import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('🚀 Syncing Product Categories in Database...\n');

        const journeys = await prisma.journey.findMany();

        for (const journey of journeys) {
            console.log(`Checking journey: ${journey.name} (${journey.slug})`);
            
            const content = journey.content as any;
            let updated = false;

            const processList = (listKey: 'soul-luxury' | 'energy-curious') => {
                const products = content[listKey] || [];
                products.forEach((p: any) => {
                    let category = "";
                    
                    // Determine category based on name or ID
                    const nameLower = (p.name || "").toLowerCase();
                    const idLower = (p.id || "").toLowerCase();

                    if (nameLower.includes("muffler") || idLower.includes("muffler") || nameLower.includes("aamvaraah")) {
                        category = "Muffler";
                    } else if (nameLower.includes("wall hanging") || idLower.includes("hanging") || nameLower.includes("prithvi") || nameLower.includes("aayam")) {
                        category = "Wall Hanging";
                    } else if (nameLower.includes("bonsai") || idLower.includes("bonsai")) {
                        category = "Bonsai"; 
                    } else if (nameLower.includes("bracelet") || idLower.includes("bracelet")) {
                        category = "Jewellery";
                    } else if (nameLower.includes("necklace") || idLower.includes("necklace") || nameLower.includes("mala") || nameLower.includes("rudraksha") || nameLower.includes("earrings") || idLower.includes("earrings")) {
                        category = "Jewellery";
                    } else if (nameLower.includes("oil") || idLower.includes("oil") || nameLower.includes("essential")) {
                        category = "Essential Oils";
                    } else if (nameLower.includes("incense") || idLower.includes("incense") || nameLower.includes("dhoop")) {
                        category = "Incense";
                    } else if (nameLower.includes("copper") || nameLower.includes("bottle") || nameLower.includes("tongue") || nameLower.includes("neti")) {
                        category = "Copperware";
                    } else if (nameLower.includes("anchor") || nameLower.includes("drishti") || nameLower.includes("yantra")) {
                         category = "Meditation Tool";
                    } 
                    // Add more rules as needed

                    if (category && p.category !== category) {
                        p.category = category;
                        updated = true;
                        console.log(`   🔸 Tagged "${p.name}" as [${category}]`);
                    }
                });
                content[listKey] = products;
            };

            processList('soul-luxury');
            processList('energy-curious');

            if (updated) {
                await prisma.journey.update({
                    where: { id: journey.id },
                    data: { content },
                });
                console.log(`   ✅ Updated ${journey.slug}`);
            } else {
                console.log(`   - No changes needed`);
            }
        }

        console.log('\n🎉 Category sync complete!');

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

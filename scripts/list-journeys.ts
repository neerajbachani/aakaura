import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        const journeys = await prisma.journey.findMany({
            select: { slug: true, name: true }
        });
        console.log('Available Journeys:');
        journeys.forEach(j => console.log(`- ${j.slug}: ${j.name}`));
    } catch (error: any) {
        console.error('Error listing journeys:', error.message || error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

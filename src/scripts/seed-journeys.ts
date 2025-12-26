import { PrismaClient } from "@prisma/client";
import { chakrasData } from "../data/chakras";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding journeys...");

    for (const journey of Object.values(chakrasData)) {
        console.log(`Seeding journey: ${journey.name}`);

        // We need to cast the JSON compatible objects to any or strict JSON types
        // Prisma's input types for Json are quite flexible

        await prisma.journey.upsert({
            where: { slug: journey.slug },
            update: {
                name: journey.name,
                tagline: journey.tagline,
                sanskritName: journey.sanskritName,
                tone: journey.tone,
                location: journey.location,
                element: journey.element,
                mantra: journey.mantra,
                symbol: journey.symbol,
                description: journey.description,
                colors: journey.colors as any,
                crystals: journey.crystals,
                benefits: journey.benefits,
                content: journey.content as any,
                products: [],
            },
            create: {
                slug: journey.slug,
                name: journey.name,
                tagline: journey.tagline,
                sanskritName: journey.sanskritName,
                tone: journey.tone,
                location: journey.location,
                element: journey.element,
                mantra: journey.mantra,
                symbol: journey.symbol,
                description: journey.description,
                colors: journey.colors as any,
                crystals: journey.crystals,
                benefits: journey.benefits,
                products: [],
                content: journey.content as any,
            },
        });
    }

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

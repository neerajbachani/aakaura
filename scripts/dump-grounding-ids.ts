import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    try {
        const slug = 'grounding';
        const journey = await prisma.journey.findUnique({ where: { slug } });
        
        if (!journey) {
            fs.writeFileSync('grounding_ids.txt', 'Journey not found');
            return;
        }

        const content = journey.content as any;
        const sl = content['soul-luxury'] || [];
        const ec = content['energy-curious'] || [];

        let output = '--- Soul-Luxury ---\n';
        sl.forEach((p: any) => output += `${p.id}\n`);
        
        output += '\n--- Energy-Curious ---\n';
        ec.forEach((p: any) => output += `${p.id}\n`);

        fs.writeFileSync('grounding_ids.txt', output);
        console.log('IDs dumped to grounding_ids.txt');

    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

main();

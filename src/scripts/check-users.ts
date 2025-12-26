import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true
        }
    });

    console.log('--- Users in Database ---');
    users.forEach(u => {
        console.log(`ID: ${u.id} | Email: ${u.email} | Name: ${u.name} | Role: ${u.role}`);
    });
    console.log('-------------------------');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

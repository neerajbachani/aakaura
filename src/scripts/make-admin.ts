import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Promoting all users to ADMIN...');

    const result = await prisma.user.updateMany({
        data: {
            role: 'ADMIN'
        }
    });

    console.log(`Updated ${result.count} users to ADMIN role.`);

    const users = await prisma.user.findMany({
        select: { email: true, role: true }
    });

    console.log('Current user roles:');
    console.table(users);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

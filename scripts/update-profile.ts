
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const email = 'graciele@fonoia.com';

    console.log(`Upserting user with email: ${email}...`);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            name: 'Graciele Costa',
            crfa: '2124/9',
            specialty: 'Fonoaudióloga',
        },
        create: {
            email,
            name: 'Graciele Costa',
            role: 'PROFESSIONAL',
            crfa: '2124/9',
            specialty: 'Fonoaudióloga',
        },
    });

    console.log('User updated/created:', user);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Creating Test Data...');

    // Create "Ana Particular" (Verde, Reavaliação Vencida)
    const ana = await prisma.patient.upsert({

        // Actually patient id is cuid, name is not unique. I'll search by name? No upsert needs unique.
        // I'll creates new ones but first cleanup if possible or just create.
        // Since names are unique enough for testing:
        create: {
            name: 'Ana Particular',
            financialSource: 'PARTICULAR',
            status: 'Em Tratamento',
            dateOfBirth: new Date('1990-01-01'),
            phone: '5511999999999', // Valid format for test
            nextReevaluation: new Date(Date.now() - 86400000), // Yesterday
            gender: 'Feminino',
            startDate: new Date(),
        },
        update: {
            financialSource: 'PARTICULAR',
            nextReevaluation: new Date(Date.now() - 86400000), // Yesterday
            phone: '5511999999999',
        },
        where: { id: (await findPatientIdByName('Ana Particular')) || 'dummy-id' }
    });

    // Create "Beto Convênio" (Azul)
    const beto = await prisma.patient.upsert({
        where: { id: await findPatientIdByName('Beto Convênio') || 'dummy-id-2' },
        create: {
            name: 'Beto Convênio',
            financialSource: 'CONVENIO',
            status: 'Aguardando',
            dateOfBirth: new Date('2015-05-05'),
            phone: '5511888888888',
            gender: 'Masculino',
            startDate: new Date(),
        },
        update: {
            financialSource: 'CONVENIO',
            phone: '5511888888888',
        }
    });

    console.log('Patients created.');

    // Create Finances for Profit Logic
    // Income 200, Expense 50
    // Clean up previous transactions with specific descriptions to avoid dupes?
    // Just create new ones for "Today"

    await prisma.transaction.create({
        data: {
            description: 'Receita Teste',
            amount: 200,
            type: 'INCOME', // Using type as INCOME based on schema analysis? schema says flow String @default("INCOME") and type String
            flow: 'INCOME',
            status: 'pago',
            dueDate: new Date(),
            paymentDate: new Date(),
            category: 'Consulta',
            source: 'PARTICULAR'
        }
    });

    await prisma.transaction.create({
        data: {
            description: 'Material Teste',
            amount: 50,
            flow: 'EXPENSE',
            type: 'EXPENSE',
            status: 'pago',
            dueDate: new Date(),
            paymentDate: new Date(),
            category: 'Variável'
        }
    });

    console.log('Financial data created.');
}

// Helper to find ID (since schema doesn't have unique name)
async function findPatientIdByName(name: string) {
    const p = await prisma.patient.findFirst({ where: { name } });
    return p ? p.id : undefined;
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";

// Load environment from .env.local
config({ path: ".env.local" });

const prisma = new PrismaClient();

const patients = [
  {
    name: "Theo Santos",
    responsibleName: "Marcela Rosa",
    timesPerWeek: 1,
    type: "Intervenção",
    paymentDueDay: 15,
    value: 440,
  },
  {
    name: "Gael",
    responsibleName: "Larissa",
    timesPerWeek: 2,
    type: "Intervenção",
    paymentDueDay: 17,
    value: 1000,
  },
  {
    name: "Tiago",
    responsibleName: "Juliana",
    timesPerWeek: 1,
    type: "Intervenção",
    paymentDueDay: 23,
    value: 950,
  },
  {
    name: "Infinity",
    responsibleName: "Daniel",
    timesPerWeek: 3,
    type: "Intervenção",
    paymentDueDay: 5,
    value: 6500,
  },
  {
    name: "Miguel Benjamin",
    responsibleName: "Luana Rocha",
    timesPerWeek: 1,
    type: "Intervenção",
    paymentDueDay: 5,
    value: 450,
  },
  {
    name: "Bernardo",
    responsibleName: "Leila",
    timesPerWeek: 1,
    type: "Intervenção",
    paymentDueDay: 5,
    value: 1000,
  },
  {
    name: "Théo Silva",
    responsibleName: "Elaine",
    timesPerWeek: 2,
    type: "Intervenção",
    paymentDueDay: 5,
    value: 1275,
  },
  {
    name: "Heitor Teophilo",
    responsibleName: "Sheila / Leandro",
    timesPerWeek: 2,
    type: "Intervenção",
    paymentDueDay: 5,
    value: 350,
  },
  {
    name: "João Pedro",
    responsibleName: "Gabriela",
    timesPerWeek: 2,
    type: "Intervenção",
    paymentDueDay: 5,
    value: 1625,
  },
  {
    name: "Henry",
    responsibleName: "Karen",
    timesPerWeek: 1,
    type: "Intervenção",
    paymentDueDay: 5,
    value: 650,
  },
  {
    name: "Marcos",
    responsibleName: "Defenz",
    timesPerWeek: 0,
    type: "Consultoria", // Not regular intervention
    paymentDueDay: 5,
    value: 5000,
  },
];

async function main() {
  console.log("Starting patient seed...\n");

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  for (const patientData of patients) {
    // Create patient
    const patient = await prisma.patient.create({
      data: {
        name: patientData.name,
        motherName: patientData.responsibleName,
        status: "Em Terapia",
        gender: "Masculino", // Default, can be updated later
        dateOfBirth: new Date("2020-01-01"), // Placeholder, can be updated later
        financialSource: "PARTICULAR",
        negotiatedValue: patientData.value,
        observations: `${patientData.timesPerWeek}x por semana - ${patientData.type}`,
      },
    });

    console.log(`Created patient: ${patient.name} (ID: ${patient.id})`);

    // Create monthly transaction for current month
    const dueDate = new Date(currentYear, currentMonth, patientData.paymentDueDay);

    // If the due date has passed, set it for next month
    if (dueDate < currentDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }

    const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const referenceMonth = monthNames[dueDate.getMonth()];
    const referenceYear = dueDate.getFullYear();

    const transaction = await prisma.transaction.create({
      data: {
        description: `Mensalidade ${patientData.type} - ${patient.name}`,
        amount: patientData.value,
        type: "Terapia",
        flow: "INCOME",
        source: "PARTICULAR",
        status: "pendente",
        dueDate: dueDate,
        referenceId: `MONTHLY_${referenceMonth}_${referenceYear}`,
        isMonthly: true,
        patientId: patient.id,
      },
    });

    console.log(`  -> Created transaction: R$ ${transaction.amount} due on day ${patientData.paymentDueDay}\n`);
  }

  console.log("\nSeed completed successfully!");
  console.log(`Total patients created: ${patients.length}`);
}

main()
  .catch((e) => {
    console.error("Error seeding patients:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

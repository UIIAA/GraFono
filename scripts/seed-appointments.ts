import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { addDays, startOfWeek, setHours, setMinutes } from "date-fns";

config({ path: ".env.local" });

const prisma = new PrismaClient();

// Patient IDs
const PATIENTS: Record<string, string> = {
  "Theo Santos": "cmkivqfdo00003og884dkyejd",
  "Gael": "cmkivqfhp00033og8sny8nwmh",
  "Tiago": "cmkivqfj500063og8rb7u4fq0",
  "Infinity": "cmkivqfku00093og8gub19pzm",
  "Miguel Benjamin": "cmkivqfmi000c3og8127nmy9n",
  "Heitor Teophilo": "cmkivqfrv000l3og8ggm70m6k",
  "João Pedro": "cmkivqfth000o3og8zd11vzbn",
  "Henry": "cmkivqfv0000r3og8vsem679i",
};

// Schedule: [dayOfWeek (0=Sun, 2=Tue), hour, patientName]
const WEEKLY_SCHEDULE = [
  // Segunda-feira (1) - Infinity
  [1, 8, "Infinity"],
  [1, 9, "Infinity"],
  [1, 10, "Infinity"],
  [1, 11, "Infinity"],
  [1, 13, "Infinity"],
  [1, 14, "Infinity"],
  [1, 15, "Infinity"],
  [1, 16, "Infinity"],
  [1, 17, "Infinity"],

  // Terça-feira (2) - Infinity
  [2, 8, "Infinity"],
  [2, 9, "Infinity"],
  [2, 10, "Infinity"],
  [2, 11, "Infinity"],
  [2, 13, "Infinity"],
  [2, 14, "Infinity"],
  [2, 15, "Infinity"],
  [2, 16, "Infinity"],
  [2, 17, "Infinity"],

  // Quarta-feira (3)
  [3, 10, "Henry"],
  [3, 15, "João Pedro"],
  [3, 16, "Tiago"],
  [3, 17, "Theo Santos"],

  // Quinta-feira (4) - Infinity
  [4, 8, "Infinity"],
  [4, 9, "Infinity"],
  [4, 10, "Infinity"],
  [4, 11, "Infinity"],
  [4, 13, "Infinity"],
  [4, 14, "Infinity"],
  [4, 15, "Infinity"],
  [4, 16, "Infinity"],
  [4, 17, "Infinity"],

  // Sexta-feira (5)
  [5, 10, "Henry"],
  [5, 11, "Miguel Benjamin"],
  [5, 14, "João Pedro"],
  [5, 15, "João Pedro"],
  [5, 16, "Gael"],

  // Sábado (6)
  [6, 9, "Theo Santos"],
  [6, 10, "Heitor Teophilo"],
];

async function main() {
  console.log("Creating appointments...\n");

  // Get start of current week (Sunday)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });

  let created = 0;

  // Create appointments for this week and next 3 weeks
  for (let week = 0; week < 4; week++) {
    const weekOffset = week * 7;

    for (const [dayOfWeek, hour, patientName] of WEEKLY_SCHEDULE) {
      const patientId = PATIENTS[patientName as string];
      if (!patientId) {
        console.log(`  Skipping unknown patient: ${patientName}`);
        continue;
      }

      // Calculate date
      let appointmentDate = addDays(weekStart, (dayOfWeek as number) + weekOffset);
      appointmentDate = setHours(appointmentDate, hour as number);
      appointmentDate = setMinutes(appointmentDate, 0);

      // Skip if date is in the past
      if (appointmentDate < today) continue;

      // Check if appointment already exists
      const existing = await prisma.appointment.findFirst({
        where: {
          patientId,
          date: appointmentDate,
        },
      });

      if (!existing) {
        await prisma.appointment.create({
          data: {
            date: appointmentDate,
            time: `${String(hour).padStart(2, "0")}:00`,
            status: "Agendado",
            type: "Terapia",
            location: "Presencial",
            patientId,
          },
        });
        created++;
        console.log(`  Created: ${patientName} - ${appointmentDate.toLocaleDateString("pt-BR")} ${hour}:00`);
      }
    }
  }

  console.log(`\nTotal appointments created: ${created}`);
}

main()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

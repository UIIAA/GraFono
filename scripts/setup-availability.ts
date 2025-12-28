
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Setting up granular availability...');

    const timeSlots = [
        { day: "MON", active: true, slots: [{ start: "08:00", end: "18:00" }] },
        { day: "TUE", active: true, slots: [{ start: "08:00", end: "18:00" }] },
        { day: "WED", active: true, slots: [{ start: "13:00", end: "18:00" }] }, // Partial Afternoon
        { day: "THU", active: true, slots: [{ start: "08:00", end: "18:00" }] },
        { day: "FRI", active: true, slots: [{ start: "08:00", end: "18:00" }] },
        { day: "SAT", active: true, slots: [{ start: "08:00", end: "12:00" }] }, // Partial Morning
        { day: "SUN", active: false, slots: [] }
    ];

    const workingDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

    // Upsert Config (assuming single record logic or just take the first)
    // Since schema doesn't force single record, we usually findFirst/update or create.

    const existing = await prisma.availabilityConfig.findFirst();

    if (existing) {
        await prisma.availabilityConfig.update({
            where: { id: existing.id },
            data: {
                workingDays: JSON.stringify(workingDays),
                startHour: "08:00",
                endHour: "18:00",
                timeSlots: JSON.stringify(timeSlots),
                sessionDuration: 30
            }
        });
        console.log("Updated availability config.");
    } else {
        await prisma.availabilityConfig.create({
            data: {
                workingDays: JSON.stringify(workingDays),
                startHour: "08:00",
                endHour: "18:00",
                timeSlots: JSON.stringify(timeSlots),
                sessionDuration: 30
            }
        });
        console.log("Created availability config.");
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

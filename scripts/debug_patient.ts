import { db } from "@/lib/db";

async function main() {
    console.log("--- Debugging 'Infinity' Patient ---");

    const p = await db.patient.findFirst({
        where: {
            name: { contains: "Infinity" }
        },
        include: {
            appointments: {
                where: {
                    status: "Agendado",
                    date: { gte: new Date() }
                }
            }
        }
    });

    if (!p) {
        console.log("Patient not found.");
        return;
    }

    console.log("Patient:", p.name);
    console.log("Payment Method:", p.paymentMethod); // CRITICAL
    console.log("Category:", p.category);
    console.log("Negotiated Value:", p.negotiatedValue);
    console.log("Financial Source:", p.financialSource);
    console.log("Future Appointments Count:", p.appointments.length);
}

main();

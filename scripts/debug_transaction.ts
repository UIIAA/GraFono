import { db } from "@/lib/db";

async function main() {
    console.log("--- Debugging 'Infinity' Transaction ---");

    // Find the transaction by description or amount since we saw 'Infinity' and '6500' in screenshot
    const tx = await db.transaction.findFirst({
        where: {
            description: { contains: "Infinity" } // or patient name
        }
    });

    if (!tx) {
        console.log("Transaction not found.");

        // List all transactions to see what's there
        const all = await db.transaction.findMany({ take: 5 });
        console.log("First 5 transactions:", all);
        return;
    }

    console.log("Transaction Found:", tx);
    console.log("Flow:", tx.flow);
    console.log("Status:", tx.status);
    console.log("PaymentDate:", tx.paymentDate);
    console.log("Amount:", tx.amount);

    // Test the Metric Query Logic specifically for this transaction
    const start = new Date(tx.paymentDate || "2026-01-01");
    start.setHours(0, 0, 0, 0);
    const end = new Date(tx.paymentDate || "2026-01-31");
    end.setHours(23, 59, 59, 999);

    console.log(`\nTesting Query Window: ${start.toISOString()} to ${end.toISOString()}`);

    const agg = await db.transaction.aggregate({
        _sum: { amount: true },
        where: {
            paymentDate: { gte: start, lte: end },
            OR: [{ status: "PAID" }, { status: "PAGO" }, { status: "pago" }],
            flow: { in: ["INCOME", "Receita", "RECEITA", "receita"] }
        }
    });

    console.log("Aggregation Result:", agg._sum.amount);
}

main();

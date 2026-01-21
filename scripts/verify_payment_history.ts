
import { getPaymentHistory } from "../src/app/actions/finance";
import { db } from "../src/lib/db";

async function verifyPaymentHistory() {
    console.log("--- Verifying Payment History Logic ---");

    try {
        // 1. Find a transaction to test (or create a dummy one if needed, but let's try finding first)
        const transaction = await db.transaction.findFirst({
            where: { isMonthly: true }, // Ideally checking a monthly one as those are common
            select: { id: true, description: true }
        });

        if (!transaction) {
            console.log("No transaction found to test history. Please run seeds or create a transaction manually.");
            return;
        }

        console.log(`Testing with Transaction: ${transaction.description} (${transaction.id})`);

        // 2. Fetch History (Should be empty or have entries, but NOT fail)
        const result = await getPaymentHistory(transaction.id);

        if (result.success) {
            console.log("✅ getPaymentHistory returned success.");
            console.log(`Entries found: ${result.data?.length}`);
            if (result.data && result.data.length > 0) {
                console.log("Sample Entry:", JSON.stringify(result.data[0], null, 2));
            }
        } else {
            console.error("❌ getPaymentHistory failed:", result.error);
        }

    } catch (e) {
        console.error("❌ Unexpected script error:", e);
    }
}

verifyPaymentHistory();

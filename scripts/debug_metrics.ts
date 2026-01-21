
import { getFinancialMetrics } from "../src/app/actions/finance";

async function main() {
    console.log("--- Debugging Financial Metrics ---");
    const result = await getFinancialMetrics();

    if (result.success) {
        console.log("Metrics Result:", JSON.stringify(result.data, null, 2));
    } else {
        console.error("Error fetching metrics:", result.error);
    }
}

main();

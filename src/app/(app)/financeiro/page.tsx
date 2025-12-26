"use server";

import FinanceDashboardClient from "./_components/finance-dashboard-client";
import { getFinancialMetrics, getTransactions } from "@/app/actions/finance";
import { getPatients } from "@/app/actions/patient";

export default async function FinanceiroPage() {
    // Parallel data fetching for performance
    const [metricsRes, transactionsRes, patientsRes] = await Promise.all([
        getFinancialMetrics(),
        getTransactions(),
        getPatients()
    ]);

    const metrics = metricsRes.success ? metricsRes.data : null;
    const transactions = transactionsRes.success ? transactionsRes.data : [];
    const patients = patientsRes.success ? patientsRes.data : [];

    return (
        <FinanceDashboardClient
            initialMetrics={metrics}
            initialTransactions={transactions}
            patients={patients}
        />
    );
}

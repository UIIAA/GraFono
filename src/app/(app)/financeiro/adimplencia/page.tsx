import { Suspense } from "react";
import { getComplianceList, getDelinquencyStats } from "@/app/actions/finance";
import { ComplianceListClient } from "./_components/compliance-list-client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function CompliancePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const today = new Date();
    const currentMonth = today.getMonth(); // 0-11
    const currentYear = today.getFullYear();

    const monthParam = searchParams.month ? parseInt(searchParams.month as string) : currentMonth;
    const yearParam = searchParams.year ? parseInt(searchParams.year as string) : currentYear;

    const [complianceResult, delinquencyResult] = await Promise.all([
        getComplianceList(monthParam, yearParam),
        getDelinquencyStats()
    ]);

    const { success, data } = complianceResult;
    const delinquencyStats = delinquencyResult.success ? delinquencyResult.data : null;

    const prevDate = new Date(yearParam, monthParam - 1);
    const nextDate = new Date(yearParam, monthParam + 1);

    return (
        <div className="space-y-8 max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                        Lista de Adimplência
                    </h1>
                    <p className="text-slate-500 mt-2">
                        Gerencie mensalidades e recebimentos do período.
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
                    <Link href={`?month=${prevDate.getMonth()}&year=${prevDate.getFullYear()}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-lg">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>

                    <span className="text-sm font-bold w-32 text-center capitalize text-slate-700">
                        {format(new Date(yearParam, monthParam), "MMMM yyyy", { locale: ptBR })}
                    </span>

                    <Link href={`?month=${nextDate.getMonth()}&year=${nextDate.getFullYear()}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-lg">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            <Suspense fallback={<div className="text-center p-10">Carregando lista...</div>}>
                <ComplianceListClient
                    initialTransactions={success && data ? data : []}
                    month={currentMonth}
                    year={currentYear}
                    delinquencyStats={delinquencyStats || null}
                />
            </Suspense>
        </div>
    );
}

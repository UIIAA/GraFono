import { prisma } from "@/lib/prisma";
import { EvolutionForm } from "./_components/evolution-form";
import { getMonthlyFinancialStatus } from "@/app/actions/evolution";
import { notFound } from "next/navigation";

export default async function EvolutionPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const patient = await prisma.patient.findUnique({
        where: { id },
    });

    if (!patient) {
        notFound();
    }

    const financialStatus = await getMonthlyFinancialStatus(id);

    return (
        <EvolutionForm
            patient={{
                id: patient.id,
                name: patient.name,
                financialSource: patient.financialSource
            }}
            financialStatus={financialStatus}
        />
    );
}

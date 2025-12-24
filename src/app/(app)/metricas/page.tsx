"use client";

import { Button } from "@/components/ui/button";
import { BarChart } from "lucide-react";

export default function MetricasPage() {
    return (
        <div className="p-8 min-h-screen bg-[#F0F2F5]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Métricas e KPIs</h1>
                    <p className="text-gray-500">Análise de desempenho e resultados</p>
                </div>
                <Button variant="outline">
                    <BarChart className="mr-2 h-4 w-4" /> Exportar Relatório
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">Gráfico de desempenho...</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 min-h-[300px] flex items-center justify-center">
                    <p className="text-gray-500">Distribuição de pacientes...</p>
                </div>
            </div>
        </div>
    )
}

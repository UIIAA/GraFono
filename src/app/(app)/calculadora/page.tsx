"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalculatorTab } from "./_components/calculator-tab";
import { ProgressTab } from "./_components/progress-tab";
import { getPatients } from "@/app/actions/patient";
import { getDiagnoses } from "@/app/actions/settings";
import { Calculator, BarChart3 } from "lucide-react";

export default function CalculadoraPage() {
    const [patients, setPatients] = useState<any[]>([]);
    const [diagnoses, setDiagnoses] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState("calculator");

    // We can store the calculation result here to pass it to the active tab if needed,
    // or to show a "success" state before switching tabs.
    const [calculationResult, setCalculationResult] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [patRes, diagRes] = await Promise.all([
                getPatients(),
                getDiagnoses()
            ]);

            if (patRes.success && patRes.data) setPatients(patRes.data);
            if (diagRes.success && diagRes.data) setDiagnoses(diagRes.data);
        };
        fetchData();
    }, []);

    const handleCalculationSuccess = (result: any) => {
        setCalculationResult(result);
        // Optional: Switch to progress tab automatically?
        // setActiveTab("progress"); 
    };

    return (
        <div className="min-h-screen p-8 bg-slate-50/50 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Calculadora de Terapia</h1>
                    <p className="text-slate-500 mt-1">Estimativa de duração e planejamento terapêutico</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white p-1 rounded-xl shadow-sm border">
                    <TabsList className="bg-transparent h-10">
                        <TabsTrigger value="calculator" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                            <Calculator className="mr-2 h-4 w-4" /> Calculadora
                        </TabsTrigger>
                        <TabsTrigger value="progress" className="rounded-lg data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                            <BarChart3 className="mr-2 h-4 w-4" /> Progresso
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsContent value="calculator" className="outline-none">
                    <CalculatorTab
                        patients={patients}
                        diagnoses={diagnoses}
                        onResult={handleCalculationSuccess}
                    />
                </TabsContent>
                <TabsContent value="progress" className="outline-none">
                    <ProgressTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}

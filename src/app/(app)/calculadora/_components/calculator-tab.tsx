"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { BrainCircuit, Sparkles, User, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CalculatorTabProps {
    patients: any[];
    diagnoses: any[];
    onResult: (result: any) => void;
}

export function CalculatorTab({ patients, diagnoses, onResult }: CalculatorTabProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form State
    const [patientId, setPatientId] = useState("");
    const [patientAge, setPatientAge] = useState({ years: 5, months: 0 });
    const [diagnosis, setDiagnosis] = useState("");
    const [secondaryDiagnosis, setSecondaryDiagnosis] = useState("");
    const [severity, setSeverity] = useState([5]);
    const [frequency, setFrequency] = useState([2]); // Default 2x week
    const [duration, setDuration] = useState([45]);  // Default 45min
    const [familySupport, setFamilySupport] = useState([5]); // 1-10
    const [hasComorbidities, setHasComorbidities] = useState(false);
    const [template, setTemplate] = useState("");

    // Update form when patient is selected
    useEffect(() => {
        if (patientId) {
            const patient = patients.find(p => p.id === patientId);
            if (patient) {
                // Calculate age manually if needed, or use mock for now
                const birth = new Date(patient.dateOfBirth);
                const now = new Date();
                let years = now.getFullYear() - birth.getFullYear();
                let months = now.getMonth() - birth.getMonth();
                if (months < 0) {
                    years--;
                    months += 12;
                }
                setPatientAge({ years, months });
            }
        }
    }, [patientId, patients]);

    const handleCalculate = async () => {
        if (!patientId || !diagnosis) {
            toast({
                title: "Dados incompletos",
                description: "Selecione um paciente e o diagnóstico principal.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        // Mocking AI Calculation for UX validation
        setTimeout(() => {
            const calculatedResult = {
                totalSessions: 48,
                estimatedMonths: 6,
                successChance: 85 - (severity[0] * 2) + 20, // Simple logic
                weeklyFrequency: frequency[0],
                sessionDuration: duration[0]
            };

            onResult(calculatedResult);
            toast({ title: "Plano Calculado com Sucesso" });
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. SELEÇÃO DO PACIENTE */}
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Seleção do Paciente</CardTitle>
                    <CardDescription>Escolha um paciente ou insira a idade manualmente</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Paciente</Label>
                        <Select value={patientId} onValueChange={setPatientId}>
                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Selecione um paciente" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Anos</Label>
                            <Input
                                type="number"
                                value={patientAge.years}
                                onChange={e => setPatientAge({ ...patientAge, years: parseInt(e.target.value) })}
                                className="h-11 rounded-xl bg-slate-50 border-slate-200"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Meses</Label>
                            <Input
                                type="number"
                                value={patientAge.months}
                                onChange={e => setPatientAge({ ...patientAge, months: parseInt(e.target.value) })}
                                className="h-11 rounded-xl bg-slate-50 border-slate-200"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* 2. TEMPLATES */}
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Templates de Tratamento</CardTitle>
                    <CardDescription>Selecione um modelo predefinido ou personalize</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Select value={template} onValueChange={setTemplate}>
                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Selecione um template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="t1">Desenvolvimento da Fala</SelectItem>
                                <SelectItem value="t2">Instalação do Fonema /r/</SelectItem>
                                <SelectItem value="t3">Tratamento de Gagueira</SelectItem>
                                <SelectItem value="t4">TEA - Desenvolvimento de Linguagem</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* 3. DIAGNÓSTICO E SEVERIDADE */}
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Diagnóstico e Severidade</CardTitle>
                    <CardDescription>Defina o quadro clínico e sua gravidade</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Diagnóstico Principal</Label>
                        <Select value={diagnosis} onValueChange={setDiagnosis}>
                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Selecione o diagnóstico" />
                            </SelectTrigger>
                            <SelectContent>
                                {diagnoses.map(d => (
                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Diagnóstico Secundário (opcional)</Label>
                        <Select value={secondaryDiagnosis} onValueChange={setSecondaryDiagnosis}>
                            <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Selecione o diagnóstico secundário" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">Nenhum</SelectItem>
                                {diagnoses.map(d => (
                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex justify-between items-center">
                            <Label>Severidade</Label>
                            <span className="text-sm font-medium text-slate-500">
                                {severity[0] < 4 ? "Leve" : severity[0] < 8 ? "Moderado" : "Severo"}
                            </span>
                        </div>
                        <Slider
                            value={severity}
                            onValueChange={setSeverity}
                            max={10} step={1}
                            className="bg-slate-100 rounded-full"
                        />
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox
                            id="comorb"
                            checked={hasComorbidities}
                            onCheckedChange={(c) => setHasComorbidities(c as boolean)}
                        />
                        <Label htmlFor="comorb" className="font-normal cursor-pointer">
                            Comorbidades associadas
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* 4. CONFIGURAÇÃO SESSÕES */}
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl flex flex-col">
                <CardHeader>
                    <CardTitle className="text-xl">Configuração de Sessões</CardTitle>
                    <CardDescription>Defina frequência e duração das sessões</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Frequência Semanal</Label>
                            <span className="text-sm text-slate-500">{frequency[0]} vezes por semana</span>
                        </div>
                        <Slider value={frequency} onValueChange={setFrequency} min={1} max={5} step={1} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Duração da Sessão</Label>
                            <span className="text-sm text-slate-500">{duration[0]} minutos</span>
                        </div>
                        <Slider value={duration} onValueChange={setDuration} min={30} max={90} step={15} />
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label>Suporte Familiar</Label>
                            <span className="text-sm text-slate-500">
                                {familySupport[0] < 4 ? "Baixo" : familySupport[0] < 8 ? "Médio" : "Alto"}
                            </span>
                        </div>
                        <Slider value={familySupport} onValueChange={setFamilySupport} max={10} step={1} />
                    </div>

                    <div className="pt-4 mt-auto">
                        <Button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="w-full h-12 text-base font-bold bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all"
                        >
                            {loading ? "Calculando..." : "Calcular Plano de Terapia"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

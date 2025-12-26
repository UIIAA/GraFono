"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Calculator,
    User,
    Calendar,
    BrainCircuit,
    ArrowRight,
    Sparkles,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function CalculadoraPage() {
    const { toast } = useToast();
    const [severity, setSeverity] = useState([5]);
    const [complexity, setComplexity] = useState([3]);
    const [frequency, setFrequency] = useState("1");

    // Derived values (Mock logic)
    const sessions = 12 * parseInt(frequency);
    const months = 3; // Fixed for MVP
    const improvementChance = 85 - (severity[0] * 2) + (parseInt(frequency) * 5);

    // Glass styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassPanel = "bg-white/50 backdrop-blur-sm border border-red-100 rounded-2xl";
    const glassInput = "bg-white/50 border-red-100 focus:bg-white/80 transition-all";

    const handleFeatureNotImplemented = () => {
        toast({
            title: "Em breve",
            description: "Esta funcionalidade estará disponível na próxima atualização.",
            variant: "default",
        });
    };

    return (
        <div
            className="min-h-screen p-8 space-y-8 relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-400/10 to-red-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/60 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-white/50">
                        <Calculator className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Calculadora de Terapia</h1>
                        <p className="text-slate-500">Estimativa de Tratamento Personalizada</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Configuration Panel */}
                <Card className={`lg:col-span-2 ${glassCard} border-0`}>
                    <CardHeader>
                        <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                            <User className="h-5 w-5 text-red-500" />
                            Dados Clínicos
                        </CardTitle>
                        <CardDescription className="text-slate-500">Configure os parâmetros do paciente para gerar a estimativa.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">

                        {/* Patient & Diagnosis */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Paciente</Label>
                                <Select>
                                    <SelectTrigger className={`rounded-xl h-11 ${glassInput}`}>
                                        <SelectValue placeholder="Selecione o paciente" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="joao">João Silva</SelectItem>
                                        <SelectItem value="maria">Maria Santos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700 font-semibold">Diagnóstico Principal</Label>
                                <Select>
                                    <SelectTrigger className={`rounded-xl h-11 ${glassInput}`}>
                                        <SelectValue placeholder="Selecione a patologia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="atraso">Atraso de Linguagem</SelectItem>
                                        <SelectItem value="troca">Troca de Fonemas</SelectItem>
                                        <SelectItem value="voz">Disfonia</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Sliders */}
                        <div className={`p-6 ${glassPanel} space-y-6`}>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-slate-700 font-semibold">Severidade do Caso</Label>
                                    <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-lg border border-red-200">Nível {severity}</span>
                                </div>
                                <Slider
                                    value={severity}
                                    onValueChange={setSeverity}
                                    max={10}
                                    step={1}
                                    className="py-1"
                                />
                                <p className="text-xs text-slate-500 font-medium">
                                    1 (Leve) - 10 (Severo). Impacta na duração total do tratamento.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <Label className="text-slate-700 font-semibold">Complexidade Cognitiva</Label>
                                    <span className="text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-lg border border-orange-200">Nível {complexity}</span>
                                </div>
                                <Slider
                                    value={complexity}
                                    onValueChange={setComplexity}
                                    max={5}
                                    step={1}
                                    className="py-1"
                                />
                            </div>
                        </div>

                        {/* Frequency */}
                        <div className="space-y-3">
                            <Label className="text-slate-700 font-semibold">Frequência Semanal Sugerida</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {['1', '2', '3'].map((freq) => (
                                    <div
                                        key={freq}
                                        onClick={() => setFrequency(freq)}
                                        className={`
                                            cursor-pointer rounded-xl p-3 text-center border transition-all text-sm font-bold
                                            ${frequency === freq
                                                ? 'bg-red-500 text-white border-red-600 shadow-md shadow-red-200 scale-105'
                                                : 'bg-white/50 border-white/60 text-slate-600 hover:bg-white hover:text-red-500'
                                            }
                                        `}
                                    >
                                        {freq}x Semanal
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Panel */}
                <div className="space-y-6">
                    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-2xl shadow-slate-400/50 rounded-3xl overflow-hidden relative">
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-red-500/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-yellow-400" />
                                Plano Sugerido
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 relative z-10">
                            <div className="text-center py-4 border-b border-white/10">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Duração Estimada</span>
                                <div className="text-5xl font-bold mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                                    {months} Meses
                                </div>
                                <p className="text-sm text-slate-400 mt-1">~ {sessions} Sessões totais</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-300">Chance de Sucesso</span>
                                        <span className="font-bold text-green-400">{improvementChance}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400"
                                            style={{ width: `${improvementChance}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-4 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-white">Objetivo Curto Prazo</p>
                                            <p className="text-xs text-slate-400">Melhora na articulação de fonemas fricativos.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <BrainCircuit className="h-4 w-4 text-purple-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-bold text-white">Foco Cognitivo</p>
                                            <p className="text-xs text-slate-400">Estimulação de memória auditiva.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button onClick={handleFeatureNotImplemented} className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl h-11">
                                Gerar Proposta PDF <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className={`${glassCard} border-0`}>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                    <BrainCircuit className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">IA Grafono</p>
                                    <p className="text-xs text-slate-500">Baseado em 1.2k casos</p>
                                </div>
                            </div>
                            <Button onClick={handleFeatureNotImplemented} variant="ghost" size="sm" className="text-xs text-red-500 font-bold">Ver Insights</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

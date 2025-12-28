"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, TrendingUp, Share2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ProgressTab() {
    return (
        <div className="space-y-6">
            <Card className="bg-white border-slate-100 shadow-sm rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Progresso do Tratamento</CardTitle>
                    <CardDescription>Análise de aderência e progresso do plano terapêutico</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-500">Sessões realizadas</span>
                                <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                    <Calendar className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold text-slate-800">0</span>
                                <span className="text-sm text-slate-400">/ 48</span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-500">Taxa de presença</span>
                                <div className="h-8 w-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold text-slate-800">0.0%</div>
                            <span className="text-xs text-slate-400">0 sessões perdidas</span>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-500">Status atual</span>
                                <div className="h-8 w-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <Badge variant="destructive" className="bg-red-100 text-red-600 hover:bg-red-100 border-none">Atrasado</Badge>
                                <span className="text-red-500 font-bold">-100.0%</span>
                            </div>
                            <span className="text-xs text-slate-400">41 semanas em atraso</span>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-xl space-y-1">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-slate-500">Conclusão prevista</span>
                            </div>
                            <div className="text-2xl font-bold text-slate-800">jun 2026</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                                <AlertTriangle className="h-3 w-3" />
                                287 dias depois do planejado
                            </div>
                        </div>
                    </div>

                    {/* CHART PLACEHOLDER */}
                    <div>
                        <h3 className="font-semibold text-slate-800 mb-4">Progressão das Sessões</h3>
                        <div className="h-[300px] w-full border border-dashed border-slate-200 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400">
                            Gráfico de Evolução (Mockup: Eixos X tempo, Y sessões)
                        </div>
                    </div>

                </CardContent>
            </Card>

            <div className="flex justify-center">
                <Button variant="outline" className="h-12 w-full bg-white border-slate-200">
                    <Share2 className="mr-2 h-4 w-4" /> Compartilhar com Paciente
                </Button>
            </div>
        </div>
    );
}

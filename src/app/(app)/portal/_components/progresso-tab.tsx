"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Award, CalendarCheck, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ProgressoTab() {
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold">Seu Progresso</h2>
                <p className="text-muted-foreground">Visualize sua evolução ao longo do tratamento</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sessões Realizadas</CardTitle>
                        <CalendarCheck className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12</div>
                        <p className="text-xs text-muted-foreground">+2 esse mês</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Taxa de Presença</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">92%</div>
                        <p className="text-xs text-muted-foreground">Excelente assiduidade</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Metas Alcançadas</CardTitle>
                        <Award className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">3/8</div>
                        <p className="text-xs text-muted-foreground">Continue assim!</p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Charts/Progress */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6 border rounded-lg p-6">
                    <h3 className="font-semibold flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-500" /> Evolução por Área
                    </h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Linguagem Expressiva</span>
                                <span className="text-zinc-500">75%</span>
                            </div>
                            <Progress value={75} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Compreensão Auditiva</span>
                                <span className="text-zinc-500">85%</span>
                            </div>
                            <Progress value={85} className="h-2" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Articulação e Fala</span>
                                <span className="text-zinc-500">60%</span>
                            </div>
                            <Progress value={60} className="h-2" />
                        </div>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold text-blue-900">Feedback da Fonoaudióloga</h3>
                    <div className="bg-white p-4 rounded border border-blue-100 text-sm text-zinc-600 italic">
                        "Marcos tem demonstrado excelente evolução nas últimas semanas, especialmente nos exercícios de articulação. Recomendo manter a frequência dos exercícios em casa para consolidar os ganhos."
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-700">
                        <div className="h-6 w-6 rounded-full bg-blue-200" />
                        <span>Dra. Ana Silva - 15/12/2023</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

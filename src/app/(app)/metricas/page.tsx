"use client";

import { Button } from "@/components/ui/button";
import {
    BarChart3,
    TrendingUp,
    Users,
    DollarSign,
    Calendar,
    Download,
    Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MetricasPage() {
    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassPanel = "bg-white/50 backdrop-blur-sm border border-red-100 rounded-2xl";

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
                        <BarChart3 className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Métricas e KPIs</h1>
                        <p className="text-slate-500">Análise de Desempenho Clínico</p>
                    </div>
                </div>
                <Button variant="outline" className="bg-white/50 border-white/60 hover:bg-white text-slate-700 rounded-xl">
                    <Download className="mr-2 h-4 w-4" /> Exportar Dados
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pacientes Ativos</CardTitle>
                        <Users className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">124</div>
                        <p className="text-xs text-slate-500 font-medium text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +12% vs mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Sessões Realizadas</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">543</div>
                        <p className="text-xs text-slate-500 font-medium text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +8% vs mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Faturamento Real</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">R$ 42.5k</div>
                        <p className="text-xs text-slate-500 font-medium text-green-600 flex items-center mt-1">
                            <TrendingUp className="h-3 w-3 mr-1" /> +24% vs mês anterior
                        </p>
                    </CardContent>
                </Card>
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Taxa de Presença</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">94.2%</div>
                        <p className="text-xs text-slate-500 font-medium text-red-500 flex items-center mt-1">
                            -1.5% vs mês anterior
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 relative z-10">
                {/* Main Graph */}
                <Card className={`col-span-4 ${glassCard} border-0`}>
                    <CardHeader>
                        <CardTitle className="text-slate-800">Sessões por Mês</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full flex items-end justify-between p-4 gap-2">
                            {[45, 66, 80, 70, 90, 100, 85, 95, 110, 105, 120, 115].map((val, i) => (
                                <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
                                    <div
                                        className="w-full bg-slate-200 rounded-t-sm group-hover:bg-red-400 transition-all relative overflow-hidden"
                                        style={{ height: `${val}%` }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-red-500 to-orange-400 opacity-80" />
                                    </div>
                                    <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-red-500 transition-colors">
                                        {["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][i]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Secondary Stats */}
                <Card className={`col-span-3 ${glassCard} border-0`}>
                    <CardHeader>
                        <CardTitle className="text-slate-800">Distribuição por Patologia</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {[
                            { label: "Atraso de Linguagem", val: 35, color: "bg-red-500" },
                            { label: "Trocas Fonológicas", val: 25, color: "bg-orange-500" },
                            { label: "Motricidade Orofacial", val: 20, color: "bg-yellow-500" },
                            { label: "Voz / Disfonia", val: 15, color: "bg-blue-500" },
                            { label: "Outros", val: 5, color: "bg-slate-300" },
                        ].map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-medium text-slate-700">
                                    <span>{item.label}</span>
                                    <span>{item.val}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${item.val}%` }} />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

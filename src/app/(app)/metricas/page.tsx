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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Added CardDescription
import { useState } from "react";
import { getKPIMetrics, getSessionsChartData, getDistributionData, KPIMetrics, MonthlyChartData, DistributionData } from "@/app/actions/metrics";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MetricsRange } from "@/app/actions/metrics";
import { AIAssistant } from "@/components/ai/ai-assistant";

export default function MetricasPage() {
    const { toast } = useToast();
    const [pageLoading, setPageLoading] = useState(true);

    // Filter State
    const [range, setRange] = useState<MetricsRange>('30d');

    // Real Data State
    const [kpis, setKpis] = useState<KPIMetrics | null>(null);
    const [chartData, setChartData] = useState<MonthlyChartData[]>([]);
    const [distribution, setDistribution] = useState<DistributionData[]>([]);

    useEffect(() => {
        async function loadMetrics() {
            setPageLoading(true);
            try {
                const [kpiRes, chartRes, distRes] = await Promise.all([
                    getKPIMetrics(range),
                    getSessionsChartData(range),
                    getDistributionData(range)
                ]);

                if (kpiRes.success && kpiRes.data) setKpis(kpiRes.data);
                if (chartRes.success && chartRes.data) setChartData(chartRes.data);
                if (distRes.success && distRes.data) setDistribution(distRes.data);

            } catch (error) {
                toast({ title: "Erro", description: "Falha ao carregar métricas.", variant: "destructive" });
            } finally {
                setPageLoading(false);
            }
        }
        loadMetrics();
    }, [range]);

    // Helper for Export (Updated)
    const metricsData = {
        activePatients: kpis?.activePatients || 0,
        sessions: kpis?.sessionsThisMonth || 0,
        revenue: kpis?.revenue ? `R$ ${kpis.revenue}` : "R$ 0",
        attendanceRate: kpis?.attendanceRate ? `${kpis.attendanceRate}%` : "0%",
        pathologies: distribution
    };

    const handleExport = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Métrica,Valor\n"
            + `Pacientes Ativos,${metricsData.activePatients}\n`
            + `Sessões Realizadas,${metricsData.sessions}\n`
            + `Faturamento,${metricsData.revenue}\n`
            + `Taxa de Presença,${metricsData.attendanceRate}\n`
            + "Patologias,%\n"
            + metricsData.pathologies.map(p => `${p.label},${p.val}%`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "metricas_grafono.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Exportado", description: "O arquivo CSV foi baixado." });
    };

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
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleExport} className="bg-white/50 border-white/60 hover:bg-white text-slate-700 rounded-xl">
                        <Download className="mr-2 h-4 w-4" /> Exportar Dados
                    </Button>
                    <AIAssistant
                        variant="feature"
                        contextName="Métricas e KPIs"
                        welcomeMessage="Analiso seus indicadores de desempenho para sugerir melhorias operacionais."
                        data={{
                            range: range,
                            kpis: kpis,
                            chartSummary: `Dados mostrados: ${chartData.length} pontos. Maior pico: ${chartData.length > 0 ? Math.max(...chartData.map(d => d.sessions)) : 0} sessões.`,
                            distributionTop: distribution.slice(0, 3)
                        }}
                    />
                    <Select value={range} onValueChange={(v) => setRange(v as MetricsRange)}>

                        <SelectTrigger className="w-[180px] bg-white/50 border-white/60 rounded-xl">
                            <SelectValue placeholder="Período" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Hoje (Em Tempo Real)</SelectItem>
                            <SelectItem value="7d">Últimos 7 dias</SelectItem>
                            <SelectItem value="30d">Últimos 30 dias</SelectItem>
                            <SelectItem value="6m">Últimos 6 meses</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pacientes Ativos</CardTitle>
                        <Users className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        {pageLoading ? <Skeleton className="h-8 w-20" /> : (
                            <>
                                <div className="text-2xl font-bold text-slate-800">{kpis?.activePatients ?? 0}</div>
                                <p className={cn("text-xs font-medium flex items-center mt-1", (kpis?.activePatientsGrowth || 0) >= 0 ? "text-green-600" : "text-red-500")}>
                                    <TrendingUp className={cn("h-3 w-3 mr-1", (kpis?.activePatientsGrowth || 0) < 0 && "rotate-180")} />
                                    {kpis?.activePatientsGrowth}% vs mês anterior
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Sessões Realizadas</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        {pageLoading ? <Skeleton className="h-8 w-20" /> : (
                            <>
                                <div className="text-2xl font-bold text-slate-800">{kpis?.sessionsThisMonth ?? 0}</div>
                                <p className={cn("text-xs font-medium flex items-center mt-1", (kpis?.sessionsGrowth || 0) >= 0 ? "text-green-600" : "text-red-500")}>
                                    <TrendingUp className={cn("h-3 w-3 mr-1", (kpis?.sessionsGrowth || 0) < 0 && "rotate-180")} />
                                    {kpis?.sessionsGrowth}% vs mês anterior
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Faturamento Real</CardTitle>
                        <DollarSign className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        {pageLoading ? <Skeleton className="h-8 w-24" /> : (
                            <>
                                <div className="text-2xl font-bold text-slate-800">
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis?.revenue ?? 0)}
                                </div>
                                <p className={cn("text-xs font-medium flex items-center mt-1", (kpis?.revenueGrowth || 0) >= 0 ? "text-green-600" : "text-red-500")}>
                                    <TrendingUp className={cn("h-3 w-3 mr-1", (kpis?.revenueGrowth || 0) < 0 && "rotate-180")} />
                                    {kpis?.revenueGrowth}% vs mês anterior
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Taxa de Presença</CardTitle>
                        <Activity className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        {pageLoading ? <Skeleton className="h-8 w-20" /> : (
                            <>
                                <div className="text-2xl font-bold text-slate-800">{kpis?.attendanceRate ?? 0}%</div>
                                <p className={cn("text-xs font-medium flex items-center mt-1", (kpis?.attendanceGrowth || 0) >= 0 ? "text-green-600" : "text-red-500")}>
                                    <TrendingUp className={cn("h-3 w-3 mr-1", (kpis?.attendanceGrowth || 0) < 0 && "rotate-180")} />
                                    {kpis?.attendanceGrowth}% vs mês anterior
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 relative z-10">
                {/* Main Graph */}
                <Card className={`col-span-4 ${glassCard} border-0`}>
                    <CardHeader>
                        <CardTitle className="text-slate-800">
                            {range === 'today' ? 'Atendimentos por Hora' : (range === '6m' ? 'Sessões por Mês' : 'Sessões por Dia')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {pageLoading ? <div className="h-[300px] w-full flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" /></div> : (
                            <div className="h-[300px] w-full flex items-end justify-between p-4 gap-2">
                                {(() => {
                                    const maxSessions = Math.max(...chartData.map(d => d.sessions), 1);
                                    return chartData.map((item, i) => {
                                        const heightPercentage = (item.sessions / maxSessions) * 100;
                                        // Ensure even small values have at least a tiny visible bar (e.g. 5%) if they are non-zero.
                                        // But if it is zero, keep it flat or minimal.
                                        const visualHeight = item.sessions === 0 ? 0 : Math.max(heightPercentage, 5);

                                        return (
                                            <div key={i} className="flex flex-col items-center gap-2 flex-1 group cursor-pointer h-full justify-end">
                                                <div className="relative w-full flex items-end h-[250px]">
                                                    <div
                                                        className="w-full bg-slate-200 rounded-t-sm group-hover:bg-red-400 transition-all relative overflow-hidden mx-auto"
                                                        style={{ height: `${visualHeight}%`, width: '80%' }}
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-t from-red-500 to-orange-400 opacity-80" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center h-[50px] justify-start content-start">
                                                    <span className="text-[10px] font-medium text-slate-600 opacity-60 group-hover:opacity-100 mb-1">
                                                        {item.sessions > 0 ? item.sessions : "-"}
                                                    </span>
                                                    <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-red-500 transition-colors">
                                                        {item.month}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                                {chartData.length === 0 && <div className="text-slate-400">Sem dados históricos ainda.</div>}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Secondary Stats */}
                <Card className={`col-span-3 ${glassCard} border-0`}>
                    <CardHeader>
                        <CardTitle className="text-slate-800">Distribuição por Tipo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {pageLoading ? <div className="space-y-4">{[1, 2, 3].map(i => <Skeleton key={i} className="h-6 w-full" />)}</div> : (
                            distribution.length > 0 ? distribution.map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-sm font-medium text-slate-700">
                                        <span>{item.label}</span>
                                        <span>{item.val}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${item.color || 'bg-slate-300'}`} style={{ width: `${item.val}%` }} />
                                    </div>
                                </div>
                            )) : <div className="text-slate-400 text-center py-10">Sem dados suficientes.</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <AIAssistant
                variant="help"
                contextName="Suporte Métricas"
                welcomeMessage="Dúvidas sobre os gráficos? Posso explicar o cálculo de cada indicador."
            />
        </div >
    )
}

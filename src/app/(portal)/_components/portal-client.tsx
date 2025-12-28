"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    TrendingUp,
    FileText,
    CheckCircle2,
    CalendarDays,
    Info,
    Dumbbell,
    Flag,
    Sparkles
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { PatientDashboardData } from "@/types/portal";

// Mock Data for Progress Chart (Image 3 equivalent)
const progressData = [
    { name: 'Jan', expected: 3, actual: 2 },
    { name: 'Feb', expected: 4, actual: 4 },
    { name: 'Mar', expected: 6, actual: 7 },
    { name: 'Apr', expected: 8, actual: 9 },
];

export default function PortalDashboard({ data }: { data: PatientDashboardData }) {
    const { patient, nextAppointment, financial, progress } = data;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                        {patient.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            {patient.name}
                        </h1>
                        <p className="text-slate-500">
                            Bem-vindo ao seu portal
                        </p>
                    </div>
                </div>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none px-4 py-1.5 text-sm">
                    Em Tratamento Ativo
                </Badge>
            </div>

            <Tabs defaultValue="resumo" className="space-y-6">
                <TabsList className="bg-slate-100/50 p-1 rounded-xl h-auto flex flex-wrap justify-start gap-1">
                    <TabsTrigger value="resumo" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Resumo</TabsTrigger>
                    <TabsTrigger value="agenda" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Agenda</TabsTrigger>
                    <TabsTrigger value="objetivos" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Objetivos</TabsTrigger>
                    <TabsTrigger value="relatorios" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Relatórios</TabsTrigger>
                    <TabsTrigger value="exercicios" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Exercícios</TabsTrigger>
                    <TabsTrigger value="progresso" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">Progresso</TabsTrigger>
                </TabsList>

                {/* === TAB: RESUMO === */}
                <TabsContent value="resumo" className="space-y-6">
                    {/* Next Session Card */}
                    <Card className="border-slate-100 shadow-sm bg-white">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 text-indigo-600 font-semibold">
                                <Calendar className="w-5 h-5" />
                                Próxima Sessão
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">
                                    {nextAppointment ? nextAppointment.date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : "Nenhuma sessão agendada"}
                                    {nextAppointment && ` às ${nextAppointment.time}`}
                                </h3>
                                <p className="text-slate-500">{nextAppointment?.type || "Agende com seu fonoaudiólogo"}</p>
                            </div>
                            {nextAppointment && (
                                <Button variant="outline" className="border-slate-200">
                                    Ver Agenda <ChevronRight className="ml-2 w-4 h-4" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>

                    {/* Progress Summary Card */}
                    <Card className="border-slate-100 shadow-sm bg-white">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-blue-600 font-semibold">
                                <Flag className="w-5 h-5" />
                                Seu Progresso Recente
                            </div>
                            <CardDescription>Período: Últimos 30 dias</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { label: "Linguagem", from: 5, to: 7, color: "bg-slate-800" },
                                { label: "Articulação", from: 4, to: 6, color: "bg-slate-800" },
                                { label: "Fluência", from: 3, to: 5, color: "bg-slate-800" }
                            ].map((skill, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-base font-medium text-slate-700">
                                        <span>{skill.label}</span>
                                        <span className="text-blue-600 text-sm font-bold">{skill.from} → {skill.to}</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${(skill.to / 10) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                <span className="text-slate-600 font-medium">Taxa de presença</span>
                                <Badge variant="secondary" className="bg-green-100 text-green-700">85%</Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Assessments & Reports */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-slate-100 shadow-sm bg-white">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                    <ClipboardList className="w-5 h-5" />
                                    Avaliações Recentes
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Avaliação Inicial</p>
                                        <p className="text-sm text-slate-400">09 de outubro de 2023</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800">Avaliação progresso</p>
                                        <p className="text-sm text-slate-400">14 de dezembro de 2023</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-slate-100 shadow-sm bg-white">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                    <FileText className="w-5 h-5" />
                                    Relatórios Disponíveis
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Relatório Avaliação</p>
                                            <p className="text-sm text-slate-400">14 out 2023</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline">avaliação</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-800">Evolução Trimestral</p>
                                            <p className="text-sm text-slate-400">10 dez 2023</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline">evolução</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* === TAB: AGENDA === */}
                <TabsContent value="agenda" className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Minhas Sessões Agendadas</h2>
                        <p className="text-slate-500">Confira suas próximas sessões e histórico</p>
                    </div>

                    <Card className="border-slate-100 bg-white">
                        <CardContent className="p-6 flex gap-4">
                            <Info className="w-6 h-6 text-slate-400 shrink-0" />
                            <div>
                                <h4 className="font-semibold text-slate-800">Informação sobre agendamentos</h4>
                                <p className="text-sm text-slate-500 mt-1">
                                    Seus agendamentos são exibidos diretamente do sistema. Para remarcar, entre em contato com seu fonoaudiólogo.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        {/* Next Session */}
                        <Card className="border-l-4 border-l-blue-500 shadow-sm">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">20 de janeiro de 2024 às 14:30</h3>
                                    <p className="text-slate-500">Sessão De Terapia</p>
                                </div>
                                <Badge className="bg-blue-100 text-blue-700 border-none">Próxima</Badge>
                            </CardContent>
                        </Card>

                        {/* Past Sessions */}
                        <Card className="border-l-4 border-l-green-500 shadow-sm opacity-80">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">13 de janeiro de 2024 às 14:30</h3>
                                    <p className="text-slate-500">Sessão De Terapia</p>
                                </div>
                                <Badge className="bg-green-100 text-green-700 border-none">Realizada</Badge>
                            </CardContent>
                        </Card>
                        <Card className="border-l-4 border-l-green-500 shadow-sm opacity-80">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">06 de janeiro de 2024 às 14:30</h3>
                                    <p className="text-slate-500">Sessão De Avaliação</p>
                                </div>
                                <Badge className="bg-green-100 text-green-700 border-none">Realizada</Badge>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* === TAB: PROGRESSO === */}
                <TabsContent value="progresso" className="space-y-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">Progresso do Tratamento</h2>
                        <p className="text-slate-500">Acompanhamento do seu plano terapêutico</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-white border-slate-100 shadow-sm">
                            <CardContent className="p-6">
                                <span className="text-sm text-slate-500">Sessões realizadas</span>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-3xl font-bold text-slate-900">15 <span className="text-slate-300 text-xl font-normal">/ 20</span></span>
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                        <CalendarDays className="w-5 h-5" />
                                    </div>
                                </div>
                                <Progress value={75} className="mt-4 h-2 bg-slate-100" />
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-slate-100 shadow-sm">
                            <CardContent className="p-6">
                                <span className="text-sm text-slate-500">Taxa de presença</span>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-3xl font-bold text-slate-900">85%</span>
                                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                                        <CheckCircle2 className="w-5 h-5" />
                                    </div>
                                </div>
                                <span className="text-xs text-slate-400 mt-2 block">3 sessões perdidas</span>
                            </CardContent>
                        </Card>

                        <Card className="bg-white border-slate-100 shadow-sm">
                            <CardContent className="p-6">
                                <span className="text-sm text-slate-500">Previsão de conclusão</span>
                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-3xl font-bold text-slate-900">jun 2024</span>
                                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">
                                        <Flag className="w-5 h-5" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Chart */}
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle>Evolução do Tratamento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={progressData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} domain={[0, 12]} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontSize: '12px' }}
                                        />
                                        <Line type="monotone" dataKey="expected" name="Esperado" stroke="#94A3B8" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                                        <Line type="monotone" dataKey="actual" name="Realizado" stroke="#4ADE80" strokeWidth={2} dot={{ r: 0 }} activeDot={{ r: 4 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Milestone */}
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle>Marcos do Tratamento</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-4">
                                <div className="mt-1 w-6 h-6 rounded-full bg-green-100  flex items-center justify-center text-green-600">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800">Avaliação inicial concluída</h4>
                                    <p className="text-sm text-slate-500">2023-10-10</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardHeader>
                            <CardTitle>Recomendações</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <span className="text-slate-700">Pratique os exercícios de respiração diariamente.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <span className="text-slate-700">Leia em voz alta por 10 minutos, 3 vezes por semana.</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <span className="text-slate-700">Jogue jogos de categorias semânticas para expandir o vocabulário.</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Footer Info */}
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardContent className="p-6 flex flex-col md:flex-row gap-4">
                            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                            <div className="space-y-2 text-sm text-slate-600">
                                <p className="font-medium text-slate-800">
                                    O progresso do tratamento é calculado com base na sua frequência e evolução nas sessões. Para obter melhores resultados:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-1">
                                    <li>Mantenha uma boa frequência nas sessões</li>
                                    <li>Realize os exercícios recomendados em casa</li>
                                    <li>Comunique qualquer dificuldade ao seu terapeuta</li>
                                    <li>Acompanhe regularmente seu progresso</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Placeholders for other tabs */}
                <TabsContent value="objetivos" className="min-h-[200px] flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <Flag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Objetivos do tratamento serão listados aqui</p>
                    </div>
                </TabsContent>

                <TabsContent value="relatorios" className="min-h-[200px] flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Todos os seus relatórios e evoluções</p>
                    </div>
                </TabsContent>

                <TabsContent value="exercicios" className="min-h-[200px] flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <Dumbbell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>Exercícios para praticar em casa</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function ClipboardList({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="M12 11h4" />
            <path d="M12 16h4" />
            <path d="M8 11h.01" />
            <path d="M8 16h.01" />
        </svg>
    )
}

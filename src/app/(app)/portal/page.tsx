"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Calendar,
    CheckCircle2,
    Clock,
    FileText,
    Trophy,
    TrendingUp,
    LogOut,
    ArrowRight,
    Info
} from "lucide-react";

export default function PortalPage() {
    return (
        <div className="min-h-screen bg-[#F0F2F5] p-6 space-y-6">
            {/* Header / Top Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                        M
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Marcos Cruz</h1>
                        <p className="text-sm text-gray-500">Bem-vindo ao seu portal</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        Em Tratamento Ativo
                    </span>
                    <Button variant="outline" className="text-gray-600 ml-4">
                        <LogOut className="mr-2 h-4 w-4" /> Sair
                    </Button>
                </div>
            </div>

            {/* Tabs Navigation */}
            <Tabs defaultValue="resumo" className="w-full space-y-6">
                <TabsList className="bg-white p-1 rounded-lg border border-gray-100 flex justify-start w-full h-auto">
                    <TabsTrigger value="resumo" className="flex-1 max-w-[150px] data-[state=active]:bg-black data-[state=active]:text-white h-9 rounded-md">Resumo</TabsTrigger>
                    <TabsTrigger value="agenda" className="flex-1 max-w-[150px] h-9 rounded-md">Agenda</TabsTrigger>
                    <TabsTrigger value="objetivos" className="flex-1 max-w-[150px] h-9 rounded-md">Objetivos</TabsTrigger>
                    <TabsTrigger value="relatorios" className="flex-1 max-w-[150px] h-9 rounded-md">Relatórios</TabsTrigger>
                    <TabsTrigger value="exercicios" className="flex-1 max-w-[150px] h-9 rounded-md">Exercícios</TabsTrigger>
                    <TabsTrigger value="progresso" className="flex-1 max-w-[150px] h-9 rounded-md">Progresso</TabsTrigger>
                </TabsList>

                {/* Tab: Resumo */}
                <TabsContent value="resumo" className="space-y-6">
                    {/* Próxima Sessão */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Calendar className="h-5 w-5 text-blue-600" />
                                Próxima Sessão
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">20 de janeiro de 2024 às 14:30</h3>
                                <p className="text-gray-500">Sessão De Terapia</p>
                            </div>
                            <Button variant="outline">
                                Ver Agenda <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Seu Progresso Recente */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <Trophy className="h-5 w-5 text-blue-600" />
                                Seu Progresso Recente
                            </CardTitle>
                            <p className="text-sm text-gray-500">Período: 30 de novembro de 2023 a 21 de dezembro de 2025</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Linguagem */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Linguagem</span>
                                    <span className="text-blue-600">5 → 7</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-900 rounded-full" style={{ width: '70%' }}></div>
                                </div>
                            </div>
                            {/* Articulação */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Articulacao</span>
                                    <span className="text-blue-600">4 → 6</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-900 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                            {/* Fluência */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm font-medium">
                                    <span>Fluencia</span>
                                    <span className="text-blue-600">3 → 5</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gray-900 rounded-full" style={{ width: '50%' }}></div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-700">Taxa de presença</span>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                    85%
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Avaliações Recentes */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Avaliações Recentes
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">Avaliação inicial</h4>
                                        <p className="text-xs text-gray-500">09 de outubro de 2023</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-sm">Avaliação progresso</h4>
                                        <p className="text-xs text-gray-500">14 de dezembro de 2023</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Relatórios Disponíveis */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                    Relatórios Disponíveis
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">Relatório de Avaliação Inicial</h4>
                                            <p className="text-xs text-gray-500">14 de outubro de 2023</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">avaliação</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-sm">Relatório de Evolução Trimestral</h4>
                                            <p className="text-xs text-gray-500">19 de dezembro de 2023</p>
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">evolução</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Tab: Objetivos */}
                <TabsContent value="objetivos" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Meus Objetivos Terapêuticos</CardTitle>
                            <p className="text-sm text-gray-500">Acompanhe seu progresso nos objetivos definidos para seu tratamento</p>
                        </CardHeader>
                        <CardContent className="space-y-8">
                            {/* Aim 1 */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-900">Aprimorar articulação de fonemas específicos</h4>
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Em andamento</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Progresso:</span>
                                    <span>70%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full flex">
                                        <div className="bg-gray-900 w-[70%]" />
                                        <div className="bg-green-500 flex-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Aim 2 */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-900">Melhorar fluência na leitura</h4>
                                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100">Em andamento</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Progresso:</span>
                                    <span>45%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full flex">
                                        <div className="bg-gray-900 w-[45%]" />
                                        <div className="bg-amber-400 flex-1" />
                                    </div>
                                </div>
                            </div>

                            {/* Aim 3 */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <h4 className="font-semibold text-gray-900">Ampliar vocabulário expressivo</h4>
                                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-100">Quase concluído</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>Progresso:</span>
                                    <span>90%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full rounded-full flex">
                                        <div className="bg-gray-900 w-[90%]" />
                                        <div className="bg-green-500 flex-1" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 text-blue-800">
                        <Info className="h-5 w-5 flex-shrink-0" />
                        <div>
                            <h5 className="font-semibold text-sm underline mb-1">Dica</h5>
                            <p className="text-sm text-blue-700">Pratique regularmente os exercícios recomendados para atingir seus objetivos mais rapidamente.</p>
                        </div>
                    </div>
                </TabsContent>

                {/* Tab: Agenda */}
                <TabsContent value="agenda" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Minhas Sessões Agendadas</CardTitle>
                            <p className="text-sm text-gray-500">Confira suas próximas sessões e histórico de atendimento</p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border border-gray-100 rounded-lg p-4 flex gap-3 items-start bg-gray-50/50">
                                <Info className="h-5 w-5 text-gray-400 mt-0.5" />
                                <div>
                                    <h5 className="font-semibold text-sm text-gray-900">Informação sobre agendamentos</h5>
                                    <p className="text-sm text-gray-600">Seus agendamentos são exibidos diretamente do sistema. Para remarcar uma sessão, entre em contato com seu fonoaudiólogo.</p>
                                </div>
                            </div>

                            {/* Session 1 */}
                            <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center border-l-4 border-l-blue-500 bg-white">
                                <div>
                                    <h4 className="font-bold text-gray-900">20 de janeiro de 2024 às 14:30</h4>
                                    <p className="text-gray-500 text-sm">Sessão De Terapia</p>
                                </div>
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Próxima
                                </span>
                            </div>

                            {/* Session 2 */}
                            <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center border-l-4 border-l-green-500 bg-white">
                                <div>
                                    <h4 className="font-bold text-gray-900">13 de janeiro de 2024 às 14:30</h4>
                                    <p className="text-gray-500 text-sm">Sessão De Terapia</p>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Realizada
                                </span>
                            </div>

                            {/* Session 3 */}
                            <div className="border border-gray-100 rounded-xl p-4 flex justify-between items-center border-l-4 border-l-green-500 bg-white">
                                <div>
                                    <h4 className="font-bold text-gray-900">06 de janeiro de 2024 às 14:30</h4>
                                    <p className="text-gray-500 text-sm">Sessão De Avaliação</p>
                                </div>
                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                                    Realizada
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

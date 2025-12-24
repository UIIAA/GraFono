"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, User, ArrowRight, Activity, Zap, Check } from "lucide-react";

export default function DesignOptionsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-12">
            <div className="max-w-6xl mx-auto text-center space-y-4">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Design System Options</h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Explorando direções visuais para transformar o Grafono em uma experiência premium.
                </p>
            </div>

            {/* Option A: Sophisticated Minimalist */}
            <section className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold font-serif">A</div>
                    <div>
                        <h2 className="text-2xl font-semibold text-zinc-900">Sophisticated Minimalist</h2>
                        <p className="text-zinc-500">Foco em tipografia, preto e branco, linhas finas e elegância atemporal.</p>
                    </div>
                </div>

                <div className="p-8 bg-white border border-zinc-200 rounded-none shadow-sm grid md:grid-cols-2 gap-8 font-sans">
                    <Card className="rounded-none border-zinc-200 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-zinc-900 font-light text-2xl">Paciente</CardTitle>
                            <CardDescription className="text-zinc-500 tracking-wide uppercase text-xs font-semibold">Resumo Clínico</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-zinc-100 flex items-center justify-center text-zinc-900 border border-zinc-200">
                                    <User strokeWidth={1.5} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-zinc-900">João Silva</h3>
                                    <p className="text-zinc-500 text-sm">Próxima sessão: Amanhã</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <span className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Progresso</span>
                                <div className="h-1 w-full bg-zinc-100">
                                    <div className="h-1 bg-zinc-900 w-[75%]"></div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t border-zinc-100 pt-6">
                            <Button className="w-full bg-zinc-900 text-white hover:bg-zinc-800 rounded-none h-12 uppercase tracking-wide text-xs">
                                Ver Detalhes
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="space-y-6 pt-4">
                        <div className="flex gap-2">
                            <Badge className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 rounded-none border border-zinc-200 px-4 py-1 font-normal">Ativo</Badge>
                            <Badge className="bg-transparent border border-zinc-300 text-zinc-600 rounded-none px-4 py-1 font-normal">Pendente</Badge>
                        </div>
                        <div className="relative group">
                            <Input placeholder="Buscar..." className="border-0 border-b border-zinc-300 rounded-none px-0 focus-visible:ring-0 focus-visible:border-zinc-900 transition-colors bg-transparent placeholder:text-zinc-400" />
                            <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900" />
                        </div>
                        <Button variant="outline" className="border-zinc-900 text-zinc-900 hover:bg-zinc-50 rounded-none w-full h-12 uppercase tracking-wide text-xs">
                            Ação Secundária
                        </Button>
                    </div>
                </div>
            </section>

            {/* Option B: Modern Glass & Vibrant */}
            <section className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-200">B</div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Modern Glass</h2>
                        <p className="text-slate-500">Gradientes sutis, sombras suaves (blur), cantos arredondados e cores vibrantes.</p>
                    </div>
                </div>

                <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl grid md:grid-cols-2 gap-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-blue-50/20 pointer-events-none"></div>

                    <Card className="rounded-2xl border-white/50 bg-white/70 backdrop-blur-md shadow-xl shadow-indigo-100/50 relative z-10">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-slate-800 font-bold text-xl">Paciente</CardTitle>
                                <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
                                    <Activity className="h-5 w-5" />
                                </div>
                            </div>
                            <CardDescription className="text-slate-500 font-medium">Status da Terapia</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                                    <User />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">João Silva</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700">
                                        Em dia
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-12 font-semibold shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]">
                                Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="space-y-6 pt-4 relative z-10">
                        <div className="flex gap-2">
                            <Badge className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-4 py-1.5 shadow-md shadow-indigo-200">Principal</Badge>
                            <Badge className="bg-white text-slate-600 hover:bg-slate-50 rounded-lg px-4 py-1.5 shadow-sm border border-slate-100">Secundário</Badge>
                        </div>
                        <Input
                            placeholder="Buscar..."
                            className="border-slate-200 rounded-xl bg-white/80 backdrop-blur-sm focus-visible:ring-indigo-500 focus-visible:border-indigo-500 h-12 shadow-sm"
                        />
                        <Button variant="outline" className="border-slate-200 text-slate-700 hover:bg-white hover:text-indigo-600 rounded-xl w-full h-12 font-semibold bg-white/50">
                            Ação Secundária
                        </Button>
                    </div>
                </div>
            </section>

            {/* Option C: Tech / Robust */}
            <section className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="h-10 w-10 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold">C</div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Tech Robust</h2>
                        <p className="text-gray-500">Denso em informação, cinzas azulados (Slate), estrutura de grid forte, profissional.</p>
                    </div>
                </div>

                <div className="p-8 bg-[#F5F7FA] border border-gray-200 rounded-lg grid md:grid-cols-2 gap-8">
                    <Card className="rounded-lg border-gray-200 shadow-sm bg-white">
                        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <CardTitle className="text-gray-700 font-semibold text-base">ID: #8492</CardTitle>
                                </div>
                                <Activity className="h-4 w-4 text-gray-400" />
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">João Silva</h3>
                                    <p className="text-gray-500 text-sm">Fonoaudiologia • Dr. Marcos</p>
                                </div>
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-gray-400">
                                    <Zap className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                    <span className="text-gray-500 block text-xs mb-1">Status</span>
                                    <span className="font-medium text-gray-900 flex items-center gap-1"><Check className="h-3 w-3 text-green-500" /> Ativo</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded border border-gray-100">
                                    <span className="text-gray-500 block text-xs mb-1">Sessões</span>
                                    <span className="font-medium text-gray-900">12/20</span>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-gray-50 border-t border-gray-100 py-3">
                            <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 rounded-md h-9 text-sm font-medium">
                                Acessar Prontuário
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="space-y-4 pt-2">
                        <div className="flex gap-2">
                            <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-md border border-blue-200 px-3 py-1 font-medium">Primário</Badge>
                            <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md border border-gray-200 px-3 py-1 font-medium">Neutro</Badge>
                        </div>
                        <Input
                            placeholder="Filtrar registros..."
                            className="border-gray-300 rounded-md bg-white focus-visible:ring-blue-500 text-sm h-10"
                        />
                        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-white rounded-md w-full h-10 text-sm font-medium shadow-sm">
                            Exportar Dados
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

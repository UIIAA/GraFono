"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Calendar as CalendarIcon,
    Trophy,
    Target,
    Clock,
    User,
    ArrowUpRight,
    Star,
    Video,
    MessageCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const nextSession = {
    date: "24 Dez 2024",
    time: "14:00",
    type: "Fonoaudiologia",
    professional: "Dra. Ana Costa"
};

const objectives = [
    { id: 1, title: "Articulação de /R/", progress: 75, status: "Excelente" },
    { id: 2, title: "Fluência Verbal", progress: 45, status: "Em evolução" },
    { id: 3, title: "Consciência Fonológica", progress: 90, status: "Quase lá!" },
];

export default function PortalPacientePage() {
    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassPanel = "bg-white/50 backdrop-blur-sm border border-red-100 rounded-2xl";
    const highlightCard = "bg-gradient-to-br from-red-500 to-orange-500 text-white shadow-xl shadow-red-200 rounded-3xl border-0";

    return (
        <div
            className="min-h-screen p-8 space-y-8 relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-400/10 to-red-400/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Header / Welcome */}
            <div className={`p-6 rounded-3xl ${glassCard} relative z-10 flex flex-col md:flex-row justify-between items-center gap-6`}>
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                        <AvatarFallback className="bg-gradient-to-br from-slate-200 to-slate-300 text-slate-600 text-xl font-bold">JS</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Olá, João!</h1>
                        <p className="text-slate-500 font-medium">Você tem 15 sessões concluídas. Continue assim! 🚀</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button className="bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl shadow-sm h-11">
                        <MessageCircle className="mr-2 h-4 w-4 text-green-500" /> Falar com Fono
                    </Button>
                    <Button className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-11 shadow-lg shadow-slate-300">
                        <CalendarIcon className="mr-2 h-4 w-4" /> Nova Sessão
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                {/* Left Column: Next Session & Stats */}
                <div className="space-y-6 lg:col-span-1">
                    {/* Next Session Highlight */}
                    <Card className={highlightCard}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardDescription className="text-red-100 font-medium">Sua próxima sessão</CardDescription>
                                    <CardTitle className="text-3xl font-bold mt-1">Amanhã</CardTitle>
                                </div>
                                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4 space-y-3 bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-white/80" />
                                    <span className="font-semibold">{nextSession.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-white/80" />
                                    <span className="font-semibold">{nextSession.time}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-white/80" />
                                    <span className="font-semibold">{nextSession.professional}</span>
                                </div>
                            </div>
                            <Button className="w-full mt-4 bg-white text-red-600 hover:bg-red-50 font-bold rounded-xl h-10">
                                <Video className="mr-2 h-4 w-4" /> Link da Videochamada
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Stats */}
                    <Card className={`${glassCard} border-0`}>
                        <CardHeader>
                            <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                                <Trophy className="h-5 w-5 text-yellow-500" /> Suas Conquistas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className={`${glassPanel} p-3 flex items-center gap-3`}>
                                <div className="h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                    <Star className="h-5 w-5 fill-yellow-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Super Focado</p>
                                    <p className="text-xs text-slate-500">5 sessões sem faltas</p>
                                </div>
                            </div>
                            <div className={`${glassPanel} p-3 flex items-center gap-3`}>
                                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <Target className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">Objetivo Batido</p>
                                    <p className="text-xs text-slate-500">Melhorou 20% este mês</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Objectives & History */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Objectives List */}
                    <Card className={`${glassCard} border-0`}>
                        <CardHeader>
                            <CardTitle className="text-slate-800 flex items-center justify-between">
                                <span>Meus Objetivos</span>
                                <span className="text-xs font-normal bg-white/50 px-3 py-1 rounded-full text-slate-500">Trimestre Atual</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {objectives.map((obj) => (
                                <div key={obj.id} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="font-bold text-slate-700 text-sm">{obj.title}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-0.5">{obj.status}</p>
                                        </div>
                                        <span className="text-sm font-bold text-slate-600">{obj.progress}%</span>
                                    </div>
                                    <Progress value={obj.progress} className="h-2.5 bg-slate-100" indicatorClassName="bg-gradient-to-r from-red-500 to-orange-500" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Recent History */}
                    <Card className={`${glassCard} border-0`}>
                        <CardHeader className="pb-0">
                            <CardTitle className="text-slate-800 text-lg">Histórico Recente</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-0 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-2.5 top-2 bottom-6 w-0.5 bg-slate-200"></div>

                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="flex gap-4 items-start pb-6 last:pb-0 relative">
                                        <div className="h-5 w-5 rounded-full bg-red-500 border-4 border-white shadow-sm flex-shrink-0 z-10" />
                                        <div className={`${glassPanel} p-4 flex-1 -mt-1 hover:bg-white/50 transition-colors cursor-pointer`}>
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-700 text-sm">Sessão de Terapia</h4>
                                                <span className="text-xs text-slate-400">20 Dez</span>
                                            </div>
                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                Exercícios de repetição focados em fonemas /R/ e /L/. Paciente demonstrou cansaço no final.
                                            </p>
                                            <div className="mt-3 flex gap-2">
                                                <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-md">Presença</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

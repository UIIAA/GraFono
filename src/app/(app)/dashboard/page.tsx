"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Bell,
    Clock,
    Calendar as CalendarIcon,
    ArrowRight,
    User,
    Activity,
    CheckCircle,
    XCircle,
    HeartPulse
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    // Shared glass styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20 rounded-3xl";
    const glassPanel = "bg-white/50 backdrop-blur-sm border border-red-100 rounded-2xl";

    return (
        <div
            className="min-h-screen p-8 space-y-8 relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)" // Rose to Orange Light Gradient
            }}
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-400/10 to-red-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className={`relative z-10 flex justify-between items-center bg-white/40 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-sm`}>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Painel Inicial</h2>
                        <p className="text-slate-500 font-medium">Bem-vindo(a) de volta, Marcos.</p>
                    </div>
                </div>
                <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg shadow-red-200 border-0 h-11 px-6 font-semibold transition-all hover:scale-[1.02]">
                    + Novo Paciente
                </Button>
            </div>

            <div className="relative z-10 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                {/* Coluna Esquerda: Consultas de Hoje */}
                <Card className={`lg:col-span-2 flex flex-col ${glassCard} border-0`}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                                <Clock className="w-5 h-5 text-red-500" />
                                Consultas de Hoje
                            </CardTitle>
                            <span className="text-sm font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full border border-red-100">
                                22 Dezembro
                            </span>
                        </div>
                        <CardDescription className="text-slate-500">
                            Você tem 0 consultas agendadas para hoje.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center flex-1 text-muted-foreground min-h-[400px]">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-red-400 blur-2xl opacity-20 rounded-full"></div>
                            <div className="bg-gradient-to-br from-white to-red-50 p-8 rounded-full border border-red-100 shadow-xl relative">
                                <CalendarIcon className="w-12 h-12 text-red-400" />
                            </div>
                        </div>
                        <p className="font-bold text-slate-800 text-lg">Dia livre!</p>
                        <p className="text-slate-500 text-sm">Nenhuma consulta pendente para hoje.</p>
                        <Button variant="outline" className="mt-6 border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                            Ver Agenda Completa
                        </Button>
                    </CardContent>
                </Card>

                {/* Coluna Direita: Notificações, Agenda, Amanhã */}
                <div className="space-y-6 flex flex-col">
                    {/* Notificações */}
                    <Card className={`${glassCard} border-0`}>
                        <CardHeader className="pb-3 border-b border-white/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-orange-500" />
                                    <CardTitle className="text-base text-slate-800">Notificações</CardTitle>
                                </div>
                                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-red-200">4</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-4">
                            {[
                                { title: "Pagamento Recebido", desc: "R$ 150,00 - Maria Silva", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
                                { title: "Sessão Confirmada", desc: "João Silva - 14:00", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-50" },
                                { title: "Sessão Cancelada", desc: "Ana Oliveira - Amanhã", icon: XCircle, color: "text-red-500", bg: "bg-red-50" }
                            ].map((item, i) => (
                                <div key={i} className={`${glassPanel} p-3 flex justify-between items-start hover:bg-white/50 transition-colors cursor-pointer group`}>
                                    <div>
                                        <h4 className={`text-sm font-bold flex items-center gap-2 ${item.color}`}>
                                            <item.icon className="w-3.5 h-3.5" /> {item.title}
                                        </h4>
                                        <p className="text-xs text-slate-600 mt-1 font-medium">{item.desc}</p>
                                    </div>
                                    <div className={`h-2 w-2 rounded-full ${item.color.replace('text', 'bg')} mt-1`} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Agenda da Semana */}
                    <Card className={`${glassCard} border-0`}>
                        <CardHeader className="pb-3 border-b border-white/50">
                            <CardTitle className="text-base text-slate-800">Semana</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex justify-between gap-1">
                                {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((day, i) => (
                                    <div key={i} className={`flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all ${i === 0 ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-105' : 'hover:bg-white/60 text-slate-500'}`}>
                                        <span className="text-[10px] font-bold uppercase mb-1 opacity-80">{day}</span>
                                        <span className="text-sm font-bold">{22 + i}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Próximo Paciente Highlight */}
                    <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                            <HeartPulse className="w-24 h-24" />
                        </div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">Amanhã, 09:00</p>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                                <User className="text-white h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold">Ana Oliveira</h3>
                                <p className="text-slate-400 text-sm">Fonoaudiologia Infantil</p>
                            </div>
                        </div>
                        <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold">
                            Ver Detalhes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

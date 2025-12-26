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
    HeartPulse,
    Loader2,
    AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [weekDays, setWeekDays] = useState<Date[]>([]);

    useEffect(() => {
        // Generate next 7 days
        const days: Date[] = [];
        const today = new Date();
        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            days.push(date);
        }
        setWeekDays(days);

        async function load() {
            setLoading(true);
            const result = await getDashboardMetrics();
            if (result.success) {
                setMetrics(result.data);
            }
            setLoading(false);
        }
        load();
    }, []);

    // Filter appointments for selected date
    const filteredAppointments = metrics?.weekAppointments?.filter((apt: any) => {
        const aptDate = new Date(apt.date);
        return aptDate.getDate() === selectedDate.getDate() &&
            aptDate.getMonth() === selectedDate.getMonth() &&
            aptDate.getFullYear() === selectedDate.getFullYear();
    }) || [];

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
                <Link href="/pacientes?new=true">
                    <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg shadow-red-200 border-0 h-11 px-6 font-semibold transition-all hover:scale-[1.02]">
                        + Novo Paciente
                    </Button>
                </Link>
            </div>

            <div className="relative z-10 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                {/* Coluna Esquerda: Consultas por Data */}
                <Card className={`lg:col-span-2 flex flex-col ${glassCard} border-0`}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="flex items-center gap-2 text-xl text-slate-800">
                                <Clock className="w-5 h-5 text-red-500" />
                                Consultas de {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                            </CardTitle>
                            {/* Removed redundant date badge since title now has date */}
                        </div>
                        <CardDescription className="text-slate-500">
                            Você tem {filteredAppointments.length} consultas agendadas para esta data.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 text-muted-foreground min-h-[400px]">
                        {loading ? (
                            <div className="flex flex-1 items-center justify-center">
                                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                            </div>
                        ) : filteredAppointments.length > 0 ? (
                            <div className="space-y-4 w-full">
                                {filteredAppointments.map((apt: any) => (
                                    <div key={apt.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/50 border border-red-100 hover:bg-white/80 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-red-100 h-10 w-10 rounded-xl flex items-center justify-center text-red-600 font-bold text-xs">
                                                {apt.time}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{apt.patient?.name}</p>
                                                <p className="text-xs text-slate-500">{apt.type}</p>
                                            </div>
                                        </div>
                                        <Link href="/agenda">
                                            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                                                Detalhes
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-red-400 blur-2xl opacity-20 rounded-full"></div>
                                    <div className="bg-gradient-to-br from-white to-red-50 p-8 rounded-full border border-red-100 shadow-xl relative">
                                        <CalendarIcon className="w-12 h-12 text-red-400" />
                                    </div>
                                </div>
                                <p className="font-bold text-slate-800 text-lg">Dia livre!</p>
                                <p className="text-slate-500 text-sm">Nenhuma consulta para este dia.</p>
                                <Button variant="outline" className="mt-6 border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                                    <Link href="/agenda">Ver Agenda Completa</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Coluna Direita: Notificações, Agenda, Próximo */}
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
                                { title: "Pagamento Recebido", desc: "R$ 150,00 - Maria Silva", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50", link: "/financeiro" },
                                { title: "Sessão Confirmada", desc: "João Silva - 14:00", icon: CheckCircle, color: "text-blue-500", bg: "bg-blue-50", link: "/agenda" },
                                { title: "Sessão Cancelada", desc: "Ana Oliveira - Amanhã", icon: XCircle, color: "text-red-500", bg: "bg-red-50", link: "/agenda" }
                            ].map((item, i) => (
                                <Link href={item.link} key={i}>
                                    <div className={`${glassPanel} p-3 flex justify-between items-start hover:bg-white/50 transition-colors cursor-pointer group mb-2`}>
                                        <div>
                                            <h4 className={`text-sm font-bold flex items-center gap-2 ${item.color}`}>
                                                <item.icon className="w-3.5 h-3.5" /> {item.title}
                                            </h4>
                                            <p className="text-xs text-slate-600 mt-1 font-medium">{item.desc}</p>
                                        </div>
                                        <div className={`h-2 w-2 rounded-full ${item.color.replace('text', 'bg')} mt-1`} />
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Alertas de Reavaliação (Critical) */}
                    {metrics?.reevaluationAlerts?.length > 0 && (
                        <Card className={`${glassCard} border-red-200 border-2 shadow-red-100`}>
                            <CardHeader className="pb-3 border-b border-white/50 bg-red-50/50 rounded-t-3xl">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
                                        <CardTitle className="text-base text-red-700">Ciclo de Reavaliação</CardTitle>
                                    </div>
                                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{metrics.reevaluationAlerts.length}</span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-4">
                                {metrics.reevaluationAlerts.map((patient: any, i: number) => {
                                    const isLate = new Date(patient.nextReevaluation) < new Date();
                                    const daysLeft = Math.ceil((new Date(patient.nextReevaluation).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                                    return (
                                        <div key={i} className={`p-3 rounded-xl border ${isLate ? 'bg-red-50 border-red-200' : 'bg-orange-50 border-orange-100'} flex justify-between items-center`}>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">{patient.name}</h4>
                                                <p className={`text-xs font-semibold ${isLate ? 'text-red-600' : 'text-orange-600'}`}>
                                                    {isLate ? `Atrasado ${Math.abs(daysLeft)} dias` : `Vence em ${daysLeft} dias`}
                                                </p>
                                            </div>
                                            <Link href={`/agenda?new=true&patientId=${patient.id}&type=Sessão de Devolutiva`}>
                                                <Button size="sm" variant="outline" className="h-7 text-xs bg-white border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800">
                                                    Agendar
                                                </Button>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    )}

                    {/* Agenda da Semana (Interactive) */}
                    <Card className={`${glassCard} border-0`}>
                        <CardHeader className="pb-3 border-b border-white/50">
                            <CardTitle className="text-base text-slate-800">Próximos Dias</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            <div className="flex justify-between gap-1 overflow-x-auto">
                                {weekDays.map((day, i) => {
                                    const isSelected = selectedDate.getDate() === day.getDate() && selectedDate.getMonth() === day.getMonth();
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => setSelectedDate(day)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-2 rounded-xl flex-1 transition-all cursor-pointer min-w-[36px]",
                                                isSelected
                                                    ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-105'
                                                    : 'hover:bg-white/60 text-slate-500'
                                            )}
                                        >
                                            <span className="text-[10px] font-bold uppercase mb-1 opacity-80">
                                                {day.toLocaleDateString('pt-BR', { weekday: 'narrow' }).slice(0, 1)}
                                            </span>
                                            <span className="text-sm font-bold">{day.getDate()}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Próximo Paciente Highlight */}
                    {metrics?.nextAppointment ? (
                        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                <HeartPulse className="w-24 h-24" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4">
                                {new Date(metrics.nextAppointment.date).toLocaleDateString('pt-BR', { weekday: 'long' })}, {metrics.nextAppointment.time}
                            </p>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                                    <User className="text-white h-6 w-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">{metrics.nextAppointment.patient?.name}</h3>
                                    <p className="text-slate-400 text-sm">{metrics.nextAppointment.type}</p>
                                </div>
                            </div>
                            <Link href="/agenda">
                                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold">
                                    Ver Detalhes
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="rounded-3xl bg-slate-100 p-6 text-slate-500 shadow-inner flex flex-col items-center justify-center text-center">
                            <p className="text-sm">Sem próximos atendimentos</p>
                        </div>
                    )}
                </div>
            </div>
        </div >
    );
}

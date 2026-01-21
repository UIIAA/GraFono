"use client";

import { MagicCard, MagicStatCard } from "@/components/ui/magic-card";
import {
    Bell,
    Clock,
    Calendar as CalendarIcon,
    ArrowRight,
    User,
    CheckCircle,
    XCircle,
    HeartPulse,
    Loader2,
    AlertCircle,
    TrendingUp,
    Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { getActiveReminders } from "@/app/actions/reminders";
import { ReminderList } from "@/components/reminder-list";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<any>(null);
    const [reminders, setReminders] = useState<any[]>([]);
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
            const [metricsRes, remindersRes] = await Promise.all([
                getDashboardMetrics(),
                getActiveReminders()
            ]);

            if (metricsRes.success) {
                setMetrics(metricsRes.data);
            }
            if (remindersRes.success) {
                setReminders(remindersRes.data || []);
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

    return (
        <div className="min-h-screen p-8 space-y-8 relative overflow-hidden font-sans">
            {/* Premium Background */}
            <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 pointer-events-none -z-20" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-slate-100/0 to-slate-100/0 dark:from-indigo-900/20 pointer-events-none -z-10" />
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none -z-10" />

            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10"
            >
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Clínico</h2>
                    <p className="text-slate-500 font-medium mt-1">Visão geral da sua performance hoje.</p>
                </div>
                <Link href="/pacientes?new=true">
                    <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 border-0 font-semibold transition-all hover:scale-[1.02]">
                        + Novo Paciente
                    </Button>
                </Link>
            </motion.div>

            {/* Metrics Row using MagicStatCard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MagicStatCard
                    icon={User}
                    label="Pacientes Ativos"
                    value={metrics?.totalPatients || 0}
                    trend="+4%"
                    trendUp={true}
                    color="indigo"
                    delay={0.1}
                />
                <MagicStatCard
                    icon={CalendarIcon}
                    label="Consultas Hoje"
                    value={metrics?.todayAppointments || 0}
                    color="orange"
                    delay={0.2}
                />
                <MagicStatCard
                    icon={Wallet}
                    label="Resultado Caixa"
                    value={`R$ ${metrics?.netBalance || '0,00'}`}
                    trend="+12%"
                    trendUp={true}
                    color="emerald"
                    delay={0.3}
                />
                <MagicStatCard
                    icon={AlertCircle}
                    label="Pendências"
                    value={reminders.length || 0}
                    trend={reminders.length > 0 ? "Ação Necessária" : "Em dia"}
                    trendUp={reminders.length === 0}
                    color="red"
                    delay={0.4}
                />
            </div>

            <div className="relative z-10 grid gap-6 md:grid-cols-1 lg:grid-cols-3">
                {/* Main Column: Calendar & Appointments */}
                <div className="lg:col-span-2 space-y-6">
                    <MagicCard className="min-h-[500px] flex flex-col" delay={0.5}>
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 dark:bg-slate-900/50">
                            <div>
                                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                    <Clock className="w-5 h-5 text-indigo-500" />
                                    Agenda do Dia
                                </h3>
                                <p className="text-sm text-slate-500">
                                    {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', weekday: 'long' })}
                                </p>
                            </div>

                            {/* Simple Date Selector */}
                            <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                {weekDays.map((day, i) => {
                                    const isSelected = selectedDate.getDate() === day.getDate();
                                    return (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedDate(day)}
                                            className={cn(
                                                "w-8 h-8 rounded-md text-xs font-bold transition-all",
                                                isSelected
                                                    ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm"
                                                    : "text-slate-400 hover:text-slate-600"
                                            )}
                                        >
                                            {day.getDate()}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="p-6 flex-1 bg-white/30 dark:bg-slate-900/30">
                            {loading ? (
                                <div className="flex flex-1 items-center justify-center h-full min-h-[300px]">
                                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                                </div>
                            ) : filteredAppointments.length > 0 ? (
                                <div className="space-y-3">
                                    {filteredAppointments.map((apt: any, i: number) => (
                                        <motion.div
                                            key={apt.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                            className="group flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-800 transition-all cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="bg-indigo-50 dark:bg-indigo-900/30 h-12 w-12 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                                    {apt.time}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-800 dark:text-slate-200 text-lg tracking-tight">{apt.patient?.name}</p>
                                                    <p className="text-sm text-slate-500 font-medium">{apt.type}</p>
                                                </div>
                                            </div>
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href="/agenda">
                                                    <Button size="sm" variant="ghost" className="text-indigo-600 hover:bg-indigo-50">
                                                        Ver <ArrowRight className="w-3 h-3 ml-1" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
                                    <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-full border border-indigo-100 shadow-lg mb-4">
                                        <CalendarIcon className="w-10 h-10 text-indigo-400" />
                                    </div>
                                    <p className="font-bold text-slate-800 text-lg">Agenda Livre</p>
                                    <p className="text-slate-500 text-sm">Nenhum atendimento para este dia.</p>
                                </div>
                            )}
                        </div>
                    </MagicCard>
                </div>

                {/* Right Column: Next Patient & Notifications */}
                <div className="space-y-6 flex flex-col">

                    {/* Next Appointment Highlight */}
                    {metrics?.nextAppointment ? (
                        <MagicCard className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white border-slate-700" delay={0.6}>
                            <div className="p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <HeartPulse className="w-32 h-32" />
                                </div>
                                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
                                    Próximo Atendimento
                                </p>
                                <div className="flex items-start gap-4 mb-8 relative z-10">
                                    <Avatar className="h-16 w-16 border-4 border-slate-700 shadow-xl">
                                        <AvatarFallback className="bg-indigo-500 text-white text-xl">
                                            {metrics.nextAppointment.patient?.name?.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-2xl font-bold tracking-tight leading-tight">{metrics.nextAppointment.patient?.name}</h3>
                                        <div className="flex items-center gap-2 mt-1 text-slate-300 font-medium">
                                            <Clock className="w-4 h-4" />
                                            {metrics.nextAppointment.time} • {metrics.nextAppointment.type}
                                        </div>
                                    </div>
                                </div>
                                <Link href="/agenda">
                                    <Button className="w-full bg-white text-slate-900 hover:bg-slate-100 rounded-xl font-bold h-12">
                                        Iniciar Sessão
                                    </Button>
                                </Link>
                            </div>
                        </MagicCard>
                    ) : null}

                    {/* Notifications / Reminders */}
                    <MagicCard delay={0.7} className="flex-1">
                        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bell className="w-5 h-5 text-indigo-500" />
                                <h3 className="font-bold text-slate-800 dark:text-slate-100">Atualizações</h3>
                            </div>
                            <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md shadow-rose-200">
                                {metrics?.reevaluationAlerts?.length + reminders.length || 0}
                            </span>
                        </div>
                        <div className="p-4 space-y-3">
                            {/* Reevaluation Alerts */}
                            {metrics?.reevaluationAlerts?.map((patient: any, i: number) => (
                                <div key={`alert-${i}`} className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-800 truncate">{patient.name}</p>
                                        <p className="text-xs text-orange-600 font-medium">Reavaliação pendente</p>
                                    </div>
                                    <Link href={`/agenda?new=true&patientId=${patient.id}&type=Sessão de Devolutiva`}>
                                        <Button size="sm" variant="outline" className="h-7 text-xs bg-white border-orange-200 text-orange-700 hover:bg-orange-50">
                                            Agendar
                                        </Button>
                                    </Link>
                                </div>
                            ))}

                            {/* Use existing ReminderList but wrapped if possible, or mapping manual for style */}
                            {reminders.slice(0, 3).map((reminder: any, i: number) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer">
                                    <div className={cn("mt-1 h-2 w-2 rounded-full flex-shrink-0", reminder.type === 'PAYMENT' ? 'bg-emerald-500' : 'bg-indigo-500')} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 leading-tight">{reminder.title}</p>
                                        <p className="text-xs text-slate-400 mt-1">{new Date(reminder.dueDate).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </MagicCard>
                </div>
            </div>
        </div>
    );
}

"use client";

import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00
const DAYS = [
    { name: "Dom", full: "Domingo", date: 21 },
    { name: "Seg", full: "Segunda", date: 22, current: true },
    { name: "Ter", full: "Terça", date: 23 },
    { name: "Qua", full: "Quarta", date: 24 },
    { name: "Qui", full: "Quinta", date: 25 },
    { name: "Sex", full: "Sexta", date: 26 },
    { name: "Sab", full: "Sábado", date: 27 },
];

export default function AgendaPage() {
    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassButton = "bg-white/80 hover:bg-white border border-red-100 backdrop-blur-sm text-slate-700 shadow-sm";

    return (
        <div
            className="min-h-screen p-6 flex flex-col relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className={`flex justify-between items-center mb-6 p-4 rounded-3xl ${glassCard} relative z-10`}>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center shadow-inner">
                        <CalendarIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Agenda</h1>
                        <p className="text-slate-500 text-xs font-medium">Gestão de Tempo</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="flex bg-white/50 p-1 rounded-xl shadow-inner border border-white/60">
                        {['Dia', 'Semana', 'Mês'].map((v, i) => (
                            <Button
                                key={v}
                                variant={i === 1 ? "secondary" : "ghost"}
                                className={`h-8 text-xs rounded-lg ${i === 1 ? 'bg-white shadow-sm text-red-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {v}
                            </Button>
                        ))}
                    </div>
                    <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 h-10 px-4 transition-transform hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> Novo Evento
                    </Button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className={`p-4 flex justify-between items-center mb-4 relative z-10`}>
                <div className="flex items-center gap-2 bg-white/40 p-1 rounded-xl border border-white/50 backdrop-blur-sm shadow-sm">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/60">
                        <ChevronLeft className="h-4 w-4 text-slate-600" />
                    </Button>
                    <span className="text-sm font-bold text-slate-800 px-2 min-w-[140px] text-center">
                        Dezembro 2024
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/60">
                        <ChevronRight className="h-4 w-4 text-slate-600" />
                    </Button>
                </div>

                <Button variant="outline" className={`${glassButton} border-dashed`}>
                    <Filter className="mr-2 h-3 w-3" /> Filtros
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className={`flex-1 ${glassCard} rounded-3xl overflow-hidden flex flex-col relative z-20`}>
                {/* Header Row (Days) */}
                <div className="flex border-b border-white/40 bg-white/30 backdrop-blur-xl sticky top-0 z-30">
                    <div className="w-16 border-r border-white/40 flex-shrink-0" />
                    {DAYS.map((day) => (
                        <div
                            key={day.date}
                            className={cn(
                                "flex-1 py-4 text-center border-r border-white/40 last:border-r-0 flex flex-col items-center gap-1 transition-colors",
                                day.current ? "bg-red-50/50" : ""
                            )}
                        >
                            <span className={cn(
                                "text-[10px] uppercase font-bold tracking-widest",
                                day.current ? "text-red-600" : "text-slate-400"
                            )}>{day.name}</span>
                            <div className={cn(
                                "text-lg font-bold w-10 h-10 flex items-center justify-center rounded-2xl transition-all",
                                day.current ? "bg-red-500 text-white shadow-lg shadow-red-200 scale-110" : "text-slate-700"
                            )}>
                                {day.date}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Body */}
                <div className="flex-1 relative overflow-y-auto no-scrollbar bg-white/20">
                    {/* Time Lines */}
                    {HOURS.map((hour) => (
                        <div key={hour} className="flex h-20 border-b border-white/30 last:border-0 relative group">
                            <div className="w-16 border-r border-white/30 flex-shrink-0 text-xs font-medium text-slate-400 p-2 text-right relative">
                                <span className="relative -top-3">{hour}:00</span>
                            </div>
                            {/* Vertical Grid Lines */}
                            {DAYS.map((day) => (
                                <div
                                    key={day.date}
                                    className={cn(
                                        "flex-1 border-r border-white/30 last:border-r-0 h-full relative group-hover:bg-white/10 transition-colors",
                                        day.current ? "bg-red-50/10" : ""
                                    )}
                                />
                            ))}
                        </div>
                    ))}

                    {/* Events Overlay */}
                    {/* Event 1 - Stylized */}
                    <div
                        className="absolute m-1 rounded-2xl p-3 cursor-pointer hover:scale-[1.02] transition-all z-20 shadow-md group border border-white/20"
                        style={{
                            top: '160px', // 10:00 assuming 80px slots
                            left: 'calc(4rem + (100% - 4rem) * 1 / 7)',
                            width: 'calc((100% - 4rem) / 7 - 8px)',
                            height: '74px', // slightly less than 80px
                            background: "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(249, 115, 22, 0.9) 100%)",
                            backdropFilter: "blur(4px)"
                        }}
                    >
                        <div className="flex justify-between items-start text-white">
                            <span className="font-bold text-xs">Avaliação Inicial</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Avatar className="h-6 w-6 border-2 border-white/30">
                                <AvatarFallback className="bg-white/20 text-white text-[9px]">JS</AvatarFallback>
                            </Avatar>
                            <span className="text-white/90 text-[10px] font-medium">João Silva</span>
                        </div>
                    </div>

                    {/* Event 2 - Stylized */}
                    <div
                        className="absolute m-1 rounded-2xl p-3 cursor-pointer hover:scale-[1.02] transition-all z-20 shadow-md group border border-white/20"
                        style={{
                            top: '480px', // 14:00
                            left: 'calc(4rem + (100% - 4rem) * 3 / 7)',
                            width: 'calc((100% - 4rem) / 7 - 8px)',
                            height: '74px',
                            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)",
                        }}
                    >
                        <div className="flex justify-between items-start text-white">
                            <span className="font-bold text-xs">Reunião Pais</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-white/90 text-[10px] font-medium flex items-center gap-1">
                                <Clock className="h-3 w-3" /> 14:00 - 15:00
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

"use client";

import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00
const DAYS = [
    { name: "dom", date: 21 },
    { name: "seg", date: 22, current: true },
    { name: "ter", date: 23 },
    { name: "qua", date: 24 },
    { name: "qui", date: 25 },
    { name: "sex", date: 26 },
    { name: "sab", date: 27 },
];

export default function AgendaPage() {
    return (
        <div className="p-8 h-screen flex flex-col bg-[#F0F2F5]">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agenda</h1>
                    <p className="text-gray-500">Gerencie seus compromissos e consultas</p>
                </div>
                <div className="flex gap-2">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <Button variant="ghost" className="h-8 px-3 text-sm text-gray-600">Dia</Button>
                        <Button variant="ghost" className="h-8 px-3 text-sm bg-white shadow-sm text-gray-900 font-medium ml-1">Semana</Button>
                        <Button variant="ghost" className="h-8 px-3 text-sm text-gray-600">Mês</Button>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white ml-2">
                        <Plus className="mr-2 h-4 w-4" /> Novo Evento
                    </Button>
                </div>
            </div>

            {/* Calendar Controls */}
            <div className="bg-white rounded-t-xl border border-b-0 border-gray-200 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-3">
                        Hoje
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="font-semibold text-gray-700">
                    21 dez - 27 dez
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 bg-white border border-gray-200 rounded-b-xl overflow-y-auto flex flex-col">
                {/* Header Row (Days) */}
                <div className="flex border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div className="w-16 border-r border-gray-100 flex-shrink-0" /> {/* Time column spacer */}
                    {DAYS.map((day) => (
                        <div
                            key={day.date}
                            className={cn(
                                "flex-1 py-3 text-center border-r border-gray-100 last:border-r-0",
                                day.current ? "bg-blue-50/30" : ""
                            )}
                        >
                            <div className="text-xs font-semibold uppercase text-gray-500 mb-1">{day.name}</div>
                            <div className={cn(
                                "text-sm font-bold inline-flex items-center justify-center w-8 h-8 rounded-full",
                                day.current ? "bg-blue-600 text-white" : "text-gray-900"
                            )}>
                                {day.date}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Grid Body */}
                <div className="flex-1 relative">
                    {/* Time Lines */}
                    {HOURS.map((hour) => (
                        <div key={hour} className="flex h-16 border-b border-gray-50 last:border-0 relative group">
                            <div className="w-16 border-r border-gray-100 flex-shrink-0 text-xs text-gray-400 p-2 text-right relative -top-3">
                                {hour}:00
                            </div>
                            {/* Vertical Grid Lines */}
                            {DAYS.map((day) => (
                                <div
                                    key={day.date}
                                    className={cn(
                                        "flex-1 border-r border-gray-50 last:border-r-0 h-full relative group-hover:bg-gray-50/20 transition-colors",
                                        day.current ? "bg-blue-50/10" : ""
                                    )}
                                />
                            ))}
                        </div>
                    ))}

                    {/* Events Overlay */}
                    {/* Example Event 1: Avaliação Inicial (Segunda 10:00 - 11:00) */}
                    <div
                        className="absolute bg-purple-100 border-l-4 border-purple-500 rounded p-2 text-xs cursor-pointer hover:shadow-md transition-all z-10"
                        style={{
                            top: '128px', // 10:00 (2 * 64px) assuming 8:00 start
                            left: 'calc(4rem + (100% - 4rem) * 1 / 7 + 4px)', // col 2 (segunda)
                            width: 'calc((100% - 4rem) / 7 - 8px)',
                            height: '60px'
                        }}
                    >
                        <div className="font-semibold text-purple-700">Avaliação Inicial</div>
                        <div className="text-purple-600 text-[10px]">João Silva</div>
                    </div>

                    {/* Example Event 2: Reunião com Pais (Quarta 14:00 - 15:00) */}
                    <div
                        className="absolute bg-blue-100 border-l-4 border-blue-500 rounded p-2 text-xs cursor-pointer hover:shadow-md transition-all z-10"
                        style={{
                            top: '384px', // 14:00 (6 * 64px)
                            left: 'calc(4rem + (100% - 4rem) * 3 / 7 + 4px)', // col 4 (quarta)
                            width: 'calc((100% - 4rem) / 7 - 8px)',
                            height: '60px'
                        }}
                    >
                        <div className="font-semibold text-blue-700">Reunião com Pais</div>
                        <div className="text-blue-600 text-[10px]">Ana Oliveira</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

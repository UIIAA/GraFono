"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Filter, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAppointments } from "@/app/actions/appointment";
import { getPatients } from "@/app/actions/patient";
import { NewAppointmentDialog } from "./_components/new-appointment-dialog";
import { ConfirmationAssistant } from "./_components/confirmation-assistant";
import { CheckCircle } from "lucide-react";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

// Dynamic dates would be better, but for now hooking into existing structure
// We can assume user is looking at current week? Or stick to specific week?
// The UI shows "Dezembro 2024" and "Dom 21" - "Sab 27". This is effectively hardcoded to Dec 21-27 2024.
// I will keep this hardcoded range for visual consistency as requested, but map Real DB dates to these slots if they fall in range.

const DAYS = [
    { name: "Dom", full: "Domingo", date: 21 },
    { name: "Seg", full: "Segunda", date: 22, current: true },
    { name: "Ter", full: "Terça", date: 23 },
    { name: "Qua", full: "Quarta", date: 24 },
    { name: "Qui", full: "Quinta", date: 25 },
    { name: "Sex", full: "Sexta", date: 26 },
    { name: "Sab", full: "Sábado", date: 27 },
];

import { useSearchParams } from "next/navigation";

export default function AgendaPage() {
    const searchParams = useSearchParams();
    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: Date, time: string } | undefined>(undefined);

    async function loadData() {
        const [res, patRes] = await Promise.all([
            getAppointments(),
            getPatients()
        ]);
        if (res.success && res.data) {
            setAppointments(res.data);
        }
        if (patRes.success && patRes.data) {
            setPatients(patRes.data);
        }
    }

    const [presetPatientId, setPresetPatientId] = useState<string | undefined>(undefined);
    const [presetType, setPresetType] = useState<string | undefined>(undefined);

    useEffect(() => {
        loadData();

        // Check for URL params to auto-open dialog
        const isNew = searchParams.get("new");
        const patientId = searchParams.get("patientId");
        const type = searchParams.get("type");

        if (isNew === "true") {
            if (patientId) {
                setPresetPatientId(patientId);

                // Smart Slot Logic: Try to find a pattern in existing appointments
                // We rely on 'appointments' being loaded. If it's empty initially, this might run before data.
                // So checking `appointments.length` might be needed or we rely on re-renders.
                // Better approach: Calculate this when `appointments` changes IF we have a presetPatientId.
            }
            if (type) setPresetType(type);
            setIsDialogOpen(true);
        }
    }, [searchParams]);

    // Secondary Effect: Once appointments are loaded and we have a presetPatientId, try to predict the slot
    useEffect(() => {
        if (presetPatientId && appointments.length > 0 && !selectedSlot) {
            const patientAppts = appointments.filter(a => a.patientId === presetPatientId);

            if (patientAppts.length > 0) {
                // Sort by date desc
                patientAppts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                const lastAppt = patientAppts[0];
                const lastDate = new Date(lastAppt.date);

                // Simple logic: Same time, next occurrence of the same weekday
                // E.g. Last was Monday 14:00 at Dec 10. We want Monday 14:00 after Today.

                const targetDayOfWeek = lastDate.getDay(); // 0-6
                const targetTime = lastAppt.time || "08:00";

                let nextDate = new Date(); // Start from today

                // Advance until we match the day of week
                while (nextDate.getDay() !== targetDayOfWeek || nextDate < new Date()) {
                    nextDate.setDate(nextDate.getDate() + 1);
                }

                // If it's today but the time has passed? Assume we book for future dates generally.
                // Let's just default to that calculated date.

                setSelectedSlot({
                    date: nextDate,
                    time: targetTime
                });
            }
        }
    }, [presetPatientId, appointments, selectedSlot]);

    // Helper to position events
    const getEventStyle = (apt: any) => {
        const date = new Date(apt.date);
        const day = date.getDate(); // 21-27
        const hourStr = apt.time || "08:00";
        const hour = parseInt(hourStr.split(':')[0]);
        const minutes = parseInt(hourStr.split(':')[1] || "0");

        // Find column index (0-6) based on DAYS array matches
        const dayIndex = DAYS.findIndex(d => d.date === day);

        if (dayIndex === -1) return { display: 'none' };

        // Vertical pos
        // 8:00 is top 0?
        // each hour is 80px
        const top = (hour - 8) * 80 + (minutes / 60) * 80;

        return {
            top: `${top}px`,
            left: `calc(4rem + (100% - 4rem) * ${dayIndex} / 7)`,
            width: `calc((100% - 4rem) / 7 - 8px)`, // slightly smaller for gap
            height: '74px',
            background: apt.type === 'Avaliação'
                ? "linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(249, 115, 22, 0.9) 100%)"
                : "linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)",
            backdropFilter: "blur(4px)"
        };
    };

    const handleSlotClick = (dayDate: number, hour: number) => {
        // Construct date: Dec 2024
        const date = new Date(2024, 11, dayDate); // Month is 0-indexed: 11 = Dec
        const time = `${hour.toString().padStart(2, '0')}:00`;
        setSelectedSlot({ date, time });
        setIsDialogOpen(true);
    };

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
                    <Button
                        onClick={() => {
                            setSelectedSlot(undefined);
                            setIsDialogOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 h-10 px-4 transition-transform hover:scale-105"
                    >
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

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className={`${glassButton} border-dashed text-green-600 border-green-200 hover:bg-green-50`}
                        onClick={() => setIsAssistantOpen(true)}
                    >
                        <CheckCircle className="mr-2 h-3 w-3" /> Confirmar
                    </Button>
                    <Button variant="outline" className={`${glassButton} border-dashed`}>
                        <Filter className="mr-2 h-3 w-3" /> Filtros
                    </Button>
                </div>
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
                                    onClick={() => handleSlotClick(day.date, hour)}
                                    className={cn(
                                        "flex-1 border-r border-white/30 last:border-r-0 h-full relative cursor-pointer hover:bg-white/40 transition-colors",
                                        day.current ? "bg-red-50/10" : ""
                                    )}
                                />
                            ))}
                        </div>
                    ))}

                    {/* DB Events */}
                    {appointments.map(apt => (
                        <div
                            key={apt.id}
                            className="absolute m-1 rounded-2xl p-3 cursor-pointer hover:scale-[1.02] transition-all z-20 shadow-md group border border-white/20"
                            style={getEventStyle(apt)}
                            onClick={(e) => {
                                e.stopPropagation();
                                // Edit logic could go here
                            }}
                        >
                            <div className="flex justify-between items-start text-white">
                                <span className="font-bold text-xs">{apt.type || "Consulta"}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <Avatar className="h-6 w-6 border-2 border-white/30">
                                    <AvatarFallback className="bg-white/20 text-white text-[9px]">
                                        {apt.patient?.name?.substring(0, 2).toUpperCase() || "PT"}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-white/90 text-[10px] font-medium">
                                    {apt.patient?.name || "Paciente"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <NewAppointmentDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                patients={patients}
                initialDate={selectedSlot?.date}
                initialTime={selectedSlot?.time}
                initialPatientId={presetPatientId}
                initialType={presetType}
                onSave={loadData}
            />

            <ConfirmationAssistant
                open={isAssistantOpen}
                onOpenChange={setIsAssistantOpen}
                appointments={appointments}
            />
        </div>
    )
}

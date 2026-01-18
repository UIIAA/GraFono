"use client";
export const dynamic = "force-dynamic";

import { Suspense, useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getAppointments } from "@/app/actions/appointment";
import { getPatients } from "@/app/actions/patient";
import { getAvailabilityConfig, AvailabilityData } from "@/app/actions/settings";
import { NewAppointmentDialog } from "./_components/new-appointment-dialog";
import { ConfirmationAssistant } from "./_components/confirmation-assistant";
import { AvailabilityDialog } from "@/components/availability-dialog";
import { CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";
import {
    format,
    addDays,
    addWeeks,
    addMonths,
    subDays,
    subWeeks,
    subMonths,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    startOfMonth,
    endOfMonth,
    getDay,
    isToday,
    startOfDay
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { AgendaFilter, AgendaFilters } from "./_components/agenda-filter";

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 to 19:00

type ViewMode = 'day' | 'week' | 'month';

function AgendaContent() {
    const { toast } = useToast();
    const searchParams = useSearchParams();

    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<ViewMode>('week');
    const [activeFilters, setActiveFilters] = useState<AgendaFilters>({});

    const [appointments, setAppointments] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAssistantOpen, setIsAssistantOpen] = useState(false);
    const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: Date, time: string } | undefined>(undefined);
    const [editingAppointment, setEditingAppointment] = useState<any | undefined>(undefined);
    const [availability, setAvailability] = useState<AvailabilityData | null>(null);

    const [presetPatientId, setPresetPatientId] = useState<string | undefined>(undefined);
    const [presetType, setPresetType] = useState<string | undefined>(undefined);

    async function loadData() {
        const [res, patRes, avRes] = await Promise.all([
            getAppointments(),
            getPatients(),
            getAvailabilityConfig()
        ]);
        if (res.success && res.data) {
            setAppointments(res.data);
        }
        if (patRes.success && patRes.data) {
            setPatients(patRes.data);
        }
        if (avRes) {
            setAvailability({
                ...avRes,
                lunchStart: avRes.lunchStart ?? undefined,
                lunchEnd: avRes.lunchEnd ?? undefined
            });
        }
    }

    useEffect(() => {
        loadData();

        // Check for URL params to auto-open dialog
        const isNew = searchParams.get("new");
        const patientId = searchParams.get("patientId");
        const type = searchParams.get("type");

        if (isNew === "true") {
            if (patientId) {
                setPresetPatientId(patientId);
            }
            if (type) setPresetType(type);
            setIsDialogOpen(true);
        }
    }, [searchParams]);

    // Computed Days based on View
    const displayedDays = useMemo(() => {
        if (view === 'day') {
            return [{
                date: currentDate,
                dayId: format(currentDate, "EEE").toUpperCase(), // This might need mapping to English for config check if "EEE" is PT
                name: format(currentDate, "ccc", { locale: ptBR }),
                full: format(currentDate, "cccc", { locale: ptBR }),
                dayNum: currentDate.getDate()
            }];
        } else if (view === 'week') {
            const start = startOfWeek(currentDate, { weekStartsOn: 0 }); // Sunday
            const end = endOfWeek(currentDate, { weekStartsOn: 0 });
            return eachDayOfInterval({ start, end }).map(date => ({
                date,
                dayId: format(date, "EEE", { locale: undefined }).toUpperCase(), // Helper for EN IDs? see below
                name: format(date, "ccc", { locale: ptBR }),
                full: format(date, "cccc", { locale: ptBR }),
                dayNum: date.getDate()
            }));
        } else {
            // Month view logic handled separately for grid rendering
            return [];
        }
    }, [currentDate, view]);

    // Helper for English Day IDs (MON, TUE...) used in Availability Config
    // If date-fns returns localized "seg", "ter", we need to map them or use a non-localized format
    // Just force English format for dayId
    const getDayId = (date: Date) => {
        // 0=Sun, 1=Mon...
        const map = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
        return map[getDay(date)];
    };

    // Filtered Appointments
    const filteredAppointments = useMemo(() => {
        return appointments.filter(apt => {
            if (activeFilters.type && apt.type !== activeFilters.type) return false;
            if (activeFilters.patientId && apt.patientId !== activeFilters.patientId) return false;
            return true;
        });
    }, [appointments, activeFilters]);

    // Navigation Handlers
    const handlePrevious = () => {
        if (view === 'day') setCurrentDate(subDays(currentDate, 1));
        if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
        if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    };

    const handleNext = () => {
        if (view === 'day') setCurrentDate(addDays(currentDate, 1));
        if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
        if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    };

    // Availability Helper
    const isSlotAvailable = (date: Date, hour: number) => {
        if (!availability) return true; // Validate nothing if no config

        const dayId = getDayId(date);

        // Granular Validation (New System)
        if (availability.timeSlots && availability.timeSlots.length > 0) {
            const dayConfig = availability.timeSlots.find(d => d.day === dayId);

            // If day is not configured or not active, it's unavailable
            if (!dayConfig || !dayConfig.active) return false;

            const slotMinutes = hour * 60;

            // Check if hour is within ANY of the defined slots
            // Slot: start "08:00" -> 480 min, end "12:00" -> 720 min
            // We check if the *entire hour* (or at least the start of it) is allowed?
            // Usually agenda slots are clicked by start time.

            const isWithinSlot = dayConfig.slots.some(slot => {
                const [startH, startM] = slot.start.split(':').map(Number);
                const [endH, endM] = slot.end.split(':').map(Number);

                const startTotal = startH * 60 + startM;
                const endTotal = endH * 60 + endM;

                // Available if slotMinutes >= start && slotMinutes < end
                return slotMinutes >= startTotal && slotMinutes < endTotal;
            });

            return isWithinSlot;
        }

        // --- Fallback to Legacy Logic (for safety) ---
        // 1. Check Working Days
        if (!availability.workingDays.includes(dayId)) return false;

        const timeStr = `${hour.toString().padStart(2, '0')}:00`;

        // 2. Check Working Hours (Start - End)
        const [startH, startM] = availability.startHour.split(':').map(Number);
        const [endH, endM] = availability.endHour.split(':').map(Number);

        const slotMinutes = hour * 60;
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;

        if (slotMinutes < startMinutes || slotMinutes >= endMinutes) return false;

        // 3. Check Lunch Break
        if (availability.lunchStart && availability.lunchEnd) {
            const [lStartH, lStartM] = availability.lunchStart.split(':').map(Number);
            const [lEndH, lEndM] = availability.lunchEnd.split(':').map(Number);

            const lunchStart = lStartH * 60 + lStartM;
            const lunchEnd = lEndH * 60 + lEndM;

            // If slot is inside lunch break
            if (slotMinutes >= lunchStart && slotMinutes < lunchEnd) return false;
        }

        return true;
    };

    const handleSlotClick = (date: Date, hour: number) => {
        // Validation
        if (!isSlotAvailable(date, hour)) {
            toast({
                title: "Horário Indisponível",
                description: "Este horário está fora do seu expediente configurado.",
                variant: "destructive"
            });
            return;
        }

        const time = `${hour.toString().padStart(2, '0')}:00`;
        setSelectedSlot({ date, time });
        setIsDialogOpen(true);
    };

    // Event Positioning (Only for Day/Week views)
    const getEventStyle = (apt: any, daysInView: any[]) => {
        const aptDate = new Date(apt.date);

        const dayIndex = daysInView.findIndex(d => isSameDay(d.date, aptDate));
        if (dayIndex === -1) return { style: { display: 'none' }, className: 'hidden' };

        const hourStr = apt.time || "08:00";
        const hour = parseInt(hourStr.split(':')[0]);
        const minutes = parseInt(hourStr.split(':')[1] || "0");

        const top = (hour - 8) * 80 + (minutes / 60) * 80;

        // Clean Modern Look Colors
        let bgClass = "bg-slate-100 text-slate-700 border-l-4 border-slate-400"; // Default

        switch (apt.type) {
            case 'Avaliação':
            case 'Avaliação Inicial':
                bgClass = "bg-indigo-100 text-indigo-700 border-l-4 border-indigo-500 hover:bg-indigo-200";
                break;
            case 'Terapia':
            case 'Sessão':
                bgClass = "bg-blue-100 text-blue-700 border-l-4 border-blue-500 hover:bg-blue-200";
                break;
            case 'Reunião':
            case 'Reunião com Pais':
                bgClass = "bg-sky-100 text-sky-700 border-l-4 border-sky-500 hover:bg-sky-200";
                break;
            case 'Exame':
                bgClass = "bg-emerald-100 text-emerald-700 border-l-4 border-emerald-500 hover:bg-emerald-200";
                break;
            case 'Sessão de Devolutiva':
                bgClass = "bg-amber-100 text-amber-700 border-l-4 border-amber-500 hover:bg-amber-200";
                break;
            default:
                bgClass = "bg-slate-100 text-slate-700 border-l-4 border-slate-400 hover:bg-slate-200";
        }

        return {
            style: {
                top: `${top}px`,
                left: `calc(4rem + (100% - 4rem) * ${dayIndex} / ${daysInView.length})`,
                width: `calc((100% - 4rem) / ${daysInView.length} - 8px)`,
                height: '74px',
            },
            className: cn("absolute m-1 rounded-md p-2 cursor-pointer transition-all z-20 shadow-sm text-xs font-semibold leading-tight flex flex-col gap-1", bgClass)
        };
    };

    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassButton = "bg-white/80 hover:bg-white border border-red-100 backdrop-blur-sm text-slate-700 shadow-sm";

    // Check if a specific day is a working day based on granular or legacy config
    const isDayWorking = (date: Date) => {
        if (!availability) return true; // Default to open if no config loading

        const dayId = getDayId(date);

        // Granular Check
        if (availability.timeSlots && availability.timeSlots.length > 0) {
            const dayConfig = availability.timeSlots.find(d => d.day === dayId);
            // Must exist, be active, and have at least one slot
            return !!(dayConfig && dayConfig.active && dayConfig.slots.length > 0);
        }

        // Legacy Fallback
        return availability.workingDays.includes(dayId);
    };

    // --- Render Month Grid ---
    const renderMonthView = () => {
        const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
        const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
        const calendarDays = eachDayOfInterval({ start, end });

        // Chunk into weeks
        const weeks: Date[][] = [];
        for (let i = 0; i < calendarDays.length; i += 7) {
            weeks.push(calendarDays.slice(i, i + 7));
        }

        return (
            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                <div className="grid grid-cols-7 gap-3 h-full auto-rows-fr">
                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map(d => (
                        <div key={d} className="text-center text-xs font-bold text-slate-500 py-2 uppercase tracking-wider">
                            {d}
                        </div>
                    ))}
                    {calendarDays.map((day) => {
                        const isCurrentMonth = day.getMonth() === currentDate.getMonth();
                        const dailyApts = filteredAppointments.filter(a => isSameDay(new Date(a.date), day));

                        const working = isDayWorking(day);
                        const today = isToday(day);

                        // Styles for Working vs Off days
                        const containerStyles = working
                            ? isCurrentMonth
                                ? "bg-white shadow-sm border-slate-100 hover:shadow-md hover:border-red-100 hover:-translate-y-1 cursor-pointer"
                                : "bg-white/60 border-slate-100 opacity-60 hover:opacity-100 cursor-pointer"
                            : "bg-slate-100/50 border-transparent opacity-70 cursor-default"; // Off-day style

                        return (
                            <div
                                key={day.toISOString()}
                                className={cn(
                                    "min-h-[110px] rounded-2xl p-3 flex flex-col gap-2 transition-all duration-200 relative group border",
                                    containerStyles,
                                    today && working && "ring-2 ring-red-400 ring-offset-2 bg-gradient-to-br from-white to-red-50 shadow-red-100",
                                    today && !working && "ring-2 ring-slate-300 ring-offset-2" // Highlight today even if off
                                )}
                                onClick={() => {
                                    if (working) handleSlotClick(day, 9);
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <span className={cn(
                                        "text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full",
                                        today
                                            ? "bg-red-500 text-white shadow-lg shadow-red-300"
                                            : working
                                                ? "text-slate-600 bg-slate-100/50 group-hover:bg-red-100/50 group-hover:text-red-600 transition-colors"
                                                : "text-slate-400"
                                    )}>
                                        {day.getDate()}
                                    </span>

                                    {dailyApts.length > 0 && (
                                        <span className={cn(
                                            "text-[10px] font-bold px-1.5 rounded-full",
                                            working ? "text-slate-400 bg-slate-100" : "text-slate-400 bg-white/50"
                                        )}>
                                            {dailyApts.length}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[80px] no-scrollbar mt-1">
                                    {dailyApts.slice(0, 3).map(apt => (
                                        <div
                                            key={apt.id}
                                            className={cn(
                                                "text-[10px] truncate px-2 py-1.5 rounded-lg text-white font-bold shadow-sm transition-all",
                                                working ? "hover:brightness-110" : "opacity-70 grayscale-[0.5]"
                                            )}
                                            style={{
                                                background: apt.type === 'Avaliação'
                                                    ? "linear-gradient(135deg, rgba(239, 68, 68, 1) 0%, rgba(249, 115, 22, 1) 100%)"
                                                    : "linear-gradient(135deg, rgba(59, 130, 246, 1) 0%, rgba(124, 58, 237, 1) 100%)"
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                            }}
                                        >
                                            {apt.patient?.name || "Paciente"}
                                        </div>
                                    ))}
                                    {dailyApts.length > 3 && (
                                        <span className="text-[10px] text-center text-slate-500 font-bold bg-slate-100/80 rounded-md py-0.5">
                                            +{dailyApts.length - 3} mais
                                        </span>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    };

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
                        {(['day', 'week', 'month'] as const).map((v) => {
                            const label = v === 'day' ? 'Dia' : v === 'week' ? 'Semana' : 'Mês';
                            return (
                                <Button
                                    key={v}
                                    variant={view === v ? "secondary" : "ghost"}
                                    onClick={() => setView(v)}
                                    className={`h-8 text-xs rounded-lg ${view === v ? 'bg-white shadow-sm text-red-600 font-bold' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {label}
                                </Button>
                            )
                        })}
                    </div>
                    <Button
                        onClick={() => {
                            setSelectedSlot(undefined);
                            setEditingAppointment(undefined);
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/60" onClick={handlePrevious}>
                        <ChevronLeft className="h-4 w-4 text-slate-600" />
                    </Button>
                    <span className="text-sm font-bold text-slate-800 px-2 min-w-[160px] text-center capitalize">
                        {/* Dynamic Label depending on View */}
                        {view === 'day' && format(currentDate, "d 'de' MMMM, yyyy", { locale: ptBR })}
                        {view === 'week' && (
                            <>
                                {format(startOfWeek(currentDate), "d MMM", { locale: ptBR })} - {format(endOfWeek(currentDate), "d MMM", { locale: ptBR })}
                            </>
                        )}
                        {view === 'month' && format(currentDate, "MMMM yyyy", { locale: ptBR })}
                    </span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white/60" onClick={handleNext}>
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

                    <AgendaFilter
                        patients={patients}
                        activeFilters={activeFilters}
                        onFilterChange={setActiveFilters}
                    />

                    <Button
                        variant="outline"
                        className={`${glassButton} bg-slate-50 border-slate-200`}
                        onClick={() => setIsAvailabilityOpen(true)}
                    >
                        <Settings className="mr-2 h-3 w-3" /> Config
                    </Button>
                </div>
            </div>

            {/* Calendar Grid - View Switcher */}
            <div className={`flex-1 ${glassCard} rounded-3xl overflow-hidden flex flex-col relative z-20`}>

                {view === 'month' ? renderMonthView() : (
                    <>
                        {/* Header Row (Days) */}
                        <div className="flex border-b border-white/40 bg-white/30 backdrop-blur-xl sticky top-0 z-30">
                            <div className="w-16 border-r border-white/40 flex-shrink-0" />
                            {displayedDays.map((day) => {
                                const isCurrent = isToday(day.date);
                                return (
                                    <div
                                        key={day.date.toISOString()}
                                        className={cn(
                                            "flex-1 py-4 text-center border-r border-white/40 last:border-r-0 flex flex-col items-center gap-1 transition-colors",
                                            isCurrent ? "bg-red-50/50" : ""
                                        )}
                                    >
                                        <span className={cn(
                                            "text-[10px] uppercase font-bold tracking-widest",
                                            isCurrent ? "text-red-600" : "text-slate-400"
                                        )}>{day.name}</span>
                                        <div className={cn(
                                            "text-lg font-bold w-10 h-10 flex items-center justify-center rounded-2xl transition-all",
                                            isCurrent ? "bg-red-500 text-white shadow-lg shadow-red-200 scale-110" : "text-slate-700"
                                        )}>
                                            {day.dayNum}
                                        </div>
                                    </div>
                                )
                            })}
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
                                    {displayedDays.map((day) => {
                                        const available = isSlotAvailable(day.date, hour);
                                        return (
                                            <div
                                                key={day.date.toISOString()}
                                                onClick={() => handleSlotClick(day.date, hour)}
                                                className={cn(
                                                    "flex-1 border-r border-white/20 last:border-r-0 h-full relative cursor-pointer transition-all duration-300",
                                                    // Base state
                                                    "hover:backdrop-blur-none",

                                                    // Available State (Pink/Orange Theme)
                                                    available
                                                        ? "bg-gradient-to-br from-white/40 to-white/10 hover:from-orange-100/40 hover:to-rose-100/40"
                                                        : "bg-slate-100/90 cursor-not-allowed opacity-80 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')]",

                                                    // Today highlight
                                                    isToday(day.date) && available ? "ring-inset ring-1 ring-rose-200/50 bg-rose-50/20" : ""
                                                )}
                                            >
                                                {!available && (
                                                    <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-20 transition-opacity">
                                                        {/* Optional icon for blocked state on hover */}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            {/* DB Events */}
                            {filteredAppointments.map(apt => {
                                const { style, className } = getEventStyle(apt, displayedDays);
                                // Safety check: if style prevents display, don't render content
                                if (className?.includes('hidden') || style?.display === 'none') return null;

                                return (
                                    <div
                                        key={apt.id}
                                        className={className}
                                        style={{ ...style, position: 'absolute' }} // Force absolute
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingAppointment(apt);
                                            setIsDialogOpen(true);
                                        }}
                                    >
                                        <div className="font-bold truncate text-[11px] leading-tight">
                                            {apt.patient?.name || "Paciente"}
                                        </div>
                                        <div className="font-normal opacity-75 text-[9px] truncate leading-tight">
                                            {apt.type || "Consulta"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            <NewAppointmentDialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setEditingAppointment(undefined);
                }}
                patients={patients}
                initialDate={selectedSlot?.date}
                initialTime={selectedSlot?.time}
                initialPatientId={presetPatientId}
                initialType={presetType}
                appointmentToEdit={editingAppointment}
                onSave={loadData}
            />

            <ConfirmationAssistant
                open={isAssistantOpen}
                onOpenChange={setIsAssistantOpen}
                appointments={appointments}
            // appointments={filteredAppointments} // Should confirmation use filtered or all? All usually.
            />

            <AvailabilityDialog
                open={isAvailabilityOpen}
                onOpenChange={(open) => {
                    setIsAvailabilityOpen(open);
                    if (!open) loadData(); // Reload availability when closed
                }}
            />
        </div>
    );
}

export default function AgendaPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500">Carregando Agenda...</div>}>
            <AgendaContent />
        </Suspense>
    );
}


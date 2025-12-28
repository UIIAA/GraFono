"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Clock, Plus, Trash2 } from "lucide-react";
import { getAvailabilityConfig, saveAvailabilityConfig, AvailabilityData, DaySlots, TimeSlot } from "@/app/actions/settings";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AvailabilityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const DEFAULT_DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const DAY_LABELS: Record<string, string> = {
    "SUN": "Domingo",
    "MON": "Segunda-feira",
    "TUE": "Terça-feira",
    "WED": "Quarta-feira",
    "THU": "Quinta-feira",
    "FRI": "Sexta-feira",
    "SAT": "Sábado"
};

export function AvailabilityDialog({ open, onOpenChange }: AvailabilityDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [configId, setConfigId] = useState<string | null>(null);

    // Main State
    const [schedule, setSchedule] = useState<DaySlots[]>([]);
    const [sessionDuration, setSessionDuration] = useState(30);

    // Load initial data
    useEffect(() => {
        if (open) {
            getAvailabilityConfig().then(data => {
                if (data) {
                    setConfigId(data.id);
                    setSessionDuration(data.sessionDuration);

                    // Initialize schedule from saved data or defaults
                    if (data.timeSlots && data.timeSlots.length > 0) {
                        // Merge with default days to ensure all days exist
                        const merged = DEFAULT_DAYS.map(day => {
                            const existing = data.timeSlots?.find(d => d.day === day);
                            return existing || { day, active: false, slots: [] };
                        });
                        setSchedule(merged);
                    } else {
                        // Fallback migration: Convert old workingDays/Hours to new slots
                        const legacyDays = data.workingDays || [];
                        const converted = DEFAULT_DAYS.map(day => {
                            const isActive = legacyDays.includes(day);
                            let slots: TimeSlot[] = [];

                            if (isActive) {
                                // Morning slot
                                if (data.lunchStart) {
                                    slots.push({ start: data.startHour, end: data.lunchStart });
                                    if (data.lunchEnd) {
                                        slots.push({ start: data.lunchEnd, end: data.endHour });
                                    }
                                } else {
                                    slots.push({ start: data.startHour, end: data.endHour });
                                }
                            }

                            return { day, active: isActive, slots };
                        });
                        setSchedule(converted);
                    }
                } else {
                    // Default Empty State
                    setSchedule(DEFAULT_DAYS.map(day => ({ day, active: false, slots: [] })));
                }
            });
        }
    }, [open]);

    const handleToggleDay = (dayIndex: number) => {
        setSchedule(prev => {
            const next = [...prev];
            const current = next[dayIndex];

            if (!current.active) {
                // Enabling: Add default 08-18 slot if empty
                next[dayIndex] = {
                    ...current,
                    active: true,
                    slots: current.slots.length === 0 ? [{ start: "08:00", end: "18:00" }] : current.slots
                };
            } else {
                // Disabling
                next[dayIndex] = { ...current, active: false };
            }
            return next;
        });
    };

    const handleAddSlot = (dayIndex: number) => {
        setSchedule(prev => {
            const next = [...prev];
            next[dayIndex].slots.push({ start: "08:00", end: "12:00" });
            return next;
        });
    };

    const handleRemoveSlot = (dayIndex: number, slotIndex: number) => {
        setSchedule(prev => {
            const next = [...prev];
            next[dayIndex].slots.splice(slotIndex, 1);
            return next;
        });
    };

    const handleUpdateSlot = (dayIndex: number, slotIndex: number, field: 'start' | 'end', value: string) => {
        setSchedule(prev => {
            const next = [...prev];
            next[dayIndex].slots[slotIndex] = {
                ...next[dayIndex].slots[slotIndex],
                [field]: value
            };
            return next;
        });
    };

    const handleSave = async () => {
        setLoading(true);

        // Prepare payload (clean up legacy fields to satisfy type but they won't be used)
        const payload: AvailabilityData = {
            workingDays: [], // Deprecated
            startHour: "00:00", // Deprecated
            endHour: "00:00", // Deprecated
            sessionDuration,
            timeSlots: schedule
        };

        const res = await saveAvailabilityConfig(payload);
        setLoading(false);

        if (res.success) {
            toast({ title: "Configuração Salva", description: "Disponibilidade atualizada com sucesso." });
            onOpenChange(false);
        } else {
            toast({ title: "Erro", description: "Falha ao salvar configuração.", variant: "destructive" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0 bg-white shadow-2xl">
                <div className="p-6 pb-4 border-b">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl text-slate-800">
                            <Clock className="w-6 h-6 text-red-500" />
                            Configurar Disponibilidade
                        </DialogTitle>
                        <DialogDescription>
                            Defina os intervalos de atendimento para cada dia da semana.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-hidden bg-slate-50">
                    <ScrollArea className="h-full p-6">
                        <div className="space-y-6">

                            {/* Global Settings */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                                <Label className="text-sm font-bold text-slate-700">Duração da Sessão (minutos)</Label>
                                <Input
                                    type="number"
                                    className="w-24 text-center font-bold"
                                    step="5"
                                    value={sessionDuration}
                                    onChange={(e) => setSessionDuration(Number(e.target.value))}
                                />
                            </div>

                            <Separator />

                            {/* Days Schedule */}
                            <div className="space-y-4">
                                {schedule.map((dayData, dayIndex) => (
                                    <div
                                        key={dayData.day}
                                        className={cn(
                                            "bg-white rounded-xl border transition-all duration-300 overflow-hidden",
                                            dayData.active
                                                ? "border-red-200 shadow-sm"
                                                : "border-slate-200 opacity-70"
                                        )}
                                    >
                                        <div className="flex items-center justify-between p-4 bg-slate-50/50">
                                            <div className="flex items-center gap-3">
                                                <Switch
                                                    checked={dayData.active}
                                                    onCheckedChange={() => handleToggleDay(dayIndex)}
                                                    className="data-[state=checked]:bg-red-500"
                                                />
                                                <span className={cn("font-bold text-sm uppercase", dayData.active ? "text-slate-800" : "text-slate-400")}>
                                                    {DAY_LABELS[dayData.day]}
                                                </span>
                                            </div>
                                            {dayData.active && (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleAddSlot(dayIndex)}
                                                    className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Plus className="w-3 h-3 mr-1" /> Adicionar Horário
                                                </Button>
                                            )}
                                        </div>

                                        {dayData.active && (
                                            <div className="p-4 pt-2 space-y-3">
                                                {dayData.slots.length === 0 ? (
                                                    <p className="text-xs text-red-400 italic text-center py-2">Nenhum horário definido. O dia ficará indisponível.</p>
                                                ) : (
                                                    dayData.slots.map((slot, slotIndex) => (
                                                        <div key={slotIndex} className="flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
                                                            <div className="flex-1 grid grid-cols-2 gap-2">
                                                                <div className="relative">
                                                                    <Input
                                                                        type="time"
                                                                        value={slot.start}
                                                                        onChange={(e) => handleUpdateSlot(dayIndex, slotIndex, 'start', e.target.value)}
                                                                        className="h-9 text-center font-medium"
                                                                    />
                                                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">Início</span>
                                                                </div>
                                                                <div className="relative">
                                                                    <Input
                                                                        type="time"
                                                                        value={slot.end}
                                                                        onChange={(e) => handleUpdateSlot(dayIndex, slotIndex, 'end', e.target.value)}
                                                                        className="h-9 text-center font-medium"
                                                                    />
                                                                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-xs text-slate-400 pointer-events-none">Fim</span>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleRemoveSlot(dayIndex, slotIndex)}
                                                                className="h-9 w-9 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                        </div>
                    </ScrollArea>
                </div>

                <div className="p-4 border-t bg-white flex justify-end gap-3 z-10">
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-200"
                    >
                        {loading ? "Salvando..." : "Salvar Configuração"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

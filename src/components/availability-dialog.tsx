"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Clock } from "lucide-react";
import { getAvailabilityConfig, saveAvailabilityConfig, AvailabilityData } from "@/app/actions/settings";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface AvailabilityDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AvailabilityDialog({ open, onOpenChange }: AvailabilityDialogProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Initial State defaults
    const [formData, setFormData] = useState<AvailabilityData>({
        workingDays: ["MON", "TUE", "WED", "THU", "FRI"],
        startHour: "08:00",
        endHour: "18:00",
        lunchStart: "12:00",
        lunchEnd: "13:00",
        sessionDuration: 45
    });

    useEffect(() => {
        if (open) {
            getAvailabilityConfig().then(data => {
                if (data) {
                    setFormData({
                        workingDays: data.workingDays,
                        startHour: data.startHour,
                        endHour: data.endHour,
                        lunchStart: data.lunchStart || "",
                        lunchEnd: data.lunchEnd || "",
                        sessionDuration: data.sessionDuration
                    });
                }
            });
        }
    }, [open]);

    const handleDayToggle = (day: string) => {
        setFormData(prev => {
            if (prev.workingDays.includes(day)) {
                return { ...prev, workingDays: prev.workingDays.filter(d => d !== day) };
            } else {
                return { ...prev, workingDays: [...prev.workingDays, day] };
            }
        });
    };

    const handleSave = async () => {
        setLoading(true);
        const res = await saveAvailabilityConfig(formData);
        setLoading(false);

        if (res.success) {
            toast({ title: "Configuração Salva", description: "Capacidade de agenda atualizada." });
            onOpenChange(false);
        } else {
            toast({ title: "Erro", description: "Falha ao salvar configuração.", variant: "destructive" });
        }
    };

    const days = [
        { id: "MON", label: "Seg" },
        { id: "TUE", label: "Ter" },
        { id: "WED", label: "Qua" },
        { id: "THU", label: "Qui" },
        { id: "FRI", label: "Sex" },
        { id: "SAT", label: "Sáb" }
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-white border border-slate-100 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Clock className="w-5 h-5 text-indigo-500" />
                        Configurar Disponibilidade
                    </DialogTitle>
                    <DialogDescription>
                        Defina seus horários para cálculo de ocupação.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">

                    {/* Days */}
                    <div className="space-y-3">
                        <Label className="text-xs uppercase text-slate-500 font-bold">Dias de Atendimento</Label>
                        <div className="flex gap-2 justify-between">
                            {days.map(day => (
                                <div key={day.id} className="flex flex-col items-center gap-2">
                                    <Checkbox
                                        id={day.id}
                                        checked={formData.workingDays.includes(day.id)}
                                        onCheckedChange={() => handleDayToggle(day.id)}
                                        className="rounded-full w-5 h-5 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                    />
                                    <Label htmlFor={day.id} className="text-xs font-medium cursor-pointer">{day.label}</Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Hours */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-slate-500 font-bold">Início</Label>
                            <Input
                                type="time"
                                value={formData.startHour}
                                onChange={e => setFormData({ ...formData, startHour: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-slate-500 font-bold">Término</Label>
                            <Input
                                type="time"
                                value={formData.endHour}
                                onChange={e => setFormData({ ...formData, endHour: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Lunch */}
                    <div className="space-y-2">
                        <Label className="text-xs uppercase text-slate-500 font-bold">Intervalo de Almoço (Opcional)</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="time"
                                value={formData.lunchStart}
                                onChange={e => setFormData({ ...formData, lunchStart: e.target.value })}
                                placeholder="--:--"
                            />
                            <Input
                                type="time"
                                value={formData.lunchEnd}
                                onChange={e => setFormData({ ...formData, lunchEnd: e.target.value })}
                                placeholder="--:--"
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Duration */}
                    <div className="space-y-2">
                        <Label className="text-xs uppercase text-slate-500 font-bold flex justify-between">
                            Duração da Sessão
                            <span className="text-slate-400 font-normal">Minutos</span>
                        </Label>
                        <Input
                            type="number"
                            step="5"
                            value={formData.sessionDuration || ""}
                            onChange={e => {
                                const val = parseInt(e.target.value);
                                setFormData({
                                    ...formData,
                                    sessionDuration: isNaN(val) ? 0 : val
                                });
                            }}
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-indigo-600 hover:bg-indigo-700">
                        {loading ? "Salvando..." : "Salvar Configuração"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

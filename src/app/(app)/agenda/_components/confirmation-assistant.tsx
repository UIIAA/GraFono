"use client";

import { useState, useMemo } from "react";
import { format, addDays, isSameDay, isAfter, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MessageCircle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ConfirmationAssistantProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointments: {
        id: string;
        date: Date | string;
        time: string | null;
        status: string;
        type: string;
        patient: {
            name: string;
            phone: string | null;
        } | null;
    }[];
}

export function ConfirmationAssistant({ open, onOpenChange, appointments }: ConfirmationAssistantProps) {
    // Filter for upcoming 3 days, status "Agendado"
    const nextAppointments = useMemo(() => {
        const today = startOfDay(new Date());
        const limit = addDays(today, 3);

        return appointments
            .filter(apt => {
                const aptDate = new Date(apt.date);
                return (
                    (isSameDay(aptDate, today) || isAfter(aptDate, today)) &&
                    !isAfter(aptDate, limit) &&
                    apt.status === "Agendado"
                );
            })
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [appointments]);

    const handleWhatsApp = (apt: ConfirmationAssistantProps["appointments"][0]) => {
        const phone = apt.patient?.phone;
        if (!phone) return;

        const dateStr = format(new Date(apt.date), "dd/MM", { locale: ptBR });
        const timeStr = apt.time;
        const firstName = apt.patient?.name?.split(' ')[0] || "Paciente";

        const message = `Olá ${firstName}, tudo bem? Passando para confirmar sua sessão de ${apt.type} amanhã (${dateStr}) às ${timeStr}. Podemos confirmar?`;

        const url = `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="bg-white/95 backdrop-blur-xl border-l border-white/20 sm:max-w-[400px]">
                <SheetHeader className="mb-6">
                    <SheetTitle className="text-slate-800 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        Assistente de Confirmação
                    </SheetTitle>
                    <SheetDescription>
                        Confirme os agendamentos dos próximos 3 dias para evitar faltas (No-Show).
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-4">
                    {nextAppointments.length === 0 && (
                        <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
                            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-400" />
                            <p>Tudo certo! Nenhuma confirmação pendente.</p>
                        </div>
                    )}

                    {nextAppointments.map((apt) => (
                        <div
                            key={apt.id}
                            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold text-slate-800">{apt.patient?.name}</h4>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                        <Clock className="h-3 w-3" />
                                        <span className="capitalize">
                                            {format(new Date(apt.date), "EEEE, dd/MM", { locale: ptBR })} • {apt.time}
                                        </span>
                                    </div>
                                </div>
                                <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 uppercase text-[10px]">
                                    {apt.type}
                                </Badge>
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Button
                                    size="sm"
                                    className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-green-200 shadow-lg"
                                    onClick={() => handleWhatsApp(apt)}
                                    disabled={!apt.patient?.phone}
                                >
                                    <MessageCircle className="h-4 w-4 mr-2" />
                                    {apt.patient?.phone ? "Enviar Zap" : "Sem Telefone"}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    );
}

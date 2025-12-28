"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Phone, MessageCircle, FileText, CheckCircle, MoreHorizontal, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";

interface PatientMobileCardProps {
    patient: any;
    onEdit: (id: string) => void;
    onHistory: (id: string) => void;
}

export function PatientMobileCard({ patient, onEdit, onHistory }: PatientMobileCardProps) {
    const isParticular = patient.financialSource !== "CONVENIO";
    const statusColor = isParticular ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-sky-600 bg-sky-50 border-sky-100";
    const badgeColor = isParticular ? "bg-emerald-500 hover:bg-emerald-600" : "bg-sky-500 hover:bg-sky-600";

    const getWhatsAppLink = (phone: string, name: string) => {
        const message = `Olá ${name}, tudo bem?`;
        return `https://wa.me/55${phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    };

    const isReevaluationOverdue = patient.nextReevaluation && new Date(patient.nextReevaluation) < new Date();

    return (
        <div className={cn(
            "rounded-2xl border p-4 shadow-sm bg-white mb-4 relative transition-all",
            statusColor,
            isReevaluationOverdue && "border-l-4 border-l-red-500 bg-red-50/10"
        )}>
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className={cn("font-bold text-lg flex items-center gap-2", isParticular ? "text-emerald-900" : "text-sky-900")}>
                        {patient.name}
                        {isReevaluationOverdue && (
                            <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />
                        )}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={cn("text-white border-0", badgeColor)}>
                            {isParticular ? "Particular" : "Convênio"}
                        </Badge>
                        <span className="text-xs text-slate-500 font-medium">{patient.status}</span>
                    </div>
                </div>

                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-slate-400 hover:bg-slate-100">
                            <MoreHorizontal className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="bottom" className="rounded-t-[2rem]">
                        <SheetHeader className="text-left mb-6">
                            <SheetTitle>{patient.name}</SheetTitle>
                            <SheetDescription>Ações rápidas do paciente.</SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-3 pb-8">
                            <Button
                                variant="outline"
                                className="h-14 justify-start gap-4 text-base font-medium rounded-xl border-slate-200"
                                onClick={() => onEdit(patient.id)}
                            >
                                <FileText className="h-5 w-5 text-slate-500" />
                                Editar Cadastro
                            </Button>
                            <Link href={`/pacientes/${patient.id}/evolucao`} className="w-full">
                                <Button
                                    variant="outline"
                                    className="h-14 w-full justify-start gap-4 text-base font-medium rounded-xl border-slate-200"
                                >
                                    <FileText className="h-5 w-5 text-slate-500" />
                                    Registrar Evolução
                                </Button>
                            </Link>
                            <Button
                                className="h-14 justify-start gap-4 text-base font-medium rounded-xl bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => window.open(getWhatsAppLink(patient.phone, patient.name), '_blank')}
                            >
                                <MessageCircle className="h-5 w-5" />
                                Enviar WhatsApp
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {patient.phone ? (
                    <a href={`tel:${patient.phone}`} className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/60 border border-slate-100 text-slate-600 text-sm font-medium hover:bg-white active:scale-95 transition-all">
                        <Phone className="h-4 w-4 text-slate-400" />
                        Ligar
                    </a>
                ) : (
                    <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-sm">
                        <Phone className="h-4 w-4 opacity-50" />
                        Sem nº
                    </div>
                )}

                {patient.phone ? (
                    <a
                        href={getWhatsAppLink(patient.phone, patient.name)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 p-2 rounded-xl bg-white/60 border border-slate-100 text-slate-600 text-sm font-medium hover:bg-white active:scale-95 transition-all"
                    >
                        <MessageCircle className="h-4 w-4 text-green-500" />
                        WhatsApp
                    </a>
                ) : (
                    <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 text-sm">
                        <MessageCircle className="h-4 w-4 opacity-50" />
                        Sem Zap
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100/50 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Última: {patient.lastReevaluation ? format(new Date(patient.lastReevaluation), "bd MMM", { locale: ptBR }) : '-'}
                </span>
                <span className="font-medium text-slate-400">
                    ID: {patient.id.slice(-4)}
                </span>
            </div>
        </div>
    );
}

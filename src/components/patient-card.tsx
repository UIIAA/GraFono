"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// import { type Patient } from "@prisma/client";
import {
    MoreHorizontal,
    Calendar,
    Clock,
    TrendingUp,
    FileText,
    Pencil,
    MessageCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface PatientProps {
    id: string;
    name: string;
    status: string;
    phone?: string;
    financialSource?: string;
    nextReevaluation?: Date | string;
    imageUrl?: string | null;
    progress?: {
        completedSessions: number;
        cycleStart?: Date | string;
    };
    appointments?: { date: Date | string }[];
}

interface PatientCardProps {
    patient: PatientProps;
    onEdit?: (patient: any) => void;
    onHistory?: (patient: any) => void;
}

export function PatientCard({ patient, onEdit, onHistory }: PatientCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: patient?.id || "temp-id",
        data: {
            type: "Patient",
            patient,
        },
        disabled: !patient,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (!patient) return null;


    // Calculate progress percentage (Mock target: 12 sessions)
    const targetSessions = 12;
    const completed = patient.progress?.completedSessions || 0;
    const progressPercent = Math.min((completed / targetSessions) * 100, 100);

    // Get initials
    const initials = patient.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    // Format next appointment
    const nextAppointment = patient.appointments?.find(
        (a) => new Date(a.date) > new Date()
    );

    // Reevaluation Red Flag Logic
    const isReevaluationOverdue = patient.nextReevaluation && new Date(patient.nextReevaluation) < new Date();

    // WhatsApp Click
    const handleWhatsApp = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!patient.phone) return;
        const msg = `Olá, confirmamos a sessão do(a) ${patient.name}...`;
        const url = `https://wa.me/${patient.phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    // Badge Colors
    const isParticular = patient.financialSource === 'PARTICULAR';
    const badgeStyle = isParticular
        ? "bg-emerald-50 text-emerald-700 border-emerald-100" // Green
        : "bg-blue-50 text-blue-700 border-blue-100"; // Blue (Convênio)

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-primary/5 rounded-xl border-2 border-primary/20 h-[200px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group relative overflow-hidden transition-all duration-300",
                "bg-white/80 backdrop-blur-xl border border-white/60", // Glass base
                "rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1", // Lift effect
                isDragging && "ring-2 ring-indigo-500 rotate-2 shadow-2xl opacity-90 scale-105 z-50",
                isReevaluationOverdue && "border-l-4 border-l-red-500" // Red Flag
            )}
        >
            {/* Hover Glow Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            {/* Card Header */}
            <div className="p-4 flex flex-row items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm group-hover:border-indigo-100 transition-all">
                            <AvatarImage src={patient.imageUrl || ""} />
                            <AvatarFallback className="bg-gradient-to-br from-indigo-50 to-purple-50 text-indigo-600 font-bold text-xs">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        {isReevaluationOverdue && (
                            <div className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-sm" title="Reavaliação Pendente" />
                        )}
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="font-bold text-sm text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors">
                            {patient.name}
                        </h4>
                        <div className="flex flex-wrap gap-1">
                            <Badge variant="secondary" className={cn("text-[8px] px-1.5 h-4 border-transparent shadow-none", badgeStyle)}>
                                {isParticular ? 'PART' : 'CONV'}
                            </Badge>
                            <Badge variant="secondary" className="text-[8px] px-1.5 h-4 bg-slate-100 text-slate-500 border-transparent shadow-none">
                                {patient.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-slate-400 hover:text-indigo-600 hover:bg-white/60 rounded-full"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit?.(patient)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        {patient.phone && (
                            <DropdownMenuItem onClick={handleWhatsApp}>
                                <MessageCircle className="mr-2 h-4 w-4 text-emerald-600" />
                                WhatsApp
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => onHistory?.(patient)}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Histórico
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Card Content */}
            <div className="px-4 pb-4 space-y-3 relative z-10">

                {/* Clinical Tags (Mock) */}
                <div className="flex gap-1 flex-wrap">
                    {['Fono', 'Voz'].map(tag => (
                        <span key={tag} className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded-md border border-slate-100 uppercase tracking-wider">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Next Appointment / Info */}
                <div className="flex justify-between items-center text-xs text-slate-500 bg-white/50 p-2 rounded-lg border border-white/60 shadow-sm">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-indigo-400" />
                        {nextAppointment ? (
                            <span className="font-medium text-slate-700">
                                {new Date(nextAppointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                            </span>
                        ) : (
                            <span>Sem agendamento</span>
                        )}
                    </div>
                </div>

                {/* Micro-Progress Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-medium text-slate-400">
                        <span>Evolução</span>
                        <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-500 ease-out rounded-full", isReevaluationOverdue ? "bg-red-400" : "bg-gradient-to-r from-indigo-400 to-purple-400")}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper to make the Progress component customize indicator color if needed
// Standard Shadcn Progress uses standard variants, so we adding custom classes via indicatorClassName if strictly needed, 
// for now `indicatorClassName="bg-primary"` is a hypothetical prop or we rely on global styles.
// Actually standard shadcn Progress component usually doesn't expose indicatorClassName directly in props unless modified.
// I will check standard Shadcn Progress or just style the root.
// If Progress doesn't support indicatorClassName, I'll rely on the fact that `ProgressPrimitive.Indicator` usually takes `bg-primary` by default from the component definition.

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
    Pencil
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
    // In a real app, target should be dynamic based on reevaluationInterval
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
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn(
                "group relative overflow-hidden transition-all duration-200 hover:shadow-md border-primary/10",
                "bg-white/80 backdrop-blur-sm", // Glass effect
                isDragging && "ring-2 ring-primary rotate-2 shadow-xl opacity-90"
            )}
        >
            <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={patient.imageUrl || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="font-semibold text-sm line-clamp-1 text-gray-900 leading-none">
                            {patient.name}
                        </h4>
                        <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-primary/5 text-primary-dark border-primary/10 hover:bg-primary/10">
                            {patient.status}
                        </Badge>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 -mr-2 text-gray-400 hover:text-primary hover:bg-primary/5"
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
                        <DropdownMenuItem onClick={() => onHistory?.(patient)}>
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Histórico
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            Arquivar
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
                {/* Treatment Progress */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase font-medium tracking-wider">
                        <span>Progresso do Tratamento</span>
                        <span>{completed} / {targetSessions}</span>
                    </div>
                    <Progress value={progressPercent} className="h-1.5 bg-primary/10" indicatorClassName="bg-primary" />
                </div>

                {/* Next Appointment / Info */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground bg-gray-50/50 p-2 rounded-lg border border-gray-100/50">
                    <Calendar className="h-3.5 w-3.5 text-primary/70" />
                    {nextAppointment ? (
                        <span>
                            {new Date(nextAppointment.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                    ) : (
                        <span>Sem agendamento</span>
                    )}
                </div>
            </CardContent>
            {/* Hover actions extension could go here */}
        </Card>
    );
}

// Helper to make the Progress component customize indicator color if needed
// Standard Shadcn Progress uses standard variants, so we adding custom classes via indicatorClassName if strictly needed, 
// for now `indicatorClassName="bg-primary"` is a hypothetical prop or we rely on global styles.
// Actually standard shadcn Progress component usually doesn't expose indicatorClassName directly in props unless modified.
// I will check standard Shadcn Progress or just style the root.
// If Progress doesn't support indicatorClassName, I'll rely on the fact that `ProgressPrimitive.Indicator` usually takes `bg-primary` by default from the component definition.

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User, History as HistoryIcon, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task } from "../types";

interface TaskCardProps {
    task: Task;
    patientName: string;
    className?: string;
    onEdit?: (task: Task) => void;
    onHistory?: (task: Task) => void;
}

export function TaskCard({ task, patientName, className, onEdit, onHistory }: TaskCardProps) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={cn(
                    "opacity-30 bg-indigo-50 border-2 border-indigo-500 rounded-xl h-[120px] shadow-inner",
                    className
                )}
            />
        );
    }

    const isReevaluationDue = task.nextReevaluation && new Date(task.nextReevaluation) <= new Date();

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("touch-none", className)}
        >
            <Card className={cn(
                "mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm rounded-xl group hover:-translate-y-1 relative overflow-hidden",
                isReevaluationDue ? "border-red-400 shadow-sm" : "border-white/60"
            )}>
                {isReevaluationDue && (
                    <div className="absolute top-0 right-0 p-1.5 bg-red-100 rounded-bl-xl z-20" title={`Reavaliação Pendente! (Venc: ${new Date(task.nextReevaluation!).toLocaleDateString()})`}>
                        <AlertCircle className="w-4 h-4 text-red-600 animate-pulse" />
                    </div>
                )}

                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-indigo-100 shadow-sm">
                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-medium text-xs">
                                    {patientName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className={cn(
                                    "font-semibold text-sm leading-tight transition-colors",
                                    task.financialSource === 'CONVENIO'
                                        ? "text-blue-700 group-hover:text-blue-800"
                                        : "text-emerald-700 group-hover:text-emerald-800"
                                )}>
                                    {patientName}
                                </p>
                                <div className="flex gap-2 items-center mt-1">
                                    <Badge variant="outline" className={cn(
                                        "text-[10px] px-1.5 py-0 h-4 border-0 font-bold",
                                        task.financialSource === 'CONVENIO'
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-emerald-100 text-emerald-700 px-2"
                                    )}>
                                        {task.financialSource === 'CONVENIO' ? 'Convênio' : 'Particular'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                        {task.tags.map((tag) => (
                            <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-100 text-[10px] px-2 py-0.5 h-5 rounded-md"
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className="pt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div
                            role="button"
                            className="bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-md cursor-pointer pointer-events-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(task);
                            }}
                            title="Editar Dados"
                        >
                            <User className="w-4 h-4" />
                        </div>
                        <div
                            role="button"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-1.5 rounded-md cursor-pointer pointer-events-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                onHistory?.(task);
                            }}
                            title="Histórico / Pontos Relevantes"
                        >
                            <HistoryIcon className="w-4 h-4" />
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

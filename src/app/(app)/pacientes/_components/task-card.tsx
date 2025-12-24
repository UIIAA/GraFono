"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Task } from "../types";
import { User } from "lucide-react";

interface TaskCardProps {
    task: Task;
    patientName: string;
    className?: string;
}

export function TaskCard({ task, patientName, className }: TaskCardProps) {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={cn("touch-none", className)}
        >
            <Card className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-200 border-white/60 bg-white/70 backdrop-blur-sm rounded-xl group hover:-translate-y-1">
                <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 border border-indigo-100 shadow-sm">
                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-medium text-xs">
                                    {patientName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-slate-800 text-sm leading-tight group-hover:text-indigo-700 transition-colors">
                                    {patientName}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">
                                    Particular
                                </p>
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
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { Column, Task } from "../types";
import { TaskCard } from "./task-card";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BoardColumnProps {
    column: Column;
    tasks: Task[];
    className?: string;
    onEdit?: (task: Task) => void;
    onHistory?: (task: Task) => void;
}

export function BoardColumn({ column, tasks, className, onEdit, onHistory }: BoardColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const taskIds = tasks.map((t) => t.id);

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "flex flex-col bg-white/30 backdrop-blur-sm rounded-2xl w-[300px] min-w-[300px] h-full border border-white/40 shadow-sm",
                className
            )}
        >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-indigo-50/50">
                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-700">{column.title}</h3>
                    <span className="bg-white/60 px-2 py-0.5 rounded-full text-xs font-semibold text-slate-500 shadow-sm border border-white/50">
                        {tasks.length}
                    </span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-white/50 rounded-lg">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>

            {/* Content (Droppable Area) */}
            <div className="flex-1 p-3 overflow-y-auto no-scrollbar space-y-3">
                <SortableContext items={taskIds}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            patientName={task.content}
                            onEdit={onEdit}
                            onHistory={onHistory}
                        />
                    ))}
                </SortableContext>

                {/* Add button placeholder */}
                <Button variant="ghost" className="w-full justify-start text-indigo-500/70 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl h-10 border border-transparent hover:border-indigo-100 border-dashed">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar card
                </Button>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
    pointerWithin,
} from "@dnd-kit/core";
import {
    sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    GripVertical,
    MessageSquare,
    User
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { BoardColumn } from "./_components/board-column";
import { TaskCard } from "./_components/task-card";
import { PatientDialog } from "./_components/patient-dialog";
import { Column, Task, Patient } from "./types";

const defaultCols: Column[] = [
    {
        id: "aguardando",
        title: "Aguardando",
    },
    {
        id: "em_avaliacao",
        title: "Em avaliação",
    },
    {
        id: "em_andamento",
        title: "Em tratamento",
    },
    {
        id: "alta",
        title: "Alta / Finalizado",
    },
];

const initialTasks: Task[] = [
    {
        id: "1",
        columnId: "em_andamento",
        content: "João Silva",
        patientId: "p1",
        tags: ["Fono", "Terapia"],
    },
    {
        id: "2",
        columnId: "em_avaliacao",
        content: "Maria Santos",
        patientId: "p2",
        tags: ["Avaliação"],
    },
    {
        id: "3",
        columnId: "alta",
        content: "Pedro Souza",
        patientId: "p3",
        tags: ["Alta"],
    },
    {
        id: "4",
        columnId: "em_andamento",
        content: "Ana Oliveira",
        patientId: "p4",
        tags: ["Fono"],
    },
];

const initialPatients: Patient[] = [
    { id: "p1", name: "João Silva", email: "joao@email.com", phone: "11999999999", status: "Em tratamento", history: [] },
    { id: "p2", name: "Maria Santos", email: "maria@email.com", phone: "11888888888", status: "Aguardando", history: [] },
    { id: "p3", name: "Pedro Souza", email: "pedro@email.com", phone: "11777777777", status: "Alta", history: [] },
    { id: "p4", name: "Ana Oliveira", email: "ana@email.com", phone: "11666666666", status: "Em tratamento", history: [] },
];

export default function PacientesPage() {
    // State
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [patients, setPatients] = useState<Patient[]>(initialPatients);

    // Dnd State
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);

    // Sensors
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Handlers
    function handleSavePatient(patientData: Partial<Patient>) {
        if (editingPatient) {
            setPatients((prev) =>
                prev.map((p) => (p.id === editingPatient.id ? { ...p, ...patientData } : p))
            );
            const taskIndex = tasks.findIndex((t) => t.patientId === editingPatient.id);
            if (taskIndex !== -1) {
                const updatedTasks = [...tasks];
                updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], content: patientData.name || "" };
                setTasks(updatedTasks);
            }
        } else {
            const newId = `p${Date.now()}`;
            const newPatient: Patient = {
                id: newId,
                name: patientData.name || "Novo Paciente",
                email: patientData.email || "",
                phone: patientData.phone || "",
                status: "Aguardando",
                history: [],
                ...patientData
            };
            setPatients((prev) => [...prev, newPatient]);
            const newTask: Task = {
                id: `t${Date.now()}`,
                columnId: "aguardando",
                content: newPatient.name,
                patientId: newId,
                tags: ["Novo"],
            };
            setTasks((prev) => [...prev, newTask]);
        }
        setIsDialogOpen(false);
        setEditingPatient(undefined);
    }

    function handleEditPatient(patientId: string) {
        const patient = patients.find((p) => p.id === patientId);
        if (patient) {
            setEditingPatient(patient);
            setIsDialogOpen(true);
        }
    }

    // Dnd Handlers
    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveAColumn = active.data.current?.type === "Column";
        if (!isActiveAColumn) return;

        console.log("DRAG END COLUMN");

        setColumns((columns) => {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
            const overColumnIndex = columns.findIndex((col) => col.id === overId);

            const newColumns = [...columns];
            // Simple array move logic
            const [removed] = newColumns.splice(activeColumnIndex, 1);
            newColumns.splice(overColumnIndex, 0, removed);
            return newColumns;
        });
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column"; // This handles dropping on empty columns

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex].columnId = tasks[overIndex].columnId;
                    // Simple array move without importing arrayMove
                    const [removed] = newTasks.splice(activeIndex, 1);
                    newTasks.splice(overIndex, 0, removed);
                    return newTasks;
                }

                const newTasks = [...tasks];
                // Simple array move
                const [removed] = newTasks.splice(activeIndex, 1);
                newTasks.splice(overIndex, 0, removed);
                return newTasks;
            });
        }

        // Im dropping a Task over a Column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                if (tasks[activeIndex].columnId !== overId) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex].columnId = String(overId);
                    return newTasks;
                }
                return tasks;
            });
        }
    }

    // Styles for Glass Effect - UPDATED RED
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassInput = "bg-white/50 border-red-100 focus:bg-white/80 transition-all";

    return (
        <div
            className="min-h-screen p-8 flex flex-col relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor - Red/Orange */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-400/10 to-red-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className={`flex justify-between items-center mb-8 p-6 rounded-3xl ${glassCard} relative z-10`}>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
                        <p className="text-slate-500 font-medium">Gestão Visual de Tratamentos</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400 group-focus-within:text-red-600 transition-colors" />
                        <Input
                            placeholder="Buscar paciente..."
                            className={`pl-10 w-64 rounded-xl ${glassInput}`}
                        />
                    </div>
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-105"
                        onClick={() => {
                            setEditingPatient(undefined);
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Paciente
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl">
                            <PatientDialog
                                patient={editingPatient}
                                onSave={handleSavePatient}
                                open={isDialogOpen}
                            />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden relative z-10">
                <DndContext
                    sensors={sensors}
                    collisionDetection={pointerWithin} // Using pointerWithin for better column detection
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDragEnd={onDragEnd}
                    id="kanban-dnd-context"
                >
                    <div className="flex gap-6 h-full min-w-full pb-4">
                        {columns.map((col) => (
                            <BoardColumn
                                key={col.id}
                                column={col}
                                tasks={tasks.filter((task) => task.columnId === col.id)}
                            />
                        ))}
                    </div>

                    {typeof window !== "undefined" && (
                        <DragOverlay
                            dropAnimation={{
                                sideEffects: defaultDropAnimationSideEffects({
                                    styles: {
                                        active: {
                                            opacity: "0.5",
                                        },
                                    },
                                }),
                            }}
                        >
                            {activeTask && (
                                <TaskCard
                                    task={activeTask}
                                    patientName={activeTask.content}
                                    className="rotate-2 scale-105 shadow-2xl ring-2 ring-red-500 ring-offset-2"
                                />
                            )}
                        </DragOverlay>
                    )}
                </DndContext>
            </div>
        </div>
    );
}

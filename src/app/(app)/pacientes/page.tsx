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
import { getPatients, savePatient, updatePatientStatus } from "@/app/actions/patient";
// Ensure types are consistent or imported

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
import { PatientMobileCard } from "./_components/patient-mobile-card";
import { PatientDialog } from "./_components/patient-dialog";
import { HistoryDialog } from "./_components/history-dialog";
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



import { useSearchParams } from "next/navigation";

export default function PacientesPage() {
    const searchParams = useSearchParams();
    const shouldOpenNew = searchParams.get("new") === "true";

    // State
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);

    useEffect(() => {
        async function loadPatients() {
            try {
                const result = await getPatients();
                if (result.success && result.data) {
                    const dbPatients = result.data.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        email: p.email || "",
                        phone: p.phone || "",
                        status: p.status,
                        history: [],
                        negotiatedValue: p.negotiatedValue || 0,
                        motherName: p.motherName,
                        fatherName: p.fatherName,
                        observations: p.observations,
                        address: p.address,
                        dob: p.dateOfBirth,
                    }));
                    setPatients(dbPatients);

                    const dbTasks = dbPatients.map((p: any) => {
                        let colId = "aguardando";
                        if (p.status === "Em Avaliação" || p.status === "em_avaliacao" || p.status === "Em avaliação") colId = "em_avaliacao";
                        if (p.status === "Em Terapia" || p.status === "Em Tratamento" || p.status === "em_andamento") colId = "em_andamento";
                        if (p.status === "Alta" || p.status === "alta") colId = "alta";

                        return {
                            id: p.id,
                            columnId: colId,
                            content: p.name,
                            patientId: p.id,
                            tags: [p.status],
                        };
                    });
                    setTasks(dbTasks);
                }
            } catch (error) {
                console.error("Failed to load patients", error);
            }
        }
        loadPatients();
    }, []);

    useEffect(() => {
        async function loadPatients() {
            const result = await getPatients();
            if (result.success && result.data) {
                // Map DB patients to UI types
                const dbPatients = result.data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    email: p.email || "",
                    phone: p.phone || "",
                    status: p.status, // Ensure DB status matches UI expected values or map them
                    history: [],
                    negotiatedValue: p.negotiatedValue || 0,
                    motherName: p.motherName,
                    fatherName: p.fatherName,
                    observations: p.observations,
                    address: p.address,
                    dob: p.dateOfBirth,
                    financialSource: p.financialSource, // Mapped
                }));
                setPatients(dbPatients);

                // Map to Tasks
                const dbTasks = dbPatients.map((p: any) => {
                    let colId = "aguardando";
                    if (p.status === "Em Avaliação" || p.status === "em_avaliacao") colId = "em_avaliacao";
                    if (p.status === "Em Terapia" || p.status === "Em Tratamento" || p.status === "em_andamento") colId = "em_andamento";
                    if (p.status === "Alta" || p.status === "alta") colId = "alta";

                    return {
                        id: p.id, // Use patient ID for task ID to simplify
                        columnId: colId,
                        content: p.name,
                        patientId: p.id,
                        tags: [p.gender === "Masculino" ? "Masculino" : "Feminino"], // Example tags
                        nextReevaluation: p.nextReevaluation,
                        financialSource: p.financialSource,
                    };
                });
                setTasks(dbTasks);
            }
        }
        loadPatients();
    }, []);

    useEffect(() => {
        if (shouldOpenNew) {
            setIsDialogOpen(true);
        }
    }, [shouldOpenNew]);

    // Dnd State
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | undefined>(undefined);
    const [historyPatient, setHistoryPatient] = useState<Patient | undefined>(undefined);

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
    async function handleSavePatient(patientData: Partial<Patient>) {
        try {
            // Optimistic Update
            const tempId = editingPatient ? editingPatient.id : `temp-${Date.now()}`;

            // Map UI status back to consistent DB strings
            const statusMap: Record<string, string> = {
                "aguardando": "Aguardando",
                "em_avaliacao": "Em avaliação",
                "em_andamento": "Em Tratamento",
                "alta": "Alta"
            };

            // Only update status if it's a new patient (default) or explicitly changed?
            // For editing, we keep existing status unless UI allows changing it (DND does that).
            // Dialog doesn't have status selector, so we keep existing or default.
            const currentStatus = editingPatient?.status || "Aguardando";

            const payload = {
                id: editingPatient?.id,
                ...patientData,
                status: currentStatus,
                negotiatedValue: patientData.negotiatedValue
            };

            await savePatient(payload);

            // Reload to get real ID and data
            const result = await getPatients();
            if (result.success && result.data) {
                const dbPatients = result.data.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    email: p.email || "",
                    phone: p.phone || "",
                    status: p.status,
                    history: [],
                    negotiatedValue: p.negotiatedValue || 0,
                    motherName: p.motherName,
                    fatherName: p.fatherName,
                    observations: p.observations,
                    address: p.address,
                    dob: p.dateOfBirth,
                }));
                setPatients(dbPatients);

                const dbTasks = dbPatients.map((p: any) => {
                    let colId = "aguardando";
                    if (p.status === "Em Avaliação" || p.status === "em_avaliacao" || p.status === "Em avaliação") colId = "em_avaliacao";
                    if (p.status === "Em Terapia" || p.status === "Em Tratamento" || p.status === "em_andamento") colId = "em_andamento";
                    if (p.status === "Alta" || p.status === "alta") colId = "alta";

                    return {
                        id: p.id,
                        columnId: colId,
                        content: p.name,
                        patientId: p.id,
                        tags: [p.status],
                    };
                });
                setTasks(dbTasks);
            }

        } catch (error) {
            console.error("Failed to save patient", error);
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

    function handleHistory(patientId: string) {
        const patient = patients.find((p) => p.id === patientId);
        if (patient) {
            setHistoryPatient(patient);
            setIsHistoryOpen(true);
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
        if (isActiveAColumn) {
            setColumns((columns) => {
                const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
                const overColumnIndex = columns.findIndex((col) => col.id === overId);

                const newColumns = [...columns];
                const [removed] = newColumns.splice(activeColumnIndex, 1);
                newColumns.splice(overColumnIndex, 0, removed);
                return newColumns;
            });
            return;
        }

        // Handle Task Drag End - Persist to DB
        const isActiveATask = active.data.current?.type === "Task";
        if (isActiveATask) {
            let newStatus = "Aguardando";

            // Determine new column ID
            // overId could be a column OR a task in a column
            const isOverAColumn = over.data.current?.type === "Column";
            const isOverATask = over.data.current?.type === "Task";

            let targetColumnId = "aguardando";

            if (isOverAColumn) {
                targetColumnId = String(overId);
            } else if (isOverATask) {
                // Find the column of the task we dropped over
                const overTask = tasks.find(t => t.id === overId);
                if (overTask) targetColumnId = overTask.columnId;
            }

            // Map Column ID to DB Status
            if (targetColumnId === "aguardando") newStatus = "Aguardando";
            if (targetColumnId === "em_avaliacao") newStatus = "Em avaliação";
            if (targetColumnId === "em_andamento") newStatus = "Em Tratamento"; // DB value
            if (targetColumnId === "alta") newStatus = "Alta";

            // Call Server Action
            updatePatientStatus(String(active.data.current?.task?.patientId), newStatus)
                .then(res => {
                    if (!res.success) {
                        console.error("Failed to update status");
                        // Revert? For now assume success or reload.
                    }
                });
        }
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

    // Media Query Hook equivalent (simpler implementation for now)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Styles for Glass Effect - UPDATED RED
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassInput = "bg-white/50 border-red-100 focus:bg-white/80 transition-all";

    return (
        <div
            className="min-h-screen p-4 md:p-8 flex flex-col relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor - Red/Orange */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-400/10 to-red-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className={`flex flex-col md:flex-row justify-between items-center mb-8 p-6 rounded-3xl ${glassCard} relative z-10 gap-4`}>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200 shrink-0">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Pacientes</h1>
                        <p className="text-slate-500 font-medium">Gestão Visual de Tratamentos</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <div className="relative group w-full md:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400 group-focus-within:text-red-600 transition-colors" />
                        <Input
                            placeholder="Buscar paciente..."
                            className={`pl-10 w-full md:w-64 rounded-xl ${glassInput}`}
                        />
                    </div>
                    <Button
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 transition-all hover:scale-105 w-full md:w-auto"
                        onClick={() => {
                            setEditingPatient(undefined);
                            setIsDialogOpen(true);
                        }}
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Paciente
                    </Button>

                    <PatientDialog
                        patient={editingPatient}
                        onSave={handleSavePatient}
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                    />

                    {historyPatient && (
                        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                            <HistoryDialog
                                patient={historyPatient}
                                open={isHistoryOpen}
                                onOpenChange={setIsHistoryOpen}
                            />
                        </Dialog>
                    )}
                </div>
            </div>

            {/* Content Switch: Kanban (Desktop) vs List (Mobile) */}
            {isMobile ? (
                <div className="relative z-10 space-y-4 pb-20">
                    {/* Mobile View: Simple List of Cards (Active Only for now, or Filtered?) */}
                    {/* For simplicity, we just list all non-archived patients */}
                    {tasks.filter(t => t.columnId !== 'alta').map(task => { // Filter out archived/alta?
                        const patient = patients.find(p => p.id === task.patientId);
                        if (!patient) return null;
                        return (
                            <PatientMobileCard
                                key={task.id}
                                patient={patient}
                                onEdit={handleEditPatient}
                                onHistory={handleHistory}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto overflow-y-hidden relative z-10">
                    <DndContext
                        sensors={sensors}
                        collisionDetection={pointerWithin}
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
                                    onEdit={(task) => handleEditPatient(task.patientId)}
                                    onHistory={(task) => handleHistory(task.patientId)}
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
            )}
        </div>
    );
}

"use client";
export const dynamic = "force-dynamic";

import { Suspense } from "react";

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
import { cn } from "@/lib/utils"; // Import cn

import { Button } from "@/components/ui/button";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    GripVertical,
    User,
    MessageCircle,
    Calendar,
    Pencil,
    TrendingUp
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
import { PatientCard } from "@/components/patient-card";
import { PatientMobileCard } from "./_components/patient-mobile-card";
import { PatientDialog } from "./_components/patient-dialog";
import { HistoryDialog } from "./_components/history-dialog";
import { Column, Task, Patient } from "./types";
import { AIAssistant } from "@/components/ai/ai-assistant";

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

function PacientesContent() {
    const searchParams = useSearchParams();
    const shouldOpenNew = searchParams.get("new") === "true";

    // State
    const [columns, setColumns] = useState<Column[]>(defaultCols);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);

    // UI State for Filters/View
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"kanban" | "list">("list");

    const handleNewPatient = () => {
        setEditingPatient(undefined);
        setIsDialogOpen(true);
    };



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
                    nextReevaluation: p.nextReevaluation,
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
                        patient: p, // Add full patient object
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
                    nextReevaluation: p.nextReevaluation,
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
                        patient: p,
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

        // Handle both Task and Patient types for robustness
        if (event.active.data.current?.type === "Task" || event.active.data.current?.type === "Patient") {
            // If it's a Patient type, we might need to find the corresponding task or just use the patient data
            // But activeTask state expects a Task. Let's find the task that corresponds to this patient.
            const patientId = event.active.data.current.patient?.id || event.active.data.current.task?.patientId;
            const task = tasks.find(t => t.patientId === patientId);
            if (task) setActiveTask(task);
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

        if (activeId === activeId && activeId === overId) return; // Basic self check

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

        // Handle Task/Patient Drag End
        const isActiveATask = active.data.current?.type === "Task" || active.data.current?.type === "Patient";
        if (isActiveATask) {
            let newStatus = "Aguardando";

            const isOverAColumn = over.data.current?.type === "Column";
            const isOverATask = over.data.current?.type === "Task" || over.data.current?.type === "Patient";

            let targetColumnId = "aguardando";

            if (isOverAColumn) {
                targetColumnId = String(overId);
            } else if (isOverATask) {
                // Find the column of the task we dropped over
                // Note: overId is usually the task ID (which we mapped to patient ID)
                const overTask = tasks.find(t => t.id === overId);
                if (overTask) targetColumnId = overTask.columnId;
            }

            // Map Column ID to DB Status
            if (targetColumnId === "aguardando") newStatus = "Aguardando";
            if (targetColumnId === "em_avaliacao") newStatus = "Em avaliação";
            if (targetColumnId === "em_andamento") newStatus = "Em Tratamento";
            if (targetColumnId === "alta") newStatus = "Alta";

            // Identify Patient ID
            const patientId = active.data.current?.patient?.id || active.data.current?.task?.patientId;

            // Call Server Action
            if (patientId) {
                updatePatientStatus(String(patientId), newStatus)
                    .then(res => {
                        if (!res.success) {
                            console.error("Failed to update status");
                        } else {
                            // Optimistically update local state to avoid jumpiness
                            setTasks((tasks) => {
                                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                                if (activeIndex !== -1) {
                                    const newTasks = [...tasks];
                                    newTasks[activeIndex].columnId = targetColumnId;
                                    // Also update the tag/status locally
                                    newTasks[activeIndex].tags = [newStatus];
                                    // Update inner patient object status too for consistency
                                    newTasks[activeIndex].patient.status = newStatus;
                                    return newTasks;
                                }
                                return tasks;
                            });
                        }
                    });
            }
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task" || active.data.current?.type === "Patient";
        const isOverATask = over.data.current?.type === "Task" || over.data.current?.type === "Patient";
        const isOverAColumn = over.data.current?.type === "Column";

        if (!isActiveATask) return;

        // Im dropping a Task over another Task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                const overIndex = tasks.findIndex((t) => t.id === overId);

                if (activeIndex === -1 || overIndex === -1) return tasks;

                if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex].columnId = tasks[overIndex].columnId;
                    const [removed] = newTasks.splice(activeIndex, 1);
                    newTasks.splice(overIndex, 0, removed);
                    return newTasks;
                }

                const newTasks = [...tasks];
                const [removed] = newTasks.splice(activeIndex, 1);
                newTasks.splice(overIndex, 0, removed);
                return newTasks;
            });
        }

        // Im dropping a Task over a Column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId);
                if (activeIndex === -1) return tasks;

                if (tasks[activeIndex].columnId !== overId) {
                    const newTasks = [...tasks];
                    newTasks[activeIndex].columnId = String(overId);
                    return newTasks;
                }
                return tasks;
            });
        }
    }

    // Filter Logic
    const filteredTasks = tasks.filter((task) => {
        if (!searchQuery) return true;
        const lowerQuery = searchQuery.toLowerCase();
        return (
            task.content.toLowerCase().includes(lowerQuery) ||
            task.patient.email.toLowerCase().includes(lowerQuery)
        );
    });

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
            <div className="flex flex-col h-full bg-sidebar/50 relative overflow-hidden">
                {/* Decorative Gradients for Glass Effect */}
                <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-primary/5 via-primary/2 to-transparent -z-10 pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-orange-100/40 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

                <div className="p-6 pb-2 border-b border-sidebar-border/60 bg-white/40 backdrop-blur-md z-20">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-foreground">Pacientes</h1>
                            <p className="text-sm text-muted-foreground mt-1">
                                Gerencie seus pacientes, acompanhe evoluções e tratamentos.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <AIAssistant
                                variant="feature"
                                contextName="Gestão de Pacientes"
                                welcomeMessage="Posso ajudar a identificar pacientes inativos, oportunidades de reativação ou perfis detalhados."
                                data={{
                                    totalPatients: patients.length,
                                    activePatients: patients.filter(p => p.status === 'Em Tratamento' || p.status === 'Em avaliação').length,
                                    waitingList: patients.filter(p => p.status === 'Aguardando').length,
                                    discharged: patients.filter(p => p.status === 'Alta').length,
                                    patientsSample: patients.slice(0, 10).map(p => ({
                                        name: p.name,
                                        status: p.status,
                                        plan: p.financialSource
                                    })),
                                    viewMode: viewMode
                                }}
                            />
                            <Button
                                onClick={handleNewPatient}
                                className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                            >
                                <Plus className="mr-2 h-4 w-4" /> Novo Paciente
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                        <div className="relative w-full sm:w-[300px]">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar paciente por nome..."
                                className="pl-9 bg-white/50 border-sidebar-border/80 focus:bg-white transition-all shadow-sm"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                            <Button variant="outline" size="sm" className="bg-white/50 border-sidebar-border hover:bg-white whitespace-nowrap">
                                <Filter className="mr-2 h-3.5 w-3.5" />
                                Filtros
                            </Button>
                            <div className="h-6 w-px bg-sidebar-border mx-1" />
                            <div className="flex bg-sidebar-accent/50 p-1 rounded-lg">
                                <Button
                                    variant={viewMode === "kanban" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("kanban")}
                                    className={cn(
                                        "h-7 px-3 text-xs",
                                        viewMode === "kanban" && "bg-white text-primary shadow-sm"
                                    )}
                                >
                                    <GripVertical className="mr-2 h-3.5 w-3.5" /> Kanban
                                </Button>
                                <Button
                                    variant={viewMode === "list" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setViewMode("list")}
                                    className={cn(
                                        "h-7 px-3 text-xs",
                                        viewMode === "list" && "bg-white text-primary shadow-sm"
                                    )}
                                >
                                    <MoreHorizontal className="mr-2 h-3.5 w-3.5 rotate-90" /> Lista
                                </Button>
                            </div>
                        </div>
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
                ) : viewMode === "list" ? (
                    <div className="flex-1 overflow-y-auto relative z-10 px-6 pb-20 space-y-2">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                            <div className="col-span-4">Paciente</div>
                            <div className="col-span-2">Status</div>
                            <div className="col-span-2">Tags Clínicas</div>
                            <div className="col-span-2">Próx. Sessão</div>
                            <div className="col-span-2 text-right">Ações</div>
                        </div>

                        {filteredTasks.map((task) => (
                            <div
                                key={task.id}
                                className="group grid grid-cols-12 gap-4 items-center p-3 rounded-xl bg-white/40 border border-white/60 hover:bg-white/80 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-100/20 hover:scale-[1.005] transition-all duration-200 cursor-pointer backdrop-blur-sm"
                                onClick={() => handleEditPatient(task.patient.id)}
                            >
                                <div className="col-span-4 flex items-center gap-3">
                                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm group-hover:border-indigo-100 transition-colors">
                                        <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-600 font-bold border border-indigo-50">
                                            {task.patient.name.slice(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-bold text-slate-700 group-hover:text-indigo-700 transition-colors">{task.patient.name}</div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <span>{task.patient.financialSource === 'PARTICULAR' ? 'Particular' : 'Convênio'}</span>
                                            {task.patient.phone && (
                                                <span className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600 font-medium">
                                                    • <MessageCircle className="h-3 w-3" /> WhatsApp
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-sm",
                                        task.patient.status === 'Em Tratamento' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                            task.patient.status === 'Aguardando' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                                task.patient.status === 'Alta' ? "bg-slate-50 text-slate-500 border-slate-100" :
                                                    "bg-blue-50 text-blue-600 border-blue-100"
                                    )}>
                                        {task.patient.status}
                                    </span>
                                </div>

                                <div className="col-span-2 flex gap-1 flex-wrap">
                                    {/* Mock Tags for now - Real implementation would pull from DB */}
                                    {['Fono', 'Voz'].map(tag => (
                                        <span key={tag} className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="col-span-2 text-sm text-slate-500 font-medium">
                                    {task.nextReevaluation ? (
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {new Date(task.nextReevaluation).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                                        </span>
                                    ) : <span className="text-slate-400 text-xs">-</span>}
                                </div>

                                <div className="col-span-2 flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                        onClick={(e) => { e.stopPropagation(); handleEditPatient(task.patient.id); }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
                                        onClick={(e) => { e.stopPropagation(); handleHistory(task.patient.id); }}
                                    >
                                        <TrendingUp className="h-4 w-4" />
                                    </Button>
                                    {task.patient.phone && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const url = `https://wa.me/${task.patient.phone.replace(/\D/g, '')}`;
                                                window.open(url, '_blank');
                                            }}
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {filteredTasks.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-4">
                                <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                                    <User className="h-8 w-8 text-slate-300" />
                                </div>
                                <p>Nenhum paciente encontrado.</p>
                            </div>
                        )}
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
                                        tasks={filteredTasks.filter((task) => task.columnId === col.id)}
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
                                        <PatientCard
                                            patient={activeTask.patient}
                                        />
                                    )}
                                </DragOverlay>
                            )}
                        </DndContext>
                    </div>
                )}
            </div>

            {/* Dialogs */}
            <PatientDialog
                patient={editingPatient}
                onSave={handleSavePatient}
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />

            {historyPatient && (
                <HistoryDialog
                    patient={historyPatient}
                    open={isHistoryOpen}
                    onOpenChange={setIsHistoryOpen}
                />
            )}

            <AIAssistant
                variant="help"
                contextName="Suporte Pacientes"
                welcomeMessage="Precisa de ajuda com o cadastro? Posso explicar como registrar evoluções ou anexar arquivos."
            />
        </div>
    );
}

export default function PacientesPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen text-slate-500">Carregando Pacientes...</div>}>
            <PacientesContent />
        </Suspense>
    );
}

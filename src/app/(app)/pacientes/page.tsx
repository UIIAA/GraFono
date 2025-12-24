"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    pointerWithin,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
    DragStartEvent,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Phone, Mail, Plus, MapPin, Calendar } from "lucide-react";
import { PatientDialog } from "./_components/patient-dialog";

// Mock Data
type Patient = {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    status: string;
    lastContact: string;
    dob?: string;
    address?: string;
    motherName?: string;
    fatherName?: string;
    observations?: string;
    history?: any[];
};

type Column = {
    id: string;
    title: string;
    color: string;
};

const initialColumns: Column[] = [
    { id: "lead", title: "Lead / Contato", color: "bg-blue-500" },
    { id: "agendado", title: "Avaliação Agendada", color: "bg-purple-500" },
    { id: "terapia", title: "Em Terapia", color: "bg-green-500" },
    { id: "espera", title: "Em Espera", color: "bg-yellow-500" },
    { id: "alta", title: "Alta / Arquivo", color: "bg-gray-500" },
];

const initialPatients: Patient[] = [
    {
        id: "1",
        name: "Lucas Silva",
        email: "lucas@example.com",
        phone: "(11) 98765-4321",
        avatar: "files/avatar1.png",
        status: "lead",
        lastContact: "2 dias atrás",
        history: [
            { id: 1, date: "23/12/2024", type: "Contato", description: "Entrou em contato via WhatsApp interessado em terapia." }
        ]
    },
    {
        id: "2",
        name: "Sofia Oliveira",
        email: "sofia@example.com",
        phone: "(11) 91234-5678",
        avatar: "files/avatar2.png",
        status: "terapia",
        lastContact: "1 semana atrás",
    },
    {
        id: "3",
        name: "Pedro Santos",
        email: "pedro@example.com",
        phone: "(11) 99876-5432",
        avatar: "files/avatar3.png",
        status: "agendado",
        lastContact: "Hoje",
    },
];

export default function CRMPage() {
    const [patients, setPatients] = useState<Patient[]>(initialPatients);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragStart(event: DragStartEvent) {
        setActiveId(event.active.id as string);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (!over) {
            setActiveId(null);
            return;
        }

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the container (column) for the active item and the over item
        const activeContainer = patients.find(p => p.id === activeId)?.status;

        // If dropping over a column directly
        let overContainer = initialColumns.some(col => col.id === overId)
            ? overId
            : patients.find(p => p.id === overId)?.status;

        if (activeContainer !== overContainer && overContainer) {
            setPatients((items) => {
                const activeItem = items.find(p => p.id === activeId);
                if (!activeItem) return items;

                return items.map((item) =>
                    item.id === activeId
                        ? { ...item, status: overContainer }
                        : item
                );
            });
        }

        // Handling reordering within the same column could be added here if needed
        // using arrayMove, but for now we just want to ensure column switching works.

        setActiveId(null);
    }

    function handleSavePatient(updatedPatient: any) {
        if (updatedPatient.id) {
            // Edit existing
            setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
        } else {
            // Create new
            const newPatient = {
                ...updatedPatient,
                id: Math.random().toString(36).substr(2, 9),
                status: "lead", // Default column
                lastContact: "Agora",
                avatar: "files/avatar1.png" // Default avatar
            };
            setPatients(prev => [...prev, newPatient]);
        }
    }

    return (
        <div className="p-8 h-screen bg-[#F0F2F5] overflow-y-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestão de Pacientes</h1>
                    <p className="text-gray-500">Acompanhe o ciclo de vida dos seus pacientes</p>
                </div>
                <PatientDialog onSave={handleSavePatient}>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Novo Paciente
                    </Button>
                </PatientDialog>
            </div>

            <DndContext
                id="kanban-dnd-context"
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="flex gap-4 h-full overflow-x-auto pb-4">
                    {initialColumns.map((col) => (
                        <BoardColumn
                            key={col.id}
                            column={col}
                            patients={patients.filter((p) => p.status === col.id)}
                            onSavePatient={handleSavePatient}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeId ? (
                        <PatientCard patient={patients.find(p => p.id === activeId)!} isOverlay />
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}

import { useDroppable } from "@dnd-kit/core";

function BoardColumn({ column, patients, onSavePatient }: { column: Column, patients: Patient[], onSavePatient: (p: any) => void }) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div
            ref={setNodeRef}
            className="min-w-[300px] w-[300px] flex flex-col bg-gray-100 rounded-xl max-h-full"
        >
            {/* Header da Coluna */}
            <div className="p-4 border-b border-gray-200 bg-white rounded-t-xl sticky top-0 z-10">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-700">{column.title}</h3>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        {patients.length}
                    </Badge>
                </div>
                <div className={`h-1 w-full rounded-full ${column.color}`} />
            </div>

            {/* Lista de Cards Sortable */}
            <SortableContext
                id={column.id}
                items={patients.map((p) => p.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="p-3 space-y-3 flex-1 overflow-y-auto min-h-[100px]">
                    {patients.map((patient) => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            onSave={onSavePatient}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
}

function PatientCard({ patient, isOverlay, onSave }: { patient: Patient, isOverlay?: boolean, onSave?: (data: any) => void }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: patient.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group relative",
                isOverlay ? "shadow-xl scale-105 rotate-2 cursor-grabbing border-blue-200 ring-2 ring-blue-500/20" : ""
            )}
            {...attributes}
            {...listeners}
        >
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border border-gray-100">
                        <AvatarFallback className="bg-blue-50 text-blue-600 font-medium">
                            {patient.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h4 className="font-semibold text-sm text-gray-900 leading-tight">{patient.name}</h4>
                        <p className="text-xs text-gray-500">Há {patient.lastContact}</p>
                    </div>
                </div>

                {/* Prevent Drag on Button click */}
                <div onPointerDown={(e) => e.stopPropagation()}>
                    <PatientDialog patient={patient} onSave={onSave}>
                        <button className="text-gray-400 hover:text-gray-600 transition-opacity">
                            <MoreHorizontal className="h-4 w-4" />
                        </button>
                    </PatientDialog>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Mail className="h-3 w-3" /> {patient.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone className="h-3 w-3" /> {patient.phone}
                </div>
            </div>
        </div>
    );
}

// Utility classname merger
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

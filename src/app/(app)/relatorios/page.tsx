"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Filter,
    FileText,
    Upload,
    MoreHorizontal,
    User
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock Data
const reports = [
    {
        id: 1,
        title: "Relatório sem título",
        patient: "Paciente não encontrado",
        type: "Avaliação",
        status: "Finalizado",
        date: "26 mar 2025",
        typeColor: "bg-blue-100 text-blue-700",
        statusColor: "bg-green-100 text-green-700"
    },
    {
        id: 2,
        title: "Relatório sem título",
        patient: "Paciente não encontrado",
        type: "Evolução",
        status: "Rascunho",
        date: "26 mar 2025",
        typeColor: "bg-cyan-100 text-cyan-700",
        statusColor: "bg-gray-100 text-gray-700"
    },
    {
        id: 3,
        title: "Relatório de Evolução Trimestral - João Silva",
        patient: "Paciente não encontrado",
        type: "Evolução",
        status: "Finalizado",
        date: "24 mar 2025",
        typeColor: "bg-cyan-100 text-cyan-700",
        statusColor: "bg-green-100 text-green-700"
    },
    {
        id: 4,
        title: "Relatório de Avaliação Inicial - João Silva",
        patient: "Paciente não encontrado",
        type: "Avaliação",
        status: "Finalizado",
        date: "24 mar 2025",
        typeColor: "bg-blue-100 text-blue-700",
        statusColor: "bg-green-100 text-green-700"
    },
    {
        id: 5,
        title: "Relatório de Avaliação Inicial - Maria Santos",
        patient: "Paciente não encontrado",
        type: "Avaliação",
        status: "Finalizado",
        date: "24 mar 2025",
        typeColor: "bg-blue-100 text-blue-700",
        statusColor: "bg-green-100 text-green-700"
    },
    {
        id: 6,
        title: "Relatório de Evolução Terapêutica - Trimestral",
        patient: "Paciente não encontrado",
        type: "Evolução",
        status: "Finalizado",
        date: "21 mar 2025",
        typeColor: "bg-cyan-100 text-cyan-700",
        statusColor: "bg-green-100 text-green-700"
    },
    {
        id: 7,
        title: "teste",
        patient: "Álvaro de Lima Silva",
        type: "Evolução",
        status: "Rascunho",
        date: "20 mar 2025",
        typeColor: "bg-cyan-100 text-cyan-700",
        statusColor: "bg-gray-100 text-gray-700"
    },
    {
        id: 8,
        title: "Relatório de Anamnese Inicial",
        patient: "Paciente não encontrado",
        type: "Preliminar",
        status: "Finalizado",
        date: "20 mar 2025",
        typeColor: "bg-indigo-100 text-indigo-700",
        statusColor: "bg-green-100 text-green-700"
    }

];

export default function RelatoriosPage() {
    return (
        <div className="p-8 min-h-screen bg-[#F0F2F5] space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
                    <p className="text-gray-500">Gerencie e crie relatórios para pacientes</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white">
                        <Upload className="mr-2 h-4 w-4" />
                        Importar Relatório
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Novo Relatório
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar relatórios..."
                        className="pl-9 bg-gray-50 border-gray-200"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="text-gray-600 flex-1 md:flex-none">
                        <Filter className="mr-2 h-4 w-4" />
                        Todos os tipos
                    </Button>
                    <Button variant="outline" className="text-gray-600 flex-1 md:flex-none">
                        Todas audiências
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase">
                    <div className="col-span-4">Título</div>
                    <div className="col-span-3">Paciente</div>
                    <div className="col-span-2">Tipo</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Data</div>
                    <div className="col-span-1 text-right">Ações</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {reports.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                            <div className="col-span-4 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-400" />
                                <span className="text-sm font-medium text-gray-900 truncate">{item.title}</span>
                            </div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Avatar className="h-5 w-5 bg-gray-100">
                                    <AvatarFallback><User className="h-3 w-3 text-gray-500" /></AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-600 truncate">{item.patient}</span>
                            </div>
                            <div className="col-span-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.typeColor}`}>
                                    {item.type}
                                </span>
                            </div>
                            <div className="col-span-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.statusColor}`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="col-span-1 text-sm text-gray-600">
                                {item.date}
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

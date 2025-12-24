"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Filter,
    FileText,
    MoreHorizontal,
    User
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock Data
const exams = [
    {
        id: 1,
        title: "Audiometria",
        patient: "Paciente não encontrado",
        date: "14/12/2023",
        status: "Finalizado",
        statusColor: "bg-green-100 text-green-700",
        iconColor: "text-purple-600 bg-purple-100"
    },
    {
        id: 2,
        title: "Videolaringoscopia",
        patient: "Paciente não encontrado",
        date: "17/12/2023",
        status: "Pendente",
        statusColor: "bg-gray-100 text-gray-700",
        iconColor: "text-blue-600 bg-blue-100"
    },
    {
        id: 3,
        title: "Nasofibrolaringoscopia",
        patient: "Paciente não encontrado",
        date: "09/12/2023",
        status: "Agendado",
        statusColor: "bg-blue-100 text-blue-700",
        iconColor: "text-indigo-600 bg-indigo-100"
    }
];

export default function ExamesPage() {
    return (
        <div className="p-8 min-h-screen bg-[#F0F2F5] space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Exames</h1>
                    <p className="text-gray-500">Gerencie pedidos de exames e acompanhe resultados</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Novo Exame
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar exames..."
                        className="pl-9 bg-gray-50 border-gray-200"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="text-gray-600 flex-1 md:flex-none">
                        <Filter className="mr-2 h-4 w-4" />
                        Todos os status
                    </Button>
                    <Button variant="outline" className="text-gray-600 flex-1 md:flex-none">
                        Todos os tipos
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase">
                    <div className="col-span-4">Exame</div>
                    <div className="col-span-4">Paciente</div>
                    <div className="col-span-2">Solicitação</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1 text-right">Ações</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {exams.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                            <div className="col-span-4 flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${item.iconColor}`}>
                                    <FileText className="h-4 w-4" />
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                            </div>
                            <div className="col-span-4 flex items-center gap-2">
                                <Avatar className="h-6 w-6 bg-blue-100 text-blue-600">
                                    <AvatarFallback><User className="h-3 w-3" /></AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-medium text-gray-700 truncate">{item.patient}</span>
                            </div>
                            <div className="col-span-2 text-sm text-gray-600 font-medium">
                                {item.date}
                            </div>
                            <div className="col-span-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.statusColor}`}>
                                    {item.status}
                                </span>
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

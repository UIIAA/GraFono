"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Filter,
    FileText,
    Clock,
    BarChart,
    MoreHorizontal,
    User
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock Data matches the screenshot approximately
const evaluations = [
    {
        id: 1,
        patient: "Paciente não encontrado",
        description: "Evolução positiva em todas as áreas avaliadas",
        type: "Desconhecido",
        date: "31/08/2025",
        status: "Finalizada",
        color: "bg-gray-100 text-gray-700"
    },
    {
        id: 2,
        patient: "Paciente não encontrado",
        description: "Evolução positiva em todas as áreas avaliadas",
        type: "Desconhecido",
        date: "31/08/2025",
        status: "Finalizada",
        color: "bg-gray-100 text-gray-700"
    },
    {
        id: 3,
        patient: "Paciente não encontrado",
        description: "Avaliação de progresso indica evolução significativa em todas as áreas...",
        type: "Progresso",
        date: "31/05/2025",
        status: "Finalizada",
        color: "bg-green-100 text-green-700"
    },
    {
        id: 4,
        patient: "Paciente não encontrado",
        description: "Avaliação indica quadro compatível com atraso no desenvolvimento...",
        type: "Inicial",
        date: "28/02/2025",
        status: "Finalizada",
        color: "bg-blue-100 text-blue-700"
    },
    {
        id: 5,
        patient: "Paciente não encontrado",
        description: "Avaliação indica necessidade de intervenção fonoaudiológica imediata",
        type: "Inicial",
        date: "28/02/2025",
        status: "Finalizada",
        color: "bg-blue-100 text-blue-700"
    },
    {
        id: 6,
        patient: "Paciente não encontrado",
        description: "Avaliação inicial indica necessidade de intervenção intensiva",
        type: "Inicial",
        date: "28/02/2025",
        status: "Finalizada",
        color: "bg-blue-100 text-blue-700"
    }
];

export default function AvaliacoesPage() {
    return (
        <div className="p-8 min-h-screen bg-[#F0F2F5] space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Avaliações</h1>
                    <p className="text-gray-500">Gerencie avaliações de pacientes</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white">
                        <BarChart className="mr-2 h-4 w-4" />
                        Relatórios
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> Nova Avaliação
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Total de Avaliações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-2xl font-bold">10</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Avaliações Iniciais</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <Clock className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-2xl font-bold">6</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Reavaliações</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <BarChart className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-2xl font-bold">2</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500">Últimos 30 dias</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <FileText className="h-5 w-5 text-orange-600" />
                            </div>
                            <span className="text-2xl font-bold">0</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar por paciente ou resumo..."
                        className="pl-9 bg-gray-50 border-gray-200"
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="outline" className="text-gray-600 flex-1 md:flex-none">
                        <Filter className="mr-2 h-4 w-4" />
                        Todos os tipos
                    </Button>
                    <Button variant="outline" className="text-gray-600 flex-1 md:flex-none">
                        Todas as datas
                    </Button>
                    <Button variant="outline" className="text-gray-600 flex-1 md:flex-none">
                        Todos os pacientes
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase">
                    <div className="col-span-5">Paciente</div>
                    <div className="col-span-2">Tipo</div>
                    <div className="col-span-2">Data</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-1 text-right">Ações</div>
                </div>

                <div className="divide-y divide-gray-100">
                    {evaluations.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors">
                            <div className="col-span-5 flex items-start gap-3">
                                <Avatar className="h-9 w-9 bg-blue-100 text-blue-600">
                                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-sm text-gray-900">{item.patient}</p>
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{item.description}</p>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.color}`}>
                                    {item.type}
                                </span>
                            </div>
                            <div className="col-span-2 text-sm text-gray-600 font-medium">
                                {item.date}
                            </div>
                            <div className="col-span-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
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

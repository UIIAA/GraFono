"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Filter,
    Stethoscope,
    MoreHorizontal,
    User,
    Calendar,
    FileDigit,
    AlertCircle
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const exams = [
    {
        id: 1,
        title: "Audiometria Tonal",
        patient: "João Silva",
        requestDate: "20 Dez 2024",
        status: "Finalizado",
        statusColor: "bg-green-100 text-green-700"
    },
    {
        id: 2,
        title: "Impedanciometria",
        patient: "João Silva",
        requestDate: "20 Dez 2024",
        status: "Finalizado",
        statusColor: "bg-green-100 text-green-700"
    },
    {
        id: 3,
        title: "Processamento Auditivo (PAC)",
        patient: "Maria Santos",
        requestDate: "18 Dez 2024",
        status: "Agendado",
        statusColor: "bg-blue-100 text-blue-700"
    },
    {
        id: 4,
        title: "Videolaringoscopia",
        patient: "Pedro Souza",
        requestDate: "15 Dez 2024",
        status: "Pendente",
        statusColor: "bg-orange-100 text-orange-700"
    }
];

export default function ExamesPage() {
    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassInput = "bg-white/50 border-red-100 focus:bg-white/80 transition-all";

    return (
        <div
            className="min-h-screen p-8 space-y-8 relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-400/10 to-red-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/60 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-white/50">
                        <Stethoscope className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Exames</h1>
                        <p className="text-slate-500">Controle de Exames e Resultados</p>
                    </div>
                </div>
                <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 h-11 px-6">
                    <Plus className="mr-2 h-4 w-4" /> Novo Exame
                </Button>
            </div>

            {/* Main Content */}
            <div className={`p-6 rounded-3xl ${glassCard} relative z-10`}>

                {/* Toolbar */}
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-300 group-focus-within:text-red-500 transition-colors" />
                        <Input
                            placeholder="Buscar exames..."
                            className={`pl-10 h-11 rounded-xl ${glassInput}`}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button variant="ghost" className="text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl">
                            <Filter className="mr-2 h-4 w-4" />
                            Status
                        </Button>
                        <Button variant="ghost" className="text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl">
                            Tipos
                        </Button>
                    </div>
                </div>

                {/* List */}
                <div className="overflow-hidden rounded-xl border border-white/40">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-white/30 border-b border-white/40 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4">Exame / Paciente</div>
                        <div className="col-span-3">Solicitação</div>
                        <div className="col-span-3">Status</div>
                        <div className="col-span-2 text-right">Ações</div>
                    </div>

                    <div className="divide-y divide-white/40 bg-white/20">
                        {exams.map((item) => (
                            <div key={item.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/40 transition-colors group cursor-pointer">
                                <div className="col-span-4">
                                    <div className="font-semibold text-slate-800 text-sm mb-1">{item.title}</div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                        <User className="h-3 w-3" /> {item.patient}
                                    </div>
                                </div>
                                <div className="col-span-3 flex items-center gap-2 text-slate-500 text-sm">
                                    <Calendar className="h-3 w-3" />
                                    {item.requestDate}
                                </div>
                                <div className="col-span-3">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-opacity-60 ${item.statusColor}`}>
                                        {item.status}
                                    </span>
                                </div>
                                <div className="col-span-2 flex justify-end gap-2">
                                    <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                        Detalhes
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex gap-4 items-start">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-red-500">
                        <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-red-800 text-sm">Pendências de Documentação</h4>
                        <p className="text-red-600/80 text-xs mt-1">3 exames aguardam anexo de resultados. Verifique a lista de pendentes.</p>
                    </div>
                </div>
                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex gap-4 items-start">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500">
                        <FileDigit className="h-5 w-5" />
                    </div>
                    <div>
                        <h4 className="font-bold text-blue-800 text-sm">Integração Laboratorial</h4>
                        <p className="text-blue-600/80 text-xs mt-1">Conecte com laboratórios parceiros para receber resultados automaticamente.</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

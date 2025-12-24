"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Filter,
    FileText,
    Upload,
    MoreHorizontal,
    User,
    FileCheck,
    Link as LinkIcon
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReportDialog } from "./_components/report-dialog";
import { getReports } from "@/app/actions/report";
import { getPatients } from "@/app/actions/patient";

export default function RelatoriosPage() {
    const [reports, setReports] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingReport, setEditingReport] = useState<any>(undefined);

    async function loadData() {
        const [repResult, patResult] = await Promise.all([
            getReports(),
            getPatients()
        ]);

        if (repResult.success && repResult.data) {
            setReports(repResult.data);
        }
        if (patResult.success && patResult.data) {
            setPatients(patResult.data);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassInput = "bg-white/50 border-red-100 focus:bg-white/80 transition-all";

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Avaliação': return 'bg-blue-100 text-blue-700';
            case 'Evolução': return 'bg-cyan-100 text-cyan-700';
            default: return 'bg-purple-100 text-purple-700';
        }
    };

    const getStatusColor = (status: string) => {
        return status === 'Finalizado'
            ? 'bg-green-100 text-green-700'
            : 'bg-gray-100 text-gray-700';
    };

    return (
        <div
            className="min-h-screen p-8 space-y-8 relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/60 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-white/50">
                        <FileCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Relatórios</h1>
                        <p className="text-slate-500">Documentação Clínica</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white/50 border-white/60 hover:bg-white text-slate-700 rounded-xl">
                        <Upload className="mr-2 h-4 w-4" />
                        Importar
                    </Button>
                    <Button
                        onClick={() => {
                            setEditingReport(undefined);
                            setIsDialogOpen(true);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Novo Relatório
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className={`p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center relative z-10 ${glassCard}`}>
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-300 group-focus-within:text-red-500 transition-colors" />
                    <Input
                        placeholder="Buscar relatórios..."
                        className={`pl-10 h-11 rounded-xl ${glassInput}`}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Button variant="ghost" className="text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl">
                        <Filter className="mr-2 h-4 w-4" />
                        Tipos
                    </Button>
                    <Button variant="ghost" className="text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl">
                        Audiências
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className={`rounded-3xl shadow-sm border border-white/60 overflow-hidden relative z-10 bg-white/40 backdrop-blur-xl`}>
                <div className="grid grid-cols-12 gap-4 p-5 border-b border-white/40 bg-white/20 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-4">Título</div>
                    <div className="col-span-3">Paciente</div>
                    <div className="col-span-2">Tipo</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Data</div>
                    <div className="col-span-1 text-right">Ações</div>
                </div>

                <div className="divide-y divide-white/40">
                    {reports.map((item) => (
                        <div
                            key={item.id}
                            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/40 transition-colors group cursor-pointer"
                            onClick={() => {
                                setEditingReport(item);
                                setIsDialogOpen(true);
                            }}
                        >
                            <div className="col-span-4 flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-semibold text-slate-800 truncate group-hover:text-red-600 transition-colors">{item.title}</span>
                                    {item.fileUrl && (
                                        <div className="flex items-center text-[10px] text-blue-500 gap-1">
                                            <LinkIcon className="h-3 w-3" />
                                            <span className="truncate max-w-[150px]">Link Anexado</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="col-span-3 flex items-center gap-2">
                                <Avatar className="h-6 w-6 bg-slate-100">
                                    <AvatarFallback className="text-[10px]">{item.patient?.name?.substring(0, 2).toUpperCase() || "PT"}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-slate-600 truncate">{item.patient?.name || "Paciente"}</span>
                            </div>
                            <div className="col-span-2">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${getTypeColor(item.type)} bg-opacity-50`}>
                                    {item.type}
                                </span>
                            </div>
                            <div className="col-span-1">
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide ${getStatusColor(item.status)} bg-opacity-50`}>
                                    {item.status}
                                </span>
                            </div>
                            <div className="col-span-1 text-sm text-slate-500 font-medium">
                                {new Date(item.date).toLocaleDateString()}
                            </div>
                            <div className="col-span-1 flex justify-end">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {reports.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            Nenhum relatório encontrado.
                        </div>
                    )}
                </div>
            </div>

            <ReportDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                patients={patients}
                report={editingReport}
                onSave={loadData}
            />
        </div>
    )
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    Filter,
    ClipboardList,
    MoreHorizontal,
    Calendar,
    Activity,
    CheckCircle2,
    Clock
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAssessments } from "@/app/actions/assessment";
import { getPatients } from "@/app/actions/patient";
import { EvaluationDialog } from "./_components/evaluation-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AvaliacoesPage() {
    const [evaluations, setEvaluations] = useState<any[]>([]);
    const [patients, setPatients] = useState<any[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvaluation, setEditingEvaluation] = useState<any>(undefined);
    const [loading, setLoading] = useState(false);

    // Filters State
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    async function loadData() {
        setLoading(true);
        try {
            const [evalResult, patResult] = await Promise.all([
                getAssessments(),
                getPatients()
            ]);

            if (evalResult.success && evalResult.data) {
                setEvaluations(evalResult.data);
            }
            if (patResult.success && patResult.data) {
                setPatients(patResult.data);
            }
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    // Filter Logic
    const filteredEvaluations = evaluations.filter(item => {
        const matchesSearch =
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.patient?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.summary?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter
            ? item.status === statusFilter
            : true;

        return matchesSearch && matchesStatus;
    });

    // Stats Calculation
    const total = evaluations.length;
    const completed = evaluations.filter(e => e.status === 'Concluído').length;
    const pending = evaluations.filter(e => e.status === 'Pendente' || e.status === 'Agendado').length;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Concluído': return 'bg-green-100 text-green-700';
            case 'Pendente': return 'bg-orange-100 text-orange-700';
            case 'Agendado': return 'bg-blue-100 text-blue-700';
            case 'Cancelado': return 'bg-red-100 text-red-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassInput = "bg-white/50 border-red-100 focus:bg-white/80 transition-all";

    return (
        <div
            className="min-h-screen p-4 md:p-8 space-y-8 relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-400/10 to-red-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10 text-pretty">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/60 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-white/50 shrink-0">
                        <ClipboardList className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Avaliações</h1>
                        <p className="text-slate-500 text-sm md:text-base">Gestão de Diagnósticos e Testes</p>
                    </div>
                </div>
                <Button
                    onClick={() => {
                        setEditingEvaluation(undefined);
                        setIsDialogOpen(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 h-11 px-6 w-full md:w-auto transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Nova Avaliação
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Total Avaliações</CardTitle>
                        <Activity className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{total}</div>
                        <p className="text-xs text-slate-500">Registros no sistema</p>
                    </CardContent>
                </Card>
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Concluídas</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{completed}</div>
                        <p className="text-xs text-slate-500">Avaliações finalizadas</p>
                    </CardContent>
                </Card>
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pendentes</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">{pending}</div>
                        <p className="text-xs text-slate-500">Agendadas ou em andamento</p>
                    </CardContent>
                </Card>
            </div>

            {/* Content Area */}
            <div className={`p-4 md:p-6 rounded-3xl ${glassCard} relative z-10`}>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-300 group-focus-within:text-red-500 transition-colors" />
                        <Input
                            placeholder="Buscar avaliações..."
                            className={`pl-10 h-11 rounded-xl ${glassInput}`}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className={`text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl whitespace-nowrap ${statusFilter ? 'bg-red-50 text-red-600' : ''}`}>
                                    <Filter className="mr-2 h-4 w-4" />
                                    {statusFilter || "Status"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setStatusFilter(null)}>Todos</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("Pendente")}>Pendentes</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("Agendado")}>Agendados</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setStatusFilter("Concluído")}>Concluídos</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* List */}
                <div className="overflow-hidden rounded-xl border border-white/40">
                    <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-white/30 border-b border-white/40 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4">Paciente</div>
                        <div className="col-span-3">Tipo de Avaliação</div>
                        <div className="col-span-2">Data</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-1 text-right">Ações</div>
                    </div>

                    <div className="divide-y divide-white/40 bg-white/20">
                        {filteredEvaluations.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col md:grid md:grid-cols-12 gap-2 md:gap-4 p-4 items-start md:items-center hover:bg-white/40 transition-colors group cursor-pointer"
                                onClick={() => {
                                    setEditingEvaluation(item);
                                    setIsDialogOpen(true);
                                }}
                            >
                                <div className="col-span-4 flex items-center gap-3 w-full">
                                    <Avatar className="h-8 w-8 bg-white shadow-sm shrink-0">
                                        <AvatarFallback className="text-red-500 font-bold bg-red-50 text-xs">
                                            {item.patient?.name?.substring(0, 2).toUpperCase() || "PT"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm font-semibold text-slate-800 truncate">{item.patient?.name || "Paciente"}</span>
                                    {/* Mobile Status Badge inline with name */}
                                    <span className={`md:hidden ml-auto inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-opacity-60 ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div className="col-span-3 w-full md:w-auto pl-11 md:pl-0">
                                    <span className="text-sm text-slate-600 font-medium block md:inline">{item.type}</span>
                                    <span className="md:hidden text-xs text-slate-400 block mt-1">
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                </div>

                                <div className="hidden md:flex col-span-2 items-center gap-2 text-slate-500 text-sm">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(item.date).toLocaleDateString()}
                                </div>

                                <div className="hidden md:block col-span-2">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-opacity-60 ${getStatusColor(item.status)}`}>
                                        {item.status}
                                    </span>
                                </div>

                                <div className="col-span-1 hidden md:flex justify-end">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                        {filteredEvaluations.length === 0 && (
                            <div className="p-8 text-center text-slate-500 flex flex-col items-center gap-2">
                                <Search className="h-8 w-8 text-red-200" />
                                <p>Nenhuma avaliação encontrada.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EvaluationDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                patients={patients}
                evaluation={editingEvaluation}
                onSave={loadData}
            />
        </div>
    )
}

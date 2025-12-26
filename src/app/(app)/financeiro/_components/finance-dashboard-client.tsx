"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DollarSign,
    TrendingUp,
    CreditCard,
    Calendar,
    Search,
    Filter,
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    Download,
    MoreHorizontal,
    Loader2,
    Users,
    AlertCircle,
    CheckCircle,
    Phone,
    PieChart,
    Target
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FinanceDialog } from "./finance-dialog";
import { AvailabilityDialog } from "./availability-dialog";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

export default function FinanceDashboardClient({ initialMetrics, initialTransactions, patients }: any) {
    const { toast } = useToast();
    const router = useRouter();
    const [transactions, setTransactions] = useState(initialTransactions || []);
    const [filteredTransactions, setFilteredTransactions] = useState(initialTransactions || []);
    const [metrics, setMetrics] = useState(initialMetrics || {
        netBalance: 0,
        income: 0,
        expenses: 0,
        forecast: 0,
        defaultTotal: 0,
        efficiency: {
            avgTicket: 0,
            occupancyRate: 0
        }
    });

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
    const formatPercent = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 }).format(val / 100);

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filters
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // Re-filter when search or transactions change
    useEffect(() => {
        let result = transactions;

        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter((t: any) =>
                (t.patient?.name || t.description || "").toLowerCase().includes(lower)
            );
        }

        // Mapping filters
        // typeFilter: 'INCOME' | 'EXPENSE'
        if (typeFilter !== 'all') {
            result = result.filter((t: any) => t.flow === typeFilter);
        }

        if (statusFilter !== 'all') {
            // simplified matching, adapt to your exact status strings
            result = result.filter((t: any) => t.status?.toLowerCase() === statusFilter);
        }

        setFilteredTransactions(result);
    }, [searchTerm, typeFilter, statusFilter, transactions]);

    const handleWhatsApp = (phone: string, patientName: string) => {
        if (!phone) {
            toast({ title: "Erro", description: "Telefone não cadastrado.", variant: "destructive" });
            return;
        }
        // Assuming BILLING context for dashboard actions on pending items
        const url = getWhatsAppLink(phone, patientName, 'BILLING');
        window.open(url, '_blank');
    };

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
                        <Wallet className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Financeiro Estratégico</h1>
                        <p className="text-slate-500">Visão completa de fluxo e performance.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/financeiro/adimplencia">
                        <Button variant="outline" className="bg-white/80 hover:bg-white text-slate-700 h-11 border-red-100 shadow-sm mr-2">
                            <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" /> Adimplência
                        </Button>
                    </Link>
                    <Button onClick={() => setIsDialogOpen(true)} className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 h-11 px-6">
                        {/* Replaced old button and dialog with new FinanceDialog usage */}
                        <FinanceDialog patients={patients} onSave={() => { router.refresh(); toast({ title: "Sucesso", description: "Transação salva com sucesso." }); }} />
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
                {/* Header Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800">Financeiro Estratégico</h2>
                        <p className="text-slate-500">Fluxo de Caixa e Indicadores de Performance</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <AvailabilityDialog />
                        <FinanceDialog patients={patients} onSave={() => { router.refresh(); toast({ title: "Sucesso", description: "Transação salva com sucesso." }); }} />
                    </div>
                </div>

                {/* KPI Cards Grid - Strategic Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                    {/* 1. Real Profit (Cash Flow) */}
                    <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-lg shadow-emerald-200">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-50">Lucro Real (Caixa)</CardTitle>
                            <TrendingUp className="h-4 w-4 text-emerald-100" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(initialMetrics.netBalance)}</div>
                            <p className="text-xs text-emerald-100 mt-1">
                                Receitas: {formatCurrency(initialMetrics.income)} | Despesas: {formatCurrency(initialMetrics.expenses)}
                            </p>
                        </CardContent>
                    </Card>

                    {/* 2. Occupancy Rate */}
                    <Card className={cn(
                        "border-none shadow-sm",
                        initialMetrics.efficiency.occupancyRate >= 70 ? "bg-white border-l-4 border-l-green-500" : "bg-white border-l-4 border-l-amber-500"
                    )}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Taxa de Ocupação</CardTitle>
                            <PieChart className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <div className="text-2xl font-bold text-slate-800">
                                    {formatPercent(initialMetrics.efficiency.occupancyRate)}
                                </div>
                                <span className="text-xs text-slate-400 mb-1">de capacidade</span>
                            </div>
                            {/* Simple Progress Bar */}
                            <div className="h-2 w-full bg-slate-100 rounded-full mt-2 overflow-hidden">
                                <div
                                    className={cn("h-full rounded-full transition-all", initialMetrics.efficiency.occupancyRate >= 70 ? "bg-green-500" : "bg-amber-500")}
                                    style={{ width: `${Math.min(initialMetrics.efficiency.occupancyRate, 100)}%` }}
                                />
                            </div>
                            {initialMetrics.efficiency.occupancyRate < 70 && (
                                <p className="text-[10px] text-amber-600 mt-1 font-medium">Há espaço para novos pacientes.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* 3. Average Ticket */}
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Ticket Médio / Sessão</CardTitle>
                            <Target className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">
                                {formatCurrency(initialMetrics.efficiency.avgTicket)}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                                Baseado em {initialMetrics.efficiency.occupiedAppointments} sessões realizadas
                            </p>
                        </CardContent>
                    </Card>

                    {/* 4. Forecast or Default (Toggle? Or just Default for now) */}
                    <Card className="bg-white border-slate-100 shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Previsão (30d)</CardTitle>
                            <Calendar className="h-4 w-4 text-slate-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-800">{formatCurrency(initialMetrics.forecast)}</div>
                            <p className="text-xs text-slate-400 mt-1">
                                A Receber + Agendamentos
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Management Table */}
            <div className={`p-6 rounded-3xl ${glassCard} relative z-10`}>
                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-300" />
                        <Input
                            placeholder="Buscar..."
                            className={`pl-10 h-11 rounded-xl ${glassInput}`}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className={`w-[140px] rounded-xl h-11 ${glassInput}`}>
                                <SelectValue placeholder="Fluxo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="INCOME">Receita</SelectItem>
                                <SelectItem value="EXPENSE">Despesa</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className={`w-[140px] rounded-xl h-11 ${glassInput}`}>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="pago">Pago</SelectItem>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="atrasado">Atrasado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-red-100">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-red-50/50 border-b border-red-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4">Descrição / Paciente</div>
                        <div className="col-span-2">Fluxo</div>
                        <div className="col-span-2">Valor</div>
                        <div className="col-span-2">Vencimento</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1 text-right">Ações</div>
                    </div>

                    <div className="divide-y divide-red-100 bg-white/50">
                        {filteredTransactions.map((t: any) => (
                            <div key={t.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/40 transition-colors group">
                                <div className="col-span-4">
                                    <div className="font-bold text-slate-800 text-sm mb-0.5">
                                        {t.description || "Sem descrição"}
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        {t.patient?.name || "Geral"}
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <Badge variant="outline" className={t.flow === 'INCOME' ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}>
                                        {t.flow === 'INCOME' ? "Receita" : "Despesa"}
                                    </Badge>
                                </div>
                                <div className="col-span-2 font-bold text-slate-700">
                                    R$ {t.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="col-span-2 text-sm text-slate-500 font-medium">
                                    {t.dueDate ? new Date(t.dueDate).toLocaleDateString('pt-BR') : "-"}
                                </div>
                                <div className="col-span-1">
                                    <span className={`
                                        inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide
                                        ${t.status?.toLowerCase() === 'pago' ? 'bg-green-100 text-green-700' : ''}
                                        ${t.status?.toLowerCase() === 'pendente' ? 'bg-orange-100 text-orange-700' : ''}
                                        ${t.status?.toLowerCase() === 'atrasado' ? 'bg-red-100 text-red-700' : ''}
                                    `}>
                                        {t.status}
                                    </span>
                                </div>
                                <div className="col-span-1 flex justify-end gap-2">
                                    {t.status?.toLowerCase() !== 'pago' && t.patient?.phone && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-green-600 hover:bg-green-50"
                                            title="Cobrar via WhatsApp"
                                            onClick={() => handleWhatsApp(t.patient.phone, t.patient.name)}
                                        >
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <FinanceDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                patients={patients}
                onSave={() => {
                    router.refresh();
                    toast({ title: "Sucesso", description: "Transação salva com sucesso." });
                }}
            />

        </div>
    );
}

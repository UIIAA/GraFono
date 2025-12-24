"use client";

import { useState } from "react";
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
    MoreHorizontal
} from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

// Types
type TransactionType = 'avaliacao' | 'tratamento';
type TransactionStatus = 'pago' | 'pendente' | 'atrasado';

interface Transaction {
    id: string;
    patientName: string;
    description: string;
    type: TransactionType;
    value: number;
    status: TransactionStatus;
    date: string;
    dueDate: string;
}

// Mock Data
const transactions: Transaction[] = [
    {
        id: "t1",
        patientName: "João Silva",
        description: "Avaliação Inicial Completa",
        type: "avaliacao",
        value: 350.00,
        status: "pago",
        date: "20 Dez 2024",
        dueDate: "20 Dez 2024"
    },
    {
        id: "t2",
        patientName: "Maria Santos",
        description: "Pacote Mensal (Dezembro)",
        type: "tratamento",
        value: 1200.00,
        status: "pago",
        date: "15 Dez 2024",
        dueDate: "15 Dez 2024"
    },
    {
        id: "t3",
        patientName: "Pedro Souza",
        description: "Avaliação de Processamento Auditivo",
        type: "avaliacao",
        value: 400.00,
        status: "pendente",
        date: "-",
        dueDate: "28 Dez 2024"
    },
    {
        id: "t4",
        patientName: "Ana Oliveira",
        description: "Sessão Avulsa",
        type: "tratamento",
        value: 150.00,
        status: "atrasado",
        date: "-",
        dueDate: "22 Dez 2024"
    },
    {
        id: "t5",
        patientName: "Lucas Lima",
        description: "Pacote Mensal (Dezembro)",
        type: "tratamento",
        value: 1200.00,
        status: "pendente",
        date: "-",
        dueDate: "30 Dez 2024"
    }
];

export default function FinanceiroPage() {
    // Calculations
    const totalRevenue = transactions
        .filter(t => t.status === 'pago')
        .reduce((acc, t) => acc + t.value, 0);

    const pendingRevenue = transactions
        .filter(t => t.status === 'pendente' || t.status === 'atrasado')
        .reduce((acc, t) => acc + t.value, 0);

    const evaluationRevenue = transactions
        .filter(t => t.type === 'avaliacao' && t.status === 'pago')
        .reduce((acc, t) => acc + t.value, 0);

    const treatmentRevenue = transactions
        .filter(t => t.type === 'tratamento' && t.status === 'pago')
        .reduce((acc, t) => acc + t.value, 0);

    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassPanel = "bg-white/50 backdrop-blur-sm border border-red-100 rounded-2xl";
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
                        <h1 className="text-2xl font-bold text-slate-800">Financeiro</h1>
                        <p className="text-slate-500">Gestão de Receita e Fluxo de Caixa</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="bg-white/50 border-white/60 hover:bg-white text-slate-700 rounded-xl">
                        <Download className="mr-2 h-4 w-4" /> Exportar
                    </Button>
                    <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 h-11 px-6">
                        <DollarSign className="mr-2 h-4 w-4" /> Nova Receita
                    </Button>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 relative z-10">
                {/* Total Revenue */}
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl shadow-slate-400/50 rounded-3xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                        <CardTitle className="text-sm font-medium text-slate-300">Receita Total (Mês)</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className="text-2xl font-bold text-white">
                            R$ {totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-400 font-medium flex items-center mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" /> +15% vs mês anterior
                        </p>
                    </CardContent>
                </Card>

                {/* Pending */}
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">A Receber</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            R$ {pendingRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-1">
                            Previsão para os próximos 7 dias
                        </p>
                    </CardContent>
                </Card>

                {/* Evaluations (One Shot) */}
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Avaliações (One-shot)</CardTitle>
                        <CreditCard className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            R$ {evaluationRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
                            <div className="h-full bg-blue-500" style={{ width: '30%' }} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 text-right">30% da receita</p>
                    </CardContent>
                </Card>

                {/* Treatments (Recurring) */}
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Tratamentos (Recorrente)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            R$ {treatmentRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mt-3">
                            <div className="h-full bg-purple-500" style={{ width: '70%' }} />
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 text-right">70% da receita</p>
                    </CardContent>
                </Card>

                {/* Active Patients (Avaliação + Tratamento) */}
                <Card className={`${glassCard} border-0`}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-slate-600">Pacientes Ativos</CardTitle>
                        <Wallet className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-slate-800">
                            3
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                            Ticket Médio: R$ {((totalRevenue) / 3).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Content Area */}
            <div className={`p-6 rounded-3xl ${glassCard} relative z-10`}>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                    <div className="relative flex-1 w-full group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-300 group-focus-within:text-red-500 transition-colors" />
                        <Input
                            placeholder="Buscar transações..."
                            className={`pl-10 h-11 rounded-xl ${glassInput}`}
                        />
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <Select defaultValue="all">
                            <SelectTrigger className={`w-[140px] rounded-xl h-11 ${glassInput}`}>
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="avaliacao">Avaliação</SelectItem>
                                <SelectItem value="tratamento">Tratamento</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select defaultValue="all">
                            <SelectTrigger className={`w-[140px] rounded-xl h-11 ${glassInput}`}>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="pago">Pago</SelectItem>
                                <SelectItem value="pendente">Pendente</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Transaction List */}
                <div className="overflow-hidden rounded-xl border border-red-100">
                    <div className="grid grid-cols-12 gap-4 p-4 bg-red-50/50 border-b border-red-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <div className="col-span-4">Paciente / Descrição</div>
                        <div className="col-span-2">Tipo</div>
                        <div className="col-span-2">Valor</div>
                        <div className="col-span-2">Vencimento</div>
                        <div className="col-span-1">Status</div>
                        <div className="col-span-1 text-right">Ações</div>
                    </div>

                    <div className="divide-y divide-red-100 bg-white/50">
                        {transactions.map((t) => (
                            <div key={t.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/40 transition-colors group cursor-pointer">
                                <div className="col-span-4">
                                    <div className="font-bold text-slate-800 text-sm mb-0.5">{t.patientName}</div>
                                    <div className="text-xs text-slate-500">{t.description}</div>
                                </div>
                                <div className="col-span-2">
                                    <Badge
                                        variant="outline"
                                        className={`
                                            ${t.type === 'avaliacao' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'} 
                                            text-[10px] uppercase font-bold px-2 py-0.5 rounded-md
                                        `}
                                    >
                                        {t.type}
                                    </Badge>
                                </div>
                                <div className="col-span-2 font-bold text-slate-700">
                                    R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </div>
                                <div className="col-span-2 text-sm text-slate-500 font-medium">
                                    {t.dueDate}
                                </div>
                                <div className="col-span-1">
                                    <span
                                        className={`
                                            inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide
                                            ${t.status === 'pago' ? 'bg-green-100 text-green-700' : ''}
                                            ${t.status === 'pendente' ? 'bg-orange-100 text-orange-700' : ''}
                                            ${t.status === 'atrasado' ? 'bg-red-100 text-red-700' : ''}
                                        `}
                                    >
                                        {t.status}
                                    </span>
                                </div>
                                <div className="col-span-1 flex justify-end">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    )
}

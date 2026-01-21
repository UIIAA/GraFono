"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CheckCircle, Clock, AlertCircle, RefreshCw, Filter, AlertTriangle, DollarSign, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getWhatsAppLink } from "@/lib/whatsapp";
import { settleTransaction, generateMonthlyCharges, undoSettlement } from "@/app/actions/finance";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface DelinquencyStats {
    count: number;
    totalAmount: number;
    oldestDays: number;
}

export function ComplianceListClient({
    initialTransactions,
    month,
    year,
    delinquencyStats
}: {
    initialTransactions: any[],
    month: number,
    year: number,
    delinquencyStats: DelinquencyStats | null | undefined
}) {
    const { toast } = useToast();
    const router = useRouter();
    const [transactions, setTransactions] = useState(initialTransactions);
    const [loading, setLoading] = useState<string | null>(null); // 'generate' or transaction ID
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await generateMonthlyCharges(month, year);
            if (res.success) {
                toast({ title: "Sucesso", description: `${res.count} cobranças geradas.` });
                router.refresh();
            } else {
                toast({ title: "Erro", description: "Falha ao gerar cobranças.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Erro", description: "Erro desconhecido.", variant: "destructive" });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSettle = async (id: string) => {
        setLoading(id);
        try {
            const res = await settleTransaction(id);
            if (res.success) {
                toast({ title: "Pago!", description: "Baixa realizada com sucesso." });
                // Optimistic update
                setTransactions(prev => prev.map((t: any) =>
                    t.id === id ? { ...t, status: "PAID", complianceStatus: "PAID", paymentDate: new Date() } : t
                ));
                router.refresh();
            } else {
                toast({ title: "Erro", description: "Falha ao dar baixa.", variant: "destructive" });
            }
        } catch {
            toast({ title: "Erro", description: "Erro ao processar.", variant: "destructive" });
        } finally {
            setLoading(null);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "PAID":
                return <Badge className="bg-green-500 text-white hover:bg-green-600">Liquidado</Badge>;
            case "OVERDUE":
                return <Badge variant="destructive" className="animate-pulse">Atrasado</Badge>;
            case "WAITING":
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Aguardando</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    // Sort: Overdue > Waiting > Paid
    const [sourceFilter, setSourceFilter] = useState("ALL"); // ALL, PARTICULAR, CONVENIO

    const handleWhatsApp = (phone: string, patientName: string, monthStr?: string) => {
        if (!phone) {
            toast({ title: "Erro", description: "Telefone não cadastrado.", variant: "destructive" });
            return;
        }
        const url = getWhatsAppLink(phone, patientName, 'BILLING', { month: monthStr });
        window.open(url, '_blank');
    };

    const filteredTransactions = transactions.filter((t: any) => {
        if (sourceFilter === "ALL") return true;
        // Check t.source (which comes from the transaction record)
        // OR check t.patient?.financialSource if t.source is missing? (Fallback)
        // ideally t.source should be populated.
        return t.source === sourceFilter;
    });

    const sortedTransactions = [...filteredTransactions].sort((a, b) => {
        const priority: any = { "OVERDUE": 0, "WAITING": 1, "PAID": 2 };
        if (priority[a.complianceStatus] !== priority[b.complianceStatus]) {
            return priority[a.complianceStatus] - priority[b.complianceStatus];
        }
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });

    return (
        <div className="space-y-6">
            {/* Delinquency Summary Cards */}
            {delinquencyStats && delinquencyStats.count > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="h-8 w-8 text-red-500" />
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Inadimplentes</p>
                                    <p className="text-2xl font-bold text-red-700">{delinquencyStats.count}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <DollarSign className="h-8 w-8 text-red-500" />
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Total Atrasado</p>
                                    <p className="text-2xl font-bold text-red-700">
                                        R$ {delinquencyStats.totalAmount.toLocaleString('pt-BR')}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="border-red-200 bg-red-50">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <Calendar className="h-8 w-8 text-red-500" />
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Mais Antigo</p>
                                    <p className="text-2xl font-bold text-red-700">{delinquencyStats.oldestDays} dias</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-slate-500" />
                    Controle de Adimplência
                </h2>
                <Button
                    variant="outline"
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="border-dashed border-slate-300 text-slate-600 hover:text-slate-800"
                >
                    <RefreshCw className={cn("mr-2 h-4 w-4", isGenerating && "animate-spin")} />
                    Gerar Cobranças
                </Button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-4">
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                    <SelectTrigger className="w-[180px] bg-white border-slate-200">
                        <Filter className="w-4 h-4 mr-2 text-slate-400" />
                        <SelectValue placeholder="Filtrar Origem" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Todas as Origens</SelectItem>
                        <SelectItem value="PARTICULAR">Particular</SelectItem>
                        <SelectItem value="CONVENIO">Convênio</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-50 bg-slate-50/50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-1">Status</div>
                    <div className="col-span-3">Paciente</div>
                    <div className="col-span-3">Serviço</div>
                    <div className="col-span-2">Vencimento</div>
                    <div className="col-span-2 text-right">Valor</div>
                    <div className="col-span-1 text-center">Ação</div>
                </div>

                {sortedTransactions.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        Nenhuma pendência encontrada para este período.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {sortedTransactions.map((t: any) => (
                            <div
                                key={t.id}
                                className={cn(
                                    "grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-slate-50",
                                    t.complianceStatus === "PAID" && "bg-green-50/30 hover:bg-green-50/50 grayscale opacity-80",
                                    t.complianceStatus === "OVERDUE" && "bg-red-50 hover:bg-red-100 border-l-4 border-red-500"
                                )}
                            >
                                <div className="col-span-1">
                                    {getStatusBadge(t.complianceStatus)}
                                </div>
                                <div className="col-span-3">
                                    <span className="font-bold text-slate-700 block">{t.patient?.name}</span>
                                    <span className="text-xs text-slate-400 capitalize">{t.source?.toLowerCase()}</span>
                                </div>
                                <div className="col-span-3 text-sm text-slate-600">
                                    {t.description}
                                </div>
                                <div className="col-span-2 text-sm font-medium text-slate-600">
                                    {format(new Date(t.dueDate), "dd/MM/yyyy")}
                                </div>
                                <div className="col-span-2 text-right font-bold text-slate-800">
                                    R$ {t.amount}
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    {t.complianceStatus === "PAID" ? (
                                        <CheckCircle className="h-6 w-6 text-green-500 opacity-50" />
                                    ) : (
                                        <div className="flex gap-2 justify-end">
                                            {t.patient?.phone && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-green-600 hover:bg-green-50"
                                                    title="Cobrar via WhatsApp"
                                                    onClick={() => handleWhatsApp(t.patient.phone, t.patient.name, format(new Date(t.dueDate), "MMMM", { locale: ptBR }))}
                                                >
                                                    <CheckCircle className="h-4 w-4" />
                                                </Button>
                                            )}
                                            <Button
                                                size="icon"
                                                className="h-8 w-8 rounded-full bg-slate-100 text-slate-400 hover:bg-green-500 hover:text-white transition-all shadow-sm hover:shadow-green-200"
                                                onClick={() => handleSettle(t.id)}
                                                disabled={loading === t.id}
                                            >
                                                {loading === t.id ? (
                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="h-5 w-5" />
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

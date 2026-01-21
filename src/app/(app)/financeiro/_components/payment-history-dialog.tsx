"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { History, CheckCircle, RotateCcw, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPaymentHistory } from "@/app/actions/finance";

interface PaymentHistoryEntry {
    id: string;
    action: string;
    amount: number;
    month: number;
    year: number;
    createdAt: Date;
}

export function PaymentHistoryDialog({
    transactionId,
    transactionDescription
}: {
    transactionId: string;
    transactionDescription: string;
}) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<PaymentHistoryEntry[]>([]);

    useEffect(() => {
        if (open) {
            loadHistory();
        }
    }, [open]);

    const loadHistory = async () => {
        setLoading(true);
        const result = await getPaymentHistory(transactionId);
        if (result.success) {
            setHistory(result.data || []);
        }
        setLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Histórico">
                    <History className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-white/95 backdrop-blur-xl shadow-2xl border-white/20">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <History className="h-5 w-5" />
                        Histórico de Pagamento
                    </DialogTitle>
                    <p className="text-sm text-slate-500">{transactionDescription}</p>
                </DialogHeader>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        Nenhum histórico de pagamento registrado.
                    </div>
                ) : (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                        {history.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100"
                            >
                                <div className="flex items-center gap-3">
                                    {entry.action === "PAID" ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <RotateCcw className="h-5 w-5 text-amber-500" />
                                    )}
                                    <div>
                                        <Badge
                                            className={
                                                entry.action === "PAID"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-amber-100 text-amber-700"
                                            }
                                        >
                                            {entry.action === "PAID" ? "Pago" : "Estornado"}
                                        </Badge>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {format(new Date(entry.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-slate-700">
                                        R$ {entry.amount.toLocaleString('pt-BR')}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {entry.month}/{entry.year}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

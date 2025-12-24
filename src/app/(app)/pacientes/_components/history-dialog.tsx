import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, History, Loader2 } from "lucide-react";
import { getPatientHistory, addPatientHistory } from "@/app/actions/patient";
import { Patient, PatientHistoryEntry } from "../types";

interface HistoryDialogProps {
    patient: Patient;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function HistoryDialog({ patient, open, onOpenChange }: HistoryDialogProps) {
    const [history, setHistory] = useState<PatientHistoryEntry[]>([]);
    const [newPoint, setNewPoint] = useState("");
    const [loading, setLoading] = useState(false);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (open && patient) {
            loadHistory();
        }
    }, [open, patient]);

    async function loadHistory() {
        setLoading(true);
        const res = await getPatientHistory(patient.id);
        if (res.success && res.data) {
            // Map DB dates to string or Date
            const mapped = res.data.map((h: any) => ({
                id: h.id,
                content: h.content,
                date: new Date(h.date)
            }));
            setHistory(mapped);
        }
        setLoading(false);
    }

    async function handleAdd() {
        if (!newPoint.trim()) return;
        setAdding(true);
        const res = await addPatientHistory(patient.id, newPoint);
        if (res.success) {
            setNewPoint("");
            loadHistory();
        }
        setAdding(false);
    }

    return (
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-red-100 rounded-2xl shadow-2xl">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600">
                    <History className="w-5 h-5" />
                    Histórico do Paciente
                </DialogTitle>
                <p className="text-sm text-slate-500">
                    Pontos relevantes e observações para {patient.name}
                </p>
            </DialogHeader>

            <div className="flex gap-2 mt-4">
                <Input
                    placeholder="Adicionar novo ponto relevante..."
                    value={newPoint}
                    onChange={(e) => setNewPoint(e.target.value)}
                    className="flex-1 bg-white/50 border-red-100 focus:bg-white"
                    onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                />
                <Button
                    onClick={handleAdd}
                    disabled={adding || !newPoint.trim()}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl"
                >
                    {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </Button>
            </div>

            <ScrollArea className="h-[300px] pr-4 mt-4">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center text-slate-400 py-8 text-sm">
                        Nenhum histórico registrado.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {history.map((item) => (
                            <div key={item.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-sm">
                                <p className="text-slate-700">{item.content}</p>
                                <p className="text-[10px] text-slate-400 mt-1 text-right">
                                    {new Date(item.date).toLocaleDateString('pt-BR')} às {new Date(item.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </DialogContent>
    );
}

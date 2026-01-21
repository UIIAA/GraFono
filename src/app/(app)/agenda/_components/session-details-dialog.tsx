"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    Calendar, Clock, MapPin, User, FileText, History,
    CheckCircle, AlertTriangle, Smile, Frown, Meh, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { saveEvolution, getEvolutions } from "@/app/actions/evolution";
import { useToast } from "@/hooks/use-toast";

interface SessionDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    appointment: any; // Full appointment object with patient relation
    onSave?: () => void;
}

export function SessionDetailsDialog({ open, onOpenChange, appointment, onSave }: SessionDetailsDialogProps) {
    const { toast } = useToast();
    const [activeTab, setActiveTab] = useState("evolution");
    const [loading, setLoading] = useState(false);

    // Evolution Form State
    const [content, setContent] = useState("");
    const [emotionalStatus, setEmotionalStatus] = useState("Colaborativo");

    // History State
    const [history, setHistory] = useState<any[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (open && appointment?.patientId) {
            // Reset for new open
            setHistory([]);
            setPage(1);
            setHasMore(false);
            loadHistory(1, true);

            // Reset form state for new appointment
            setContent("");
            setEmotionalStatus("Colaborativo");
            // In future: load existing evolution if user already saved one for this ID
        } else if (!open) {
            // Optional: clear on close too, for safety
            setContent("");
        }
    }, [open, appointment]);

    async function loadHistory(pageNum: number, reset: boolean = false) {
        if (!appointment?.patientId) return;
        setLoadingHistory(true);
        const res = await getEvolutions(appointment.patientId, pageNum);

        if (res.success && res.data) {
            setHistory(prev => reset ? res.data : [...prev, ...res.data]);
            setHasMore(res.hasMore || false);
        }
        setLoadingHistory(false);
    }

    function handleLoadMore() {
        const nextPage = page + 1;
        setPage(nextPage);
        loadHistory(nextPage);
    }

    async function handleSaveEvolution() {
        if (!content) {
            toast({ title: "Erro", description: "O conteúdo é obrigatório.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await saveEvolution({
                patientId: appointment.patientId,
                content,
                emotionalStatus,
                type: appointment.patient.financialSource || "PARTICULAR",
                date: new Date(), // Realization date
                appointmentId: appointment.id
            });

            if (res.success) {
                toast({ title: "Sucesso", description: "Evolução registrada." });
                onOpenChange(false);
                setContent(""); // Reset

                // Refresh data after close animation to improve UX
                if (onSave) {
                    setTimeout(() => {
                        onSave();
                    }, 300);
                }
            } else {
                toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Erro", description: "Erro interno.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    if (!appointment) return null;

    const emotionalOptions = [
        { label: "Colaborativo", icon: Smile, color: "text-green-500" },
        { label: "Resistente", icon: Frown, color: "text-red-500" },
        { label: "Agitado", icon: AlertTriangle, color: "text-orange-500" },
        { label: "Neutro", icon: Meh, color: "text-slate-500" },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white">
                {/* Header with Patient context */}
                <div className="bg-slate-50 border-b p-6 pb-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <User className="h-5 w-5 text-slate-400" />
                            {appointment.patient?.name || "Paciente"}
                        </DialogTitle>
                        <DialogDescription className="flex items-center gap-4 mt-2 text-slate-500">
                            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border text-xs font-medium">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(appointment.date), "dd 'de' MMMM", { locale: ptBR })}
                            </span>
                            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border text-xs font-medium">
                                <Clock className="h-3 w-3" />
                                {appointment.time}
                            </span>
                            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border text-xs font-medium">
                                <MapPin className="h-3 w-3" />
                                {appointment.location || "Presencial"}
                            </span>
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
                    <div className="px-6 pt-4 border-b bg-slate-50/50">
                        {/* Premium 'Segmented Control' / Pill Style */}
                        <TabsList className="grid w-full grid-cols-2 bg-slate-200/50 p-1.5 rounded-full">
                            <TabsTrigger
                                value="evolution"
                                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300 font-semibold py-2"
                            >
                                <FileText className="w-4 h-4 mr-2" />
                                Nova Evolução
                            </TabsTrigger>
                            <TabsTrigger
                                value="history"
                                className="rounded-full data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all duration-300 font-semibold py-2"
                            >
                                <History className="w-4 h-4 mr-2" />
                                Histórico do Paciente
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* NEW EVOLUTION TAB */}
                    <TabsContent value="evolution" className="flex-1 flex flex-col p-6 gap-4 overflow-y-auto m-0">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Estado Emocional</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {emotionalOptions.map((opt) => (
                                        <button
                                            key={opt.label}
                                            onClick={() => setEmotionalStatus(opt.label)}
                                            className={cn(
                                                "flex flex-col items-center justify-center p-2 rounded-lg border transition-all h-20",
                                                emotionalStatus === opt.label
                                                    ? "bg-slate-900 border-slate-900 text-white shadow-md"
                                                    : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                                            )}
                                        >
                                            <opt.icon className={cn("w-5 h-5 mb-1", emotionalStatus === opt.label ? "text-white" : opt.color)} />
                                            <span className="text-[10px] font-medium">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2 flex-1 flex flex-col">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Anotações da Sessão</label>
                                <Textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Descreva o que foi trabalhado, progresso e observações..."
                                    className="flex-1 min-h-[200px] resize-none text-base p-4 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t mt-auto">
                            <Button variant="ghost" className="hover:bg-slate-100 rounded-xl font-medium" onClick={() => onOpenChange(false)}>Cancelar</Button>
                            <Button
                                onClick={handleSaveEvolution}
                                disabled={loading}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-200 transition-all hover:scale-105 active:scale-95 font-bold"
                            >
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar e Finalizar
                            </Button>
                        </div>
                    </TabsContent>

                    {/* HISTORY TAB */}
                    <TabsContent value="history" className="flex-1 overflow-y-hidden m-0 flex flex-col bg-slate-50/30">
                        <ScrollArea className="flex-1 p-6">
                            {loadingHistory && history.length === 0 ? (
                                <div className="flex items-center justify-center h-40 text-slate-400">
                                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                                    Carregando histórico...
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-10 text-slate-400">
                                    Nenhuma evolução anterior encontrada.
                                </div>
                            ) : (
                                <div className="space-y-0 relative">
                                    {/* Vertical Timeline Line */}
                                    <div className="absolute left-[29px] top-4 bottom-4 w-px bg-slate-200" />

                                    {history.map((evo: any) => (
                                        <div key={evo.id} className="relative pl-16 pb-8 group">
                                            {/* Timeline Dot */}
                                            <div className="absolute left-[24px] top-1 w-3 h-3 rounded-full bg-white border-[3px] border-slate-300 group-hover:border-emerald-500 group-hover:scale-110 transition-all z-10 shadow-sm" />

                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-tight flex items-center gap-2">
                                                        {format(new Date(evo.date), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                                        <span className="text-slate-300 font-light text-[10px]">•</span>
                                                        <span className="text-slate-400 font-medium">{format(new Date(evo.date), "HH:mm")}</span>
                                                    </span>
                                                    {evo.emotionalStatus && (
                                                        <span className={cn(
                                                            "text-[10px] px-2 py-0.5 rounded-full font-medium border",
                                                            evo.emotionalStatus === "Colaborativo" ? "bg-green-50 text-green-700 border-green-100" :
                                                                evo.emotionalStatus === "Resistente" ? "bg-red-50 text-red-700 border-red-100" :
                                                                    evo.emotionalStatus === "Agitado" ? "bg-orange-50 text-orange-700 border-orange-100" :
                                                                        "bg-slate-100 text-slate-600 border-slate-200"
                                                        )}>
                                                            {evo.emotionalStatus}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-700 whitespace-pre-wrap bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm transition-shadow hover:shadow-md">
                                                    {evo.content}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="pl-16 pt-2 pb-4">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleLoadMore}
                                                disabled={loadingHistory}
                                                className="w-full text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                                            >
                                                {loadingHistory ? (
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                ) : (
                                                    <Clock className="h-4 w-4 mr-2" />
                                                )}
                                                Carregar mais histórico
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, FileText, Frown, Meh, Smile, Paperclip, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { saveEvolution } from "@/app/actions/evolution";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EvolutionFormProps {
    patient: {
        id: string;
        name: string;
        financialSource: string;
    };
    financialStatus: {
        status: string;
        message: string;
    };
}

export function EvolutionForm({ patient, financialStatus }: EvolutionFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState(patient.financialSource || "PARTICULAR");
    const [emotionalStatus, setEmotionalStatus] = useState("Colaborativo");
    const [content, setContent] = useState("");

    // Attachments (Mock for now, or just text input for URL)
    const [fileUrl, setFileUrl] = useState("");

    async function handleSubmit() {
        if (!content) {
            toast({ title: "Atenção", description: "O descritivo da evolução é obrigatório.", variant: "destructive" });
            return;
        }

        setLoading(true);
        try {
            const res = await saveEvolution({
                patientId: patient.id,
                date: new Date(date),
                type,
                emotionalStatus,
                content,
                fileUrl
            });

            if (res.success) {
                if (res.warning) {
                    toast({
                        title: "Evolução Salva",
                        description: res.warning,
                        variant: "destructive", // Red Warning
                        duration: 6000
                    });
                } else {
                    toast({ title: "Sucesso", description: "Evolução registrada." });
                }
                router.push("/pacientes"); // Or back to dashboard
                router.refresh();
            } else {
                toast({ title: "Erro", description: "Falha ao salvar.", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Erro", description: "Erro inesperado.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    const emotionalOptions = [
        { label: "Colaborativo", icon: Smile, color: "text-green-500" },
        { label: "Resistente", icon: Frown, color: "text-red-500" },
        { label: "Agitado", icon: AlertTriangle, color: "text-orange-500" },
        { label: "Neutro", icon: Meh, color: "text-slate-500" },
        { label: "Alegre", icon: Smile, color: "text-blue-500" },
        { label: "Choroso", icon: Frown, color: "text-indigo-500" }
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <div className={cn(
                "p-6 pb-8",
                patient.financialSource === 'CONVENIO' ? "bg-blue-600" : "bg-emerald-600"
            )}>
                <div className="flex items-center gap-4 mb-4">
                    <Link href="/pacientes">
                        <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 rounded-full">
                            <ArrowLeft className="w-6 h-6" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-white">Nova Evolução</h1>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{patient.name}</h2>
                        <Badge variant="secondary" className="mt-2 bg-white/20 text-white hover:bg-white/30 border-0">
                            {patient.financialSource === 'CONVENIO' ? 'Convênio' : 'Particular'}
                        </Badge>
                    </div>
                </div>
            </div>

            {/* Form Body - Rounded overlap */}
            <div className="flex-1 px-4 -mt-6">
                <Card className="rounded-xl shadow-lg border-0 mb-20">
                    <CardContent className="p-6 space-y-6">

                        {/* Date & Type Row */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Data</label>
                                <div className="relative">
                                    <Input
                                        type="date"
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="pl-9"
                                    />
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase">Tipo</label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PARTICULAR">Particular</SelectItem>
                                        <SelectItem value="CONVENIO">Convênio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Emotional Status */}
                        <div className="space-y-3">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Estado Emocional</label>
                            <div className="grid grid-cols-3 gap-2">
                                {emotionalOptions.map((opt) => (
                                    <button
                                        key={opt.label}
                                        onClick={() => setEmotionalStatus(opt.label)}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                                            emotionalStatus === opt.label
                                                ? "bg-slate-900 border-slate-900 text-white shadow-md scale-105"
                                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                                        )}
                                    >
                                        <opt.icon className={cn("w-6 h-6 mb-1", emotionalStatus === opt.label ? "text-white" : opt.color)} />
                                        <span className="text-[10px] font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase flex justify-between">
                                Descritivo
                                <span className="text-slate-300 font-normal normal-case">Rich Text (Simples)</span>
                            </label>
                            <Textarea
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder="Descreva a evolução do paciente..."
                                className="min-h-[200px] bg-slate-50 border-slate-200 focus:bg-white transition-colors p-4 text-base leading-relaxed"
                            />
                        </div>

                        {/* Attachments */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Anexos</label>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Link do arquivo (Google Drive, etc)..."
                                    value={fileUrl}
                                    onChange={e => setFileUrl(e.target.value)}
                                    className="flex-1"
                                />
                                <Button variant="outline" size="icon">
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>

            {/* Footer - Fixed */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 pb-8 safe-area-pb shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-md mx-auto space-y-3">
                    {/* Financial Status */}
                    <div className={cn(
                        "flex items-center justify-between px-4 py-2 rounded-lg text-sm font-medium",
                        financialStatus.status === 'PAID'
                            ? "bg-green-50 text-green-700"
                            : "bg-amber-50 text-amber-700"
                    )}>
                        <span className="flex items-center gap-2">
                            {financialStatus.status === 'PAID'
                                ? <CheckCircle className="w-4 h-4" />
                                : <AlertTriangle className="w-4 h-4" />
                            }
                            {financialStatus.message}
                        </span>
                        <span className="text-xs opacity-75 uppercase tracking-wider">Mês Atual</span>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={cn(
                            "w-full h-12 text-lg font-bold rounded-xl shadow-lg transition-transform active:scale-95",
                            patient.financialSource === 'CONVENIO'
                                ? "bg-blue-600 hover:bg-blue-700 shadow-blue-200"
                                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
                        )}
                    >
                        {loading ? "Salvando..." : "Salvar Evolução"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

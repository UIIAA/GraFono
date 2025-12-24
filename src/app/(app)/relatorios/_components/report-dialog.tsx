import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { saveReport } from "@/app/actions/report";
import { Patient } from "../../pacientes/types";

interface ReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patients: Patient[];
    report?: any;
    onSave: () => void;
}

export function ReportDialog({ open, onOpenChange, patients, report, onSave }: ReportDialogProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [patientId, setPatientId] = useState("");
    const [status, setStatus] = useState("Rascunho");
    const [type, setType] = useState("Avaliação");
    const [content, setContent] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (report) {
            setTitle(report.title || "");
            setDate(report.date ? new Date(report.date).toISOString().split('T')[0] : "");
            setPatientId(report.patientId || "");
            setStatus(report.status || "Rascunho");
            setType(report.type || "Avaliação");
            setContent(report.content || "");
            setFileUrl(report.fileUrl || "");
            setSummary(report.summary || "");
        } else {
            setTitle("");
            setDate(new Date().toISOString().split('T')[0]);
            setPatientId("");
            setStatus("Rascunho");
            setType("Avaliação");
            setContent("");
            setFileUrl("");
            setSummary("");
        }
    }, [report, open]);

    async function handleSave() {
        if (!title || !patientId || !date) return;
        setLoading(true);
        try {
            await saveReport({
                id: report?.id,
                title,
                date,
                patientId,
                status,
                type,
                content,
                fileUrl,
                summary
            });
            onSave();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save report", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-white/90 backdrop-blur-xl border border-white/50 max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{report ? "Editar Relatório" : "Novo Relatório"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Título do Relatório</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Relatório de Evolução Mensal"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Paciente</Label>
                        <Select value={patientId} onValueChange={setPatientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o paciente" />
                            </SelectTrigger>
                            <SelectContent>
                                {patients.map(p => (
                                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Data</Label>
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Rascunho">Rascunho</SelectItem>
                                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Tipo</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger>
                                <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Avaliação">Avaliação</SelectItem>
                                <SelectItem value="Evolução">Evolução</SelectItem>
                                <SelectItem value="Alta">Alta</SelectItem>
                                <SelectItem value="Encaminhamento">Encaminhamento</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Link do Arquivo (Link Externo)</Label>
                        <Input
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="https://..."
                        />
                        <p className="text-[10px] text-slate-500">Cole o link do seu documento (Google Drive, Dropbox, etc).</p>
                    </div>

                    <div className="grid gap-2">
                        <Label>Resumo / Contexto para IA</Label>
                        <Textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Resumo breve do que trata este documento..."
                            className="h-20"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Conteúdo (Texto Completo)</Label>
                        <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Digite ou cole o conteúdo do relatório aqui..."
                            className="min-h-[150px]"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
                        {loading ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

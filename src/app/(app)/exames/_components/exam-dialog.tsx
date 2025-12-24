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
import { saveExam } from "@/app/actions/exam";
import { Patient } from "../../pacientes/types";

interface ExamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patients: Patient[];
    exam?: any;
    onSave: () => void;
}

export function ExamDialog({ open, onOpenChange, patients, exam, onSave }: ExamDialogProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [patientId, setPatientId] = useState("");
    const [status, setStatus] = useState("Pendente");
    const [type, setType] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (exam) {
            setTitle(exam.title);
            setDate(new Date(exam.date).toISOString().split('T')[0]);
            setPatientId(exam.patientId);
            setStatus(exam.status);
            setType(exam.type || "");
            setFileUrl(exam.fileUrl || "");
            setSummary(exam.summary || "");
        } else {
            setTitle("");
            setDate(new Date().toISOString().split('T')[0]);
            setPatientId("");
            setStatus("Pendente");
            setType("");
            setFileUrl("");
            setSummary("");
        }
    }, [exam, open]);

    async function handleSave() {
        if (!title || !patientId || !date) return;
        setLoading(true);
        try {
            await saveExam({
                id: exam?.id,
                title,
                date,
                patientId,
                status,
                type,
                fileUrl,
                summary
            });
            onSave();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save exam", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-xl border border-white/50">
                <DialogHeader>
                    <DialogTitle>{exam ? "Editar Exame" : "Novo Exame"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Título do Exame</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Audiometria Tonal"
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
                            <Label>Data da Solicitação</Label>
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
                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                    <SelectItem value="Agendado">Agendado</SelectItem>
                                    <SelectItem value="Finalizado">Finalizado</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Link do Arquivo (URL)</Label>
                        <Input
                            value={fileUrl}
                            onChange={(e) => setFileUrl(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Tipo (Opcional)</Label>
                        <Input
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            placeholder="Ex: Rotina, Investigação"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Observações / Resumo</Label>
                        <Textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Resumo do exame ou observações..."
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

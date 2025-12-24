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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { saveAssessment } from "@/app/actions/assessment";
import { Patient } from "../../pacientes/types";

interface EvaluationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patients: Patient[];
    evaluation?: any;
    onSave: () => void;
}

export function EvaluationDialog({ open, onOpenChange, patients, evaluation, onSave }: EvaluationDialogProps) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [patientId, setPatientId] = useState("");
    const [status, setStatus] = useState("Pendente");
    const [type, setType] = useState("Avaliação Inicial");
    const [description, setDescription] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (evaluation) {
            setTitle(evaluation.title || "");
            setDate(evaluation.date ? new Date(evaluation.date).toISOString().split('T')[0] : "");
            setPatientId(evaluation.patientId || "");
            setStatus(evaluation.status || "Pendente");
            setType(evaluation.type || "Avaliação Inicial");
            setDescription(evaluation.description || "");
            setFileUrl(evaluation.fileUrl || "");
        } else {
            setTitle("");
            setDate(new Date().toISOString().split('T')[0]);
            setPatientId("");
            setStatus("Pendente");
            setType("Avaliação Inicial");
            setDescription("");
            setFileUrl("");
        }
    }, [evaluation, open]);

    async function handleSave() {
        if (!patientId || !date) return;
        setLoading(true);
        try {
            await saveAssessment({
                id: evaluation?.id,
                title,
                date,
                patientId,
                status,
                type,
                description,
                fileUrl
            });
            onSave();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save assessment", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-xl border border-white/50">
                <DialogHeader>
                    <DialogTitle>{evaluation ? "Editar Avaliação" : "Nova Avaliação"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
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

                    <div className="grid gap-2">
                        <Label>Título</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Avaliação Inicial de Fala"
                        />
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
                                    <SelectItem value="Agendado">Agendado</SelectItem>
                                    <SelectItem value="Pendente">Pendente</SelectItem>
                                    <SelectItem value="Concluído">Concluído</SelectItem>
                                    <SelectItem value="Cancelado">Cancelado</SelectItem>
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
                                <SelectItem value="Avaliação Inicial">Avaliação Inicial</SelectItem>
                                <SelectItem value="Reavaliação">Reavaliação</SelectItem>
                                <SelectItem value="Triagem">Triagem</SelectItem>
                                <SelectItem value="Alta">Alta</SelectItem>
                            </SelectContent>
                        </Select>
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
                        <Label>Observações</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Detalhes adicionais..."
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

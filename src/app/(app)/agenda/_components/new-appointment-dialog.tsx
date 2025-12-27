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
import { createAppointment } from "@/app/actions/appointment";
import { Patient } from "../../pacientes/types";

interface NewAppointmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patients: Patient[];
    initialDate?: Date;
    initialTime?: string;
    initialPatientId?: string;
    initialType?: string;
    onSave: () => void;
}

export function NewAppointmentDialog({
    open,
    onOpenChange,
    patients,
    initialDate,
    initialTime,
    initialPatientId,
    initialType,
    onSave
}: NewAppointmentDialogProps) {
    const [patientId, setPatientId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [type, setType] = useState("Avaliação");
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            if (initialDate) {
                setDate(initialDate.toISOString().split('T')[0]);
            } else {
                setDate(new Date().toISOString().split('T')[0]);
            }
            if (initialTime) {
                setTime(initialTime);
            } else {
                setTime("08:00");
            }

            setPatientId(initialPatientId || "");
            setType(initialType || "Avaliação");
            setNotes("");
        }
    }, [open, initialDate, initialTime, initialPatientId, initialType]);

    async function handleSave() {
        if (!patientId || !date || !time) return;
        setLoading(true);
        try {
            await createAppointment({
                date: new Date(date),
                time,
                patientId,
                type,
                notes
            });
            onSave();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to create appointment", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white border border-slate-100 shadow-xl">
                <DialogHeader>
                    <DialogTitle>Novo Agendamento</DialogTitle>
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
                            <Label>Horário</Label>
                            <Input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
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
                                <SelectItem value="Sessão de Devolutiva">Sessão de Devolutiva</SelectItem>
                                <SelectItem value="Terapia">Terapia</SelectItem>
                                <SelectItem value="Exame">Exame</SelectItem>
                                <SelectItem value="Outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label>Observações</Label>
                        <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Detalhes adicionais..."
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button onClick={handleSave} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
                        {loading ? "Agendando..." : "Confirmar Agendamento"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

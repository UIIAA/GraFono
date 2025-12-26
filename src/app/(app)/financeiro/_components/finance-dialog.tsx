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
import { saveTransaction } from "@/app/actions/finance";
import { Patient } from "../../pacientes/types";

interface FinanceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    patients: Patient[];
    onSave: () => void;
}

export function FinanceDialog({ open, onOpenChange, patients, onSave }: FinanceDialogProps) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState("tratamento");
    const [flow, setFlow] = useState("INCOME");
    const [category, setCategory] = useState("FIXED");
    const [source, setSource] = useState("PARTICULAR");
    const [status, setStatus] = useState("pendente");
    const [dueDate, setDueDate] = useState("");
    const [patientId, setPatientId] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) {
            setDescription("");
            setAmount("");
            setType("tratamento");
            setFlow("INCOME");
            setCategory("FIXED");
            setSource("PARTICULAR");
            setStatus("pendente");
            setDueDate(new Date().toISOString().split('T')[0]);
            setPatientId("");
        } else {
            setDueDate(new Date().toISOString().split('T')[0]);
        }
    }, [open]);

    // Auto-fill logic
    useEffect(() => {
        if (patientId) {
            const patient = patients.find(p => p.id === patientId);
            if (patient) {
                // Auto-set Source
                if (patient.financialSource) {
                    setSource(patient.financialSource);
                    // Also update category if needed?
                    // User requested: "preencher automaticamente a categoria da receita"
                    // Usually therapy income is VARIABLE (depends on sessions) or FIXED (monthly)?
                    // Let's assume VARIABLE for now as it's safer, or keep default.
                    // But definitely set the SOURCE.
                }

                // Optional: Pre-fill amount if negotiatedValue exists
                if (patient.negotiatedValue) {
                    setAmount(String(patient.negotiatedValue));
                }
            }
        }
    }, [patientId, patients]);

    async function handleSave() {
        if (!description || !amount || !dueDate) return;
        setLoading(true);
        try {
            await saveTransaction({
                description,
                amount: parseFloat(amount),
                type,
                flow,
                category,
                source,
                status,
                dueDate: new Date(dueDate),
                patientId: patientId || undefined // Allow undefined
            });
            onSave();
            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save transaction", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] bg-white/90 backdrop-blur-xl border border-white/50">
                <DialogHeader>
                    <DialogTitle>Nova Transação</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Descrição</Label>
                        <Input
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex: Sessão de Fonoaudiologia"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Paciente (Opcional)</Label>
                        <Select value={patientId} onValueChange={setPatientId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Vincular a paciente..." />
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
                            <Label>Valor (R$)</Label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Vencimento</Label>
                            <Input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Fluxo</Label>
                            <Select value={flow} onValueChange={setFlow}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="INCOME">Receita</SelectItem>
                                    <SelectItem value="EXPENSE">Despesa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {flow === "INCOME" && (
                            <div className="grid gap-2">
                                <Label>Origem</Label>
                                <Select value={source} onValueChange={setSource}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Particular/Convênio" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="PARTICULAR">Particular</SelectItem>
                                        <SelectItem value="CONVENIO">Convênio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {flow === "EXPENSE" && (
                            <div className="grid gap-2">
                                <Label>Categoria</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="FIXED">Custo Fixo</SelectItem>
                                        <SelectItem value="VARIABLE">Custo Variável</SelectItem>
                                        <SelectItem value="TAX">Impostos</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Tipo (Detalhe)</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="tratamento">Tratamento</SelectItem>
                                    <SelectItem value="avaliacao">Avaliação</SelectItem>
                                    <SelectItem value="aluguel">Aluguel</SelectItem>
                                    <SelectItem value="materiais">Materiais</SelectItem>
                                    <SelectItem value="outros">Outros</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pendente">Pendente</SelectItem>
                                    <SelectItem value="pago">Pago</SelectItem>
                                    <SelectItem value="atrasado">Atrasado</SelectItem>
                                    <SelectItem value="aguardando_repasse">Aguardando Repasse</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
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

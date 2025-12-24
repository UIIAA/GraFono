import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, Plus, User } from "lucide-react";

export function PatientDialog({
    children,
    patient,
    onSave,
    open: externalOpen,
    onOpenChange
}: {
    children?: React.ReactNode,
    patient?: any,
    onSave?: (data: any) => void,
    open?: boolean,
    onOpenChange?: (open: boolean) => void
}) {
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = externalOpen !== undefined;
    const open = isControlled ? externalOpen : internalOpen;
    const setOpen = isControlled ? onOpenChange : setInternalOpen;
    const [activeTab, setActiveTab] = useState("cadastro");
    const [formData, setFormData] = useState({
        name: patient?.name || "",
        phone: patient?.phone || "",
        email: patient?.email || "",
        dob: patient?.dob || "",
        address: patient?.address || "",
        motherName: patient?.motherName || "",
        fatherName: patient?.fatherName || "",
        observations: patient?.observations || "",
    });

    // Mock history state - in a real app this would come from the patient object or an API
    const [history, setHistory] = useState<any[]>(patient?.history || [
        { id: 1, date: "23/12/2024", type: "Contato", description: "Entrou em contato via WhatsApp interessado em terapia." },
        { id: 2, date: "20/12/2024", type: "Sistema", description: "Cadastro realizado no sistema." },
    ]);
    const [newNote, setNewNote] = useState("");

    // Sync state when patient changes or dialog opens
    useEffect(() => {
        if (open) {
            setFormData({
                name: patient?.name || "",
                phone: patient?.phone || "",
                email: patient?.email || "",
                dob: patient?.dob || "",
                address: patient?.address || "",
                motherName: patient?.motherName || "",
                fatherName: patient?.fatherName || "",
                observations: patient?.observations || "",
            });
            setHistory(patient?.history || [
                { id: 1, date: "23/12/2024", type: "Contato", description: "Entrou em contato via WhatsApp interessado em terapia." },
                { id: 2, date: "20/12/2024", type: "Sistema", description: "Cadastro realizado no sistema." },
            ]);
        }
    }, [patient, open]);

    const handleSave = () => {
        if (onSave) {
            onSave({
                ...patient,
                ...formData,
                history
            });
        }
        if (setOpen) setOpen(false);
    };

    const handleAddNote = () => {
        if (!newNote.trim()) return;

        const note = {
            id: Date.now(),
            date: new Date().toLocaleDateString('pt-BR'),
            type: "Observação",
            description: newNote
        };

        setHistory([note, ...history]);
        setNewNote("");
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] h-[80vh] flex flex-col p-0 gap-0 bg-white">
                <div className="p-6 pb-2 border-b">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl">{patient ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle>
                        <DialogDescription>
                            Gerencie as informações e o histórico do paciente.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="cadastro" className="flex items-center gap-2">
                                <User className="h-4 w-4" /> Dados Cadastrais
                            </TabsTrigger>
                            <TabsTrigger value="historico" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" /> Histórico e Evolução
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <ScrollArea className="flex-1 p-6">
                    {/* Conteúdo das Tabs renderizado condicionalmente para manter estado ou usar o display none do TabsContent */}

                    <div className={activeTab === "cadastro" ? "block" : "hidden"}>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome Completo</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Data de Nascimento</Label>
                                    <Input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Telefone (WhatsApp)</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>E-mail</Label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Endereço Completo</Label>
                                <Input
                                    placeholder="Rua, número, bairro..."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome da Mãe</Label>
                                    <Input
                                        placeholder="Nome da mãe"
                                        value={formData.motherName}
                                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nome do Pai</Label>
                                    <Input
                                        placeholder="Nome do pai"
                                        value={formData.fatherName}
                                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Observações Gerais</Label>
                                <Textarea
                                    placeholder="Anotações gerais..."
                                    value={formData.observations}
                                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={activeTab === "historico" ? "block" : "hidden"}>
                        <div className="space-y-6">
                            <div className="flex gap-2">
                                <Textarea
                                    placeholder="Adicionar nova observação ou evento..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="min-h-[80px]"
                                />
                                <Button className="h-auto" onClick={handleAddNote}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {history.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg bg-slate-50">
                                        <div className="min-w-[100px] text-xs font-medium text-slate-500 border-r pr-4">
                                            {item.date}
                                            <div className="mt-1 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                                                {item.type}
                                            </div>
                                        </div>
                                        <div className="text-sm text-slate-700">
                                            {item.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </ScrollArea>

                <div className="p-4 border-t bg-white">
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { }}>Cancelar</Button>
                        <Button type="submit" onClick={handleSave}>Salvar Alterações</Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

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
        negotiatedValue: patient?.negotiatedValue || "",
        reevaluationInterval: patient?.reevaluationInterval || "NONE",
        responsibleEmail: patient?.responsibleEmail || "",
        financialSource: patient?.financialSource || "PARTICULAR",
        insuranceName: patient?.insuranceName || "",
        insuranceNumber: patient?.insuranceNumber || "",
        authorizationStatus: patient?.authorizationStatus || "",
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
                negotiatedValue: patient?.negotiatedValue || "",
                reevaluationInterval: patient?.reevaluationInterval || "NONE",
                responsibleEmail: patient?.responsibleEmail || "",
                financialSource: patient?.financialSource || "PARTICULAR",
                insuranceName: patient?.insuranceName || "",
                insuranceNumber: patient?.insuranceNumber || "",
                authorizationStatus: patient?.authorizationStatus || "",
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
            {children && (
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 gap-0 bg-white shadow-2xl [&>button]:text-slate-500 [&>button]:hover:text-red-500 [&>button]:transition-colors">
                <div className="p-6 pb-2 border-b bg-slate-50">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl text-slate-800">{patient ? 'Editar Paciente' : 'Novo Paciente'}</DialogTitle>
                        <DialogDescription className="text-slate-500">
                            Gerencie as informações e o histórico do paciente.
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 rounded-xl">
                            <TabsTrigger
                                value="cadastro"
                                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all duration-300"
                            >
                                <User className="h-4 w-4" /> Dados Cadastrais
                            </TabsTrigger>
                            <TabsTrigger
                                value="historico"
                                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-600 data-[state=active]:shadow-sm transition-all duration-300"
                            >
                                <Clock className="h-4 w-4" /> Histórico e Evolução
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-white">
                    {/* Conteúdo das Tabs renderizado condicionalmente para manter estado ou usar o display none do TabsContent */}

                    <div className={activeTab === "cadastro" ? "block animate-in fade-in slide-in-from-bottom-2 duration-300" : "hidden"}>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <Label className="group-hover:text-red-500 transition-colors">Nome Completo</Label>
                                    <Input
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <Label className="group-hover:text-red-500 transition-colors">Data de Nascimento</Label>
                                    <Input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <Label className="group-hover:text-red-500 transition-colors">Telefone (WhatsApp)</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <Label className="group-hover:text-red-500 transition-colors">E-mail</Label>
                                    <Input
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <Label className="group-hover:text-red-500 transition-colors">Endereço Completo</Label>
                                <Input
                                    placeholder="Rua, número, bairro..."
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                />
                            </div>

                            <div className="space-y-2 group">
                                <Label className="text-red-500 font-semibold group-hover:text-red-600 transition-colors">Origem Financeira</Label>
                                <Select
                                    value={formData.financialSource}
                                    onValueChange={(value) => setFormData({ ...formData, financialSource: value })}
                                >
                                    <SelectTrigger className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:ring-red-200">
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white dark:bg-slate-950">
                                        <SelectItem value="PARTICULAR">Particular</SelectItem>
                                        <SelectItem value="CONVENIO">Convênio</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {formData.financialSource === "CONVENIO" && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                                    <div className="space-y-2">
                                        <Label className="text-blue-700">Operadora</Label>
                                        <Input
                                            placeholder="Ex: Unimed"
                                            value={formData.insuranceName}
                                            onChange={(e) => setFormData({ ...formData, insuranceName: e.target.value })}
                                            className="border-blue-200 focus:border-blue-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-blue-700">Carteirinha</Label>
                                        <Input
                                            placeholder="000.000.000"
                                            value={formData.insuranceNumber}
                                            onChange={(e) => setFormData({ ...formData, insuranceNumber: e.target.value })}
                                            className="border-blue-200 focus:border-blue-400"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-blue-700">Status Guia</Label>
                                        <Select
                                            value={formData.authorizationStatus}
                                            onValueChange={(value) => setFormData({ ...formData, authorizationStatus: value })}
                                        >
                                            <SelectTrigger className="border-blue-200 focus:border-blue-400">
                                                <SelectValue placeholder="Status..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white dark:bg-slate-950">
                                                <SelectItem value="PENDENTE">Guia Pendente</SelectItem>
                                                <SelectItem value="AUTORIZADA">Guia Autorizada</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 group">
                                <Label className="text-red-500 font-semibold group-hover:text-red-600 transition-colors">Valor Negociado (Mensal/Sessão)</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">R$</span>
                                    <Input
                                        type="number"
                                        placeholder="0,00"
                                        className="pl-8 border-red-200 focus:border-red-400 transition-all duration-300 hover:border-red-300 hover:bg-red-50/30"
                                        value={formData.negotiatedValue}
                                        onChange={(e) => setFormData({ ...formData, negotiatedValue: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <Label className="group-hover:text-red-500 transition-colors">Ciclo de Reavaliação</Label>
                                    <Select
                                        value={formData.reevaluationInterval}
                                        onValueChange={(value) => setFormData({ ...formData, reevaluationInterval: value })}
                                    >
                                        <SelectTrigger className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:ring-red-200">
                                            <SelectValue placeholder="Selecione o intervalo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="NONE">Sem reavaliação automática</SelectItem>
                                            <SelectItem value="3_MONTHS">Trimestral (3 meses)</SelectItem>
                                            <SelectItem value="6_MONTHS">Semestral (6 meses)</SelectItem>
                                            <SelectItem value="1_YEAR">Anual (1 ano)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2 group">
                                    <Label className="group-hover:text-red-500 transition-colors">E-mail do Responsável (Notificações)</Label>
                                    <Input
                                        placeholder="email@exemplo.com"
                                        value={formData.responsibleEmail}
                                        onChange={(e) => setFormData({ ...formData, responsibleEmail: e.target.value })}
                                        className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 group">
                                    <Label className="group-hover:text-red-500 transition-colors">Nome da Mãe</Label>
                                    <Input
                                        placeholder="Nome da mãe"
                                        value={formData.motherName}
                                        onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                        className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                    />
                                </div>
                                <div className="space-y-2 group">
                                    <Label className="group-hover:text-red-500 transition-colors">Nome do Pai</Label>
                                    <Input
                                        placeholder="Nome do pai"
                                        value={formData.fatherName}
                                        onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                        className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <Label className="group-hover:text-red-500 transition-colors">Observações Gerais</Label>
                                <Textarea
                                    placeholder="Anotações gerais..."
                                    value={formData.observations}
                                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                                    className="transition-all duration-300 hover:border-red-300 hover:bg-slate-50 focus:border-red-500 focus:ring-red-200 min-h-[100px]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className={activeTab === "historico" ? "block animate-in fade-in slide-in-from-bottom-2 duration-300" : "hidden"}>
                        <div className="space-y-6">
                            <div className="flex gap-2 group">
                                <Textarea
                                    placeholder="Adicionar nova observação ou evento..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    className="min-h-[80px] transition-all duration-300 group-hover:border-red-300 group-hover:bg-slate-50 focus:border-red-500 focus:ring-red-200"
                                />
                                <Button
                                    className="h-auto bg-slate-100 text-slate-600 hover:bg-red-500 hover:text-white transition-all duration-300"
                                    onClick={handleAddNote}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {history.map((item) => (
                                    <div key={item.id} className="flex gap-4 p-4 border rounded-xl bg-slate-50 hover:bg-white hover:shadow-md transition-all duration-300 hover:border-red-100 group">
                                        <div className="min-w-[100px] text-xs font-medium text-slate-500 border-r pr-4 group-hover:border-red-100 transition-colors">
                                            <span className="font-bold text-slate-700">{item.date}</span>
                                            <div className="mt-2 text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block group-hover:bg-blue-100 transition-colors">
                                                {item.type}
                                            </div>
                                        </div>
                                        <div className="text-sm text-slate-700 leading-relaxed">
                                            {item.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                <div className="p-4 border-t bg-slate-50/50 flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="text-slate-500 hover:text-red-500 hover:bg-red-50 font-medium transition-all duration-200"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        onClick={handleSave}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold shadow-lg shadow-red-200 hover:shadow-red-300 transition-all duration-200 hover:scale-[1.02]"
                    >
                        Salvar Alterações
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

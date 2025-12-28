"use client";

import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    BrainCircuit,
    Settings,
    Plus,
    Trash2,
    Briefcase,
    FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    getAvailabilityConfig,
    saveAvailabilityConfig,
    getProfessionalProfile,
    saveProfessionalProfile,
    getDiagnoses,
    createDiagnosis,
    deleteDiagnosis
} from "@/app/actions/settings";

export default function SettingsClient() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Profile State
    const [profile, setProfile] = useState({
        name: "",
        crfa: "",
        specialty: "",
        address: ""
    });

    // Diagnoses State
    const [diagnoses, setDiagnoses] = useState<any[]>([]);
    const [newDiagnosis, setNewDiagnosis] = useState("");

    // Load Initial Data
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        // Load Profile (Simulated User ID for MVP)
        // In real app, get from session
        const profileRes = await getProfessionalProfile("cm4n5s04y0000u58j5x6y7z8a");
        if (profileRes) {
            setProfile({
                name: profileRes.name || "",
                crfa: profileRes.crfa || "",
                specialty: profileRes.specialty || "",
                address: profileRes.address || ""
            });
        }

        // Load Diagnoses
        const diagRes = await getDiagnoses();
        if (diagRes.success && diagRes.data) {
            setDiagnoses(diagRes.data);
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            await saveProfessionalProfile("cm4n5s04y0000u58j5x6y7z8a", profile);
            toast({ title: "Perfil atualizado!" });
        } catch (error) {
            toast({ title: "Erro ao salvar", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddDiagnosis = async () => {
        if (!newDiagnosis.trim()) return;
        setLoading(true);
        try {
            await createDiagnosis({ name: newDiagnosis, baseSeverity: 5 });
            setNewDiagnosis("");
            loadData(); // Reload list
            toast({ title: "Diagnóstico adicionado" });
        } catch (error) {
            toast({ title: "Erro ao adicionar", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDiagnosis = async (id: string) => {
        if (!confirm("Excluir diagnóstico?")) return;
        try {
            await deleteDiagnosis(id);
            loadData();
            toast({ title: "Removido com sucesso" });
        } catch (error) {
            toast({ title: "Erro ao remover", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-red-100">
                    <Settings className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
                    <p className="text-slate-500">Gerencie seu perfil e preferências do sistema</p>
                </div>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-white/50 border border-red-100 p-1 rounded-xl h-12 w-full justify-start">
                    <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white">
                        <Briefcase className="mr-2 h-4 w-4" /> Perfil Profissional
                    </TabsTrigger>
                    <TabsTrigger value="diagnoses" className="rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white">
                        <BrainCircuit className="mr-2 h-4 w-4" /> Diagnósticos (IA)
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white">
                        <FileText className="mr-2 h-4 w-4" /> Templates
                    </TabsTrigger>
                </TabsList>

                {/* PROFILE TAB */}
                <TabsContent value="profile">
                    <Card className="border-none shadow-lg shadow-red-100/20 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Dados do Profissional</CardTitle>
                            <CardDescription>Essas informações aparecerão em seus relatórios e documentos.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Nome Completo</Label>
                                    <Input
                                        value={profile.name}
                                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Especialidade</Label>
                                    <Input
                                        value={profile.specialty}
                                        onChange={e => setProfile({ ...profile, specialty: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Registro (CRFa)</Label>
                                    <Input
                                        value={profile.crfa}
                                        onChange={e => setProfile({ ...profile, crfa: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Endereço / Rodapé</Label>
                                    <Input
                                        value={profile.address}
                                        onChange={e => setProfile({ ...profile, address: e.target.value })}
                                    />
                                </div>
                            </div>
                            <Button onClick={handleSaveProfile} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* DIAGNOSES TAB */}
                <TabsContent value="diagnoses">
                    <Card className="border-none shadow-lg shadow-red-100/20 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Patologias do Sistema</CardTitle>
                            <CardDescription>Gerencie a lista de diagnósticos disponíveis para a Calculadora de Terapia.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Nome do novo diagnóstico (ex: Apraxia de Fala)"
                                    value={newDiagnosis}
                                    onChange={e => setNewDiagnosis(e.target.value)}
                                />
                                <Button onClick={handleAddDiagnosis} disabled={loading} className="bg-red-500 hover:bg-red-600 text-white">
                                    <Plus className="mr-2 h-4 w-4" /> Adicionar
                                </Button>
                            </div>

                            <div className="rounded-xl border border-slate-100 overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead>Diagnóstico</TableHead>
                                            <TableHead className="w-[100px] text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {diagnoses.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center text-slate-500 py-8">
                                                    Nenhum diagnóstico cadastrado.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            diagnoses.map((d) => (
                                                <TableRow key={d.id}>
                                                    <TableCell className="font-medium">{d.name}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => handleDeleteDiagnosis(d.id)}
                                                            className="text-red-400 hover:text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TEMPLATES TAB (Placeholder for now) */}
                <TabsContent value="templates">
                    <Card className="border-none shadow-lg shadow-red-100/20 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Templates de Documentos</CardTitle>
                            <CardDescription>Em breve você poderá gerenciar seus modelos por aqui.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-500 italic">Funcionalidade em desenvolvimento.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

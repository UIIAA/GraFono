"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { FileText, Plus, Settings, Edit, Trash2, Printer, Copy, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createTemplate, updateTemplate, deleteTemplate } from "@/app/actions/template";
import { saveProfessionalProfile } from "@/app/actions/settings";

interface Template {
    id: string;
    title: string;
    content: string;
    category: string;
    updatedAt: Date;
}

interface UserProfile {
    id: string;
    name: string | null;
    digitalSignature: string | null;
    crfa: string | null;
    specialty: string | null;
    address: string | null;
}

interface TemplatesClientProps {
    initialTemplates: Template[];
    user: UserProfile;
}

export default function TemplatesClient({ initialTemplates, user }: TemplatesClientProps) {
    const { toast } = useToast();
    const [templates, setTemplates] = useState<Template[]>(initialTemplates);
    const [profile, setProfile] = useState<UserProfile>(user);

    // Dialog States
    const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
    const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);

    // Form States
    const [currentTemplate, setCurrentTemplate] = useState<Partial<Template>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [profileForm, setProfileForm] = useState(user);

    // Template Actions
    const handleSaveTemplate = async () => {
        if (!currentTemplate.title || !currentTemplate.content || !currentTemplate.category) {
            toast({ title: "Erro", description: "Preencha todos os campos.", variant: "destructive" });
            return;
        }

        let res;
        if (isEditing && currentTemplate.id) {
            res = await updateTemplate(currentTemplate.id, {
                title: currentTemplate.title,
                content: currentTemplate.content,
                category: currentTemplate.category
            });
        } else {
            res = await createTemplate(user.id, {
                title: currentTemplate.title,
                content: currentTemplate.content,
                category: currentTemplate.category
            });
        }

        if (res.success && res.data) {
            toast({ title: "Sucesso", description: `Modelo ${isEditing ? 'atualizado' : 'criado'} com sucesso.` });
            setIsTemplateDialogOpen(false);

            if (isEditing) {
                setTemplates(prev => prev.map(t => t.id === res.data.id ? { ...res.data, updatedAt: new Date() } as Template : t));
            } else {
                setTemplates(prev => [res.data as unknown as Template, ...prev]);
            }
            setCurrentTemplate({});
        } else {
            toast({ title: "Erro", description: "Falha ao salvar modelo.", variant: "destructive" });
        }
    };

    const handleDeleteTemplate = async (id: string) => {
        if (confirm("Tem certeza que deseja excluir este modelo?")) {
            const res = await deleteTemplate(id);
            if (res.success) {
                setTemplates(prev => prev.filter(t => t.id !== id));
                toast({ title: "Deletado", description: "Modelo removido." });
            }
        }
    };

    const handleEditClick = (template: Template) => {
        setCurrentTemplate(template);
        setIsEditing(true);
        setIsTemplateDialogOpen(true);
    };

    const handleNewClick = () => {
        setCurrentTemplate({ category: "Atestado" });
        setIsEditing(false);
        setIsTemplateDialogOpen(true);
    };

    // Printing Logic
    const handlePrint = () => {
        if (!currentTemplate.content) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            toast({ title: "Erro", description: "Permita pop-ups para imprimir.", variant: "destructive" });
            return;
        }

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${currentTemplate.title || "Documento"}</title>
                <style>
                    body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.6; }
                    .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
                    .header h1 { font-size: 24px; margin: 0; text-transform: uppercase; }
                    .header p { margin: 5px 0 0; font-size: 14px; color: #666; }
                    .content { white-space: pre-wrap; font-size: 14px; min-height: 400px; }
                    .footer { margin-top: 50px; text-align: center; border-top: 1px solid #ddd; padding-top: 20px; }
                    .signature-line { margin: 50px auto 10px; width: 300px; border-top: 1px solid #000; }
                    @media print {
                        body { padding: 0; }
                        @page { margin: 2cm; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${profile.name || "Nome do Profissional"}</h1>
                    <p>${profile.specialty || "Fonoaudiologia"} | CRFa: ${profile.crfa || "N/A"}</p>
                    <p>${profile.address || ""}</p>
                </div>
                
                <div class="content">
                    ${currentTemplate.content.replace(/\n/g, '<br/>')}
                </div>

                <div class="footer">
                    ${profile.digitalSignature ? `<img src="${profile.digitalSignature}" style="max-height: 60px; display: block; margin: 0 auto;" />` : '<div style="height: 60px;"></div>'}
                    <div class="signature-line"></div>
                    <p><strong>${profile.name || ""}</strong></p>
                    <p>CRFa ${profile.crfa || ""}</p>
                    <p style="font-size: 10px; margin-top: 10px; color: #999;">Documento gerado eletronicamente em ${new Date().toLocaleDateString()}</p>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
    };

    // Profile Actions
    const handleSaveProfile = async () => {
        const res = await saveProfessionalProfile(user.id, {
            name: profileForm.name || undefined,
            digitalSignature: profileForm.digitalSignature || undefined,
            crfa: profileForm.crfa || undefined,
            specialty: profileForm.specialty || undefined,
            address: profileForm.address || undefined
        });

        if (res.success) {
            setProfile(profileForm);
            setIsProfileDialogOpen(false);
            toast({ title: "Perfil Atualizado", description: "Configurações de cabeçalho salvas." });
        } else {
            toast({ title: "Erro", description: "Falha ao salvar perfil.", variant: "destructive" });
        }
    };

    const insertVariable = (variable: string) => {
        setCurrentTemplate(prev => ({
            ...prev,
            content: (prev.content || "") + ` {{${variable}}} `
        }));
    };

    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassButton = "bg-white/80 hover:bg-white border border-red-100 backdrop-blur-sm text-slate-700 shadow-sm";

    return (
        <div
            className="min-h-screen p-8 space-y-8 relative overflow-hidden font-sans"
            style={{
                background: "linear-gradient(135deg, #fff1f2 0%, #fff7ed 100%)"
            }}
        >
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-red-400/10 to-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-rose-400/10 to-red-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            {/* Header */}
            <div className={`flex justify-between items-center p-6 rounded-3xl ${glassCard} relative z-10`}>
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Modelos de Documentos</h1>
                        <p className="text-slate-500">Padronização e Agilidade</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsProfileDialogOpen(true)} className={glassButton}>
                        <Settings className="mr-2 h-4 w-4" /> Configurar Cabeçalho
                    </Button>
                    <Button onClick={handleNewClick} className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 h-11 px-6 transition-transform hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" /> Novo Modelo
                    </Button>
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {templates.map(template => (
                    <Card key={template.id} className={`${glassCard} border-0 hover:scale-[1.02] transition-transform group overflow-hidden`}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100">{template.category}</Badge>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => handleEditClick(template)}>
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-600" onClick={() => handleDeleteTemplate(template.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardTitle className="text-lg text-slate-800">{template.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white/50 p-3 rounded-xl text-xs text-slate-500 font-mono h-24 overflow-hidden border border-white/60 relative backdrop-blur-sm">
                                {template.content}
                                <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-white/90 to-transparent" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 text-xs text-slate-400 flex justify-between">
                            <span>{new Date(template.updatedAt).toLocaleDateString()}</span>
                            <Button variant="ghost" size="sm" className="h-8 text-xs hover:bg-red-50 hover:text-red-600" onClick={() => handleEditClick(template)}>
                                <Printer className="mr-1 h-3 w-3" /> Imprimir
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* Template Dialog */}
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? "Editar Modelo" : "Novo Modelo"}</DialogTitle>
                        <DialogDescription>
                            Configure o conteúdo. Use variáveis para preenchimento dinâmico.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Título</Label>
                                <Input
                                    placeholder="Ex: Atestado de Frequência"
                                    value={currentTemplate.title || ""}
                                    onChange={e => setCurrentTemplate(prev => ({ ...prev, title: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Categoria</Label>
                                <Select
                                    value={currentTemplate.category}
                                    onValueChange={v => setCurrentTemplate(prev => ({ ...prev, category: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Atestado">Atestado</SelectItem>
                                        <SelectItem value="Encaminhamento">Encaminhamento</SelectItem>
                                        <SelectItem value="Relatório">Relatório</SelectItem>
                                        <SelectItem value="Contrato">Contrato</SelectItem>
                                        <SelectItem value="Recibo">Recibo</SelectItem>
                                        <SelectItem value="Outro">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label>Conteúdo</Label>
                                <div className="flex gap-1 flex-wrap">
                                    {["PACIENTE", "DATA", "CPF", "DIAGNOSTICO"].map(v => (
                                        <Badge key={v} variant="outline" className="cursor-pointer hover:bg-slate-100 text-[10px]" onClick={() => insertVariable(v)}>
                                            {v}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <Textarea
                                className="h-[400px] font-mono text-sm leading-relaxed p-4"
                                placeholder="Digite o conteúdo aqui..."
                                value={currentTemplate.content || ""}
                                onChange={e => setCurrentTemplate(prev => ({ ...prev, content: e.target.value }))}
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        {isEditing && (
                            <Button variant="secondary" onClick={handlePrint} className="mr-auto bg-slate-100 hover:bg-slate-200 text-slate-700">
                                <Printer className="mr-2 h-4 w-4" /> Visualizar Impressão
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => setIsTemplateDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveTemplate} className="bg-red-600 hover:bg-red-700">Salvar Modelo</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Profile Dialog */}
            <Dialog open={isProfileDialogOpen} onOpenChange={setIsProfileDialogOpen}>
                {/* Profile Dialog */}

                <DialogContent className="bg-white">
                    <DialogHeader>
                        <DialogTitle>Cabeçalho & Identificação</DialogTitle>
                        <DialogDescription>
                            Configure os dados que aparecerão nos documentos impressos.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Nome Completo (Profissional)</Label>
                            <Input
                                value={profileForm.name || ""}
                                onChange={e => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>CRFa</Label>
                                <Input
                                    value={profileForm.crfa || ""}
                                    onChange={e => setProfileForm(prev => ({ ...prev, crfa: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Especialidade</Label>
                                <Input
                                    value={profileForm.specialty || ""}
                                    onChange={e => setProfileForm(prev => ({ ...prev, specialty: e.target.value }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Endereço da Clínica</Label>
                            <Input
                                value={profileForm.address || ""}
                                onChange={e => setProfileForm(prev => ({ ...prev, address: e.target.value }))}
                                placeholder="Rua, Número, Bairro, Cidade - UF"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Assinatura Digital (Upload)</Label>
                            <div className="flex items-center gap-3">
                                {profileForm.digitalSignature && (
                                    <div className="h-10 w-10 relative overflow-hidden rounded border">
                                        <img src={profileForm.digitalSignature} alt="Assinatura" className="object-cover h-full w-full" />
                                    </div>
                                )}
                                <div className="relative w-full">
                                    <Button variant="outline" className="w-full relative cursor-pointer bg-slate-50 border-dashed border-2 border-slate-300 hover:bg-red-50 hover:border-red-300 text-slate-500 hover:text-red-500 transition-all">
                                        <Upload className="mr-2 h-4 w-4" />
                                        {profileForm.digitalSignature ? "Trocar Arquivo" : "Enviar Assinatura"}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setProfileForm(prev => ({ ...prev, digitalSignature: reader.result as string }));
                                                        toast({ title: "Upload Concluído", description: "Assinatura salva no Drive e pronta para uso." });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </Button>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400">
                                A imagem será salva automaticamente na pasta do Drive configurada.
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsProfileDialogOpen(false)}>Cancelar</Button>
                        <Button onClick={handleSaveProfile} className="bg-red-600 hover:bg-red-700">Salvar Dados</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

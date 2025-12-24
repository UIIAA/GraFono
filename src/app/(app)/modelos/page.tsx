"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Plus,
    Search,
    FileText,
    Star,
    ArrowRight,
    Copy,
    Settings2
} from "lucide-react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const templates = [
    {
        id: 1,
        title: "Avaliação Fonoaudiológica Inicial",
        description: "Modelo padrão para primeira consulta com anamnese completa e avaliação estrutural.",
        category: "Avaliação",
        favorite: true
    },
    {
        id: 2,
        title: "Relatório de Evolução Mensal",
        description: "Estrutura para documentar progressos mensais em terapia de linguagem infantil.",
        category: "Evolução",
        favorite: true
    },
    {
        id: 3,
        title: "Encaminhamento Escolar",
        description: "Carta formal para contato com coordenação pedagógica e professores.",
        category: "Administrativo",
        favorite: false
    },
    {
        id: 4,
        title: "Laudo de Audiometria",
        description: "Modelo técnico para descrição de resultados de exames audiométricos.",
        category: "Exames",
        favorite: false
    },
    {
        id: 5,
        title: "Plano Terapêutico Singular",
        description: "Planejamento de objetivos de curto, médio e longo prazo.",
        category: "Planejamento",
        favorite: true
    },
    {
        id: 6,
        title: "Declaração de Comparecimento",
        description: "Modelo simples para justificativa de faltas em trabalho ou escola.",
        category: "Administrativo",
        favorite: false
    },
];

export default function ModelosPage() {
    // Glass Styles
    const glassCard = "bg-white/60 backdrop-blur-md border border-red-100 shadow-lg shadow-red-100/20";
    const glassInput = "bg-white/50 border-red-100 focus:bg-white/80 transition-all";

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
            <div className="flex justify-between items-center relative z-10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-white/60 rounded-2xl flex items-center justify-center text-red-500 shadow-sm border border-white/50">
                        <Copy className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Modelos de Documentos</h1>
                        <p className="text-slate-500">Padronização e Agilidade</p>
                    </div>
                </div>
                <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200 h-11 px-6">
                    <Plus className="mr-2 h-4 w-4" /> Novo Modelo
                </Button>
            </div>

            {/* Search */}
            <div className={`p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center relative z-10 ${glassCard}`}>
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-300 group-focus-within:text-red-500 transition-colors" />
                    <Input
                        placeholder="Buscar modelos..."
                        className={`pl-10 h-11 rounded-xl ${glassInput}`}
                    />
                </div>
                <Button variant="ghost" className="text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl">
                    <Settings2 className="mr-2 h-4 w-4" />
                    Gerenciar Tags
                </Button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {templates.map((template) => (
                    <Card key={template.id} className={`${glassCard} border-0 hover:scale-[1.02] transition-transform cursor-pointer group`}>
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="secondary" className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 text-[10px]">
                                    {template.category}
                                </Badge>
                                <Button variant="ghost" size="icon" className={`h-8 w-8 rounded-full ${template.favorite ? 'text-yellow-400 hover:text-yellow-500' : 'text-slate-300 hover:text-yellow-400'}`}>
                                    <Star className={`h-4 w-4 ${template.favorite ? 'fill-yellow-400' : ''}`} />
                                </Button>
                            </div>
                            <CardTitle className="text-lg text-slate-800 leading-tight group-hover:text-red-600 transition-colors">
                                {template.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription className="text-slate-500 line-clamp-3">
                                {template.description}
                            </CardDescription>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full bg-white/50 border-white/60 hover:bg-white text-slate-700 rounded-xl group-hover:border-red-200 group-hover:text-red-600">
                                Usar Modelo <ArrowRight className="ml-2 h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

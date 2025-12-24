"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, FileText, Copy, Star } from "lucide-react";

const templates = [
    {
        id: 1,
        title: "Anamnese Infantil Padrão",
        description: "Modelo completo para primeira entrevista com pais ou responsáveis.",
        category: "Avaliação",
        favorites: 12
    },
    {
        id: 2,
        title: "Evolução Diária - SOAP",
        description: "Estrutura Subjetivo, Objetivo, Avaliação e Plano para registro de sessões.",
        category: "Registro",
        favorites: 45
    },
    {
        id: 3,
        title: "Relatório de Alta Fonoaudiológica",
        description: "Modelo formal para documentação de encerramento de tratamento.",
        category: "Relatório",
        favorites: 8
    },
    {
        id: 4,
        title: "Encaminhamento Escolar",
        description: "Carta de encaminhamento e orientações para a escola.",
        category: "Encaminhamento",
        favorites: 15
    },
    {
        id: 5,
        title: "Avaliação de Processamento Auditivo",
        description: "Template específico para bateria de testes PAC.",
        category: "Avaliação",
        favorites: 20
    },
    {
        id: 6,
        title: "Plano Terapêutico Singular",
        description: "Estrutura para definição de objetivos de curto, médio e longo prazo.",
        category: "Planejamento",
        favorites: 32
    }
];

export default function ModelosPage() {
    return (
        <div className="p-8 min-h-screen bg-[#F0F2F5] space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Modelos de Documentos</h1>
                    <p className="text-gray-500">Gerencie e utilize seus templates de documentos</p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Novo Modelo
                </Button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Buscar modelos por nome, categoria..."
                        className="pl-9 bg-gray-50 border-gray-200"
                    />
                </div>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <FileText className="h-5 w-5 text-blue-600" />
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-yellow-400 hover:text-yellow-500">
                                    <Star className="h-4 w-4" fill="currentColor" />
                                </Button>
                            </div>
                            <CardTitle className="mt-4 text-lg">{template.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{template.description}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between items-center pt-0">
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                                {template.category}
                            </span>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Copy className="h-3 w-3" /> Usar Modelo
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

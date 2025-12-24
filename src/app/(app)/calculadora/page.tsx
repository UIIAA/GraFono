"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calculator } from "lucide-react";

export default function CalculadoraPage() {
    const [severity, setSeverity] = useState([50]);
    const [frequency, setFrequency] = useState([2]);
    const [duration, setDuration] = useState([45]);
    const [familySupport, setFamilySupport] = useState([70]);

    return (
        <div className="p-8 space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">
                    Calculadora de Terapia
                </h2>
                <p className="text-muted-foreground">
                    Estimativa de duração e planejamento terapêutico
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Seleção do Paciente */}
                <Card>
                    <CardHeader>
                        <CardTitle>Seleção do Paciente</CardTitle>
                        <CardDescription>
                            Escolha um paciente ou insira a idade manualmente
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Paciente</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione um paciente" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Novo Paciente (Manual)</SelectItem>
                                    <SelectItem value="Maria">Maria Santos</SelectItem>
                                    <SelectItem value="Joao">João Silva</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Anos</Label>
                                <Input type="number" defaultValue="5" />
                            </div>
                            <div className="space-y-2">
                                <Label>Meses</Label>
                                <Input type="number" defaultValue="0" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Templates de Tratamento */}
                <Card>
                    <CardHeader>
                        <CardTitle>Templates de Tratamento</CardTitle>
                        <CardDescription>
                            Selecione um modelo predefinido ou personalize
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um template" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="speech-delay">Atraso de Fala (Padrão)</SelectItem>
                                <SelectItem value="autism">TEA - Intervenção Precoce</SelectItem>
                                <SelectItem value="stuttering">Disfluência / Gagueira</SelectItem>
                                <SelectItem value="custom">Personalizado</SelectItem>
                            </SelectContent>
                        </Select>
                    </CardContent>
                </Card>

                {/* Diagnóstico e Severidade */}
                <Card>
                    <CardHeader>
                        <CardTitle>Diagnóstico e Severidade</CardTitle>
                        <CardDescription>
                            Defina o quadro clínico e sua gravidade
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label>Diagnóstico Principal</Label>
                            <Select defaultValue="language-delay">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="language-delay">Atraso de Linguagem</SelectItem>
                                    <SelectItem value="apraxia">Apraxia de Fala</SelectItem>
                                    <SelectItem value="voice">Distúrbio de Voz</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Diagnóstico Secundário (opcional)</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o diagnóstico secundário" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="adhd">TDAH</SelectItem>
                                    <SelectItem value="processing">Processamento Auditivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Severidade</Label>
                                <span className="text-sm text-muted-foreground">Moderado</span>
                            </div>
                            <Slider
                                value={severity}
                                onValueChange={setSeverity}
                                max={100}
                                step={1}
                                className="w-full"
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="comorbidities" />
                            <Label htmlFor="comorbidities">Comorbidades associadas</Label>
                        </div>
                    </CardContent>
                </Card>

                {/* Configuração de Sessões */}
                <Card>
                    <CardHeader>
                        <CardTitle>Configuração de Sessões</CardTitle>
                        <CardDescription>
                            Defina frequência e duração das sessões
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Frequência Semanal</Label>
                                <span className="text-sm text-muted-foreground">{frequency[0]} vezes por semana</span>
                            </div>
                            <Slider
                                value={frequency}
                                onValueChange={setFrequency}
                                max={5}
                                step={1}
                                min={1}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Duração da Sessão</Label>
                                <span className="text-sm text-muted-foreground">{duration[0]} minutos</span>
                            </div>
                            <Slider
                                value={duration}
                                onValueChange={setDuration}
                                max={60}
                                step={15}
                                min={30}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <Label>Suporte Familiar</Label>
                                <span className="text-sm text-muted-foreground">Médio</span>
                            </div>
                            <Slider
                                value={familySupport}
                                onValueChange={setFamilySupport}
                                max={100}
                                step={10}
                            />
                        </div>

                        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                            <Calculator className="w-4 h-4 mr-2" /> Calcular Plano de Terapia
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

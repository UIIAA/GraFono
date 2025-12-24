import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, FileText, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function ResumoTab({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
    return (
        <div className="space-y-8">
            {/* Next Session */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" /> Próxima Sessão
                </h3>
                <div className="bg-zinc-50 border rounded-lg p-6 flex items-center justify-between">
                    <div>
                        <p className="text-lg font-medium">20 de janeiro de 2024 às 14:30</p>
                        <p className="text-zinc-500">Sessão De Terapia</p>
                    </div>
                    <Button variant="outline" onClick={() => setActiveTab('agenda')}>
                        Ver Agenda <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Progress Summary */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" /> Seu Progresso Recente
                </h3>
                <p className="text-sm text-zinc-500">Período: 30 de novembro de 2023 a 21 de dezembro de 2025</p>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Linguagem</span>
                            <span className="text-blue-600">5 → 7</span>
                        </div>
                        <Progress value={70} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Articulacao</span>
                            <span className="text-blue-600">4 → 6</span>
                        </div>
                        <Progress value={60} className="h-2" />
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="font-medium">Fluencia</span>
                            <span className="text-blue-600">3 → 5</span>
                        </div>
                        <Progress value={50} className="h-2" />
                    </div>
                    <div className="pt-2 border-t flex justify-between items-center">
                        <span className="text-sm font-medium">Taxa de presença</span>
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">85%</div>
                    </div>
                </div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" /> Avaliações Recentes
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <FileText className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Avaliação inicial</p>
                                <p className="text-xs text-zinc-500">09 de outubro de 2023</p>
                            </div>
                        </div>
                        <div className="flex gap-4 items-start">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                <FileText className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Avaliação progresso</p>
                                <p className="text-xs text-zinc-500">14 de dezembro de 2023</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border rounded-lg p-6 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" /> Relatórios Disponíveis
                    </h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <FileText className="h-4 w-4 text-zinc-400" />
                                <div>
                                    <p className="font-medium text-sm">Relatório de Avaliação Inicial</p>
                                    <p className="text-xs text-zinc-500">14 de outubro de 2023</p>
                                </div>
                            </div>
                            <span className="text-[10px] bg-zinc-100 px-2 py-1 rounded">avaliação</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <FileText className="h-4 w-4 text-zinc-400" />
                                <div>
                                    <p className="font-medium text-sm">Relatório de Evolução Trimestral</p>
                                    <p className="text-xs text-zinc-500">19 de dezembro de 2023</p>
                                </div>
                            </div>
                            <span className="text-[10px] bg-zinc-100 px-2 py-1 rounded">evolução</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

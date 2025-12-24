import { Progress } from "@/components/ui/progress";
import { Target, CheckCircle2 } from "lucide-react";

export function ObjetivosTab() {
    const goals = [
        {
            title: "Melhorar a articulação do fonema /r/",
            description: "Alvo terapêutico principal: produção correta em palavras e frases.",
            progress: 75,
            status: "Em Progresso"
        },
        {
            title: "Aumentar a clareza da fala em conversação",
            description: "Objetivo: reduzir a taxa de ininteligibilidade para menos de 10%.",
            progress: 60,
            status: "Em Progresso"
        },
        {
            title: "Expandir o vocabulário expressivo",
            description: "Meta: introduzir e utilizar 50 novas palavras funcionais.",
            progress: 40,
            status: "Em Progresso"
        }
    ];

    const completedGoals = [
        {
            title: "Participação ativa nas sessões",
            completedDate: "Concluído em 15/12/2023"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Target className="h-6 w-6 text-blue-500" /> Metas Terapêuticas
                </h2>
                <p className="text-muted-foreground">Acompanhe o progresso dos seus objetivos definidos</p>
            </div>

            <div className="grid gap-6">
                {goals.map((goal, i) => (
                    <div key={i} className="border rounded-lg p-6 space-y-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-semibold text-lg">{goal.title}</h3>
                                <p className="text-sm text-zinc-500">{goal.description}</p>
                            </div>
                            <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">{goal.status}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">Progresso</span>
                                <span className="text-zinc-500">{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-4">
                <h3 className="font-semibold text-lg">Metas Concluídas</h3>
                <div className="space-y-3">
                    {completedGoals.map((goal, i) => (
                        <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <div>
                                <p className="font-medium text-green-900">{goal.title}</p>
                                <p className="text-xs text-green-700">{goal.completedDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

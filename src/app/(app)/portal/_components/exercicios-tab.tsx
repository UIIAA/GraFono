import { PlayCircle, FileVideo, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ExerciciosTab() {
    const exercises = [
        {
            title: "Exercício de Respiração Diafragmática",
            duration: "5 min",
            type: "Vídeo",
            icon: FileVideo,
            status: "Pendente",
            instructions: "Praticar 2x ao dia, pela manhã e à noite."
        },
        {
            title: "Repetição de Palavras com /r/",
            duration: "10 min",
            type: "Áudio",
            icon: Mic,
            status: "Realizado",
            instructions: "Gravar áudio com a lista de palavras enviada."
        },
        {
            title: "Leitura em Voz Alta - Texto 1",
            duration: "15 min",
            type: "Prática",
            icon: PlayCircle,
            status: "Pendente",
            instructions: "Ler o texto pausadamente respeitando a pontuação."
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold">Exercícios para Casa</h2>
                <p className="text-muted-foreground">Pratique entre as sessões para acelerar seus resultados</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {exercises.map((ex, i) => (
                    <div key={i} className="border rounded-lg p-6 flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors">
                        <div className="space-y-2">
                            <div className="flex justify-between items-start">
                                <div className={`p-2 rounded-lg ${ex.status === 'Realizado' ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                                    <ex.icon className="h-6 w-6" />
                                </div>
                                <span className={`text-xs px-2 py-1 rounded font-medium ${ex.status === 'Realizado' ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                                    {ex.status}
                                </span>
                            </div>
                            <h3 className="font-semibold text-lg leading-tight">{ex.title}</h3>
                            <p className="text-sm text-zinc-500">{ex.instructions}</p>
                        </div>

                        <div className="space-y-4 pt-2 border-t mt-2">
                            <div className="flex items-center text-sm text-zinc-500 gap-2">
                                <span>⏱ {ex.duration} estimadados</span>
                            </div>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                Começar
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

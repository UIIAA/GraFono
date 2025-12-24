import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RelatoriosTab() {
    const reports = [
        {
            title: "Relatório de Avaliação Inicial",
            date: "14 de outubro de 2023",
            type: "Avaliação",
            description: "Avaliação fonoaudiológica completa com foco em linguagem e fala."
        },
        {
            title: "Relatório de Evolução Trimestral",
            date: "19 de dezembro de 2023",
            type: "Evolução",
            description: "Resumo do progresso terapêutico nos últimos 3 meses."
        },
        {
            title: "Plano Terapêutico Singular",
            date: "20 de outubro de 2023",
            type: "Planejamento",
            description: "Definição de metas e estratégias para o tratamento."
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold">Relatórios e Documentos</h2>
                <p className="text-muted-foreground">Acesse e baixe seus relatórios terapêuticos</p>
            </div>

            <div className="grid gap-4">
                {reports.map((report, i) => (
                    <div key={i} className="border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-sm transition-all md:hover:border-blue-300">
                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 shrink-0">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">{report.title}</h3>
                                <div className="flex flex-wrap gap-2 text-sm text-zinc-500 mt-1">
                                    <span className="flex items-center gap-1">• {report.date}</span>
                                    <span className="flex items-center gap-1">• {report.type}</span>
                                </div>
                                <p className="text-sm text-zinc-600 mt-2">{report.description}</p>
                            </div>
                        </div>
                        <Button variant="outline" className="shrink-0 w-full md:w-auto">
                            <Download className="h-4 w-4 mr-2" /> Baixar PDF
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

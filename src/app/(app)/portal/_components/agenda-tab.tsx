import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function AgendaTab() {
    const sessions = [
        {
            date: "20 de janeiro de 2024 às 14:30",
            type: "Sessão De Terapia",
            status: "Próxima",
            statusColor: "bg-blue-100 text-blue-700"
        },
        {
            date: "13 de janeiro de 2024 às 14:30",
            type: "Sessão De Terapia",
            status: "Realizada",
            statusColor: "bg-green-100 text-green-700"
        },
        {
            date: "06 de janeiro de 2024 às 14:30",
            type: "Sessão De Avaliação",
            status: "Realizada",
            statusColor: "bg-green-100 text-green-700"
        }
    ];

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold">Minhas Sessões Agendadas</h2>
                <p className="text-muted-foreground">Confira suas próximas sessões e histórico de atendimento</p>
            </div>

            <div className="bg-white border rounded-lg p-4 flex gap-4 items-start">
                <Info className="h-5 w-5 text-zinc-900 shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-semibold text-sm">Informação sobre agendamentos</h4>
                    <p className="text-sm text-zinc-500">Seus agendamentos são exibidos diretamente do sistema. Para remarcar uma sessão, entre em contato com seu fonoaudiólogo.</p>
                </div>
            </div>

            <div className="space-y-4">
                {sessions.map((session, index) => (
                    <div key={index} className={`border rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden ${session.status === 'Próxima' ? 'border-blue-200' : ''}`}>
                        {session.status === 'Próxima' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />}
                        {session.status === 'Realizada' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />}

                        <div className="pl-4">
                            <h3 className="font-semibold text-lg">{session.date}</h3>
                            <p className="text-zinc-500">{session.type}</p>
                        </div>
                        <Badge className={`mt-4 md:mt-0 ${session.statusColor} hover:${session.statusColor}`}>
                            {session.status}
                        </Badge>
                    </div>
                ))}
            </div>
        </div>
    );
}

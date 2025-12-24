import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Bell,
    CheckCircle,
    Clock,
    DollarSign,
    XCircle,
    ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Painel Inicial</h2>
                    <p className="text-muted-foreground">
                        Bem-vindo(a) de volta, Marcos Cruz.
                    </p>
                </div>
                <Button className="bg-black text-white hover:bg-zinc-800">
                    + Novo Paciente
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3 h-full">
                {/* Coluna Esquerda: Consultas de Hoje */}
                <Card className="lg:col-span-2 h-full flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Clock className="w-5 h-5 text-blue-600" />
                            Consultas de Hoje
                        </CardTitle>
                        <CardDescription>
                            segunda-feira, 22 de dezembro
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center flex-1 text-muted-foreground min-h-[400px]">
                        <div className="bg-zinc-100 p-6 rounded-2xl mb-4">
                            <CalendarIcon className="w-10 h-10 text-zinc-300" />
                        </div>
                        <p className="font-medium text-zinc-900">Nenhuma consulta para hoje.</p>
                        <p className="text-sm">Aproveite para planejar sua semana!</p>
                    </CardContent>
                </Card>

                {/* Coluna Direita: Notificações, Agenda, Amanhã */}
                <div className="space-y-6 flex flex-col">
                    {/* Notificações */}
                    <Card>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-orange-500" />
                                    <CardTitle className="text-base">Notificações</CardTitle>
                                </div>
                                <div className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">4</div>
                            </div>
                            <CardDescription>
                                Confirmações e atualizações recentes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                                        <CheckCircle className="w-3.5 h-3.5" /> Pagamento Recebido
                                    </h4>
                                    <p className="text-xs text-green-700 mt-1">Pagamento de R$ 150,00 confirmado - Maria Silva</p>
                                    <span className="text-[10px] text-green-600 font-medium">08/06 23:22</span>
                                </div>
                                <XCircle className="w-4 h-4 text-green-400 cursor-pointer hover:text-green-600" />
                            </div>

                            <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded-r-md flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-semibold text-green-800 flex items-center gap-2">
                                        <CheckCircle className="w-3.5 h-3.5" /> Sessão Confirmada
                                    </h4>
                                    <p className="text-xs text-green-700 mt-1">João Silva confirmou presença para sessão das 14:00</p>
                                    <span className="text-[10px] text-green-600 font-medium">08/06 23:22</span>
                                </div>
                                <XCircle className="w-4 h-4 text-green-400 cursor-pointer hover:text-green-600" />
                            </div>

                            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-semibold text-red-800 flex items-center gap-2">
                                        <XCircle className="w-3.5 h-3.5" /> Sessão Cancelada
                                    </h4>
                                    <p className="text-xs text-red-700 mt-1">Ana Oliveira cancelou a sessão de amanhã às 10:00</p>
                                    <span className="text-[10px] text-red-600 font-medium">08/06 23:22</span>
                                </div>
                                <XCircle className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-600" />
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-md flex justify-between items-start">
                                <div>
                                    <h4 className="text-sm font-semibold text-blue-800 flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Lembrete de Sessão
                                    </h4>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Agenda da Semana */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Agenda da Semana</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between gap-2">
                                {['seg', 'ter', 'qua', 'qui', 'sex', 'sáb', 'dom'].map((day, i) => (
                                    <div key={day} className={`flex flex-col items-center justify-center p-2 rounded-lg flex-1 ${i === 0 ? 'bg-blue-100/50 border border-blue-200 text-blue-700' : 'bg-zinc-50 border border-zinc-100 text-zinc-500'}`}>
                                        <span className="text-[10px] font-medium uppercase mb-1">{day}</span>
                                        <span className="text-lg font-bold">{22 + i}</span>
                                        <span className="text-[10px] text-zinc-400 mt-1">-</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Consultas de Amanhã */}
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Consultas de Amanhã</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center justify-center py-6 text-center">
                            <p className="text-sm text-muted-foreground mb-4">Nenhuma consulta agendada.</p>
                            <Button variant="outline" className="w-full text-xs h-9">
                                Ver Agenda Completa <ArrowRight className="w-3 h-3 ml-2" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function CalendarIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );
}

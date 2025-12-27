"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ExternalLink, Bell, AlertCircle } from "lucide-react";
import { completeReminder } from "@/app/actions/reminders";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Reminder {
    id: string;
    title: string;
    description: string | null;
    type: string;
    priority: string;
    link: string | null;
    dueDate: Date | null;
}

interface ReminderListProps {
    reminders: Reminder[];
}

export function ReminderList({ reminders }: ReminderListProps) {
    const { toast } = useToast();
    const [loadingId, setLoadingId] = useState<string | null>(null);

    if (reminders.length === 0) return null;

    const handleComplete = async (id: string) => {
        setLoadingId(id);
        const res = await completeReminder(id);
        if (res.success) {
            toast({ title: "Lembrete Concluído", description: "Tarefa marcada como realizada." });
        } else {
            toast({ title: "Erro", description: "Não foi possível concluir o lembrete.", variant: "destructive" });
        }
        setLoadingId(null);
    };

    return (
        <Card className="border-orange-100 bg-orange-50/30">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Lembretes Pendentes
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 hover:bg-orange-200">
                        {reminders.length}
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {reminders.map((reminder) => (
                    <div
                        key={reminder.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-lg border border-orange-100 shadow-sm"
                    >
                        <div className="space-y-1">
                            <div className="flex items-center gap-2">
                                {reminder.priority === 'HIGH' && (
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                                <span className="font-medium text-sm text-slate-800">{reminder.title}</span>
                            </div>
                            {reminder.description && (
                                <p className="text-xs text-slate-500">{reminder.description}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                            {reminder.link && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                                    onClick={() => window.open(reminder.link!, "_blank")}
                                >
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    Acessar
                                </Button>
                            )}

                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                                onClick={() => handleComplete(reminder.id)}
                                disabled={loadingId === reminder.id}
                            >
                                {loadingId === reminder.id ? (
                                    <span className="animate-spin mr-1">⏳</span>
                                ) : (
                                    <CheckCircle2 className="w-4 h-4 mr-1" />
                                )}
                                Concluído
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

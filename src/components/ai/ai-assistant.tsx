"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Lightbulb, Loader2, MessageSquare, Send, Sparkles, Star, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateGenericInsight } from "@/app/actions/ai";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIAssistantProps {
    contextName: string;
    data?: any; // Data optional for Help mode
    mode?: "auto" | "interactive";
    welcomeMessage?: string;
    variant?: "feature" | "help";
}

interface InsightResult {
    title: string;
    analysis: string;
    suggestions?: { title: string; description: string }[];
}

export function AIAssistant({ contextName, data, mode = "interactive", welcomeMessage, variant = "help" }: AIAssistantProps) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [input, setInput] = useState("");
    const [result, setResult] = useState<InsightResult | null>(null);

    const isFeature = variant === "feature";

    const handleGenerate = async (customPrompt?: string) => {
        setIsLoading(true);
        setResult(null);
        try {
            const res = await generateGenericInsight(contextName, data || {}, customPrompt); // Handle empty data for generic help
            if (res.success && res.data) {
                setResult(res.data);
            } else {
                toast({ title: "Erro", description: "Não foi possível gerar a análise.", variant: "destructive" });
            }
        } catch (error) {
            console.error(error);
            toast({ title: "Erro", description: "Falha na comunicação com a IA.", variant: "destructive" });
        } finally {
            setIsLoading(false);
            setInput("");
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (input.trim()) handleGenerate(input);
        }
    };

    // Styles based on variant
    const triggerClass = isFeature
        ? "h-11 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-200 transition-all hover:scale-105 flex items-center gap-2 font-medium"
        : "h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/30 hover:scale-110 transition-all p-0 flex items-center justify-center border-2 border-white/20";

    const Icon = isFeature ? Star : Loader2; // Placeholder, see logic below
    const TriggerIcon = isFeature ? Star : MessageSquare;

    const panelClass = isFeature
        ? "absolute top-full right-0 mt-2 z-50 w-[400px]" // Dropdown style for Feature
        : "fixed bottom-6 right-6 z-50 w-[400px]"; // Floating style for Help

    const defaultWelcome = isFeature
        ? "Analiso os dados desta tela para te dar insights estratégicos."
        : "Em que posso te ajudar hoje? Posso explicar funcionalidades ou tirar dúvidas.";

    return (
        <div className={cn("relative", !isFeature && "fixed bottom-6 right-6 z-50")}>
            {/* Trigger */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={triggerClass}
            >
                {isFeature ? (
                    <>
                        <Star className="h-4 w-4 fill-current" />
                        <span>IA Insights</span>
                    </>
                ) : (
                    <TriggerIcon className="h-7 w-7 text-white" />
                )}
            </Button>

            {/* Panel */}
            {isOpen && (
                <div
                    className={cn(
                        "max-w-[90vw] bg-white/95 backdrop-blur-xl border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-200",
                        isFeature ? "border-purple-100 absolute top-14 right-0" : "border-blue-100 fixed bottom-24 right-0 mx-6 mb-0 origin-bottom-right"
                    )}
                    style={{ width: '400px' }}
                >
                    {/* Header */}
                    <div className={cn("p-4 flex justify-between items-center shrink-0", isFeature ? "bg-gradient-to-r from-purple-600 to-indigo-600" : "bg-gradient-to-r from-blue-600 to-cyan-600")}>
                        <div className="flex items-center gap-2 text-white">
                            {isFeature ? <Sparkles className="h-5 w-5" /> : <Lightbulb className="h-5 w-5" />}
                            <h3 className="font-bold">{isFeature ? "AI Insights" : "Ajuda Inteligente"}</h3>
                            {isFeature && (
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full text-purple-100">
                                    {contextName}
                                </span>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8 rounded-full"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Content Area */}
                    <ScrollArea className="flex-1 p-4 bg-slate-50/50 min-h-[300px]">
                        {!result && !isLoading && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 py-8">
                                <div className={cn("h-16 w-16 rounded-full flex items-center justify-center", isFeature ? "bg-purple-100 text-purple-400" : "bg-blue-100 text-blue-400")}>
                                    {isFeature ? <Sparkles className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
                                </div>
                                <div className="text-center max-w-[80%]">
                                    <p className="font-medium text-slate-600 mb-1">Como posso ajudar?</p>
                                    <p className="text-xs">{welcomeMessage || defaultWelcome}</p>
                                </div>
                                {isFeature && (
                                    <Button
                                        variant="outline"
                                        className="bg-white hover:bg-purple-50 text-purple-600 border-purple-200 text-xs rounded-full"
                                        onClick={() => handleGenerate()}
                                    >
                                        <Sparkles className="mr-2 h-3 w-3" />
                                        Analisar contexto atual
                                    </Button>
                                )}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-10 space-y-3">
                                <Loader2 className={cn("h-8 w-8 animate-spin", isFeature ? "text-purple-600" : "text-blue-600")} />
                                <p className={cn("text-xs font-medium animate-pulse", isFeature ? "text-purple-600" : "text-blue-600")}>
                                    {isFeature ? "Analisando dados..." : "Consultando base de conhecimento..."}
                                </p>
                            </div>
                        )}

                        {result && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Analysis Bubble */}
                                <div className="flex gap-3">
                                    <div className={cn("h-8 w-8 rounded-full flex items-center justify-center shrink-0", isFeature ? "bg-purple-100" : "bg-blue-100")}>
                                        <Sparkles className={cn("h-4 w-4", isFeature ? "text-purple-600" : "text-blue-600")} />
                                    </div>
                                    <div className={cn("bg-white border shadow-sm p-3 rounded-2xl rounded-tl-none text-sm text-slate-700 space-y-2", isFeature ? "border-purple-100" : "border-blue-100")}>
                                        <h4 className={cn("font-bold", isFeature ? "text-purple-700" : "text-blue-700")}>{result.title}</h4>
                                        <div className="prose prose-sm max-w-none text-slate-600 leading-relaxed">
                                            {result.analysis}
                                        </div>
                                    </div>
                                </div>

                                {/* Suggestions */}
                                {result.suggestions && result.suggestions.length > 0 && (
                                    <div className="pl-11 space-y-2">
                                        {result.suggestions.map((s, i) => (
                                            <Card key={i} className={cn("bg-white/60 shadow-sm hover:shadow-md transition-all cursor-default", isFeature ? "border-purple-100/50" : "border-blue-100/50")}>
                                                <CardContent className="p-3 flex gap-3 items-start">
                                                    <ChevronRight className={cn("h-4 w-4 mt-0.5 shrink-0", isFeature ? "text-purple-400" : "text-blue-400")} />
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-700">{s.title}</p>
                                                        <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </ScrollArea>

                    {/* Footer Input */}
                    <div className="p-3 bg-white border-t border-slate-100 shrink-0">
                        <div className="relative flex items-center">
                            <Input
                                placeholder={isFeature ? "Pergunte sobre os dados..." : "Digite sua dúvida..."}
                                className={cn("pr-12 rounded-full border-slate-200 bg-slate-50", isFeature ? "focus-visible:ring-purple-500" : "focus-visible:ring-blue-500")}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                disabled={isLoading}
                            />
                            <Button
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                onClick={() => handleGenerate(input)}
                                className={cn("absolute right-1 h-8 w-8 rounded-full text-white shadow-sm", isFeature ? "bg-purple-600 hover:bg-purple-700" : "bg-blue-600 hover:bg-blue-700")}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 ml-0.5" />}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

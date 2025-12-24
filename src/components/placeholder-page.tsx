import { Construction } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PlaceholderPage({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center p-8">
            <div className="h-20 w-20 bg-zinc-100 rounded-full flex items-center justify-center">
                <Construction className="h-10 w-10 text-zinc-400" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            <p className="text-muted-foreground max-w-[500px]">
                Esta funcionalidade ainda está em desenvolvimento. Em breve você terá acesso completo a este módulo.
            </p>
            <Button asChild variant="outline">
                <Link href="/dashboard">Voltar ao Dashboard</Link>
            </Button>
        </div>
    );
}

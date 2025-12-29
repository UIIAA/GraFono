import { Inter } from "next/font/google";
import "../globals.css"; // Go up one level to reach app/globals.css
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Portal do Paciente | FonoIA",
    description: "Acompanhe seu tratamento fonoaudiológico.",
};

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className={`min-h-screen bg-slate-50 ${inter.className}`}>
            {/* Simple Top Navigation for Patient */}
            <header className="bg-white border-b border-slate-100 h-16 flex items-center px-6 justify-between sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                        F
                    </div>
                    <span className="font-semibold text-slate-700">Portal do Paciente</span>
                </div>
                <div className="text-sm text-slate-500">
                    FonoIA
                </div>
            </header>

            <main className="max-w-5xl mx-auto p-6 md:p-8">
                {children}
            </main>

            <Toaster />
        </div>
    );
}

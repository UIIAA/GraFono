import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, MapPin } from "lucide-react";

export default function InstitutionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-stone-50 font-sans selection:bg-rose-100 selection:text-rose-900">
            {/* Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-rose-100/50 shadow-sm">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/site" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-200/50 group-hover:shadow-rose-300/60 transition-all duration-300 group-hover:scale-105">
                            G
                        </div>
                        <span className="font-semibold text-lg text-stone-800 tracking-tight">
                            Graciele<span className="text-rose-500">Fono</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="#sobre" className="text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors">
                            Sobre
                        </Link>
                        <Link href="#especialidades" className="text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors">
                            Especialidades
                        </Link>
                        <Link href="#metodologia" className="text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors">
                            Metodologia
                        </Link>
                        <Link href="#materiais" className="text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors">
                            Materiais
                        </Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="hidden sm:flex text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </Button>
                        <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-lg shadow-stone-900/20 hover:shadow-stone-900/30 transition-all hover:scale-[1.02]">
                            <Phone className="w-4 h-4 mr-2" />
                            Agendar
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-stone-900 text-stone-300 py-16 border-t border-stone-800">
                <div className="container mx-auto px-6 grid md:grid-cols-4 gap-10">
                    <div className="space-y-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                                G
                            </div>
                            <span className="font-semibold text-lg text-white">
                                Graciele<span className="text-rose-400">Fono</span>
                            </span>
                        </div>
                        <p className="text-sm text-stone-400 leading-relaxed">
                            Ajudando crianças a desenvolverem todo o seu potencial de comunicação com amor, ciência e ludicidade.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Navegação</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="#sobre" className="text-stone-400 hover:text-rose-400 transition-colors">Sobre Mim</Link></li>
                            <li><Link href="#especialidades" className="text-stone-400 hover:text-rose-400 transition-colors">Especialidades</Link></li>
                            <li><Link href="#metodologia" className="text-stone-400 hover:text-rose-400 transition-colors">Método de Trabalho</Link></li>
                            <li><Link href="#duvidas" className="text-stone-400 hover:text-rose-400 transition-colors">Dúvidas Frequentes</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Contato</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-rose-400 mt-1 shrink-0" />
                                <span className="text-stone-400">Rua da Prata, 123 - Bethaville<br />Barueri - SP</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                                <span className="text-stone-400">(11) 99999-9999</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Horários</h3>
                        <ul className="space-y-2 text-sm text-stone-400">
                            <li className="flex justify-between">
                                <span>Seg - Sex</span>
                                <span>08:00 - 19:00</span>
                            </li>
                            <li className="flex justify-between">
                                <span>Sábado</span>
                                <span>08:00 - 12:00</span>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="container mx-auto px-6 mt-12 pt-8 border-t border-stone-800 text-center text-xs text-stone-500">
                    © {new Date().getFullYear()} Graciele Fonoaudiologia. Todos os direitos reservados.
                </div>
            </footer>
        </div>
    );
}

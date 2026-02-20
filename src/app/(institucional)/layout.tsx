import Link from "next/link";
import { Phone, MapPin } from "lucide-react";
import { Header } from "./_components/header";

export default function InstitutionalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-stone-50 font-sans selection:bg-rose-100 selection:text-rose-900">
            {/* Navigation */}
            <Header />

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
                            <li><Link href="#materiais" className="text-stone-400 hover:text-rose-400 transition-colors">Materiais</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Contato</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-rose-400 mt-1 shrink-0" />
                                <span className="text-stone-400">Av. Trindade, 254 - Sala 710, Bethaville I<br />Barueri - SP</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                                <a href="https://wa.me/5511991556534" className="text-stone-400 hover:text-rose-400 transition-colors">(11) 99155-6534</a>
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
                <div className="container mx-auto px-6 mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
                    <span>© {new Date().getFullYear()} Graciele Fonoaudiologia. Todos os direitos reservados.</span>
                    <div className="flex gap-6">
                        <Link href="/politica-de-privacidade" className="hover:text-rose-400 transition-colors">Política de Privacidade</Link>
                        <Link href="/termos-de-uso" className="hover:text-rose-400 transition-colors">Termos de Uso</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

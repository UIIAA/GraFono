"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Calendar,
    Users,
    DollarSign,
    BarChart3,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Smartphone,
    LayoutDashboard
} from "lucide-react";

export default function SystemSalesPage() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Navigation */}
            <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">
                            Grafono
                        </span>
                        <span className="hidden md:inline-flex text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">
                            Para Profissionais
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <button onClick={() => scrollToSection("features")} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                            Funcionalidades
                        </button>
                        <button onClick={() => scrollToSection("benefits")} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                            Benefícios
                        </button>
                        <button onClick={() => scrollToSection("pricing")} className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                            Planos
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login">
                            <Button variant="ghost" className="text-gray-600 hover:text-primary">
                                Entrar
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button className="bg-primary hover:bg-orange-600 text-white shadow-lg hover:shadow-primary/25 transition-all">
                                Começar Grátis
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 overflow-hidden relative">
                <div className="absolute top-0 right-0 -z-10 w-[800px] h-[800px] bg-orange-100/50 rounded-full blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl opacity-50 -translate-x-1/2 translate-y-1/2"></div>

                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-16 relative">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6 animate-fade-in-up">
                            <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
                            <span className="text-sm font-medium text-gray-600">O sistema ideal para Fonoaudiólogos e Terapeutas</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl/tight font-extrabold tracking-tight mb-6 text-gray-900">
                            Gerencie seu consultório com <span className="text-primary relative inline-block">
                                inteligência
                                <svg className="absolute w-full h-3 -bottom-1 left-0 text-orange-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                                    <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
                                </svg>
                            </span> e simplicidade.
                        </h1>

                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                            Tenha agenda, prontuários, financeiro e marketing em um só lugar.
                            Foque no que realmente importa: seus pacientes.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/login">
                                <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-orange-600 text-white shadow-xl hover:shadow-primary/25 hover:-translate-y-1 transition-all rounded-full">
                                    Teste Gratuitamente
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <Link href="#demo">
                                <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-gray-300 hover:border-sidebar-primary hover:text-primary hover:bg-orange-50 rounded-full transition-all">
                                    Ver Demonstração
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Dashboard Preview / Mockup */}
                    <div className="relative mx-auto max-w-6xl -mb-32 z-10 perspective-1000">
                        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden transform rotate-x-2 transition-transform hover:rotate-x-0 duration-700 ease-out">
                            {/* Browser Chrome UI */}
                            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                </div>
                                <div className="ml-4 bg-white rounded-md px-3 py-1 text-xs text-gray-400 flex-1 text-center font-mono">
                                    app.grafono.com/dashboard
                                </div>
                            </div>
                            {/* Placeholder for System Screenshot */}
                            <div className="aspect-[16/9] bg-gray-50 flex items-center justify-center text-gray-400 bg-[url('/placeholder-dashboard.png')] bg-cover bg-center">
                                <div className="p-12 text-center bg-white/90 backdrop-blur rounded-xl shadow-lg border border-gray-200 max-w-lg">
                                    <LayoutDashboard className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Visão Geral do Sistema</h3>
                                    <p className="text-gray-500">Aqui será exibida uma captura de tela real do Dashboard do Grafono, mostrando métricas de atendimento, agenda e faturamento.</p>
                                </div>
                            </div>
                        </div>
                        {/* Decorative Elements */}
                        <div className="absolute -right-12 -bottom-12 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
                        <div className="absolute -left-12 top-12 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="bg-white pt-48 pb-16 border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-gray-100">
                        <div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">+1000</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wide">Pacientes Atendidos</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">98%</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wide">Satisfação</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">24/7</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wide">Disponibilidade</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-gray-900 mb-2">NaN</div>
                            <div className="text-sm text-gray-500 uppercase tracking-wide">Burocracia</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-primary font-semibold tracking-wide uppercase mb-3">Funcionalidades</h2>
                        <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Tudo o que você precisa para crescer</h3>
                        <p className="text-xl text-gray-600">
                            Uma suíte completa de ferramentas projetadas especificamente para as necessidades de profissionais de saúde autônomos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                            <CardHeader>
                                <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                    <Calendar className="w-7 h-7 text-primary group-hover:text-white" />
                                </div>
                                <CardTitle className="text-xl">Agenda Inteligente</CardTitle>
                                <CardDescription className="text-base">
                                    Controle total dos seus horários, com lembretes automáticos para pacientes e controle de faltas.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Confirmação automática</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Gestão de recorrência</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Lista de espera</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                            <CardHeader>
                                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
                                    <Users className="w-7 h-7 text-blue-600 group-hover:text-white" />
                                </div>
                                <CardTitle className="text-xl">Prontuário Eletrônico</CardTitle>
                                <CardDescription className="text-base">
                                    Histórico completo do paciente, evolução, anexos e anamneses personalizáveis.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Modelos de evolução</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Upload de exames</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Segurança LGPD</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-2">
                            <CardHeader>
                                <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
                                    <DollarSign className="w-7 h-7 text-green-600 group-hover:text-white" />
                                </div>
                                <CardTitle className="text-xl">Gestão Financeira</CardTitle>
                                <CardDescription className="text-base">
                                    Fluxo de caixa, emissão de recibos e relatórios de faturamento em tempo real.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Contas a pagar/receber</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Recibos automáticos</li>
                                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Relatórios gráficos</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Feature Highlight Sections */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 order-2 lg:order-1">
                            {/* Visual Placeholder */}
                            <div className="relative rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 aspect-[4/3] p-6 shadow-inner border border-gray-100 flex items-center justify-center">
                                <div className="text-center text-gray-400">
                                    <BarChart3 className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                    <span className="text-lg font-medium">Print da Tela de Finanças</span>
                                </div>
                                {/* Floating Cards */}
                                <div className="absolute -right-8 top-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 animate-pulse">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">$</div>
                                        <div>
                                            <div className="text-xs text-gray-400">Receita Mensal</div>
                                            <div className="text-lg font-bold text-gray-800">R$ 15.420</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 order-1 lg:order-2">
                            <div className="inline-block px-3 py-1 rounded bg-orange-100 text-primary text-sm font-semibold mb-4">
                                Financeiro
                            </div>
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                                Assuma o controle do seu faturamento
                            </h3>
                            <p className="text-lg text-gray-600 mb-8">
                                Chega de planilhas confusas. O Grafono organiza suas finanças automaticamente conforme você atende.
                                Saiba exatamente quanto vai receber e quem está inadimplente.
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Fluxo de Caixa Visual</h4>
                                        <p className="text-gray-500 text-sm">Vizualize entradas e saídas em gráficos intuitivos.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-4">
                                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-1 flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Emissão de Recibos</h4>
                                        <p className="text-gray-500 text-sm">Gere recibos profissionais com um clique e envie por WhatsApp.</p>
                                    </div>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <Link href="/login">
                                    <Button className="bg-white border border-gray-200 text-gray-900 hover:bg-gray-50">
                                        Saiba mais sobre o financeiro
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mobile Value Section */}
            <section className="py-24 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary rounded-full blur-[128px] opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <h3 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                                Seu consultório na palma da sua mão.
                            </h3>
                            <p className="text-xl text-gray-300 mb-8">
                                Acesse agendamentos, dados de pacientes e finanças de qualquer lugar.
                                O Grafono é totalmente responsivo e otimizado para celular e tablet.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                                    <Smartphone className="w-8 h-8 text-primary mb-3" />
                                    <h4 className="font-semibold mb-1">Acesso Mobile</h4>
                                    <p className="text-sm text-gray-400">Funciona perfeitamente no seu iPhone ou Android.</p>
                                </div>
                                <div className="bg-gray-800 p-5 rounded-xl border border-gray-700">
                                    <ShieldCheck className="w-8 h-8 text-primary mb-3" />
                                    <h4 className="font-semibold mb-1">Dados Seguros</h4>
                                    <p className="text-sm text-gray-400">Criptografia de ponta e backups automáticos diários.</p>
                                </div>
                            </div>
                        </div>
                        <div className="lg:w-1/2 flex justify-center">
                            <div className="relative w-[300px] h-[600px] bg-gray-950 rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-20"></div>
                                <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400">
                                    <div className="text-center p-6">
                                        <LayoutDashboard className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                        <span className="text-sm">Mobile View</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section id="pricing" className="py-24 bg-primary/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Comece sua transformação hoje</h2>
                    <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
                        Junte-se a centenas de profissionais que já modernizaram seus atendimentos com o Grafono.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/login">
                            <Button size="lg" className="h-16 px-10 text-xl bg-primary hover:bg-orange-600 text-white shadow-xl hover:shadow-primary/25 rounded-full transition-all">
                                Criar Conta Gratuita
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-gray-500">
                        Teste grátis por 7 dias • Não requer cartão de crédito • Cancele quando quiser
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 pt-16 pb-8">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                                    <LayoutDashboard className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-lg font-bold text-gray-900">Grafono</span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                Software de gestão completo para fonoaudiólogos e terapeutas.
                                Simples, bonito e eficiente.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Produto</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="#features" className="hover:text-primary">Funcionalidades</Link></li>
                                <li><Link href="#pricing" className="hover:text-primary">Preços</Link></li>
                                <li><Link href="#" className="hover:text-primary">Atualizações</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Empresa</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="/sobre" className="hover:text-primary">Sobre Nós</Link></li>
                                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                                <li><Link href="#" className="hover:text-primary">Contato</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li><Link href="#" className="hover:text-primary">Termos de Uso</Link></li>
                                <li><Link href="#" className="hover:text-primary">Privacidade</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center bg-gray-50/50 -mx-4 px-4 py-6 mt-8 rounded-b-xl">
                        <p className="text-sm text-gray-500">© 2024 Grafono. Todos os direitos reservados.</p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            {/* Social Icons placeholders */}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

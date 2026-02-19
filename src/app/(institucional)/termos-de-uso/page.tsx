import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Termos de Uso | Graciele Fonoaudiologia",
    description: "Termos de Uso da Graciele Fonoaudiologia.",
};

export default function TermosDeUso() {
    return (
        <div className="min-h-screen bg-stone-50">
            <div className="container mx-auto px-6 py-16 max-w-3xl">
                <h1 className="text-3xl font-bold text-stone-900 mb-2">Termos de Uso</h1>
                <p className="text-sm text-stone-400 mb-10">Última atualização: 15 de fevereiro de 2026</p>

                <div className="prose prose-stone max-w-none space-y-8 text-stone-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">1. Aceitação dos Termos</h2>
                        <p>
                            Ao acessar e utilizar o site e os serviços da <strong>Graciele Fonoaudiologia</strong>,
                            você concorda com estes Termos de Uso. Caso não concorde, por favor, não utilize nossos serviços.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">2. Descrição dos Serviços</h2>
                        <p>
                            Oferecemos serviços de fonoaudiologia clínica, incluindo avaliação, diagnóstico e
                            tratamento de distúrbios da comunicação humana. Nosso site e canais de comunicação
                            (incluindo WhatsApp) são utilizados para:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Agendamento de consultas e avaliações.</li>
                            <li>Comunicação sobre tratamentos em andamento.</li>
                            <li>Envio de lembretes e orientações clínicas.</li>
                            <li>Divulgação de conteúdo educativo sobre fonoaudiologia.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">3. Atendimento via WhatsApp</h2>
                        <p>
                            Nosso atendimento via WhatsApp pode utilizar assistente virtual (inteligência artificial)
                            para agilizar o agendamento e responder dúvidas frequentes. O assistente virtual:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Não substitui a consulta profissional presencial.</li>
                            <li>Não realiza diagnósticos clínicos.</li>
                            <li>Pode encaminhar sua solicitação para atendimento humano quando necessário.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">4. Responsabilidades do Usuário</h2>
                        <p>Ao utilizar nossos serviços, você se compromete a:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Fornecer informações verdadeiras e atualizadas.</li>
                            <li>Não utilizar nossos canais para fins ilícitos ou abusivos.</li>
                            <li>Respeitar os horários de agendamento e políticas de cancelamento.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">5. Propriedade Intelectual</h2>
                        <p>
                            Todo o conteúdo do site, incluindo textos, imagens, logotipos e materiais educativos,
                            é de propriedade da Graciele Fonoaudiologia e está protegido por leis de direitos autorais.
                            É proibida a reprodução sem autorização prévia.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">6. Limitação de Responsabilidade</h2>
                        <p>
                            As informações disponibilizadas no site e via WhatsApp têm caráter informativo e
                            não substituem a consulta presencial com profissional de saúde. Não nos
                            responsabilizamos por decisões tomadas com base exclusivamente em informações
                            obtidas por esses canais.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">7. Alterações nos Termos</h2>
                        <p>
                            Estes termos podem ser atualizados a qualquer momento. Alterações significativas
                            serão comunicadas pelos nossos canais de contato.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">8. Contato</h2>
                        <p>Para dúvidas sobre estes Termos de Uso:</p>
                        <ul className="list-none space-y-1">
                            <li><strong>Responsável:</strong> Graciele Cruz - Fonoaudióloga</li>
                            <li><strong>WhatsApp:</strong> <a href="https://wa.me/5511991556534" className="text-rose-500 hover:text-rose-600 underline">(11) 99155-6534</a></li>
                            <li><strong>Endereço:</strong> Av. Trindade, 254 - Sala 710, Bethaville I, Barueri - SP</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}

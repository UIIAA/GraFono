import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Política de Privacidade | Graciele Fonoaudiologia",
    description: "Política de Privacidade da Graciele Fonoaudiologia - Saiba como tratamos seus dados pessoais.",
};

export default function PoliticaDePrivacidade() {
    return (
        <div className="min-h-screen bg-stone-50">
            <div className="container mx-auto px-6 py-16 max-w-3xl">
                <h1 className="text-3xl font-bold text-stone-900 mb-2">Política de Privacidade</h1>
                <p className="text-sm text-stone-400 mb-10">Última atualização: 15 de fevereiro de 2026</p>

                <div className="prose prose-stone max-w-none space-y-8 text-stone-700 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">1. Informações Gerais</h2>
                        <p>
                            Esta Política de Privacidade descreve como <strong>Graciele Fonoaudiologia</strong> (&quot;nós&quot;, &quot;nosso&quot;)
                            coleta, utiliza e protege as informações pessoais dos usuários (&quot;você&quot;) que acessam nosso site
                            e utilizam nossos serviços de agendamento e comunicação, incluindo o atendimento via WhatsApp.
                        </p>
                        <p>
                            Ao utilizar nossos serviços, você concorda com as práticas descritas nesta política, em conformidade
                            com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">2. Dados que Coletamos</h2>
                        <p>Podemos coletar os seguintes dados pessoais:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><strong>Dados de identificação:</strong> nome completo, telefone, e-mail.</li>
                            <li><strong>Dados de saúde:</strong> informações clínicas fornecidas durante atendimento fonoaudiológico, histórico de tratamento e evolução.</li>
                            <li><strong>Dados de comunicação:</strong> mensagens trocadas via WhatsApp para fins de agendamento e acompanhamento clínico.</li>
                            <li><strong>Dados de navegação:</strong> cookies e informações técnicas de acesso ao site.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">3. Como Utilizamos seus Dados</h2>
                        <p>Utilizamos seus dados pessoais para:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Agendamento e gestão de consultas fonoaudiológicas.</li>
                            <li>Comunicação sobre consultas, lembretes e orientações clínicas via WhatsApp.</li>
                            <li>Registro e acompanhamento da evolução clínica do paciente.</li>
                            <li>Emissão de relatórios e documentos clínicos.</li>
                            <li>Cumprimento de obrigações legais e regulatórias da profissão.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">4. Compartilhamento de Dados</h2>
                        <p>
                            Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros para fins comerciais.
                            Seus dados podem ser compartilhados apenas nas seguintes situações:
                        </p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Com plataformas de comunicação (WhatsApp/Meta) exclusivamente para viabilizar o contato com você.</li>
                            <li>Com provedores de infraestrutura tecnológica que auxiliam na operação do sistema, sob acordos de confidencialidade.</li>
                            <li>Quando exigido por lei ou ordem judicial.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">5. Armazenamento e Segurança</h2>
                        <p>
                            Seus dados são armazenados em servidores seguros com criptografia e acesso restrito.
                            Adotamos medidas técnicas e organizacionais para proteger suas informações contra acesso
                            não autorizado, perda ou destruição.
                        </p>
                        <p>
                            Dados clínicos são mantidos pelo prazo mínimo de 20 anos, conforme determinação do
                            Conselho Federal de Fonoaudiologia e legislação vigente.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">6. Seus Direitos (LGPD)</h2>
                        <p>Você tem direito a:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li>Confirmar a existência de tratamento de seus dados.</li>
                            <li>Acessar, corrigir ou atualizar seus dados pessoais.</li>
                            <li>Solicitar a eliminação de dados desnecessários.</li>
                            <li>Revogar o consentimento a qualquer momento.</li>
                            <li>Solicitar portabilidade dos dados.</li>
                        </ul>
                        <p>
                            Para exercer seus direitos, entre em contato pelo WhatsApp{" "}
                            <a href="https://wa.me/5511991556534" className="text-rose-500 hover:text-rose-600 underline">(11) 99155-6534</a> ou
                            pelo e-mail <strong>contato@gracielefono.com.br</strong>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">7. Cookies</h2>
                        <p>
                            Nosso site pode utilizar cookies para melhorar a experiência de navegação.
                            Cookies são pequenos arquivos armazenados no seu dispositivo que nos ajudam
                            a entender como você utiliza o site. Você pode desativar cookies nas
                            configurações do seu navegador.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">8. Alterações nesta Política</h2>
                        <p>
                            Esta política pode ser atualizada periodicamente. Recomendamos que você a consulte
                            regularmente. Alterações significativas serão comunicadas pelos nossos canais de contato.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-stone-800">9. Contato</h2>
                        <p>
                            Para dúvidas sobre esta Política de Privacidade ou sobre o tratamento de seus dados pessoais:
                        </p>
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

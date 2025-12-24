"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, Instagram, MapPin, Award, BookOpen, Users, Heart, Target, Lightbulb, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SobrePage() {
  const specializations = [
    {
      title: "Fonoaudióloga",
      institution: "Conselho Regional de Fonoaudiologia",
      description: "Formada em Fonoaudiologia com registro profissional ativo no Conselho Regional de Fonoaudiologia.",
      icon: "🎓"
    },
    {
      title: "Especialista em Análise do Comportamento Aplicado (ABA)",
      institution: "Universidade de São Paulo",
      description: "Pós-graduada em Análise do Comportamento Aplicado com foco no atendimento de crianças com transtornos do desenvolvimento.",
      icon: "🧠"
    },
    {
      title: "Especialista em Distúrbios da Fala e Linguagem",
      institution: "Universidade de São Paulo",
      description: "Pós-graduação em Distúrbios da Fala e Linguagem, com ênfase no diagnóstico e tratamento de crianças e adolescentes.",
      icon: "🗣️"
    }
  ];

  const expertise = [
    {
      title: "Atendimento Clínico",
      description: "Anos de experiência clínica no atendimento de crianças e adolescentes com desenvolvimento atípico, aprimorando habilidades de avaliação e tratamento.",
      icon: "🏥"
    },
    {
      title: "Neuroreabilitação Infantil",
      description: "Vasta experiência na área de neuroreabilitação infantil, com foco especial em casos de paralisia cerebral e Síndrome de Down.",
      icon: "👶"
    },
    {
      title: "Comunicação Alternativa",
      description: "Domínio de métodos de comunicação alternativa e aumentativa, como PECS e PODD, para crianças com dificuldades na fala oral.",
      icon: "📱"
    }
  ];

  const techniques = [
    {
      title: "Terapia de Taping Orofacial",
      description: "Especialista na aplicação da técnica Therapy Taping, utilizando fitas especiais para estimular o desenvolvimento motor oral e melhorar a articulação da fala.",
      icon: "🩹"
    },
    {
      title: "Método Prompt",
      description: "Através da abordagem Prompt, trabalho de forma individualizada com cada criança, guiando e reestruturando os movimentos necessários para a produção correta dos sons.",
      icon: "🎯"
    },
    {
      title: "Protocolos de Avaliação",
      description: "Domínio de diversos protocolos consagrados, como ADL, PROC, ABFW, AMIOF, PAD-PED, EDACAS e CFSC, para avaliações minuciosas e personalizadas.",
      icon: "📋"
    }
  ];

  const values = [
    {
      title: "Acolhimento",
      description: "Oferecemos um ambiente seguro e confortável para cada criança.",
      icon: "🤗"
    },
    {
      title: "Respeito",
      description: "Valorizamos a individualidade e as necessidades únicas de cada paciente.",
      icon: "🙏"
    },
    {
      title: "Comprometimento",
      description: "Dedicamos nossos esforços integralmente ao progresso de cada criança.",
      icon: "💪"
    },
    {
      title: "Ética",
      description: "Conduzimos nosso trabalho com os mais altos padrões de integridade.",
      icon: "⚖️"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* Header/Navigation */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-pink-100">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-pink-500">Grafono</Link>
          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors">Início</Link>
            <Link href="/sobre" className="text-gray-700 hover:text-pink-500 transition-colors font-semibold">Sobre</Link>
            <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors">Serviços</Link>
            <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors">Contato</Link>
          </div>
          <Link href="https://wa.me/5511966287489" target="_blank">
            <Button className="bg-pink-500 hover:bg-pink-600 text-white">
              Agende uma consulta inicial gratuita
            </Button>
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            Sobre <span className="text-pink-500">Graciele Costa</span>
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Fonoaudióloga especialista em desenvolvimento infantil, dedicada a ajudar crianças a 
            desenvolverem todo o seu potencial de comunicação e linguagem com paixão e experiência.
          </p>
          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-full h-full flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/professional-1.jpg" 
                  alt="Graciele Costa - Fonoaudióloga Infantil" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Minha Filosofia de Trabalho</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 mb-8">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Com paixão e experiência, dedico minha carreira a ajudar crianças a desenvolverem todo o seu 
                potencial de comunicação e linguagem. Minha formação em Fonoaudiologia e pós-graduações 
                especializadas me tornam uma profissional completa e preparada para atender às necessidades 
                individuais de cada criança.
              </p>
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                Acredito que cada criança é única e merece um tratamento que respeite seu ritmo e estilo 
                de aprendizagem. Comigo, seu filho terá um acompanhamento individualizado e atencioso, 
                com foco em suas necessidades específicas e potencialidades.
              </p>
              <div className="flex items-center justify-center gap-2 text-pink-600 font-medium">
                <Heart className="w-5 h-5" />
                <span>Seu filho em boas mãos</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Formação e Especializações</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conhecimento especializado para oferecer o melhor atendimento
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specializations.map((formacao, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4">{formacao.icon}</div>
                  <CardTitle className="text-xl text-gray-800">{formacao.title}</CardTitle>
                  <CardDescription className="text-sm text-purple-600 font-medium">
                    {formacao.institution}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{formacao.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Experiência que Faz a Diferença</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Áreas de atuação onde construí minha expertise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {expertise.map((exp, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4">{exp.icon}</div>
                  <CardTitle className="text-xl text-gray-800">{exp.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{exp.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Techniques Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Técnicas Especializadas</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Metodologias modernas e eficazes para o melhor resultado
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {techniques.map((tech, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
                <CardHeader className="text-center pb-4">
                  <div className="text-5xl mb-4">{tech.icon}</div>
                  <CardTitle className="text-xl text-gray-800">{tech.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{tech.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Nossos Valores</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Os princípios que guiam nosso trabalho
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0 text-center">
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Missão e Visão</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Missão</h3>
                <p className="text-gray-600">
                  Ajudar cada criança a encontrar sua própria voz e se comunicar plenamente com o mundo ao seu redor
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Visão</h3>
                <p className="text-gray-600">
                  Oferecer atendimento de excelência que transforme vidas através da comunicação
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg border-0 text-center">
              <CardContent className="p-8">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Compromisso</h3>
                <p className="text-gray-600">
                  Ser referência em fonoaudiologia infantil, dedicando-nos com alegria e confiança
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* Newsletter Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-500 to-purple-500">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Receba Nossos Materiais Exclusivos
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Inscreva-se na nossa newsletter e receba dicas valiosas sobre desenvolvimento infantil
          </p>
          <Link href="/#contato">
            <Button variant="secondary" className="bg-white text-pink-500 hover:bg-gray-100 text-lg px-8 py-3">
              Cadastrar na Newsletter
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold text-pink-300 mb-4">Grafono</div>
          <p className="text-gray-300 mb-4">Fonoaudiologia Infantil com amor e cuidado</p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-300 hover:text-pink-300 transition-colors">
              <Mail className="w-6 h-6" />
            </a>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Grafono - Graciele Costa. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
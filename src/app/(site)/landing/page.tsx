"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BlogCarousel } from "@/components/BlogCarousel";
import { BlogPost } from "@/lib/blog";
import { Phone, Mail, Instagram, MapPin, Star, Heart, Play, BookOpen, Users, MessageCircle, ChevronRight } from "lucide-react";

export default function Home() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Carregar posts do blog
  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch("/api/blog");
        if (response.ok) {
          const posts = await response.json();
          setBlogPosts(posts);
        }
      } catch (error) {
        console.error("Failed to fetch blog posts:", error);
      }
    };

    fetchBlogPosts();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Cadastro realizado!",
      description: "Você receberá nossos materiais exclusivos em breve.",
    });
    setFormData({ name: "", email: "", phone: "" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const services = [
    {
      title: "Atraso no Desenvolvimento da Fala e Linguagem",
      description: "Ajudamos crianças com dificuldades em adquirir e desenvolver habilidades de comunicação verbal e não-verbal no tempo esperado.",
      icon: "🗣️"
    },
    {
      title: "Apraxia de Fala Infantil",
      description: "Tratamento especializado para crianças com dificuldades no planejamento e execução dos movimentos necessários para a fala.",
      icon: "🧠"
    },
    {
      title: "Distúrbios da Articulação",
      description: "Avaliamos e tratamos trocas, omissões e distorções de sons da fala com técnicas especializadas.",
      icon: "🔤"
    },
    {
      title: "Gagueira Infantil",
      description: "Desenvolvemos trabalho terapêutico para redução da tensão e fortalecimento da fluência e confiança na comunicação.",
      icon: "⏯️"
    },
    {
      title: "Neuroreabilitação Infantil",
      description: "Atendimento especializado para crianças com paralisia cerebral e Síndrome de Down.",
      icon: "👶"
    },
    {
      title: "Comunicação Alternativa",
      description: "Domínio de métodos como PECS e PODD para crianças com dificuldades na fala oral.",
      icon: "📱"
    }
  ];

  const approachItems = [
    {
      title: "Terapia de Taping Orofacial",
      description: "Especialista na aplicação da técnica Therapy Taping para estimular o desenvolvimento motor oral e melhorar a articulação.",
      icon: "🩹"
    },
    {
      title: "Método Prompt",
      description: "Abordagem individualizada para guiar e reestruturar os movimentos necessários para a produção correta dos sons.",
      icon: "🎯"
    },
    {
      title: "Avaliação Abrangente",
      description: "Domínio de protocolos consagrados como ADL, PROC, ABFW, AMIOF, PAD-PED, EDACAS e CFSC para avaliações minuciosas.",
      icon: "📋"
    },
    {
      title: "Atendimento Lúdico",
      description: "Aprender brincando é mais eficaz e divertido para o desenvolvimento infantil.",
      icon: "🎮"
    },
    {
      title: "Abordagem Humanizada",
      description: "Cada criança é única e o plano terapêutico é personalizado according to suas necessidades.",
      icon: "❤️"
    },
    {
      title: "Orientação Familiar",
      description: "O sucesso da terapia envolve toda a família. Contem comigo!",
      icon: "👨‍👩‍👧‍👦"
    }
  ];

  const testimonials = [
    {
      name: "Ana Carolina",
      text: "A Gra foi transformadora na vida do meu filho. Ele evoluiu muito na fala e na confiança. Super recomendo!",
      role: "Mãe do Lucas, 4 anos"
    },
    {
      name: "Roberto Silva",
      text: "Atendimento excelente! Profissional dedicada e que realmente ama o que faz. Minha filha adora as sessões.",
      role: "Pai da Sofia, 3 anos"
    },
    {
      name: "Fernanda Oliveira",
      text: "A abordagem lúdica fez toda a diferença. Meu filho melhorou a fala sem perceber que estava em terapia.",
      role: "Mãe do Pedro, 5 anos"
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-blue-50">
      {/* Header/Navigation */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-pink-100">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-pink-500">Grafono</div>
          <div className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection("hero")} className="text-gray-700 hover:text-pink-500 transition-colors">Início</button>
            <Link href="/sobre" className="text-gray-700 hover:text-pink-500 transition-colors">Sobre</Link>
            <button onClick={() => scrollToSection("servicos")} className="text-gray-700 hover:text-pink-500 transition-colors">Serviços</button>
            <button onClick={() => scrollToSection("abordagem")} className="text-gray-700 hover:text-pink-500 transition-colors">Abordagem</button>
            <button onClick={() => scrollToSection("contato")} className="text-gray-700 hover:text-pink-500 transition-colors">Newsletter</button>
          </div>
          <Button 
            onClick={() => window.open('https://wa.me/5511966287489', '_blank')}
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            Agende uma consulta inicial gratuita
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="pt-24 pb-16 px-4">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
              Transformando vidas através da <span className="text-pink-500">comunicação</span>.
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl">
              Ajudo seu filho a desenvolver a fala, a linguagem e a se expressar com confiança e alegria. 
              Conheça a Fonoaudiologia Infantil com um olhar humano e especializado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
              <Button 
                onClick={() => window.open('https://wa.me/5511966287489', '_blank')}
                className="bg-pink-500 hover:bg-pink-600 text-white text-lg px-8 py-3"
              >
                Agende uma consulta inicial gratuita
              </Button>
              <Button 
                onClick={() => scrollToSection("sobre")}
                variant="outline" 
                className="border-pink-300 text-pink-500 hover:bg-pink-50 text-lg px-8 py-3"
              >
                Conheça meu trabalho
              </Button>
            </div>
            
            {/* Additional CTA for About Page */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 inline-block">
              <Link href="/sobre" className="flex items-center gap-2 text-purple-700 hover:text-purple-800 transition-colors">
                <Star className="w-4 h-4" />
                <span className="font-medium">Descubra minha formação e especializações</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-pink-200 rounded-full blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl p-8">
                <div className="w-full h-64 rounded-xl overflow-hidden">
                  <img 
                    src="/images/graciele-hero.jpg"
                    alt="Graciele Costa - Fonoaudióloga Infantil" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-800">Graciele Costa</h3>
                  <p className="text-pink-500">Fonoaudióloga Infantil</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-200 rounded-full blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-200 rounded-full blur-3xl opacity-20 translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-2 rounded-full mb-6">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Especialista Reconhecida</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
              Conheça a <span className="text-pink-500">Especialista</span> por Trás dos Resultados
            </h2>
            <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Com formação de excelência e experiência comprovada, transformo vidas através da fonoaudiologia infantil 
              com técnica, amor e dedicação exclusiva a cada criança.
            </p>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-10">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-pink-500 mb-2">DFL</div>
                <p className="text-sm text-gray-600">Especialista em Distúrbios da Fala e Linguagem</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-purple-500 mb-2">PECS</div>
                <p className="text-sm text-gray-600">Especialista em Comunicação Alternativa</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-blue-500 mb-2">ABA</div>
                <p className="text-sm text-gray-600">Análise do Comportamento Aplicado</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-8 rounded-2xl shadow-xl max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Descubra Minha História e Expertise</h3>
              <p className="mb-6 text-white/90">
                Conheça detalhes da minha formação, técnicas especializadas e casos de sucesso que 
                demonstram meu compromisso com o desenvolvimento infantil.
              </p>
              <Link href="/sobre">
                <Button variant="secondary" className="bg-white text-pink-500 hover:bg-gray-100 text-lg px-8 py-3 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  Ver Perfil Completo
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Quick Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all border-0 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Formação</h3>
                <p className="text-sm text-gray-600">
                  Fonoaudióloga com especializações em ABA e Distúrbios da Fala e Linguagem
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all border-0 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🏥</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Experiência</h3>
                <p className="text-sm text-gray-600">
                  Neuroreabilitação infantil, paralisia cerebral e Síndrome de Down
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all border-0 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">❤️</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Abordagem</h3>
                <p className="text-sm text-gray-600">
                  Humanizada, lúdica e personalizada para cada criança
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Desenvolvimento e Cuidado em Cada Etapa</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Ofereço atendimento especializado para diversas necessidades da comunicação infantil
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow border-0">
                <CardHeader className="text-center pb-4">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <CardTitle className="text-xl text-gray-800">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Formação e Especializações</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Conhecimento especializado para oferecer o melhor atendimento
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Fonoaudióloga</h3>
                <p className="text-sm text-gray-600 mb-3">Conselho Regional de Fonoaudiologia</p>
                <p className="text-xs text-gray-500">
                  Formada com registro profissional ativo
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Especialista em ABA</h3>
                <p className="text-sm text-gray-600 mb-3">Formação Especializada</p>
                <p className="text-xs text-gray-500">
                  Análise do Comportamento Aplicado
                </p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg border-0">
              <CardContent className="p-6 text-center">
                <div className="text-4xl mb-4">🗣️</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Especialista em Distúrbios</h3>
                <p className="text-sm text-gray-600 mb-3">Formação Especializada</p>
                <p className="text-xs text-gray-500">
                  Distúrbios da Fala e Linguagem
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section id="abordagem" className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Uma Jornada de Afeto e Técnica</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Minha metodologia combina conhecimento científico com uma abordagem acolhedora
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {approachItems.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">O que as Famílias Dizem</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Dicas da Fono</h2>
            <p className="text-lg text-gray-600 mb-4">Conteúdo útil para pais e cuidadores</p>
            <p className="text-sm text-gray-500">
              Deslize para ver mais artigos ou aguarde a troca automática
            </p>
          </div>
          <BlogCarousel posts={blogPosts} />
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contato" className="py-16 px-4 bg-gradient-to-b from-purple-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Quer receber material exclusivo?</h2>
            <p className="text-lg text-gray-600">Cadastre-se na nossa newsletter</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="bg-white shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-800">Newsletter Grafono</CardTitle>
                  <CardDescription>
                    Receba dicas exclusivas, materiais educativos e conteúdo sobre desenvolvimento infantil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white">
                      Quero me cadastrar
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="bg-white shadow-lg border-0">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Informações de Contato</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-pink-500" />
                      <span className="text-gray-600">(11) 96628-7489</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-pink-500" />
                      <span className="text-gray-600">suportegrafono@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Instagram className="w-5 h-5 text-pink-500" />
                      <span className="text-gray-600">@graciele_fonoaudiologa</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-pink-500" />
                      <span className="text-gray-600">Bethaville, Barueri - SP</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-4">Agende pelo WhatsApp</h3>
                  <p className="mb-4">Resposta mais rápida e atendimento personalizado</p>
                  <Button 
                    variant="secondary" 
                    className="bg-white text-pink-500 hover:bg-gray-100"
                    onClick={() => window.open('https://wa.me/5511966287489', '_blank')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Agendar Agora
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="text-2xl font-bold text-pink-300 mb-4">Grafono</div>
          <p className="text-gray-300 mb-4">Fonoaudiologia Infantil com amor e cuidado</p>
          <div className="flex justify-center space-x-6 mb-4">
            <button className="text-gray-300 hover:text-pink-300 transition-colors">
              <Instagram className="w-6 h-6" />
            </button>
            <button className="text-gray-300 hover:text-pink-300 transition-colors">
              <Mail className="w-6 h-6" />
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 Grafono - Graciele Costa. CRFa: XXXXX. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <button 
        onClick={() => window.open('https://wa.me/5511966287489', '_blank')}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Floating CTA for About Page */}
      <div className="fixed bottom-6 left-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full px-6 py-3 shadow-lg transition-all hover:scale-105 z-40 hidden md:block">
        <Link href="/sobre" className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="text-sm font-medium">Conheça a Especialista</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
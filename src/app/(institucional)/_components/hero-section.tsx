"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, User, Heart } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gradient-to-b from-teal-50/50 to-white">
            {/* Animated Background Elements (Blobs) */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-200/20 rounded-full blur-[100px] animate-pulse-slow" />
            <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-pink-200/20 rounded-full blur-[80px]" />

            <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                <div className="space-y-8 lg:pr-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-teal-100 shadow-sm text-teal-700 text-sm font-medium animate-fade-in-up">
                        <Sparkles className="w-4 h-4 fill-teal-200 text-teal-500" />
                        <span>Fonoaudiologia Infantil Especializada</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1] animate-fade-in-up [animation-delay:200ms]">
                        Ajudando seu filho a encontrar sua <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-emerald-500">própria voz</span>.
                    </h1>

                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl animate-fade-in-up [animation-delay:400ms]">
                        Uma abordagem acolhedora e baseada em evidências para o desenvolvimento da comunicação, linguagem e fala.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up [animation-delay:600ms]">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-teal-600 hover:bg-teal-700 text-lg shadow-xl shadow-teal-200/50 hover:shadow-teal-300/50 transition-all">
                            Agendar Avaliação
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                        <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-teal-700 text-lg">
                            Conhecer Método
                        </Button>
                    </div>
                </div>

                <div className="relative animate-fade-in-up [animation-delay:800ms]">
                    {/* Abstract Composition for Hero Image */}
                    <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                        <div className="absolute inset-4 rounded-[40px] bg-gradient-to-tr from-teal-100 to-slate-100 rotate-3 overflow-hidden shadow-2xl border-4 border-white">
                            {/* Placeholder for Hero Image - Needs actual asset */}
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">
                                <User className="w-32 h-32 opacity-20" />
                                <span className="absolute bottom-8 font-medium">Foto: Criança Sorrindo / Interagindo</span>
                            </div>
                        </div>
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[260px] animate-bounce-slow">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-pink-100 rounded-full text-pink-600">
                                    <Heart className="w-5 h-5 fill-pink-600" />
                                </div>
                                <span className="font-bold text-slate-800">Cuidado Humanizado</span>
                            </div>
                            <p className="text-sm text-slate-500">Respeito ao ritmo e particularidades de cada criança.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

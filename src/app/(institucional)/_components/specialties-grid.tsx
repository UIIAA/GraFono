"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MessageCircle, Brain, Star, Sparkles, Smile, Activity } from "lucide-react";

const specialties = [
    {
        title: "Atraso na Fala",
        desc: "Estímulo natural e divertido para crianças que demoram a iniciar a comunicação verbal.",
        icon: MessageCircle,
        badge: "Linguagem",
        gradient: "from-rose-500 to-pink-500",
    },
    {
        title: "Apraxia de Fala",
        desc: "Técnicas motoras específicas (PROMPT) para planejamento e produção dos sons.",
        icon: Brain,
        badge: "Motor",
        gradient: "from-violet-500 to-purple-500",
    },
    {
        title: "Síndrome de Down",
        desc: "Intervenção precoce focada em autonomia, linguagem e motricidade orofacial.",
        icon: Star,
        badge: "Neuro",
        gradient: "from-amber-500 to-orange-500",
    },
    {
        title: "Gagueira Infantil",
        desc: "Abordagem para promover fluência e confiança, reduzindo a tensão na fala.",
        icon: Sparkles,
        badge: "Fluência",
        gradient: "from-emerald-500 to-teal-500",
    },
    {
        title: "TEA (Autismo)",
        desc: "Comunicação social e linguagem funcional baseada em modelos naturalistas e ABA.",
        icon: Smile,
        badge: "Comportamento",
        gradient: "from-blue-500 to-cyan-500",
    },
    {
        title: "Motricidade Orofacial",
        desc: "Fortalecimento muscular para funções de fala, mastigação e respiração.",
        icon: Activity,
        badge: "MO",
        gradient: "from-rose-500 to-red-500",
    },
];

export function SpecialtiesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={containerRef}
            id="especialidades"
            className="py-32 bg-stone-50 relative overflow-hidden"
        >
            {/* Animated Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0 opacity-50"
            >
                <div className="absolute top-20 left-10 w-72 h-72 bg-rose-100 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-stone-200 rounded-full blur-[120px]" />
            </motion.div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-center max-w-2xl mx-auto mb-20"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-white text-rose-600 text-sm font-medium tracking-wide mb-4 shadow-sm">
                        Especialidades
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-6">
                        Áreas de Atuação
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        Tratamentos personalizados para diversas necessidades do desenvolvimento infantil.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {specialties.map((card, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.1,
                                ease: [0.25, 0.4, 0.25, 1],
                            }}
                            whileHover={{ y: -8, transition: { duration: 0.3 } }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 hover:border-rose-100 overflow-hidden">
                                {/* Gradient Glow on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />

                                {/* Top Row */}
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <div className="p-3 rounded-xl bg-stone-50 group-hover:bg-rose-50 transition-colors duration-300">
                                        <card.icon className="w-6 h-6 text-stone-400 group-hover:text-rose-500 transition-colors duration-300" />
                                    </div>
                                    <span className="text-xs font-semibold px-3 py-1.5 bg-stone-100 group-hover:bg-rose-100 text-stone-500 group-hover:text-rose-600 rounded-full transition-colors duration-300">
                                        {card.badge}
                                    </span>
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-stone-800 transition-colors relative z-10">
                                    {card.title}
                                </h3>
                                <p className="text-stone-600 leading-relaxed text-sm relative z-10">
                                    {card.desc}
                                </p>

                                {/* Bottom Accent Line */}
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

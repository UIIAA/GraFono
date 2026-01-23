"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Video, Download, ArrowUpRight } from "lucide-react";

const resources = [
    {
        type: "Guia",
        title: "Sinais de Alerta na Fala",
        desc: "Aprenda a identificar quando procurar ajuda profissional.",
        icon: FileText,
        badge: "PDF Gratuito",
    },
    {
        type: "Vídeo",
        title: "Brincadeiras que Estimulam",
        desc: "5 atividades simples para fazer em casa com seu filho.",
        icon: Video,
        badge: "3 min",
    },
    {
        type: "E-book",
        title: "Primeiras Palavras",
        desc: "Um guia completo sobre o desenvolvimento da linguagem.",
        icon: Download,
        badge: "E-book",
    },
];

export function ResourcesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

    return (
        <section
            ref={containerRef}
            id="materiais"
            className="py-32 bg-stone-50 relative overflow-hidden"
        >
            {/* Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0"
            >
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-stone-200/60 rounded-full blur-[100px]" />
            </motion.div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-white text-rose-600 text-sm font-medium tracking-wide mb-4 shadow-sm">
                        Materiais Educativos
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-6">
                        Recursos para Famílias
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        Conteúdos gratuitos para ajudar você a entender e estimular
                        o desenvolvimento do seu filho.
                    </p>
                </motion.div>

                {/* Resources Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {resources.map((resource, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{
                                duration: 0.6,
                                delay: i * 0.15,
                                ease: [0.25, 0.4, 0.25, 1],
                            }}
                        >
                            <motion.div
                                whileHover={{ y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100 hover:border-rose-100 h-full cursor-pointer"
                            >
                                {/* Badge */}
                                <span className="absolute top-6 right-6 text-xs font-medium px-3 py-1 rounded-full bg-rose-50 text-rose-500">
                                    {resource.badge}
                                </span>

                                {/* Icon */}
                                <div className="w-14 h-14 rounded-xl bg-stone-50 group-hover:bg-rose-50 flex items-center justify-center mb-6 transition-colors duration-300">
                                    <resource.icon className="w-6 h-6 text-stone-400 group-hover:text-rose-500 transition-colors duration-300" />
                                </div>

                                {/* Type */}
                                <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-2 block">
                                    {resource.type}
                                </span>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-stone-900 mb-3 group-hover:text-stone-800 transition-colors">
                                    {resource.title}
                                </h3>

                                {/* Description */}
                                <p className="text-stone-600 text-sm leading-relaxed mb-6">
                                    {resource.desc}
                                </p>

                                {/* Link */}
                                <div className="flex items-center gap-2 text-rose-500 font-medium text-sm group-hover:gap-3 transition-all">
                                    <span>Acessar</span>
                                    <ArrowUpRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                {/* Newsletter CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                    className="mt-20 text-center"
                >
                    <div className="max-w-xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-stone-100">
                        <h3 className="text-xl font-bold text-stone-900 mb-2">
                            Receba conteúdos exclusivos
                        </h3>
                        <p className="text-stone-500 text-sm mb-6">
                            Dicas semanais para estimular a comunicação do seu filho.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                placeholder="Seu melhor e-mail"
                                className="flex-1 px-5 py-3 rounded-full border border-stone-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-stone-700 placeholder:text-stone-400"
                            />
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-medium transition-colors"
                            >
                                Quero Receber
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

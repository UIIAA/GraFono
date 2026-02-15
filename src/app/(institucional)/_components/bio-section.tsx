"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award, BookOpen, GraduationCap, Heart } from "lucide-react";

const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            delay,
            ease: [0.25, 0.4, 0.25, 1] as const,
        },
    }),
};

const credentials = [
    {
        icon: GraduationCap,
        title: "Pós em Análise do Comportamento (ABA)",
    },
    {
        icon: Award,
        title: "Especialista em Distúrbios da Fala",
    },
    {
        icon: BookOpen,
        title: "Certificação PROMPT",
    },
    {
        icon: Heart,
        title: "Formação em Neuroreabilitação",
    },
];

export function BioSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const imageY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
    const contentY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

    return (
        <section
            ref={containerRef}
            id="sobre"
            className="py-32 bg-white relative overflow-hidden"
        >
            {/* Subtle Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-rose-50/50 rounded-full blur-[100px] -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-stone-100/80 rounded-full blur-[80px] translate-y-1/2" />

            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
                    {/* Image Column */}
                    <motion.div
                        style={{ y: imageY }}
                        className="lg:col-span-5 relative"
                    >
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            custom={0}
                            className="relative"
                        >
                            {/* Decorative Frame */}
                            <div className="absolute -inset-4 bg-gradient-to-br from-rose-100 to-stone-100 rounded-[32px] rotate-3" />

                            {/* Main Image Container */}
                            <div className="relative aspect-[3/4] rounded-[28px] overflow-hidden shadow-2xl shadow-rose-200/30 border-4 border-white">
                                {/* Foto Graciele */}
                                <img
                                    src="/images/graciele-hero.jpg"
                                    alt="Graciele Costa - Fonoaudióloga Infantil"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                                    <p className="text-white font-medium text-lg">
                                        "Amo fazer parte da jornada de cada família."
                                    </p>
                                </div>
                            </div>

                            {/* Experience Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                                className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-rose-100"
                            >
                                <p className="text-4xl font-bold text-rose-500">10+</p>
                                <p className="text-sm font-medium text-stone-600 mt-1">
                                    Anos de<br />Experiência
                                </p>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Content Column */}
                    <motion.div
                        style={{ y: contentY }}
                        className="lg:col-span-7 space-y-8"
                    >
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            custom={0.1}
                        >
                            <span className="inline-block px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-medium tracking-wide mb-4">
                                Sobre a Especialista
                            </span>
                            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-6">
                                Graciele Fonoaudióloga
                            </h2>
                        </motion.div>

                        <motion.p
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            custom={0.2}
                            className="text-lg text-stone-600 leading-relaxed"
                        >
                            Com paixão e experiência, dedico minha carreira a ajudar crianças a
                            desenvolverem todo o seu potencial de comunicação. Minha abordagem une
                            ciência, técnica e, acima de tudo, um olhar atento às necessidades
                            emocionais da família.
                        </motion.p>

                        {/* Credentials Grid */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            custom={0.3}
                            className="grid sm:grid-cols-2 gap-4 pt-4"
                        >
                            {credentials.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        delay: 0.4 + i * 0.1,
                                        duration: 0.5,
                                        ease: [0.25, 0.4, 0.25, 1],
                                    }}
                                    className="group flex items-center gap-4 p-4 rounded-xl bg-stone-50/50 hover:bg-rose-50/50 border border-transparent hover:border-rose-100 transition-all duration-300"
                                >
                                    <div className="p-2 rounded-lg bg-white shadow-sm group-hover:shadow-md group-hover:bg-rose-100 transition-all duration-300">
                                        <item.icon className="w-5 h-5 text-stone-400 group-hover:text-rose-500 transition-colors" />
                                    </div>
                                    <span className="font-medium text-stone-700 text-sm">
                                        {item.title}
                                    </span>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Quote */}
                        <motion.blockquote
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            custom={0.5}
                            className="border-l-4 border-rose-200 pl-6 py-2 mt-8"
                        >
                            <p className="text-stone-500 italic text-lg">
                                "Cada criança tem seu próprio tempo e seu próprio caminho.
                                Meu papel é guiá-las com amor e conhecimento."
                            </p>
                        </motion.blockquote>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

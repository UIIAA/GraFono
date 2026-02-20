"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ClipboardList, Puzzle, HeartHandshake, Castle, ArrowRight } from "lucide-react";

const steps = [
    {
        number: "01",
        title: "Avaliação Detalhada",
        desc: "Identificamos as necessidades específicas da criança através de protocolos validados (ADL, PROC, ABFW) e observação clínica minuciosa.",
        icon: ClipboardList,
        color: "rose",
    },
    {
        number: "02",
        title: "Plano Personalizado",
        desc: "Desenvolvemos um plano terapêutico único, respeitando o ritmo da criança e integrando técnicas como ABA, PROMPT ou PECS.",
        icon: Puzzle,
        color: "violet",
    },
    {
        number: "03",
        title: "Terapia Lúdica",
        desc: "Utilizamos o brincar como ferramenta principal. A criança aprende se divertindo, o que torna o processo natural e motivador.",
        icon: Castle,
        color: "amber",
    },
    {
        number: "04",
        title: "Parceria com os Pais",
        desc: "Oferecemos orientação contínua para a família estimular a comunicação em casa, potencializando os resultados da terapia.",
        icon: HeartHandshake,
        color: "emerald",
    },
];

const colorClasses = {
    rose: {
        bg: "bg-rose-50",
        text: "text-rose-500",
        border: "border-rose-200",
        gradient: "from-rose-500 to-pink-500",
    },
    violet: {
        bg: "bg-violet-50",
        text: "text-violet-500",
        border: "border-violet-200",
        gradient: "from-violet-500 to-purple-500",
    },
    amber: {
        bg: "bg-amber-50",
        text: "text-amber-500",
        border: "border-amber-200",
        gradient: "from-amber-500 to-orange-500",
    },
    emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-500",
        border: "border-emerald-200",
        gradient: "from-emerald-500 to-teal-500",
    },
};

export function MethodTimeline() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
    });

    // Progress line animation
    const lineHeight = useTransform(smoothProgress, [0.1, 0.9], ["0%", "100%"]);

    return (
        <section
            ref={containerRef}
            id="metodologia"
            className="py-32 bg-white relative overflow-hidden"
        >
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-rose-50/30 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-stone-100/50 rounded-full blur-[100px]" />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-center max-w-2xl mx-auto mb-20"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-medium tracking-wide mb-4">
                        Metodologia
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-6">
                        Como Acontece a Mágica
                    </h2>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        Nossa metodologia transforma o aprendizado em uma experiência
                        positiva e envolvente para toda a família.
                    </p>
                </motion.div>

                {/* Timeline */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Progress Line - Desktop */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2">
                        <div className="absolute inset-0 bg-stone-200" />
                        <motion.div
                            style={{ height: lineHeight }}
                            className="absolute top-0 left-0 right-0 bg-gradient-to-b from-rose-400 to-rose-500"
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-16 md:space-y-24">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            const colors = colorClasses[step.color as keyof typeof colorClasses];

                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{
                                        duration: 0.7,
                                        delay: index * 0.1,
                                        ease: [0.25, 0.4, 0.25, 1],
                                    }}
                                    className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                                        isEven ? "" : "md:flex-row-reverse"
                                    }`}
                                >
                                    {/* Content */}
                                    <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
                                        <motion.div
                                            whileHover={{ x: isEven ? -5 : 5 }}
                                            transition={{ duration: 0.3 }}
                                            className="group"
                                        >
                                            {/* Step Number */}
                                            <span className={`inline-block text-6xl font-bold mb-4 bg-gradient-to-r ${colors.gradient} bg-clip-text text-transparent opacity-30 group-hover:opacity-50 transition-opacity`}>
                                                {step.number}
                                            </span>

                                            <h3 className="text-2xl md:text-3xl font-bold text-stone-900 mb-4">
                                                {step.title}
                                            </h3>
                                            <p className="text-stone-600 leading-relaxed max-w-md mx-auto md:mx-0">
                                                {step.desc}
                                            </p>
                                        </motion.div>
                                    </div>

                                    {/* Center Icon */}
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                        className="relative z-10 shrink-0"
                                    >
                                        <div className={`w-20 h-20 rounded-full ${colors.bg} border-4 border-white shadow-lg flex items-center justify-center`}>
                                            <step.icon className={`w-8 h-8 ${colors.text}`} />
                                        </div>
                                    </motion.div>

                                    {/* Empty Space for Balance */}
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                        className="text-center mt-20"
                    >
                        <p className="text-stone-500 mb-6">
                            Pronta para começar essa jornada?
                        </p>
                        <motion.a
                            href="https://wa.me/5511991556534?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-medium shadow-xl shadow-stone-900/20 transition-colors"
                        >
                            Agendar Avaliação
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { MessageCircle, ArrowRight, Phone, Clock, MapPin } from "lucide-react";

export function CtaSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
    });

    const backgroundY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
    const contentY = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);
    const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.95, 1, 0.95]);

    return (
        <section
            ref={containerRef}
            className="py-32 bg-gradient-to-b from-rose-50 to-white relative overflow-hidden"
        >
            {/* Animated Background Elements */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0"
            >
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-stone-100/60 rounded-full blur-[100px]" />
            </motion.div>

            {/* Decorative Pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #000 1px, transparent 1px)`,
                    backgroundSize: "32px 32px",
                }}
            />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    style={{ y: contentY, scale }}
                    className="max-w-4xl mx-auto"
                >
                    {/* Main CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                        className="relative bg-stone-900 rounded-[32px] p-12 md:p-16 text-center overflow-hidden shadow-2xl"
                    >
                        {/* Inner Glow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-transparent to-transparent" />

                        {/* Decorative Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-stone-700/50 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

                        {/* Content */}
                        <div className="relative z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/30"
                            >
                                <MessageCircle className="w-10 h-10 text-white" />
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                            >
                                O primeiro passo para o
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-rose-400">
                                    futuro do seu filho
                                </span>
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="text-stone-400 text-lg max-w-xl mx-auto mb-10"
                            >
                                Agende uma avaliação inicial e receba um plano de cuidados
                                totalmente personalizado para as necessidades do seu filho.
                            </motion.p>

                            {/* CTA Buttons */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="flex flex-col sm:flex-row gap-4 justify-center"
                            >
                                <motion.a
                                    href="https://wa.me/5511999999999"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-400 hover:to-rose-500 text-white rounded-full font-semibold text-lg shadow-xl shadow-rose-500/30 transition-all"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                    Falar pelo WhatsApp
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </motion.a>

                                <motion.a
                                    href="tel:+5511999999999"
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium border border-white/20 backdrop-blur-sm transition-all"
                                >
                                    <Phone className="w-5 h-5" />
                                    Ligar Agora
                                </motion.a>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Info Cards Below */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="grid md:grid-cols-2 gap-6 mt-8"
                    >
                        <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                            <div className="p-3 rounded-xl bg-rose-50">
                                <Clock className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-stone-900">Horário de Atendimento</p>
                                <p className="text-sm text-stone-500">Seg - Sex: 8h às 19h | Sáb: 8h às 12h</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
                            <div className="p-3 rounded-xl bg-rose-50">
                                <MapPin className="w-6 h-6 text-rose-500" />
                            </div>
                            <div>
                                <p className="font-semibold text-stone-900">Localização</p>
                                <p className="text-sm text-stone-500">Rua da Prata, 123 - Bethaville, Barueri</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

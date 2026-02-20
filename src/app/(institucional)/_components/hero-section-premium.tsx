"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Heart, Star, Play } from "lucide-react";

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: (delay: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            delay,
            ease: [0.25, 0.4, 0.25, 1] as const, // "Creamy" bezier
        },
    }),
};

const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (delay: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
            duration: 1,
            delay,
            ease: [0.25, 0.4, 0.25, 1] as const,
        },
    }),
};

export function HeroSectionPremium() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll-based parallax
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    // Smooth spring for parallax
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    // Parallax transforms
    const titleY = useTransform(smoothProgress, [0, 1], ["0%", "30%"]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.4], [1, 0]);
    const imageY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
    const imageScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
    const blobY = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-rose-50 via-stone-50 to-white"
        >
            {/* Animated Background Blobs */}
            <motion.div
                style={{ y: blobY }}
                className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] bg-rose-200/30 rounded-full blur-[120px]"
            />
            <motion.div
                style={{ y: blobY }}
                className="absolute bottom-[-10%] left-[-15%] w-[500px] h-[500px] bg-rose-100/40 rounded-full blur-[100px]"
            />
            <motion.div
                className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-amber-100/30 rounded-full blur-[80px]"
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Subtle Noise Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center min-h-[80vh]">
                    {/* Left Column - Content */}
                    <motion.div
                        style={{ y: titleY, opacity: titleOpacity }}
                        className="space-y-8"
                    >
                        {/* Badge */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            custom={0.1}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-rose-100 shadow-sm"
                        >
                            <Sparkles className="w-4 h-4 text-rose-400" />
                            <span className="text-sm font-medium text-stone-700 tracking-wide">
                                Fonoaudiologia Infantil Especializada
                            </span>
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            custom={0.2}
                            className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[1.1]"
                        >
                            Ajudando seu filho a encontrar sua{" "}
                            <span className="relative inline-block">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-rose-500 to-rose-400">
                                    própria voz
                                </span>
                                {/* Decorative underline */}
                                <motion.span
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                                    className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-rose-300 to-rose-400 rounded-full origin-left"
                                />
                            </span>
                            .
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            custom={0.4}
                            className="text-lg md:text-xl text-stone-600 leading-relaxed max-w-xl font-light"
                        >
                            Uma abordagem acolhedora e baseada em evidências para o desenvolvimento
                            da comunicação, linguagem e fala.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            custom={0.5}
                            className="flex flex-col sm:flex-row gap-4 pt-4"
                        >
                            <a href="https://wa.me/5511991556534?text=Ol%C3%A1%2C%20gostaria%20de%20agendar%20uma%20avalia%C3%A7%C3%A3o" target="_blank" rel="noopener noreferrer">
                                <Button
                                    size="lg"
                                    className="group h-14 px-8 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-lg shadow-xl shadow-stone-900/20 hover:shadow-stone-900/30 transition-all duration-300 hover:scale-[1.02]"
                                >
                                    Agendar Avaliação
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </a>
                            <a href="#metodologia">
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="group h-14 px-8 rounded-full border-2 border-stone-200 text-stone-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-lg transition-all duration-300"
                                >
                                    <Play className="w-4 h-4 mr-2 fill-current" />
                                    Conhecer Método
                                </Button>
                            </a>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            animate="visible"
                            custom={0.7}
                            className="flex items-center gap-6 pt-8 border-t border-stone-100"
                        >
                            <div className="flex -space-x-2">
                                {[...Array(4)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-200 to-rose-300 border-2 border-white flex items-center justify-center text-xs font-medium text-rose-700"
                                    >
                                        {["M", "A", "C", "P"][i]}
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm text-stone-600">
                                <span className="font-semibold text-stone-900">+200 famílias</span>
                                <span className="hidden sm:inline"> já transformaram a comunicação dos seus filhos</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Column - Visual */}
                    <motion.div
                        variants={scaleIn}
                        initial="hidden"
                        animate="visible"
                        custom={0.3}
                        style={{ y: imageY, scale: imageScale }}
                        className="relative"
                    >
                        {/* Main Image Container */}
                        <div className="relative w-full aspect-[4/5] max-w-[520px] mx-auto">
                            {/* Decorative Frame */}
                            <motion.div
                                className="absolute -inset-4 rounded-[48px] bg-gradient-to-br from-rose-200/50 via-transparent to-rose-300/30 rotate-3"
                                animate={{
                                    rotate: [3, 5, 3],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />

                            {/* Image Container */}
                            <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-gradient-to-br from-rose-100 to-stone-100 shadow-2xl shadow-rose-200/50 border-4 border-white">
                                <Image
                                    src="/images/hero-fono-crianca.jpg"
                                    alt="Fonoaudióloga em sessão com criança - momento de conexão e aprendizado"
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 768px) 100vw, 520px"
                                />
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: -30, y: 20 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 0.8, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                                className="absolute -left-8 bottom-20 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-rose-100 max-w-[220px]"
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-rose-100 rounded-xl">
                                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                                    </div>
                                    <span className="font-semibold text-stone-800 text-sm">
                                        Cuidado Humanizado
                                    </span>
                                </div>
                                <p className="text-xs text-stone-500 leading-relaxed">
                                    Respeito ao ritmo e particularidades de cada criança.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: 30, y: -20 }}
                                animate={{ opacity: 1, x: 0, y: 0 }}
                                transition={{ delay: 1, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                                className="absolute -right-4 top-16 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-amber-100"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-stone-700">5.0</span>
                                </div>
                                <p className="text-xs text-stone-500 mt-1">Avaliação no Google</p>
                            </motion.div>

                            {/* Experience Badge */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1.2, duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
                                className="absolute -bottom-6 right-8 bg-gradient-to-br from-stone-900 to-stone-800 p-5 rounded-2xl shadow-xl text-white"
                            >
                                <p className="text-3xl font-bold">10+</p>
                                <p className="text-xs text-stone-300 mt-1">
                                    Anos de<br />Experiência
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            >
                <span className="text-xs text-stone-400 tracking-widest uppercase">
                    Role para descobrir
                </span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="w-6 h-10 rounded-full border-2 border-stone-300 flex justify-center pt-2"
                >
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                </motion.div>
            </motion.div>
        </section>
    );
}

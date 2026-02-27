"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
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

/* ── Individual scroll-driven card ── */
function SpecialtyCard({
    card,
    index,
    scrollProgress,
}: {
    card: (typeof specialties)[number];
    index: number;
    scrollProgress: MotionValue<number>;
}) {
    const total = specialties.length;
    // Cards activate between 5% and 50% of scroll — compact so they finish before overlap
    const start = 0.05 + (index / total) * 0.40;
    const end = start + 0.08;

    const rawProgress = useTransform(scrollProgress, [start, end], [0, 1]);
    const progress = useSpring(rawProgress, { stiffness: 200, damping: 25 });

    const opacity = useTransform(progress, [0, 1], [0.35, 1]);
    const scale = useTransform(progress, [0, 1], [0.97, 1]);
    const shadowOpacity = useTransform(progress, [0, 1], [0, 0.15]);
    const glowOpacity = useTransform(progress, [0, 1], [0, 0.03]);
    const lineScaleX = useTransform(progress, [0, 0.5, 1], [0, 0.3, 1]);
    const iconBg = useTransform(progress, [0, 1], ["rgb(250,250,249)", "rgb(255,241,242)"]);
    const iconColor = useTransform(progress, [0, 1], ["rgb(168,162,158)", "rgb(244,63,94)"]);
    const badgeBg = useTransform(progress, [0, 1], ["rgb(245,245,244)", "rgb(255,228,230)"]);
    const badgeColor = useTransform(progress, [0, 1], ["rgb(120,113,108)", "rgb(225,29,72)"]);
    const borderColor = useTransform(progress, [0, 1], ["rgb(245,245,244)", "rgb(255,228,230)"]);

    return (
        <motion.div style={{ opacity, scale }} className="relative">
            <motion.div
                style={{
                    borderColor,
                    boxShadow: useTransform(
                        shadowOpacity,
                        (v) => `0 10px 40px -10px rgba(244,63,94,${v}), 0 4px 12px -4px rgba(0,0,0,${v * 0.3})`
                    ),
                }}
                className="relative bg-white rounded-2xl p-8 border overflow-hidden"
            >
                <motion.div
                    style={{ opacity: glowOpacity }}
                    className={`absolute inset-0 bg-gradient-to-br ${card.gradient}`}
                />

                <div className="flex items-center justify-between mb-6 relative z-10">
                    <motion.div style={{ backgroundColor: iconBg }} className="p-3 rounded-xl">
                        <motion.div style={{ color: iconColor }}>
                            <card.icon className="w-6 h-6" />
                        </motion.div>
                    </motion.div>
                    <motion.span
                        style={{ backgroundColor: badgeBg, color: badgeColor }}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                    >
                        {card.badge}
                    </motion.span>
                </div>

                <h3 className="text-xl font-bold text-stone-900 mb-3 relative z-10">
                    {card.title}
                </h3>
                <p className="text-stone-600 leading-relaxed text-sm relative z-10">
                    {card.desc}
                </p>

                <motion.div
                    style={{ scaleX: lineScaleX }}
                    className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} origin-left`}
                />
            </motion.div>
        </motion.div>
    );
}

/* ── Main section ── */
export function SpecialtiesGrid() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    return (
        /* Outer wrapper: scroll runway for the sticky animation */
        <div ref={containerRef} id="especialidades" style={{ height: "300vh" }}>
            {/* Sticky section — pinned below the fixed header (top-20 = 5rem = header height) */}
            <div className="sticky top-20 bg-stone-50" style={{ height: "calc(100vh - 5rem)" }}>
                {/* Background blobs */}
                <div className="absolute inset-0 opacity-50 pointer-events-none">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-rose-100 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-stone-200 rounded-full blur-[120px]" />
                </div>

                {/* Content — pushed up with pt, not centered */}
                <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-12 lg:pt-16">
                    {/* Header — always visible */}
                    <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
                        <span className="inline-block px-4 py-2 rounded-full bg-white text-rose-600 text-sm font-medium tracking-wide mb-4 shadow-sm">
                            Especialidades
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-6">
                            Áreas de Atuação
                        </h2>
                        <p className="text-lg text-stone-600 leading-relaxed">
                            Tratamentos personalizados para diversas necessidades do desenvolvimento infantil.
                        </p>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        {specialties.map((card, i) => (
                            <SpecialtyCard
                                key={i}
                                card={card}
                                index={i}
                                scrollProgress={scrollYProgress}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    MotionValue,
} from "framer-motion";
import { Heart, Users, Shield } from "lucide-react";

const values = [
    {
        number: "01",
        title: "Acolhimento",
        desc: "Um ambiente seguro e confortável para cada criança se sentir em casa.",
        icon: Heart,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-500",
        numberColor: "text-rose-300",
        accent: "from-rose-400 to-pink-400",
        borderColor: "border-rose-200",
    },
    {
        number: "02",
        title: "Respeito",
        desc: "Valorizamos a individualidade e o tempo de desenvolvimento de cada um.",
        icon: Users,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-500",
        numberColor: "text-violet-300",
        accent: "from-violet-400 to-purple-400",
        borderColor: "border-violet-200",
    },
    {
        number: "03",
        title: "Ética & Ciência",
        desc: "Práticas baseadas em evidências com integridade e transparência.",
        icon: Shield,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-500",
        numberColor: "text-amber-300",
        accent: "from-amber-400 to-orange-400",
        borderColor: "border-amber-200",
    },
];

const CARD_COUNT = values.length;
const CARD_WIDTH = 220;
const RADIUS = 240;

/* ── Individual card ── */
function CarouselCard({
    value,
    index,
    angle,
}: {
    value: (typeof values)[number];
    index: number;
    angle: MotionValue<number>;
}) {
    const cardAngle = (360 / CARD_COUNT) * index;

    const offset = useTransform(angle, (a) => {
        const effective = ((a + cardAngle) % 360 + 360) % 360;
        return effective > 180 ? 360 - effective : effective;
    });

    const opacity = useTransform(offset, [0, 50, 120], [1, 1, 0.35]);
    const scale = useTransform(offset, [0, 50, 120], [1, 0.95, 0.8]);

    return (
        <div
            className="absolute top-0 left-0"
            style={{
                width: CARD_WIDTH,
                transform: `rotateY(${cardAngle}deg) translateZ(${RADIUS}px)`,
                backfaceVisibility: "hidden",
            }}
        >
            <motion.div
                style={{ opacity, scale }}
                className={`relative bg-white rounded-2xl border ${value.borderColor} shadow-lg p-6 flex flex-col items-center text-center overflow-hidden`}
            >
                {/* Colored accent bar at bottom */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${value.accent}`} />

                {/* Icon */}
                <div className={`w-16 h-16 mb-4 rounded-2xl ${value.iconBg} flex items-center justify-center`}>
                    <value.icon className={`w-7 h-7 ${value.iconColor}`} />
                </div>

                {/* Number */}
                <span className={`text-4xl font-serif italic ${value.numberColor} block mb-1`}>
                    {value.number}
                </span>

                {/* Title */}
                <h3 className="text-lg font-bold mb-2 text-stone-900">
                    {value.title}
                </h3>

                {/* Description */}
                <p className="text-stone-600 text-xs leading-relaxed max-w-[190px]">
                    {value.desc}
                </p>
            </motion.div>
        </div>
    );
}

/* ── Main section ── */
export function ValuesSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    // Negative rotation so cards appear in order: 01 → 02 → 03
    const rawAngle = useTransform(scrollYProgress, [0.05, 0.95], [0, -240]);
    const angle = useSpring(rawAngle, { stiffness: 120, damping: 30 });

    return (
        <div ref={containerRef} style={{ height: "200vh" }}>
            <div
                className="sticky top-20 bg-gradient-to-b from-rose-50 via-rose-50/80 to-white overflow-hidden"
                style={{ height: "auto", maxHeight: "calc(100vh - 5rem)" }}
            >
                {/* Background blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-1/4 w-[350px] h-[350px] bg-rose-200/40 rounded-full blur-[100px]" />
                    <div className="absolute top-20 right-1/4 w-[250px] h-[250px] bg-violet-100/40 rounded-full blur-[80px]" />
                    <div className="absolute bottom-10 right-1/3 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[120px]" />
                </div>

                <div className="container mx-auto px-6 lg:px-12 relative z-10 pt-[75px] pb-10">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                        className="text-center mb-8"
                    >
                        <span className="inline-block px-4 py-2 rounded-full bg-white text-rose-600 text-sm font-medium tracking-wide mb-4 shadow-sm border border-rose-100">
                            Nossos Princípios
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
                            Nossos Valores
                        </h2>
                    </motion.div>

                    {/* 3D Carousel — pushed down 200px from its natural position */}
                    <div
                        className="flex items-start justify-center select-none pt-[200px] pb-[100px]"
                        style={{ perspective: 1000, height: 600 }}
                    >
                        <motion.div
                            style={{
                                width: CARD_WIDTH,
                                height: 280,
                                position: "relative",
                                transformStyle: "preserve-3d",
                                rotateY: angle,
                            }}
                        >
                            {values.map((value, i) => (
                                <CarouselCard
                                    key={i}
                                    value={value}
                                    index={i}
                                    angle={angle}
                                />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}

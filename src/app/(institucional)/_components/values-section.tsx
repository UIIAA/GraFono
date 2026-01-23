"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, Users, Shield } from "lucide-react";

const values = [
    {
        number: "01",
        title: "Acolhimento",
        desc: "Um ambiente seguro e confortável para cada criança se sentir em casa.",
        icon: Heart,
    },
    {
        number: "02",
        title: "Respeito",
        desc: "Valorizamos a individualidade e o tempo de desenvolvimento de cada um.",
        icon: Users,
    },
    {
        number: "03",
        title: "Ética & Ciência",
        desc: "Práticas baseadas em evidências com integridade e transparência.",
        icon: Shield,
    },
];

export function ValuesSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

    return (
        <section
            ref={containerRef}
            className="py-32 bg-gradient-to-b from-rose-50 to-white relative overflow-hidden"
        >
            {/* Animated Background */}
            <motion.div
                style={{ y: backgroundY }}
                className="absolute inset-0"
            >
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-rose-100/60 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-stone-100/80 rounded-full blur-[120px]" />
            </motion.div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
                    className="text-center mb-20"
                >
                    <span className="inline-block px-4 py-2 rounded-full bg-white text-rose-600 text-sm font-medium tracking-wide mb-4 shadow-sm border border-rose-100">
                        Nossos Princípios
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900">
                        Nossos Valores
                    </h2>
                </motion.div>

                {/* Values Grid */}
                <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                    {values.map((value, i) => (
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
                            className="group text-center"
                        >
                            {/* Icon */}
                            <motion.div
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white border border-rose-100 shadow-sm flex items-center justify-center group-hover:shadow-lg group-hover:border-rose-200 transition-all duration-300"
                            >
                                <value.icon className="w-8 h-8 text-rose-400 group-hover:text-rose-500 transition-colors" />
                            </motion.div>

                            {/* Number */}
                            <span className="text-5xl font-serif italic text-rose-300 block mb-2">
                                {value.number}
                            </span>

                            {/* Title */}
                            <h3 className="text-xl font-bold mb-3 text-stone-900 group-hover:text-rose-600 transition-colors">
                                {value.title}
                            </h3>

                            {/* Description */}
                            <p className="text-stone-600 text-sm leading-relaxed max-w-xs mx-auto">
                                {value.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

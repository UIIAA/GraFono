"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { FileText, Video, Download, ArrowUpRight } from "lucide-react";
import { SITE } from "@/lib/constants";

const resources = [
    {
        type: "Guia",
        title: "Sinais de Alerta na Fala",
        desc: "Aprenda a identificar quando procurar ajuda profissional.",
        icon: FileText,
        badge: "Em breve",
        href: "",
        external: true,
        iconBg: "bg-rose-100",
        iconColor: "text-rose-500",
        borderColor: "border-rose-200",
        badgeBg: "bg-rose-50 text-rose-500",
        badgeDisabled: "bg-rose-50/60 text-rose-300",
        accent: "from-rose-400 to-pink-400",
        linkColor: "text-rose-500",
        hoverBorder: "hover:border-rose-200",
    },
    {
        type: "Vídeo",
        title: "Brincadeiras que Estimulam",
        desc: "5 atividades simples para fazer em casa com seu filho.",
        icon: Video,
        badge: "3 min",
        href: "https://www.instagram.com/p/DSTGVtLEWP0/",
        external: true,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-500",
        borderColor: "border-violet-200",
        badgeBg: "bg-violet-50 text-violet-500",
        badgeDisabled: "bg-violet-50/60 text-violet-300",
        accent: "from-violet-400 to-purple-400",
        linkColor: "text-violet-500",
        hoverBorder: "hover:border-violet-200",
    },
    {
        type: "E-book",
        title: "Primeiras Palavras",
        desc: "Um guia completo sobre o desenvolvimento da linguagem.",
        icon: Download,
        badge: "Em breve",
        href: "",
        external: true,
        iconBg: "bg-amber-100",
        iconColor: "text-amber-500",
        borderColor: "border-amber-200",
        badgeBg: "bg-amber-50 text-amber-500",
        badgeDisabled: "bg-amber-50/60 text-amber-300",
        accent: "from-amber-400 to-orange-400",
        linkColor: "text-amber-600",
        hoverBorder: "hover:border-amber-200",
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
                <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-100/30 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-amber-100/30 rounded-full blur-[100px]" />
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
                    {resources.map((resource, i) => {
                        const isAvailable = !!resource.href;
                        const Wrapper = isAvailable ? "a" : "div";
                        const wrapperProps = isAvailable
                            ? {
                                  href: resource.href,
                                  target: resource.external ? "_blank" : undefined,
                                  rel: resource.external ? "noopener noreferrer" : undefined,
                              }
                            : {};

                        return (
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
                                <Wrapper
                                    {...(wrapperProps as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                                    className="block h-full"
                                >
                                    <motion.div
                                        whileHover={{ y: isAvailable ? -8 : 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={`group relative bg-white rounded-2xl p-8 shadow-sm transition-all duration-500 border h-full overflow-hidden ${
                                            isAvailable
                                                ? `${resource.borderColor} hover:shadow-xl ${resource.hoverBorder} cursor-pointer`
                                                : "border-stone-200 opacity-75"
                                        }`}
                                    >
                                        {/* Accent bar at bottom */}
                                        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${resource.accent} ${isAvailable ? "" : "opacity-40"}`} />

                                        {/* Badge */}
                                        <span className={`absolute top-6 right-6 text-xs font-medium px-3 py-1 rounded-full ${
                                            isAvailable ? resource.badgeBg : resource.badgeDisabled
                                        }`}>
                                            {resource.badge}
                                        </span>

                                        {/* Icon */}
                                        <div className={`w-14 h-14 rounded-xl ${resource.iconBg} flex items-center justify-center mb-6 ${isAvailable ? "" : "opacity-60"}`}>
                                            <resource.icon className={`w-6 h-6 ${resource.iconColor}`} />
                                        </div>

                                        {/* Type */}
                                        <span className={`text-xs font-semibold uppercase tracking-wider mb-2 block ${resource.iconColor}`}>
                                            {resource.type}
                                        </span>

                                        {/* Title */}
                                        <h3 className="text-xl font-bold text-stone-900 mb-3 transition-colors">
                                            {resource.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-stone-600 text-sm leading-relaxed mb-6">
                                            {resource.desc}
                                        </p>

                                        {/* Link */}
                                        <div className={`flex items-center gap-2 font-medium text-sm ${
                                            isAvailable ? `${resource.linkColor} group-hover:gap-3` : "text-stone-400"
                                        } transition-all`}>
                                            <span>{isAvailable ? "Acessar" : "Em breve"}</span>
                                            {isAvailable && <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                    </motion.div>
                                </Wrapper>
                            </motion.div>
                        );
                    })}
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
                        <motion.a
                            href={SITE.whatsappDicas}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex items-center justify-center px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white rounded-full font-medium transition-colors"
                        >
                            Receber pelo WhatsApp
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

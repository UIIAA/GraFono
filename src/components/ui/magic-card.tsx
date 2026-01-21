"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MagicCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    gradient?: string;
}

export const MagicCard = ({ children, className, delay = 0, gradient = "from-white/10 to-white/5" }: MagicCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: delay,
                type: "spring",
                stiffness: 260,
                damping: 20
            }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.1)" }}
            className={cn(
                "relative overflow-hidden rounded-3xl border border-white/40",
                "bg-white/40 backdrop-blur-xl shadow-sm", // Glass Base
                "hover:border-white/60 hover:bg-white/50 transition-colors",
                className
            )}
        >
            {/* Gradient Overlay for Depth */}
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100",
                    gradient
                )}
            />

            <div className="relative z-10 h-full">
                {children}
            </div>
        </motion.div>
    );
};

interface MagicStatCardProps {
    icon: any; // Lucide Icon
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    color?: string; // Tailwind color class prefix e.g. "red", "indigo"
    delay?: number;
}

export const MagicStatCard = ({ icon: Icon, label, value, trend, trendUp, color = "slate", delay = 0 }: MagicStatCardProps) => {
    // Dynamic color mapping for glow effects
    const glowColor = {
        red: "shadow-red-500/20 hover:shadow-red-500/30",
        orange: "shadow-orange-500/20 hover:shadow-orange-500/30",
        indigo: "shadow-indigo-500/20 hover:shadow-indigo-500/30",
        emerald: "shadow-emerald-500/20 hover:shadow-emerald-500/30",
        slate: "shadow-slate-500/20 hover:shadow-slate-500/30",
    }[color] || "shadow-slate-500/20";

    const iconBg = {
        red: "bg-red-500 text-white",
        orange: "bg-orange-500 text-white",
        indigo: "bg-indigo-500 text-white",
        emerald: "bg-emerald-500 text-white",
        slate: "bg-slate-800 text-white",
    }[color] || "bg-slate-800 text-white";

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.4 }}
            whileHover={{ scale: 1.02 }}
            className={cn(
                "flex items-center gap-4 p-5 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md",
                "shadow-lg transition-all duration-300",
                glowColor
            )}
        >
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shadow-md", iconBg)}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{label}</p>
                <div className="flex items-end gap-2">
                    <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h3>
                    {trend && (
                        <span className={cn("text-xs font-bold mb-1", trendUp ? "text-emerald-600" : "text-red-600")}>
                            {trend}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

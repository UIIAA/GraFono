"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Phone, Instagram, Menu, X } from "lucide-react";

const navLinks = [
    { href: "#sobre", label: "Sobre" },
    { href: "#especialidades", label: "Especialidades" },
    { href: "#metodologia", label: "Metodologia" },
    { href: "#materiais", label: "Materiais" },
];

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-rose-100/50 shadow-sm">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-rose-200/50 group-hover:shadow-rose-300/60 transition-all duration-300 group-hover:scale-105">
                        G
                    </div>
                    <span className="font-semibold text-lg text-stone-800 tracking-tight">
                        Graciele<span className="text-rose-500">Fono</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-stone-500 hover:text-rose-500 transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <a href="https://instagram.com/graciele_fonoaudiologa" target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className="hidden sm:flex text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors">
                            <Instagram className="w-5 h-5" />
                        </Button>
                    </a>
                    <a href="https://wa.me/5511991556534" target="_blank" rel="noopener noreferrer" className="hidden sm:block">
                        <Button className="rounded-full bg-stone-900 hover:bg-stone-800 text-white shadow-lg shadow-stone-900/20 hover:shadow-stone-900/30 transition-all hover:scale-[1.02]">
                            <Phone className="w-4 h-4 mr-2" />
                            Agendar
                        </Button>
                    </a>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                        aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
                    >
                        {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-rose-100/50 shadow-lg">
                    <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="text-base font-medium text-stone-700 hover:text-rose-500 transition-colors py-2 border-b border-stone-100"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="flex items-center gap-3 pt-4">
                            <a href="https://instagram.com/graciele_fonoaudiologa" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="icon" className="text-stone-400 hover:text-rose-500 hover:bg-rose-50">
                                    <Instagram className="w-5 h-5" />
                                </Button>
                            </a>
                            <a href="https://wa.me/5511991556534" target="_blank" rel="noopener noreferrer" className="flex-1">
                                <Button className="w-full rounded-full bg-stone-900 hover:bg-stone-800 text-white">
                                    <Phone className="w-4 h-4 mr-2" />
                                    Agendar Avaliação
                                </Button>
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

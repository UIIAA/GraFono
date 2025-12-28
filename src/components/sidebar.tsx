"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  ClipboardList,
  FileText,
  Activity,
  BarChart3,
  Calculator,
  LayoutTemplate,
  LogOut,
  Settings,
  HelpCircle,
  Wallet,
  Menu,
  ChevronRight,
  AudioWaveform
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      label: "Pacientes",
      icon: Users,
      href: "/pacientes",
    },
    {
      label: "Agenda",
      icon: Calendar,
      href: "/agenda",
    },
    {
      label: "Avaliações",
      icon: ClipboardList,
      href: "/avaliacoes",
    },
    {
      label: "Relatórios",
      icon: FileText,
      href: "/relatorios",
    },
    {
      label: "Exames",
      icon: Activity,
      href: "/exames",
    },
    {
      label: "Calculadora",
      icon: Calculator,
      href: "/calculadora",
    },
    {
      label: "Métricas",
      icon: BarChart3,
      href: "/metricas",
    },
    {
      label: "Modelos",
      icon: LayoutTemplate,
      href: "/modelos",
    },
    {
      label: "Financeiro",
      icon: Wallet,
      href: "/financeiro",
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-[260px] h-full bg-sidebar border-r border-sidebar-border transition-colors duration-300 z-20">
      {/* Header */}
      <div className="p-6 pb-2">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2 shrink-0 backdrop-blur-sm">
            <AudioWaveform className="h-6 w-6 text-sidebar-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sidebar-foreground text-lg font-bold leading-none tracking-tight">FonoIA</h1>
            <p className="text-sidebar-foreground/70 text-xs font-medium mt-1">Smart Management</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-sidebar-foreground/60 uppercase tracking-wider mb-2">Menu Principal</p>

        {routes.map((route) => {
          const isActive = pathname?.startsWith(route.href);

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium",
                isActive
                  ? "bg-white/20 text-sidebar-foreground font-bold shadow-sm backdrop-blur-md ring-1 ring-white/10"
                  : "text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground transition-colors hover:shadow-sm"
              )}
            >
              <route.icon
                className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive ? "fill-current" : ""
                )}
              />
              {route.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-foreground" />
              )}
            </Link>
          );
        })}

        <div className="my-2 border-t border-sidebar-border/50 mx-2" />

        <Link
          href="/configuracoes"
          className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground transition-all text-sm font-medium"
        >
          <Settings className="h-5 w-5 group-hover:rotate-45 transition-transform" />
          Configurações
        </Link>
        <Link
          href="/ajuda"
          className="group flex items-center gap-3 px-4 py-3 rounded-xl text-sidebar-foreground/80 hover:bg-white/10 hover:text-sidebar-foreground transition-all text-sm font-medium"
        >
          <HelpCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
          Ajuda
        </Link>
      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 mt-auto border-t border-sidebar-border/50 bg-black/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sidebar-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white/20">
            MC
          </div>
          <div className="flex flex-col min-w-0 overflow-hidden">
            <p className="text-sm font-bold text-sidebar-foreground truncate group-hover:text-white transition-colors">Marcos Cruz</p>
            <p className="text-xs text-sidebar-foreground/70 truncate">Fonoaudiólogo</p>
          </div>
          <LogOut className="h-4 w-4 ml-auto text-sidebar-foreground/60 hover:text-destructive transition-colors" />
        </div>
      </div>
    </aside>
  );
}

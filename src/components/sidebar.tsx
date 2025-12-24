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
  BarChart,
  Calculator,
  LayoutTemplate,
  UserCircle,
  LogOut,
  Brain,
  Settings,
  HelpCircle
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-blue-500",
    },
    {
      label: "Pacientes",
      icon: Users,
      href: "/pacientes",
      color: "text-blue-500",
    },
    {
      label: "Agenda",
      icon: Calendar,
      href: "/agenda",
      color: "text-blue-500",
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
      icon: BarChart,
      href: "/metricas",
    },
    {
      label: "Modelos",
      icon: LayoutTemplate,
      href: "/modelos",
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0B0E14] text-gray-300 border-r border-[#1F2937]">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-3 mb-8">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">FonoIA</h1>
            <span className="text-xs text-gray-500 font-medium">Gestão Inteligente</span>
          </div>
        </Link>

        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">Menu Principal</p>
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                pathname === route.href
                  ? "bg-blue-600/10 text-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.1)] border border-blue-600/20"
                  : "hover:bg-[#1F2937]/50 hover:text-white text-gray-400"
              )}
            >
              <route.icon className={cn("h-5 w-5 mr-3 transition-colors",
                pathname === route.href ? "text-blue-500" : "text-gray-500 group-hover:text-white"
              )} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-[#1F2937] bg-[#0B0E14]">
        <div className="space-y-1 mb-4">
          <Link href="/configuracoes" className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-lg hover:text-white hover:bg-[#1F2937]/50 transition-colors">
            <Settings className="h-4 w-4 mr-3" />
            Configurações
          </Link>
          <Link href="/ajuda" className="flex items-center px-3 py-2 text-sm font-medium text-gray-400 rounded-lg hover:text-white hover:bg-[#1F2937]/50 transition-colors">
            <HelpCircle className="h-4 w-4 mr-3" />
            Ajuda
          </Link>
        </div>

        <div className="flex items-center p-3 rounded-xl bg-[#1F2937]/30 border border-[#1F2937]">
          <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
            MC
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Marcos Cruz</p>
            <p className="text-xs text-gray-500 truncate">Fonoaudiólogo</p>
          </div>
          <LogOut className="h-4 w-4 ml-auto text-gray-500 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>
    </div>
  );
}

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
  User,
  ChevronDown,
  FolderOpen,
  Briefcase,
  Building2,
  Stethoscope,
  AudioWaveform
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  // Route Groups Configuration
  const routeGroups = [
    {
      label: "Visão Geral",
      items: [
        {
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
        },
      ]
    },
    {
      label: "Atendimento",
      items: [
        {
          label: "Agenda",
          icon: Calendar,
          href: "/agenda",
        },
        {
          label: "Pacientes",
          icon: Users,
          href: "/pacientes",
        },
      ]
    },
    {
      label: "Documentação",
      icon: FolderOpen,
      collapsible: true,
      items: [
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
      ]
    },
    {
      label: "Gestão",
      icon: Building2,
      collapsible: true, // Optional: could be always open if preferred, but we'll make it collapsible per plan
      items: [
        {
          label: "Financeiro",
          icon: Wallet,
          href: "/financeiro",
        },
        {
          label: "Métricas",
          icon: BarChart3,
          href: "/metricas",
        },
      ]
    },
    {
      label: "Ferramentas",
      icon: Briefcase,
      collapsible: true,
      items: [
        {
          label: "Calculadora",
          icon: Calculator,
          href: "/calculadora",
        },
        {
          label: "Modelos",
          icon: LayoutTemplate,
          href: "/modelos",
        },
        {
          label: "Portal Paciente",
          icon: User,
          href: "/portal",
        }
      ]
    }
  ];

  return (
    <aside className={cn("hidden md:flex flex-col w-[260px] h-full bg-gradient-to-b from-[#fca5a5] to-[#f87171] border-r border-[#fecaca] transition-colors duration-300 z-20", className)}>
      {/* Header */}
      <div className="p-6 pb-2">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="bg-white/20 rounded-xl p-2 shrink-0 backdrop-blur-sm">
            <AudioWaveform className="h-6 w-6 text-sidebar-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold leading-none tracking-tight">FonoIA</h1>
            <p className="text-red-50 text-xs font-medium mt-1">Smart Management</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 flex flex-col gap-4 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">

        {routeGroups.map((group, groupIndex) => {
          // Check if any child is active to possibly default open the collapsible
          const isGroupActive = group.items.some(item => pathname?.startsWith(item.href));

          if (group.collapsible) {
            return (
              <SidebarGroup
                key={group.label}
                label={group.label}
                icon={group.icon}
                defaultOpen={isGroupActive}
              >
                {group.items.map(item => (
                  <SidebarItem key={item.href} item={item} pathname={pathname} isNested />
                ))}
              </SidebarGroup>
            )
          }

          return (
            <div key={group.label} className="flex flex-col gap-1">
              {group.label !== "Visão Geral" && (
                <p className="px-4 text-xs font-bold text-red-100 uppercase tracking-wider mb-2 mt-2">
                  {group.label}
                </p>
              )}
              {group.items.map(item => (
                <SidebarItem key={item.href} item={item} pathname={pathname} />
              ))}
            </div>
          );
        })}

        <div className="my-2 border-t border-sidebar-border/50 mx-2" />

        <div className="flex flex-col gap-1">
          <SidebarItem item={{ label: "Configurações", icon: Settings, href: "/configuracoes" }} pathname={pathname} />
          <SidebarItem item={{ label: "Ajuda", icon: HelpCircle, href: "/ajuda" }} pathname={pathname} />
        </div>

      </nav>

      {/* Footer / User Profile */}
      <div className="p-4 mt-auto border-t border-[#fecaca]/30 bg-black/5 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-sidebar-primary to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white/20">
            GC
          </div>
          <div className="flex flex-col min-w-0 overflow-hidden">
            <p className="text-sm font-bold text-white truncate group-hover:text-white transition-colors">Graciele Costa</p>
            <p className="text-xs text-red-100 truncate">Fonoaudióloga</p>
          </div>
          <LogOut className="h-4 w-4 ml-auto text-red-100 hover:text-white transition-colors" />
        </div>
      </div>
    </aside>
  );
}

// Helper Components

function SidebarItem({ item, pathname, isNested = false }: { item: any, pathname: string | null, isNested?: boolean }) {
  const isActive = pathname?.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium",
        isActive
          ? "bg-white/20 text-white font-bold shadow-sm backdrop-blur-md ring-1 ring-white/10"
          : "text-red-50 hover:bg-white/10 hover:text-white transition-colors hover:shadow-sm",
        isNested && !isActive ? "text-red-100/80 pl-10" : isNested && isActive ? "pl-4" : "" // Nested styling logic
      )}
    >
      <Icon
        className={cn(
          "h-5 w-5 transition-transform group-hover:scale-110",
          isActive ? "fill-current" : ""
        )}
      />
      {item.label}
      {isActive && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-foreground" />
      )}
    </Link>
  );
}

function SidebarGroup({ label, icon: Icon, children, defaultOpen }: { label: string, icon: any, children: React.ReactNode, defaultOpen: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
      <CollapsibleTrigger className="w-full group flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-50 hover:bg-white/10 hover:text-white transition-all text-sm font-medium">
        <Icon className="h-5 w-5" />
        {label}
        <ChevronDown className={cn("hidden ml-auto h-4 w-4 transition-transform duration-200", isOpen ? "transform rotate-180" : "")} /> {/* Hidden chevron on hover maybe? or always visible but subtle */}
        <ChevronDown className={cn("ml-auto h-4 w-4 transition-transform duration-200 opacity-60", isOpen && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
        {children}
      </CollapsibleContent>
    </Collapsible>
  )
}

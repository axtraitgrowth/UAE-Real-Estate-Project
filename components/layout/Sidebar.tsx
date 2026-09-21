"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MAIN_NAVIGATION, NavigationItem } from "@/config/navigation";
import { cn } from "@/utils/cn";
import {
  LayoutDashboard,
  UserPlus,
  Users,
  CheckSquare,
  Compass,
  Building2,
  Layers,
  BadgePercent,
  UserCheck,
  BarChart3,
  Settings,
  X,
  Building,
} from "lucide-react";

interface SidebarProps {
  onCloseMobileMenu?: () => void;
}

export function Sidebar({ onCloseMobileMenu }: SidebarProps) {
  const pathname = usePathname();

  const getIcon = (iconName: string) => {
    const icons: Record<string, React.ReactNode> = {
      LayoutDashboard: <LayoutDashboard className="w-4 h-4 shrink-0" />,
      UserPlus: <UserPlus className="w-4 h-4 shrink-0" />,
      Users: <Users className="w-4 h-4 shrink-0" />,
      CheckSquare: <CheckSquare className="w-4 h-4 shrink-0" />,
      Compass: <Compass className="w-4 h-4 shrink-0" />,
      Building2: <Building2 className="w-4 h-4 shrink-0" />,
      Layers: <Layers className="w-4 h-4 shrink-0" />,
      BadgePercent: <BadgePercent className="w-4 h-4 shrink-0" />,
      UserCheck: <UserCheck className="w-4 h-4 shrink-0" />,
      BarChart3: <BarChart3 className="w-4 h-4 shrink-0" />,
      Settings: <Settings className="w-4 h-4 shrink-0" />,
    };

    return icons[iconName] || <Building className="w-4 h-4 shrink-0" />;
  };

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800/80 bg-[#0A0D15] select-none">
      {/* Brand Header */}
      <div className="flex h-14 items-center justify-between border-b border-slate-800/80 px-4">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-sm shadow-md">
            ▲
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wider text-white">APEX UAE</span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-amber-400/90">
              Supervision OS
            </span>
          </div>
        </Link>

        {onCloseMobileMenu && (
          <button
            type="button"
            onClick={onCloseMobileMenu}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {MAIN_NAVIGATION.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {section.title && (
              <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {section.title}
              </p>
            )}

            {section.items.map((item: NavigationItem) => {
              const isActive =
                !item.isPhaseDisabled &&
                (pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href)));

              if (item.isPhaseDisabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-xs text-slate-600 cursor-not-allowed group"
                    title={`Scheduled for ${item.phaseNote}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="text-slate-600">{getIcon(item.iconName)}</span>
                      <span className="truncate">{item.name}</span>
                    </div>
                    {item.phaseNote && (
                      <span className="rounded bg-slate-900 border border-slate-800/80 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 uppercase">
                        {item.phaseNote}
                      </span>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onCloseMobileMenu}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-xs font-medium transition-colors",
                    isActive
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                      : "text-slate-300 hover:bg-slate-850 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? "text-amber-400" : "text-slate-400"}>
                      {getIcon(item.iconName)}
                    </span>
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Phase 1 Foundation Tag */}
      <div className="border-t border-slate-800/80 p-3">
        <div className="rounded-md bg-slate-900/80 p-2.5 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-300">Phase 1 Foundation</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 leading-tight">
            Multi-Tenant • RBAC • Auth • Shell
          </p>
        </div>
      </div>
    </aside>
  );
}

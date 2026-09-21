"use client";

import React from "react";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import { UserNav } from "./UserNav";
import { Menu, Bell } from "lucide-react";

export interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-800/80 bg-[#0A0D15]/90 backdrop-blur-md px-4 sm:px-6">
      {/* Left: Mobile Toggle & Workspace Switcher */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden focus:outline-none"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <WorkspaceSwitcher />
      </div>

      {/* Right: Currency/Region Tag, Notifications & User Nav */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-mono text-slate-400 border border-slate-800">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>DUBAI (AED)</span>
        </div>

        <button
          type="button"
          className="relative rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-500"></span>
        </button>

        <div className="h-4 w-px bg-slate-800"></div>

        <UserNav />
      </div>
    </header>
  );
}

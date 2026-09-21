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
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-[#1E2638] bg-[#0B0E14] px-4 sm:px-6 select-none">
      {/* Left: Mobile Toggle & Workspace Switcher */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-md p-1.5 text-slate-400 hover:bg-[#151B28] hover:text-white md:hidden focus:outline-none"
          aria-label="Open sidebar navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <WorkspaceSwitcher />
      </div>

      {/* Right: Region Tag, Notifications & User Nav */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 rounded bg-[#10141E] px-2.5 py-1 text-[10px] font-mono tracking-wider text-slate-400 border border-[#1E2638]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>DUBAI (AED) • DLD COMPLIANT</span>
        </div>

        <button
          type="button"
          className="relative rounded-md p-2 text-slate-400 hover:bg-[#151B28] hover:text-white transition-colors focus:outline-none"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-[#B39266]"></span>
        </button>

        <div className="h-4 w-px bg-[#1E2638]"></div>

        <UserNav />
      </div>
    </header>
  );
}

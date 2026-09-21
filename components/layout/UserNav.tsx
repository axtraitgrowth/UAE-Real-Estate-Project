"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { User, LogOut, Settings } from "lucide-react";

export function UserNav() {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

  return (
    <Dropdown
      align="right"
      trigger={
        <button
          type="button"
          className="flex items-center gap-2 rounded-full p-0.5 transition-all hover:ring-1 hover:ring-[#B39266]/50 focus:outline-none"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#151B28] text-xs font-semibold text-[#C5A880] border border-[#232C42]">
            {initials}
          </div>
        </button>
      }
    >
      <div className="p-2.5 border-b border-[#1E2638]">
        <p className="text-xs font-semibold text-slate-100">{user.firstName} {user.lastName}</p>
        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
        <div className="mt-1.5 inline-flex items-center rounded bg-[#B39266]/15 px-2 py-0.5 text-[10px] font-mono text-[#C5A880] border border-[#B39266]/30 uppercase">
          {user.currentRole.name}
        </div>
      </div>

      <div className="py-1">
        <Link
          href="/settings/profile"
          className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-slate-300 hover:bg-[#151B28] hover:text-white transition-colors"
        >
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Profile</span>
        </Link>
        <Link
          href="/settings"
          className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-slate-300 hover:bg-[#151B28] hover:text-white transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Organization Settings</span>
        </Link>
      </div>

      <div className="pt-1 border-t border-[#1E2638]">
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-950/20 transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </Dropdown>
  );
}

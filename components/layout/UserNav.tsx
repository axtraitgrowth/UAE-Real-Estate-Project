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
          className="flex items-center gap-2 rounded-full p-1 transition-all hover:ring-2 hover:ring-amber-500/50 focus:outline-none"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-800 text-xs font-bold text-slate-950 shadow-inner">
            {initials}
          </div>
        </button>
      }
    >
      <div className="p-2 border-b border-slate-800">
        <p className="text-xs font-semibold text-slate-100">{user.firstName} {user.lastName}</p>
        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
        <div className="mt-1.5 inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400 border border-amber-500/20">
          {user.currentRole.name}
        </div>
      </div>

      <div className="py-1">
        <Link
          href="/settings/profile"
          className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <User className="w-3.5 h-3.5 text-slate-400" />
          <span>Profile</span>
        </Link>
        <Link
          href="/settings"
          className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <Settings className="w-3.5 h-3.5 text-slate-400" />
          <span>Organization Settings</span>
        </Link>
      </div>

      <div className="pt-1 border-t border-slate-800">
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-2 rounded px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors text-left"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </Dropdown>
  );
}

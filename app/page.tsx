"use client";

import React from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { AppShell } from "@/components/layout/AppShell";
import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { LoadingSpinner } from "@/components/ui/LoadingState";

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#07090F] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <LoadingSpinner size="lg" />
          <p className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Bootstrapping Apex Supervision OS...
          </p>
        </div>
      </div>
    );
  }

  // If authenticated, render the real platform shell & overview directly at /
  if (isAuthenticated && user) {
    return (
      <AppShell>
        <DashboardOverview />
      </AppShell>
    );
  }

  // If unauthenticated, render the authentication portal entry point
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#07090F] p-4 relative overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-amber-600/5 blur-3xl" />
      <div className="relative z-10 w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

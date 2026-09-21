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
      <div className="flex h-screen w-full items-center justify-center bg-[#0B0E14] text-slate-400">
        <div className="flex flex-col items-center gap-2.5">
          <LoadingSpinner size="md" />
          <span className="text-[11px] font-mono tracking-wider uppercase text-slate-500">
            Verifying Session Credentials...
          </span>
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0E14] p-4 sm:p-6">
      <div className="w-full flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Mail, Lock, Building2, KeyRound } from "lucide-react";

export function LoginForm() {
  const { login, isLoading, error: authError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError("Please enter your work email");
      return;
    }
    if (!password) {
      setFormError("Please enter your password");
      return;
    }

    await login(email, password);
  };

  const handleFillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("ApexDemo2026!");
    setFormError(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-black text-xl shadow-lg shadow-amber-500/20">
          ▲
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">APEX UAE</h1>
        <p className="text-xs uppercase tracking-widest text-amber-400 font-mono">
          Real Estate Sales Management & Supervision
        </p>
        <p className="text-xs text-slate-400 max-w-xs mx-auto pt-1">
          Enterprise supervision platform for Dubai developers, agencies, and sales operations
        </p>
      </div>

      {/* Form Container */}
      <div className="rounded-xl border border-slate-800 bg-[#0F1420]/90 backdrop-blur-md p-6 sm:p-8 shadow-2xl">
        {(formError || authError) && (
          <div className="mb-5">
            <Alert variant="destructive" title="Authentication Error">
              {formError || authError}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Corporate Email"
            placeholder="agent@company.ae"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            autoComplete="email"
            disabled={isLoading}
            required
          />

          <Input
            type="password"
            label="Password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            autoComplete="current-password"
            disabled={isLoading}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Access Supervision OS
          </Button>
        </form>

        {/* Demo Accounts Quick-Select for Phase 1 testing */}
        <div className="mt-8 border-t border-slate-800 pt-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Phase 1 Demo Credentials</span>
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("owner@emaar.ae")}
              className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-left text-xs transition-colors hover:border-amber-500/50 hover:bg-slate-850"
            >
              <div>
                <p className="font-medium text-slate-200">Emaar Properties PJSC</p>
                <p className="text-[10px] text-slate-400">owner@emaar.ae</p>
              </div>
              <span className="rounded bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-mono text-amber-400">
                Owner
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("manager@emaar.ae")}
              className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-left text-xs transition-colors hover:border-amber-500/50 hover:bg-slate-850"
            >
              <div>
                <p className="font-medium text-slate-200">Emaar Sales Management</p>
                <p className="text-[10px] text-slate-400">manager@emaar.ae</p>
              </div>
              <span className="rounded bg-sky-500/10 border border-sky-500/30 px-1.5 py-0.5 text-[10px] font-mono text-sky-400">
                Sales Manager
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("agent@emaar.ae")}
              className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/60 px-3 py-2 text-left text-xs transition-colors hover:border-amber-500/50 hover:bg-slate-850"
            >
              <div>
                <p className="font-medium text-slate-200">Emaar Brokerage</p>
                <p className="text-[10px] text-slate-400">agent@emaar.ae</p>
              </div>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400">
                Agent
              </span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            Demo Password: <span className="font-mono text-slate-400">ApexDemo2026!</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
        <Building2 className="w-3.5 h-3.5" />
        <span>Dubai Real Estate Regulatory Compliant Architecture</span>
      </div>
    </div>
  );
}

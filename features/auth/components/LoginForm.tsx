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
      setFormError("Please enter your corporate email address");
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
    <div className="w-full max-w-md space-y-5">
      {/* Brand Header */}
      <div className="text-center space-y-1.5">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-[#B39266] text-[#0B0E14] font-black text-sm tracking-wider shadow-sm">
          APX
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">APEX REAL ESTATE</h1>
        <p className="text-[11px] uppercase tracking-widest text-[#C5A880] font-mono">
          Dubai Sales Management & Supervision Platform
        </p>
        <p className="text-xs text-slate-400 max-w-xs mx-auto pt-0.5 leading-relaxed">
          Enterprise supervision gateway for developers, builders, and sales management
        </p>
      </div>

      {/* Form Container */}
      <div className="rounded-lg border border-[#1E2638] bg-[#10141E] p-6 sm:p-7 shadow-xl">
        {(formError || authError) && (
          <div className="mb-4">
            <Alert variant="destructive" title="Authentication Error">
              {formError || authError}
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Corporate Email"
            placeholder="officer@developer.ae"
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
            className="w-full mt-1"
            isLoading={isLoading}
          >
            Access Supervision Workspace
          </Button>
        </form>

        {/* Demo Personas Selector */}
        <div className="mt-6 border-t border-[#1E2638] pt-5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Phase 1 Verified Personas</span>
          </p>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo("owner@emaar.ae")}
              className="flex items-center justify-between rounded-md border border-[#1E2638] bg-[#0B0E14] px-3.5 py-2 text-left text-xs transition-colors hover:border-[#B39266]/50 hover:bg-[#151B28]"
            >
              <div>
                <p className="font-semibold text-slate-200">Emaar Properties PJSC</p>
                <p className="text-[11px] text-slate-400 font-mono">owner@emaar.ae</p>
              </div>
              <span className="rounded bg-[#B39266]/15 border border-[#B39266]/30 px-2 py-0.5 text-[10px] font-mono text-[#C5A880] uppercase">
                Owner / Executive
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("manager@emaar.ae")}
              className="flex items-center justify-between rounded-md border border-[#1E2638] bg-[#0B0E14] px-3.5 py-2 text-left text-xs transition-colors hover:border-[#B39266]/50 hover:bg-[#151B28]"
            >
              <div>
                <p className="font-semibold text-slate-200">Emaar Sales Operations</p>
                <p className="text-[11px] text-slate-400 font-mono">manager@emaar.ae</p>
              </div>
              <span className="rounded bg-[#151B28] border border-[#232C42] px-2 py-0.5 text-[10px] font-mono text-slate-300 uppercase">
                Sales Manager
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleFillDemo("agent@emaar.ae")}
              className="flex items-center justify-between rounded-md border border-[#1E2638] bg-[#0B0E14] px-3.5 py-2 text-left text-xs transition-colors hover:border-[#B39266]/50 hover:bg-[#151B28]"
            >
              <div>
                <p className="font-semibold text-slate-200">Emaar Brokerage Division</p>
                <p className="text-[11px] text-slate-400 font-mono">agent@emaar.ae</p>
              </div>
              <span className="rounded bg-emerald-950/40 border border-emerald-700/40 px-2 py-0.5 text-[10px] font-mono text-emerald-300 uppercase">
                Licensed Agent
              </span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2.5 text-center">
            Demo Password: <span className="font-mono text-slate-300 font-semibold">ApexDemo2026!</span>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500">
        <Building2 className="w-3.5 h-3.5" />
        <span>Dubai DLD / RERA Regulatory Architecture • Multi-Tenant Enforced</span>
      </div>
    </div>
  );
}

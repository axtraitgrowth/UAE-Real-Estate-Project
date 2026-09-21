"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { AlertOctagon, RotateCw, Home } from "lucide-react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Application Error Boundary caught error]:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090F] p-4 text-center">
      <div className="w-full max-w-md rounded-xl border border-red-500/20 bg-[#0F1420] p-8 shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/30 mb-4">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">System Encountered an Error</h2>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          An unexpected error occurred during operation. The supervisory logs have captured this incident.
        </p>

        {error.digest && (
          <p className="mt-3 rounded bg-slate-900/80 px-2.5 py-1 text-[10px] font-mono text-slate-500">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => reset()}
            leftIcon={<RotateCw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
          <Link href="/dashboard">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Home className="w-3.5 h-3.5" />}
            >
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

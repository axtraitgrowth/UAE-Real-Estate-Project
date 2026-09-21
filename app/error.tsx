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
    <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] p-4 text-center">
      <div className="w-full max-w-md rounded-lg border border-rose-900/40 bg-[#10141E] p-8 shadow-2xl">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg bg-rose-950/40 text-rose-400 border border-rose-800/40 mb-4">
          <AlertOctagon className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight">System Encountered an Error</h2>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          An unexpected error occurred during operation. The supervisory logs have captured this incident.
        </p>

        {error.digest && (
          <p className="mt-3 rounded bg-[#0B0E14] px-2.5 py-1 text-[10px] font-mono text-slate-500 border border-[#1E2638]">
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

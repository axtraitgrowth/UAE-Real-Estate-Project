import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07090F] p-4 text-center">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-[#0F1420] p-8 shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-amber-400 border border-slate-700 mb-4">
          <FileQuestion className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">404 - Page Not Found</h2>
        <p className="mt-2 text-xs text-slate-400 leading-relaxed">
          The requested route or supervisory asset does not exist or has been relocated.
        </p>

        <div className="mt-6">
          <Link href="/dashboard">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

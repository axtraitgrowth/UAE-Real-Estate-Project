import React from "react";
import { cn } from "@/utils/cn";
import { AlertOctagon, RotateCw } from "lucide-react";
import { Button } from "./Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = "Failed to load data",
  message = "An unexpected error occurred while communicating with the server. Please try again.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-rose-900/40 bg-rose-950/20 p-8 text-center",
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-rose-950/50 text-rose-400 mb-3 border border-rose-800/40">
        <AlertOctagon className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-slate-200 tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-red-300/80 leading-relaxed">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            leftIcon={<RotateCw className="w-3.5 h-3.5" />}
          >
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

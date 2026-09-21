import React from "react";
import { cn } from "@/utils/cn";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "destructive";
  title?: string;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

export function Alert({
  variant = "info",
  title,
  children,
  className,
  onDismiss,
}: AlertProps) {
  const icons = {
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    destructive: <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />,
  };

  const variants = {
    info: "border-sky-500/30 bg-sky-500/10 text-sky-200",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    warning: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    destructive: "border-red-500/30 bg-red-500/10 text-red-200",
  };

  return (
    <div
      role="alert"
      className={cn("flex gap-3 rounded-lg border p-4 text-sm", variants[variant], className)}
    >
      {icons[variant]}
      <div className="flex-1">
        {title && <h5 className="font-medium tracking-tight mb-1 text-white">{title}</h5>}
        <div className="text-xs leading-relaxed opacity-90">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="rounded p-0.5 text-slate-400 hover:text-white"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

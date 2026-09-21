import React from "react";
import { cn } from "@/utils/cn";
import { Layers } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-800 p-8 text-center",
        className
      )}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-850 text-amber-400/80 mb-4 border border-slate-800">
        {icon || <Layers className="w-6 h-6" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-200 tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

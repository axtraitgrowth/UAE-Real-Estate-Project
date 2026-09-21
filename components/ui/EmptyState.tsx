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
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-[#1E2638] bg-[#10141E]/40 p-8 text-center",
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#151B28] text-[#C5A880] mb-3 border border-[#232C42]">
        {icon || <Layers className="w-5 h-5" />}
      </div>
      <h3 className="text-sm font-semibold text-slate-200 tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-slate-400 leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

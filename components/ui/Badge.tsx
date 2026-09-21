import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "gold" | "brass" | "success" | "warning" | "destructive" | "outline";
  size?: "sm" | "md";
}

export function Badge({
  className,
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    neutral: "bg-[#151B28] text-slate-300 border-[#232C42]",
    gold: "bg-[#B39266]/15 text-[#C5A880] border-[#B39266]/30",
    brass: "bg-[#B39266]/15 text-[#C5A880] border-[#B39266]/30",
    success: "bg-emerald-950/40 text-emerald-300 border-emerald-700/40",
    warning: "bg-amber-950/40 text-amber-300 border-amber-700/40",
    destructive: "bg-rose-950/40 text-rose-300 border-rose-700/40",
    outline: "bg-transparent text-slate-400 border-[#232C42]",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 leading-none",
    md: "text-[11px] px-2 py-0.5 leading-normal",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border tracking-wider uppercase font-mono transition-colors font-medium select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

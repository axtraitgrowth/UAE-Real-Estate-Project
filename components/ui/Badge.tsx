import React from "react";
import { cn } from "@/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "neutral" | "gold" | "success" | "warning" | "destructive" | "outline";
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
    neutral: "bg-slate-800 text-slate-300 border-slate-700",
    gold: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border-amber-500/40",
    destructive: "bg-red-500/10 text-red-400 border-red-500/30",
    outline: "bg-transparent text-slate-400 border-slate-700",
  };

  const sizeStyles = {
    sm: "text-[10px] px-1.5 py-0.5 font-medium",
    md: "text-xs px-2.5 py-0.5 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border tracking-wide uppercase font-mono transition-colors",
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

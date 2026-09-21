import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0B0E14] disabled:opacity-40 disabled:cursor-not-allowed select-none tracking-tight";

    const variantStyles = {
      primary:
        "bg-[#B39266] hover:bg-[#C5A880] text-[#0B0E14] font-semibold shadow-sm focus:ring-[#B39266]",
      gold:
        "bg-[#B39266] hover:bg-[#C5A880] text-[#0B0E14] font-semibold shadow-sm focus:ring-[#B39266]",
      secondary:
        "bg-[#151B28] hover:bg-[#1B2233] text-slate-100 border border-[#232C42] focus:ring-slate-400",
      outline:
        "border border-[#232C42] bg-transparent hover:bg-[#151B28] text-slate-200 focus:ring-slate-400",
      ghost:
        "bg-transparent hover:bg-[#151B28] text-slate-300 hover:text-white focus:ring-slate-500",
      destructive:
        "bg-rose-700 hover:bg-rose-600 text-white shadow-sm focus:ring-rose-500",
    };

    const sizeStyles = {
      sm: "text-xs px-2.5 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2 gap-2",
      lg: "text-base px-6 py-2.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-current" /> : leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

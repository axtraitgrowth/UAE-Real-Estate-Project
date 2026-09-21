import React from "react";
import { cn } from "@/utils/cn";
import { Loader2 } from "lucide-react";

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded bg-slate-800/60", className)}
      {...props}
    />
  );
}

export function LoadingSpinner({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <Loader2 className={cn("animate-spin text-amber-500", sizeMap[size], className)} />
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="w-full space-y-3 p-4">
      <div className="flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="space-y-2 pt-2">
        {Array.from({ length: rows }).map((_, r) => (
          <Skeleton key={r} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}

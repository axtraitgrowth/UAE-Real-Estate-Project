import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center text-xs text-slate-400", className)} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1.5 md:space-x-2">
        <li className="inline-flex items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-slate-400 hover:text-[#C5A880] transition-colors"
          >
            <Home className="w-3.5 h-3.5 mr-1" />
            <span>Apex</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            <ChevronRight className="w-3.5 h-3.5 text-slate-600 mx-1" />
            {item.href && !item.current ? (
              <Link
                href={item.href}
                className="text-slate-400 hover:text-[#C5A880] transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-slate-200" aria-current={item.current ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

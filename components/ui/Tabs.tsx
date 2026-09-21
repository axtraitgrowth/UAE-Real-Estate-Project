import React from "react";
import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn("border-b border-slate-800", className)}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "group inline-flex items-center gap-2 border-b-2 py-3 px-1 text-sm font-medium transition-all whitespace-nowrap",
                isActive
                  ? "border-amber-500 text-amber-400 font-semibold"
                  : "border-transparent text-slate-400 hover:border-slate-700 hover:text-slate-200"
              )}
            >
              {tab.icon && (
                <span
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                  )}
                >
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-1 rounded-full px-2 py-0.5 text-xs font-mono",
                    isActive
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-slate-800 text-slate-400"
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

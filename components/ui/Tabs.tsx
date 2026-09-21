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
    <div className={cn("border-b border-[#1E2638]", className)}>
      <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "group inline-flex items-center gap-2 border-b-2 py-2.5 px-1 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "border-[#B39266] text-[#C5A880] font-semibold"
                  : "border-transparent text-slate-400 hover:border-[#28334A] hover:text-slate-200"
              )}
            >
              {tab.icon && (
                <span
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isActive ? "text-[#B39266]" : "text-slate-500 group-hover:text-slate-300"
                  )}
                >
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "ml-1 rounded px-1.5 py-0.5 text-[10px] font-mono",
                    isActive
                      ? "bg-[#B39266]/20 text-[#C5A880]"
                      : "bg-[#151B28] text-slate-400 border border-[#232C42]"
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

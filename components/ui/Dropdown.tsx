"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/cn";

export interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  destructive?: boolean;
  active?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items?: DropdownItem[];
  children?: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, items, children, align = "left", className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-40 mt-1.5 min-w-[12rem] rounded-lg border border-[#1E2638] bg-[#10141E] p-1 shadow-2xl focus:outline-none",
            align === "right" ? "right-0" : "left-0",
            className
          )}
        >
          {items
            ? items.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={item.disabled}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded px-3 py-2 text-xs font-medium transition-colors text-left",
                    item.destructive
                      ? "text-rose-400 hover:bg-rose-950/30"
                      : item.active
                      ? "bg-[#B39266]/15 text-[#C5A880]"
                      : "text-slate-300 hover:bg-[#151B28] hover:text-white",
                    item.disabled ? "opacity-40 cursor-not-allowed" : ""
                  )}
                >
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span>{item.label}</span>
                </button>
              ))
            : children}
        </div>
      )}
    </div>
  );
}

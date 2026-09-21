"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";

interface DimensionScore {
  label: string;
  sublabel: string;
  score: number;
  max: number;
  color: string;
}

export interface ScoreBreakdownProps {
  scorePoints: number;
  scorePriority: "HIGH" | "MEDIUM" | "LOW" | string;
  breakdown?: {
    icpFit: number;
    marketFit: number;
    leadDependency: number;
    digitalOpportunity: number;
    salesOperation: number;
    decisionMakerAccess: number;
  };
  reasons?: string[];
  onRecalculate?: () => Promise<void> | void;
  isRecalculating?: boolean;
}

export function ScoreBreakdown({
  scorePoints,
  scorePriority,
  breakdown,
  reasons = [],
  onRecalculate,
  isRecalculating = false,
}: ScoreBreakdownProps) {
  const [showReasons, setShowReasons] = useState(true);

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return <Badge variant="gold" size="sm">High Priority (80-100)</Badge>;
      case "MEDIUM":
        return <Badge variant="neutral" size="sm">Medium Priority (55-79)</Badge>;
      case "LOW":
        return <Badge variant="outline" size="sm">Low Priority (0-54)</Badge>;
      default:
        return <Badge variant="outline" size="sm">{priority}</Badge>;
    }
  };

  const dimensions: DimensionScore[] = [
    {
      label: "ICP Segment Fit",
      sublabel: "Developer / Brokerage / Agency model",
      score: breakdown?.icpFit ?? 0,
      max: 30,
      color: "bg-[#B39266]",
    },
    {
      label: "Market & Geography",
      sublabel: "Dubai (P1) vs Abu Dhabi/Sharjah (P2)",
      score: breakdown?.marketFit ?? 0,
      max: 15,
      color: "bg-blue-400",
    },
    {
      label: "Lead Dependency",
      sublabel: "Ad activity, web lead capture & WhatsApp",
      score: breakdown?.leadDependency ?? 0,
      max: 15,
      color: "bg-emerald-400",
    },
    {
      label: "Digital Opportunity",
      sublabel: "Funnel fragmentation & conversion gap",
      score: breakdown?.digitalOpportunity ?? 0,
      max: 20,
      color: "bg-amber-400",
    },
    {
      label: "Sales Operation Scale",
      sublabel: "Company size, active launches & CRM gap",
      score: breakdown?.salesOperation ?? 0,
      max: 10,
      color: "bg-purple-400",
    },
    {
      label: "Decision Maker Access",
      sublabel: "Tier 1/2 authority & verified channels",
      score: breakdown?.decisionMakerAccess ?? 0,
      max: 10,
      color: "bg-cyan-400",
    },
  ];

  return (
    <div className="space-y-4 rounded-lg border border-[#1E2638] bg-[#0E121B] p-4 text-white">
      {/* Header Metric */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#1E2638] pb-3.5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-md border border-[#B39266]/30 bg-[#B39266]/10 text-xl font-bold font-mono text-[#C5A880]">
            {scorePoints}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">100-Point ICP Fit Score</span>
              {getPriorityBadge(scorePriority)}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent, evidence-grounded qualification index
            </p>
          </div>
        </div>

        {onRecalculate && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRecalculate}
            disabled={isRecalculating}
            className="flex items-center gap-1.5 text-xs text-slate-300 border-[#1E2638] hover:border-[#B39266]"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRecalculating ? "animate-spin text-[#C5A880]" : ""}`} />
            <span>{isRecalculating ? "Scoring..." : "Recalculate"}</span>
          </Button>
        )}
      </div>

      {/* 6 Dimension Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {dimensions.map((dim) => {
          const percent = Math.min(100, Math.round((dim.score / dim.max) * 100));
          return (
            <div
              key={dim.label}
              className="rounded border border-[#1E2638]/70 bg-[#121723] p-2.5 transition-colors hover:border-[#1E2638]"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-slate-200">{dim.label}</span>
                <span className="font-mono text-[11px] font-semibold text-slate-300">
                  {dim.score} <span className="text-slate-500 font-normal">/ {dim.max}</span>
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1A2234]">
                <div
                  className={`h-full ${dim.color} transition-all duration-300`}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">
                {dim.sublabel}
              </div>
            </div>
          );
        })}
      </div>

      {/* Evidence & Rationale Accordion */}
      {reasons.length > 0 && (
        <div className="border-t border-[#1E2638] pt-3">
          <button
            type="button"
            onClick={() => setShowReasons(!showReasons)}
            className="flex w-full items-center justify-between text-left text-xs text-slate-300 hover:text-white"
          >
            <div className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Score Rationale & Evidence ({reasons.length} signals)</span>
            </div>
            {showReasons ? (
              <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {showReasons && (
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-300">
              {reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-[#121723]/60 px-2.5 py-1.5 rounded border border-[#1E2638]/50">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] mt-0.5 shrink-0" />
                  <span className="text-[11px] leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

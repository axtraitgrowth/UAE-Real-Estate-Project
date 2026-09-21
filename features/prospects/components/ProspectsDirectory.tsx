"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import {
  Building2,
  Users,
  Search,
  Plus,
  Globe,
  Mail,
  Phone,
  Linkedin,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle2,
  Filter,
  Layers,
  Sparkles,
  Info,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  ProspectRecord,
  CompanyType,
  LeadScore,
  LeadStatus,
  ProspectOverviewStats,
  DigitalMaturity,
  DecisionMakerLevel,
  OutreachReadiness,
  ProspectDuplicate,
} from "@/types/prospect";
import { formatCurrency, formatDate } from "@/utils/format";
import { ScoreBreakdown } from "./ScoreBreakdown";

export function ProspectsDirectory() {
  const [prospects, setProspects] = useState<ProspectRecord[]>([]);
  const [stats, setStats] = useState<ProspectOverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Core Filters
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<CompanyType | "ALL">("ALL");
  const [selectedScore, setSelectedScore] = useState<LeadScore | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Step 2 Extended Qualification Filters
  const [selectedMaturity, setSelectedMaturity] = useState<DigitalMaturity | "ALL">("ALL");
  const [selectedReadiness, setSelectedReadiness] = useState<OutreachReadiness | "ALL">("ALL");
  const [selectedDmLevel, setSelectedDmLevel] = useState<DecisionMakerLevel | "ALL">("ALL");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Selection & Modal States
  const [selectedProspect, setSelectedProspect] = useState<ProspectRecord | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);

  // Duplicate Detection States
  const [duplicateCheckLoading, setDuplicateCheckLoading] = useState(false);
  const [potentialDuplicates, setPotentialDuplicates] = useState<ProspectDuplicate[]>([]);
  const [confirmedDuplicateBypass, setConfirmedDuplicateBypass] = useState(false);

  // New Prospect Form State
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "DEVELOPER" as CompanyType,
    website: "",
    location: "Dubai, UAE",
    primaryMarket: "Dubai Off-Plan",
    propertySegment: "High-End",
    companySize: "11-50",
    activeProjects: "",
    companyNotes: "",

    contactName: "",
    jobTitle: "Head of Sales",
    businessEmail: "",
    businessPhone: "",
    linkedinProfile: "",
    preferredContactChannel: "LINKEDIN",
    contactSource: "LinkedIn Research",

    websiteQuality: "AVERAGE",
    leadFunnelQuality: "FRAGMENTED",
    hasLandingPage: false,
    hasLeadForm: true,
    hasWhatsappCta: true,
    visibleAdActivity: "META_ONLY",
    crmVisibility: "NOT_PUBLICLY_VISIBLE",
    leadManagementObservation: "",
    marketingObservation: "",
    personalizedOpportunity: "",

    leadScore: "HIGH" as LeadScore,
    leadScorePoints: 75,
    leadStatus: "NEW_PROSPECT" as LeadStatus,
    dealValue: 50000,
    salesNotes: "",
  });

  const fetchProspects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (selectedType !== "ALL") params.set("companyType", selectedType);
      if (selectedScore !== "ALL") params.set("leadScore", selectedScore);
      if (selectedStatus !== "ALL") params.set("leadStatus", selectedStatus);
      if (selectedMaturity !== "ALL") params.set("digitalMaturity", selectedMaturity);
      if (selectedReadiness !== "ALL") params.set("outreachReadiness", selectedReadiness);
      if (selectedDmLevel !== "ALL") params.set("decisionMakerLevel", selectedDmLevel);

      const [resList, resStats] = await Promise.all([
        fetch(`/api/prospects?${params.toString()}`),
        fetch("/api/prospects/stats"),
      ]);

      if (!resList.ok) throw new Error("Failed to load prospects");
      const listData = await resList.json();
      setProspects(listData.data.prospects || []);

      if (resStats.ok) {
        const statsData = await resStats.json();
        setStats(statsData.data);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load prospects");
    } finally {
      setLoading(false);
    }
  }, [search, selectedType, selectedScore, selectedStatus, selectedMaturity, selectedReadiness, selectedDmLevel]);

  useEffect(() => {
    fetchProspects();
  }, [fetchProspects]);

  const checkDuplicateCompany = async (companyName: string, website?: string) => {
    if (!companyName || companyName.trim().length < 3) {
      setPotentialDuplicates([]);
      return;
    }
    try {
      setDuplicateCheckLoading(true);
      const res = await fetch("/api/prospects/duplicates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          website: website?.trim() || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPotentialDuplicates(data.data?.duplicates || []);
      }
    } catch {
      // Non-blocking duplicate check error
    } finally {
      setDuplicateCheckLoading(false);
    }
  };

  const handleRecalculateScore = async () => {
    if (!selectedProspect) return;
    try {
      setIsRecalculating(true);
      const res = await fetch(`/api/prospects/${selectedProspect.id}/score`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.data?.prospect) {
          setSelectedProspect(data.data.prospect);
          setProspects((prev) =>
            prev.map((p) => (p.id === selectedProspect.id ? data.data.prospect : p))
          );
        }
      }
    } catch {
      // Ignore
    } finally {
      setIsRecalculating(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      const payload = {
        ...formData,
        website: formData.website || undefined,
        businessEmail: formData.businessEmail || undefined,
        businessPhone: formData.businessPhone || undefined,
        linkedinProfile: formData.linkedinProfile || undefined,
        dealValue: formData.dealValue ? Number(formData.dealValue) : undefined,
        leadScorePoints: Number(formData.leadScorePoints),
      };

      const res = await fetch("/api/prospects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "Failed to create prospect");
      }

      setIsCreateOpen(false);
      setPotentialDuplicates([]);
      setConfirmedDuplicateBypass(false);
      fetchProspects();
    } catch (err: unknown) {
      setCreateError(err instanceof Error ? err.message : "Error creating prospect");
    } finally {
      setIsCreating(false);
    }
  };

  const getScoreBadge = (score: LeadScore | string) => {
    switch (score) {
      case "HIGH":
        return <Badge variant="gold" size="sm">High Priority</Badge>;
      case "MEDIUM":
        return <Badge variant="neutral" size="sm">Medium</Badge>;
      case "LOW":
        return <Badge variant="outline" size="sm">Low</Badge>;
      default:
        return <Badge variant="outline" size="sm">{score}</Badge>;
    }
  };

  const getReadinessBadge = (readiness: string) => {
    switch (readiness) {
      case "READY":
        return <Badge variant="success" size="sm">READY</Badge>;
      case "DO_NOT_CONTACT":
        return <Badge variant="destructive" size="sm">DO NOT CONTACT</Badge>;
      case "NEEDS_RESEARCH":
      default:
        return <Badge variant="warning" size="sm">NEEDS RESEARCH</Badge>;
    }
  };

  const getDmLevelBadge = (level?: string | null) => {
    switch (level) {
      case "TIER_1":
        return <Badge variant="gold" size="sm">Tier 1: Exec</Badge>;
      case "TIER_2":
        return <Badge variant="brass" size="sm">Tier 2: Head/Dir</Badge>;
      case "TIER_3":
        return <Badge variant="neutral" size="sm">Tier 3: Mgr</Badge>;
      case "LOWER":
        return <Badge variant="outline" size="sm">Coordinator</Badge>;
      default:
        return null;
    }
  };

  const getMaturityBadge = (maturity?: string | null) => {
    switch (maturity) {
      case "ADVANCED":
        return <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-700/40">ADVANCED</span>;
      case "DEVELOPING":
        return <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-950/40 text-blue-300 border border-blue-700/40">DEVELOPING</span>;
      case "LOW":
        return <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-700/40">LOW</span>;
      default:
        return <span className="inline-flex items-center text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-[#1E2638]">UNVERIFIED</span>;
    }
  };

  const getStatusBadge = (status: LeadStatus | string) => {
    switch (status) {
      case "NEW_PROSPECT":
        return <Badge variant="outline" size="sm">New</Badge>;
      case "RESEARCHED":
        return <Badge variant="neutral" size="sm">Researched</Badge>;
      case "CONTACTED":
        return <Badge variant="gold" size="sm">Contacted</Badge>;
      case "REPLIED":
      case "QUALIFIED":
        return <Badge variant="success" size="sm">{status.replace("_", " ")}</Badge>;
      case "MEETING_BOOKED":
      case "MEETING_COMPLETED":
        return <Badge variant="brass" size="sm">Meeting Booked</Badge>;
      case "PROPOSAL_SENT":
      case "NEGOTIATION":
        return <Badge variant="brass" size="sm">Proposal Active</Badge>;
      case "WON":
        return <Badge variant="success" size="sm">Won Deal</Badge>;
      case "LOST":
      case "DISQUALIFIED":
      case "DO_NOT_CONTACT":
        return <Badge variant="destructive" size="sm">{status.replace("_", " ")}</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: CompanyType | string) => {
    switch (type) {
      case "DEVELOPER":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#B39266]/10 text-[#C5A880] border border-[#B39266]/20">
            <Building2 className="w-3 h-3" />
            Developer
          </span>
        );
      case "BROKERAGE":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-blue-950/30 text-blue-300 border border-blue-800/30">
            <Layers className="w-3 h-3" />
            Brokerage
          </span>
        );
      case "AGENCY":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-purple-950/30 text-purple-300 border border-purple-800/30">
            <Users className="w-3 h-3" />
            Agency
          </span>
        );
      default:
        return <Badge variant="neutral" size="sm">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs
            items={[
              { label: "Sales Supervision", href: "/dashboard" },
              { label: "Prospect Engine", current: true },
            ]}
          />
          <div className="flex items-center gap-2.5 mt-1">
            <h1 className="text-xl font-bold tracking-tight text-white">
              UAE Real Estate Prospect Directory
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded border border-[#B39266]/30 bg-[#B39266]/10 text-[#C5A880]">
              Phase 3 Engine
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Systematic outbound pipeline targeting UAE Developers, Brokerages, and Agencies with 4-domain sales intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Prospect</span>
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="p-3.5 bg-[#10141E] border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Total Prospects</span>
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-white mt-1">
            {stats ? stats.totalProspects : "—"}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">UAE Accounts</div>
        </Card>

        <Card className="p-3.5 bg-[#10141E] border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Developers</span>
            <span className="w-2 h-2 rounded-full bg-[#B39266]" />
          </div>
          <div className="text-xl font-bold text-[#C5A880] mt-1">
            {stats ? stats.developersCount : "—"}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Builders & Masters</div>
        </Card>

        <Card className="p-3.5 bg-[#10141E] border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Brokerages</span>
            <span className="w-2 h-2 rounded-full bg-blue-400" />
          </div>
          <div className="text-xl font-bold text-blue-300 mt-1">
            {stats ? stats.brokeragesCount : "—"}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Off-Plan & Luxury</div>
        </Card>

        <Card className="p-3.5 bg-[#10141E] border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Agencies</span>
            <span className="w-2 h-2 rounded-full bg-purple-400" />
          </div>
          <div className="text-xl font-bold text-purple-300 mt-1">
            {stats ? stats.agenciesCount : "—"}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Advisories & Teams</div>
        </Card>

        <Card className="p-3.5 bg-[#10141E] border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>High Priority</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-amber-300 mt-1">
            {stats ? stats.hotLeadsCount : "—"}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">Score &gt; 70</div>
        </Card>

        <Card className="p-3.5 bg-[#10141E] border-[#1E2638]">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pipeline Value</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-300 mt-1">
            {stats ? `${(stats.totalPipelineValueAed / 1000).toFixed(0)}k` : "—"}
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-0.5">AED Projected</div>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-3 bg-[#10141E] border-[#1E2638] space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search companies, decision makers, projects, or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white placeholder-slate-500 focus:outline-none focus:border-[#B39266] transition-colors"
            />
          </div>

          {/* Type Filter Pills & Quick Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {(["ALL", "DEVELOPER", "BROKERAGE", "AGENCY"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                  selectedType === type
                    ? "bg-[#B39266]/15 border-[#B39266] text-[#C5A880] font-medium"
                    : "bg-[#0B0E14] border-[#1E2638] text-slate-400 hover:border-slate-700"
                }`}
              >
                {type === "ALL" ? "All Types" : type}
              </button>
            ))}

            <span className="h-4 w-px bg-[#1E2638] mx-1" />

            {/* Score Filter */}
            <select
              value={selectedScore}
              onChange={(e) => setSelectedScore(e.target.value as LeadScore | "ALL")}
              aria-label="Filter prospects by score"
              className="px-2 py-1 text-xs font-mono rounded bg-[#0B0E14] border border-[#1E2638] text-slate-300 focus:outline-none focus:border-[#B39266]"
            >
              <option value="ALL">Priority: All</option>
              <option value="HIGH">High (80-100)</option>
              <option value="MEDIUM">Medium (55-79)</option>
              <option value="LOW">Low (0-54)</option>
            </select>

            {/* Toggle Advanced Filters */}
            <Button
              variant={showAdvancedFilters ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-xs flex items-center gap-1"
            >
              <Filter className="w-3 h-3" />
              <span>Filters</span>
              {(selectedReadiness !== "ALL" || selectedMaturity !== "ALL" || selectedDmLevel !== "ALL") && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#B39266]" />
              )}
            </Button>
          </div>
        </div>

        {/* Expandable Qualification Filters */}
        {showAdvancedFilters && (
          <div className="pt-2.5 border-t border-[#1E2638] flex flex-wrap items-center gap-2.5 text-xs text-slate-300">
            {/* Outreach Readiness Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono text-[11px]">Readiness:</span>
              <select
                value={selectedReadiness}
                onChange={(e) => setSelectedReadiness(e.target.value as OutreachReadiness | "ALL")}
                aria-label="Filter by outreach readiness"
                className="px-2 py-1 text-xs font-mono rounded bg-[#0B0E14] border border-[#1E2638] text-slate-200 focus:outline-none focus:border-[#B39266]"
              >
                <option value="ALL">All Readiness</option>
                <option value="READY">Ready for Outreach</option>
                <option value="NEEDS_RESEARCH">Needs Research</option>
                <option value="DO_NOT_CONTACT">Do Not Contact</option>
              </select>
            </div>

            {/* Digital Maturity Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono text-[11px]">Maturity:</span>
              <select
                value={selectedMaturity}
                onChange={(e) => setSelectedMaturity(e.target.value as DigitalMaturity | "ALL")}
                aria-label="Filter by digital maturity"
                className="px-2 py-1 text-xs font-mono rounded bg-[#0B0E14] border border-[#1E2638] text-slate-200 focus:outline-none focus:border-[#B39266]"
              >
                <option value="ALL">All Maturity</option>
                <option value="LOW">Low (High Gap)</option>
                <option value="DEVELOPING">Developing</option>
                <option value="ADVANCED">Advanced</option>
                <option value="UNKNOWN">Unverified</option>
              </select>
            </div>

            {/* Decision Maker Level Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-mono text-[11px]">DM Tier:</span>
              <select
                value={selectedDmLevel}
                onChange={(e) => setSelectedDmLevel(e.target.value as DecisionMakerLevel | "ALL")}
                aria-label="Filter by decision maker level"
                className="px-2 py-1 text-xs font-mono rounded bg-[#0B0E14] border border-[#1E2638] text-slate-200 focus:outline-none focus:border-[#B39266]"
              >
                <option value="ALL">All Tiers</option>
                <option value="TIER_1">Tier 1: Exec / Owner</option>
                <option value="TIER_2">Tier 2: Head / Director</option>
                <option value="TIER_3">Tier 3: Manager</option>
                <option value="LOWER">Coordinator</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedReadiness !== "ALL" || selectedMaturity !== "ALL" || selectedDmLevel !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSelectedReadiness("ALL");
                  setSelectedMaturity("ALL");
                  setSelectedDmLevel("ALL");
                }}
                className="text-[11px] text-[#C5A880] hover:underline ml-auto font-mono"
              >
                Reset Filters
              </button>
            )}
          </div>
        )}
      </Card>

      {/* Directory Table */}
      <Card className="border-[#1E2638] bg-[#10141E] overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-slate-500">
            Scanning UAE Prospect Registry...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-xs text-rose-400">{error}</div>
        ) : prospects.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No prospects matched your criteria</p>
            <p className="text-xs text-slate-500 mt-1">
              Add your first UAE Developer, Brokerage, or Agency to begin outbound execution.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              className="mt-3 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Add Prospect
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#1E2638] bg-[#0B0E14]/70 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Company & Location</th>
                  <th className="py-3 px-4">Segment</th>
                  <th className="py-3 px-4">Decision Maker</th>
                  <th className="py-3 px-4">Digital Footprint</th>
                  <th className="py-3 px-4">100-Pt Score</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4">Pipeline</th>
                  <th className="py-3 px-4 text-right">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638] text-slate-300">
                {prospects.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProspect(p)}
                    className="hover:bg-[#151B28]/60 cursor-pointer transition-colors"
                  >
                    {/* Company & Geo */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white flex items-center gap-1.5">
                        <span>{p.companyName}</span>
                        {p.geographicPriority === "PRIORITY_1" ? (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-[#B39266]/15 text-[#C5A880] border border-[#B39266]/30">P1</span>
                        ) : p.geographicPriority === "PRIORITY_2" ? (
                          <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-blue-950/30 text-blue-300 border border-blue-800/30">P2</span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span>{p.location || "Dubai, UAE"}</span>
                        {p.website && (
                          <a
                            href={p.website}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[#C5A880] hover:underline inline-flex items-center gap-0.5"
                          >
                            <Globe className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Segment */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getTypeBadge(p.companyType)}
                    </td>

                    {/* Decision Maker */}
                    <td className="py-3 px-4">
                      {p.contactName ? (
                        <div>
                          <div className="font-medium text-slate-200 flex items-center gap-1.5">
                            <span>{p.contactName}</span>
                            {getDmLevelBadge(p.decisionMakerLevel)}
                          </div>
                          <div className="text-[11px] text-slate-400">{p.jobTitle || "Decision Maker"}</div>
                        </div>
                      ) : (
                        <span className="text-slate-600 font-mono text-[11px]">Unidentified</span>
                      )}
                    </td>

                    {/* Digital Footprint */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div>{getMaturityBadge(p.digitalMaturity)}</div>
                        <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
                          <span className={p.hasWhatsappCta ? "text-emerald-400" : "text-slate-600"}>
                            {p.hasWhatsappCta ? "WA✓" : "WA✗"}
                          </span>
                          <span>·</span>
                          <span className={p.hasLeadForm ? "text-emerald-400" : "text-slate-600"}>
                            {p.hasLeadForm ? "Form✓" : "Form✗"}
                          </span>
                          <span>·</span>
                          <span className={p.hasLandingPage ? "text-emerald-400" : "text-slate-600"}>
                            {p.hasLandingPage ? "LP✓" : "LP✗"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 100-Pt Fit Score */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="font-mono text-xs font-bold text-[#C5A880] bg-[#B39266]/10 px-2 py-0.5 rounded border border-[#B39266]/20">
                          {p.leadScorePoints ?? 50}
                        </div>
                        {getScoreBadge(p.leadScore)}
                      </div>
                    </td>

                    {/* Outreach Readiness */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getReadinessBadge(p.outreachReadiness || "NEEDS_RESEARCH")}
                    </td>

                    {/* Pipeline Status */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(p.leadStatus)}
                        {p.dealValue ? (
                          <div className="font-mono text-[11px] text-emerald-300">
                            {formatCurrency(p.dealValue, "AED")}
                          </div>
                        ) : null}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProspect(p);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-[#1E2638] transition-colors"
                        aria-label="View prospect details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Detail Slide-Over Modal */}
      {selectedProspect && (
        <Modal
          isOpen={!!selectedProspect}
          onClose={() => setSelectedProspect(null)}
          title={selectedProspect.companyName}
          description={`Registered under ${selectedProspect.location || "Dubai, UAE"} · Segment: ${selectedProspect.companyType}`}
          className="max-w-3xl"
        >
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header Gate & Readiness Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border border-[#1E2638] bg-[#0B0E14]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">Outreach Gate:</span>
                {getReadinessBadge(selectedProspect.outreachReadiness || "NEEDS_RESEARCH")}
                {selectedProspect.disqualificationReason && (
                  <Badge variant="destructive" size="sm">
                    {selectedProspect.disqualificationReason.replace(/_/g, " ")}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>Priority:</span>
                {getScoreBadge(selectedProspect.leadScore)}
                <span className="font-bold text-[#C5A880]">{selectedProspect.leadScorePoints ?? 50}/100</span>
              </div>
            </div>

            {/* Section 1: Company Profile */}
            <div className="rounded border border-[#1E2638] bg-[#0B0E14] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> 1. Company Profile & Market Fit
                </span>
                <div className="flex items-center gap-1.5">
                  {selectedProspect.geographicPriority === "PRIORITY_1" && (
                    <Badge variant="gold" size="sm">Priority 1 (Dubai)</Badge>
                  )}
                  {getTypeBadge(selectedProspect.companyType)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Location:</span>{" "}
                  <span className="text-white">{selectedProspect.location || "Dubai, UAE"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Company Scale:</span>{" "}
                  <span className="text-white">{selectedProspect.companySize || "11-50 employees"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Primary Market:</span>{" "}
                  <span className="text-white">{selectedProspect.primaryMarket || "Dubai Off-Plan"}</span>
                </div>
                <div>
                  <span className="text-slate-500">Property Segment:</span>{" "}
                  <span className="text-white">{selectedProspect.propertySegment || "Residential"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500">Website:</span>{" "}
                  {selectedProspect.website ? (
                    <a
                      href={selectedProspect.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#C5A880] hover:underline inline-flex items-center gap-1"
                    >
                      {selectedProspect.website}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-slate-600">None recorded</span>
                  )}
                </div>
              </div>
              {selectedProspect.activeProjects && (
                <div className="text-xs pt-1.5 border-t border-[#1E2638]">
                  <span className="text-slate-500">Active Launches & Developments:</span>{" "}
                  <span className="text-slate-200 font-medium">{selectedProspect.activeProjects}</span>
                </div>
              )}
            </div>

            {/* Section 2: Key Decision Maker */}
            <div className="rounded border border-[#1E2638] bg-[#0B0E14] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" /> 2. Decision Maker & Authority
                </span>
                {getDmLevelBadge(selectedProspect.decisionMakerLevel)}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Name:</span>{" "}
                  <span className="font-semibold text-white">
                    {selectedProspect.contactName || "Unassigned"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Title:</span>{" "}
                  <span className="text-slate-200">{selectedProspect.jobTitle || "—"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="truncate">{selectedProspect.businessEmail || "No direct email"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                  <span>{selectedProspect.businessPhone || "No verified phone / WA"}</span>
                </div>
                {selectedProspect.linkedinProfile && (
                  <div className="col-span-2">
                    <a
                      href={selectedProspect.linkedinProfile}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#C5A880] hover:underline inline-flex items-center gap-1 text-xs"
                    >
                      <Linkedin className="w-3 h-3" />
                      <span>Verified LinkedIn Profile</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Section 3: Digital Presence & Funnel */}
            <div className="rounded border border-[#1E2638] bg-[#0B0E14] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 3. Digital Maturity & Funnel Health
                </span>
                {getMaturityBadge(selectedProspect.digitalMaturity)}
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] font-mono bg-[#10141E] p-2.5 rounded border border-[#1E2638]">
                <div>
                  <span className="text-slate-500 block">Funnel Structure</span>
                  <span className="text-white font-semibold">{selectedProspect.leadFunnelQuality}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Dedicated LP</span>
                  <span className={selectedProspect.hasLandingPage ? "text-emerald-400 font-semibold" : "text-slate-500"}>
                    {selectedProspect.hasLandingPage ? "YES" : "NO"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Ad Campaigns</span>
                  <span className="text-white font-semibold">{selectedProspect.visibleAdActivity}</span>
                </div>
              </div>
              {selectedProspect.personalizedOpportunity && (
                <div className="text-xs p-2.5 rounded bg-[#B39266]/10 border border-[#B39266]/20 text-slate-200">
                  <div className="font-semibold text-[#C5A880] mb-0.5">Identified AXTRAIT Opportunity:</div>
                  <p className="leading-relaxed">{selectedProspect.personalizedOpportunity}</p>
                </div>
              )}
            </div>

            {/* Section 4: 100-Point Transparent Fit Score */}
            <ScoreBreakdown
              scorePoints={selectedProspect.leadScorePoints ?? 50}
              scorePriority={selectedProspect.leadScore}
              breakdown={{
                icpFit: selectedProspect.icpFitScore ?? 0,
                marketFit: selectedProspect.marketFitScore ?? 0,
                leadDependency: selectedProspect.leadDependencyScore ?? 0,
                digitalOpportunity: selectedProspect.digitalOpportunityScore ?? 0,
                salesOperation: selectedProspect.salesOperationScore ?? 0,
                decisionMakerAccess: selectedProspect.decisionMakerAccessScore ?? 0,
              }}
              onRecalculate={handleRecalculateScore}
              isRecalculating={isRecalculating}
            />

            {/* Section 5: Positive Signals & Evidence Flags */}
            <div className="rounded border border-[#1E2638] bg-[#0B0E14] p-3.5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> 5. Evidence Signals & Opportunity Indicators
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedProspect.hasWhatsappCta && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-300 border border-emerald-800/30">
                    WHATSAPP_CTA
                  </span>
                )}
                {selectedProspect.hasLeadForm && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-300 border border-emerald-800/30">
                    LEAD_FORM
                  </span>
                )}
                {selectedProspect.hasLandingPage && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/30 text-emerald-300 border border-emerald-800/30">
                    DEDICATED_LANDING_PAGE
                  </span>
                )}
                {selectedProspect.activeProjects && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B39266]/15 text-[#C5A880] border border-[#B39266]/30">
                    ACTIVE_PROJECT
                  </span>
                )}
                {["META_AND_GOOGLE", "META_ONLY", "GOOGLE_ONLY"].includes(selectedProspect.visibleAdActivity) && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/30 text-blue-300 border border-blue-800/30">
                    ACTIVE_ADVERTISING
                  </span>
                )}
                {["TIER_1", "TIER_2"].includes(selectedProspect.decisionMakerLevel) && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B39266]/15 text-[#C5A880] border border-[#B39266]/30">
                    SENIOR_DECISION_MAKER_FOUND
                  </span>
                )}
              </div>
            </div>

            {/* Section 6: Outreach Readiness & Action Recommendation */}
            <div className="rounded border border-[#1E2638] bg-[#0B0E14] p-3.5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 6. Outreach Readiness & Recommended Next Step
              </span>
              <div className="p-2.5 rounded bg-[#10141E] border border-[#1E2638] text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Current Readiness:</span>
                  {getReadinessBadge(selectedProspect.outreachReadiness || "NEEDS_RESEARCH")}
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-1">
                  {selectedProspect.outreachReadiness === "READY"
                    ? "Sufficient verified research and decision maker access confirmed. Proceed with personalized multi-channel outreach."
                    : selectedProspect.outreachReadiness === "DO_NOT_CONTACT"
                    ? "This account has been flagged DO NOT CONTACT. Verify disqualification reasons before any outreach."
                    : "Insufficient intelligence or unverified contact channel. Conduct targeted LinkedIn research on marketing/sales leadership before initial contact."}
                </p>
              </div>
            </div>

            {/* Section 7: Pipeline & Commercial Telemetry */}
            <div className="rounded border border-[#1E2638] bg-[#0B0E14] p-3.5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> 7. Pipeline & Sales Telemetry
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Pipeline Status</span>
                  {getStatusBadge(selectedProspect.leadStatus)}
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Projected Deal</span>
                  <span className="font-mono text-emerald-400 font-semibold">
                    {selectedProspect.dealValue ? formatCurrency(selectedProspect.dealValue, "AED") : "—"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Outreach Channel</span>
                  <span className="text-slate-300 font-mono text-[11px]">
                    {selectedProspect.outreachChannel || "Not Set"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Registered Date</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {formatDate(selectedProspect.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Section 8: Qualification Summary & Notes */}
            {(selectedProspect.qualificationSummary || selectedProspect.salesNotes) && (
              <div className="rounded border border-[#1E2638] bg-[#0B0E14] p-3.5 space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" /> 8. Qualification Briefing & Notes
                </span>
                {selectedProspect.qualificationSummary && (
                  <div className="text-xs bg-[#10141E] p-2.5 rounded border border-[#1E2638]">
                    <div className="font-medium text-slate-300 mb-1">Qualification Brief:</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{selectedProspect.qualificationSummary}</p>
                  </div>
                )}
                {selectedProspect.salesNotes && (
                  <div className="text-xs bg-[#10141E] p-2.5 rounded border border-[#1E2638]">
                    <div className="font-medium text-slate-300 mb-1">Sales Notes:</div>
                    <p className="text-slate-400 leading-relaxed text-[11px]">{selectedProspect.salesNotes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedProspect(null)}>
                Close Prospect
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Create Prospect Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Add UAE Real Estate Prospect"
        description="Register a developer, brokerage, or agency into the outbound system with complete intelligence."
        className="max-w-2xl"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {createError && (
            <div className="p-2.5 rounded bg-rose-950/40 border border-rose-800/40 text-xs text-rose-300">
              {createError}
            </div>
          )}

          {/* Duplicate Detection Advisory Box */}
          {potentialDuplicates.length > 0 && !confirmedDuplicateBypass && (
            <div className="p-3 rounded border border-amber-500/40 bg-amber-950/20 text-xs text-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Possible Duplicate(s) Detected ({potentialDuplicates.length})</span>
              </div>
              <p className="text-[11px] text-amber-200/80">
                Similar records already exist in your registry. Review to avoid redundant outreach:
              </p>
              <div className="space-y-1.5 max-h-28 overflow-y-auto">
                {potentialDuplicates.map((dup) => (
                  <div key={dup.id} className="text-[11px] bg-[#0B0E14] p-2 rounded border border-[#1E2638] flex items-center justify-between">
                    <div>
                      <span className="font-medium text-white">{dup.companyName}</span>
                      <span className="text-slate-500 ml-1.5">({dup.companyType})</span>
                      <span className="text-slate-500 ml-1.5">· {dup.location || "Dubai"}</span>
                    </div>
                    <span className="text-[10px] text-amber-400 font-mono">{dup.matchReason}</span>
                  </div>
                ))}
              </div>
              <div className="pt-1 border-t border-amber-500/20">
                <label className="flex items-center gap-2 cursor-pointer text-[11px] text-slate-300">
                  <input
                    type="checkbox"
                    checked={confirmedDuplicateBypass}
                    onChange={(e) => setConfirmedDuplicateBypass(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-[#B39266]"
                  />
                  <span>I confirm this is a distinct business entity — proceed with creation</span>
                </label>
              </div>
            </div>
          )}

          {/* Section 1: Company */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">
              1. Company Profile
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Company Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Emaar, DAMAC, Driven"
                  value={formData.companyName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, companyName: val });
                    checkDuplicateCompany(val, formData.website);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Company Type *</label>
                <select
                  value={formData.companyType}
                  onChange={(e) => setFormData({ ...formData, companyType: e.target.value as CompanyType })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                >
                  <option value="DEVELOPER">Real Estate Developer</option>
                  <option value="BROKERAGE">Real Estate Brokerage</option>
                  <option value="AGENCY">Real Estate Agency</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.website}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData({ ...formData, website: val });
                    checkDuplicateCompany(formData.companyName, val);
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Location & Emirate</label>
                <input
                  type="text"
                  placeholder="e.g. Business Bay, Dubai, UAE"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Primary Market Focus</label>
                <input
                  type="text"
                  placeholder="e.g. Dubai Off-Plan, Luxury Palm"
                  value={formData.primaryMarket}
                  onChange={(e) => setFormData({ ...formData, primaryMarket: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Company Size</label>
                <select
                  value={formData.companySize}
                  onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                >
                  <option value="1-10">Small (1-10)</option>
                  <option value="11-50">Growing (11-50)</option>
                  <option value="51-200">Mid-Market (51-200)</option>
                  <option value="200+">Enterprise (200+)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Contact */}
          <div className="space-y-2 pt-2 border-t border-[#1E2638]">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">
              2. Key Decision Maker
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Contact Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Job Title</label>
                <input
                  type="text"
                  placeholder="Head of Sales, Managing Director"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Business Email</label>
                <input
                  type="email"
                  placeholder="decision-maker@company.ae"
                  value={formData.businessEmail}
                  onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Phone / WhatsApp (+971)</label>
                <input
                  type="text"
                  placeholder="+971 50 000 0000"
                  value={formData.businessPhone}
                  onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Digital Presence & Funnel */}
          <div className="space-y-2 pt-2 border-t border-[#1E2638]">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">
              3. Sales Research & Digital Presence
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 p-2 rounded border border-[#1E2638] bg-[#0B0E14] text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasLeadForm}
                  onChange={(e) => setFormData({ ...formData, hasLeadForm: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-[#B39266]"
                />
                <span>Lead Form Present</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded border border-[#1E2638] bg-[#0B0E14] text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasWhatsappCta}
                  onChange={(e) => setFormData({ ...formData, hasWhatsappCta: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-[#B39266]"
                />
                <span>WhatsApp CTA</span>
              </label>
              <label className="flex items-center gap-2 p-2 rounded border border-[#1E2638] bg-[#0B0E14] text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasLandingPage}
                  onChange={(e) => setFormData({ ...formData, hasLandingPage: e.target.checked })}
                  className="rounded border-slate-700 bg-slate-900 text-[#B39266]"
                />
                <span>Dedicated LP</span>
              </label>
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Identified AXTRAIT Opportunity</label>
              <textarea
                rows={2}
                placeholder="e.g. Current project launch lacks qualified WhatsApp funnel; ad campaigns route to slow general homepage."
                value={formData.personalizedOpportunity}
                onChange={(e) => setFormData({ ...formData, personalizedOpportunity: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
              />
            </div>
          </div>

          {/* Section 4: Target Value */}
          <div className="space-y-2 pt-2 border-t border-[#1E2638]">
            <h4 className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">
              4. Commercial Target
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Target Retainer / Deal (AED)</label>
                <input
                  type="number"
                  placeholder="50000"
                  value={formData.dealValue}
                  onChange={(e) => setFormData({ ...formData, dealValue: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Active Projects / Launches</label>
                <input
                  type="text"
                  placeholder="e.g. Marasi Bay, Palm Tower"
                  value={formData.activeProjects}
                  onChange={(e) => setFormData({ ...formData, activeProjects: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs rounded bg-[#0B0E14] border border-[#1E2638] text-white focus:outline-none focus:border-[#B39266]"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E2638]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isCreating || (potentialDuplicates.length > 0 && !confirmedDuplicateBypass)}
            >
              {isCreating ? "Saving Prospect..." : "Save Prospect"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

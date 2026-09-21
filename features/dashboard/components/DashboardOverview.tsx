"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import {
  Building2,
  ShieldCheck,
  Users,
  Layers,
  Settings,
  Shield,
  ArrowUpRight,
  Clock,
  Key,
  CheckCircle2,
  Lock,
  FileCheck2,
} from "lucide-react";
import { formatDate } from "@/utils/format";

export function DashboardOverview() {
  const { user } = useAuth();

  if (!user) return null;

  const currentOrg = user.currentOrganization;
  const currentRole = user.currentRole;

  // Real estate operational divisions under this enterprise tenant
  const operationalDivisions = [
    {
      code: "DXB-DT-01",
      name: "Downtown Dubai Commercial Operations",
      location: "Downtown Dubai / Burj Khalifa District",
      supervisionLevel: "Full Supervision",
      status: "Active",
    },
    {
      code: "DXB-DCH-02",
      name: "Dubai Creek Harbour Waterfront Sales",
      location: "Ras Al Khor / Creek Marina",
      supervisionLevel: "Full Supervision",
      status: "Active",
    },
    {
      code: "DXB-PJ-03",
      name: "Palm Jumeirah Ultra-Luxury Portfolio",
      location: "Palm Jumeirah Crescent",
      supervisionLevel: "Executive Clearance",
      status: "Active",
    },
    {
      code: "DXB-DHE-04",
      name: "Dubai Hills Estate Master Community",
      location: "Dubai Hills Estate / Al Khail Road",
      supervisionLevel: "Standard Operations",
      status: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Supervision Overview", current: true }]} />
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Supervision & Governance Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Phase 1 Foundation: Enterprise multi-tenant isolation, RBAC matrix, and Dubai real-estate operating parameters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/settings">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Settings className="w-3.5 h-3.5" />}
            >
              Workspace Settings
            </Button>
          </Link>
          <Link href="/settings/roles">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Shield className="w-3.5 h-3.5" />}
            >
              RBAC Explorer
            </Button>
          </Link>
        </div>
      </div>

      {/* Tenant Context Executive Banner */}
      <div className="rounded-lg border border-[#1E2638] bg-[#10141E] p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#151B28] text-[#C5A880] border border-[#232C42] shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">{currentOrg.name}</h2>
                <Badge variant="brass">Active Tenant</Badge>
                <Badge variant="neutral">Dubai Real Estate</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>
                  Workspace Slug: <span className="font-mono text-slate-300">{currentOrg.slug}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span>
                  Operating Currency: <span className="font-semibold text-[#C5A880]">{currentOrg.currency}</span>
                </span>
                <span className="text-slate-600">•</span>
                <span>
                  Jurisdiction: <span className="text-slate-300">Dubai, United Arab Emirates</span>
                </span>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                {currentOrg.taxNumber ? (
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>UAE TRN:</span>
                    <span className="font-mono text-slate-200">{currentOrg.taxNumber}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#C5A880]">
                    <span>UAE TRN: Pending configuration in Workspace Settings</span>
                  </span>
                )}
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>DLD Regulatory Compliance: Verified</span>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start md:self-center border-t md:border-t-0 md:border-l border-[#1E2638] pt-3 md:pt-0 md:pl-6">
            <div className="text-left md:text-right">
              <p className="text-xs font-semibold text-slate-200">
                {user.firstName} {user.lastName}
              </p>
              <div className="flex items-center md:justify-end gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="text-xs font-medium text-[#C5A880]">{currentRole.name}</span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 mt-1">
                SESSION ENCRYPTED (JWT)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Telemetry & KPI Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tenant Boundary</p>
              <Lock className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="mt-2">
              <p className="text-base sm:text-lg font-bold text-white truncate">{currentOrg.name}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <p className="text-[11px] text-slate-400 font-mono truncate">
                  Row-Level Org Scoping Enforced
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Granted Capabilities</p>
              <Key className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="mt-2">
              <p className="text-base sm:text-lg font-bold text-white tabular-nums">
                {currentRole.permissions.length} <span className="text-xs font-normal text-slate-400">capabilities</span>
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-1">
                Role: {currentRole.slug}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Authorized Portfolios</p>
              <Users className="w-4 h-4 text-[#C5A880]" />
            </div>
            <div className="mt-2">
              <p className="text-base sm:text-lg font-bold text-white tabular-nums">
                {user.memberships.length} <span className="text-xs font-normal text-slate-400">organizations</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Isolated context switching
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Foundation Stage</p>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <p className="text-base sm:text-lg font-bold text-emerald-400">Phase 1 Operational</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Session Active • Protected
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Operational Real Estate Divisions Supervision Footprint */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle>Supervised Business Divisions & Sales Operations</CardTitle>
              <CardDescription>
                Corporate sales units and geographical territories configured under this tenant entity.
              </CardDescription>
            </div>
            <Badge variant="neutral">Dubai Territory</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#0B0E14] border-b border-[#1E2638] text-[10px] uppercase font-mono tracking-wider text-slate-400">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Division Code</th>
                  <th className="py-2.5 px-4 font-semibold">Division / Territory Name</th>
                  <th className="py-2.5 px-4 font-semibold">Location</th>
                  <th className="py-2.5 px-4 font-semibold">Supervision Clearance</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2638] bg-[#10141E]">
                {operationalDivisions.map((division) => (
                  <tr key={division.code} className="hover:bg-[#151B28]/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-300">{division.code}</td>
                    <td className="py-3 px-4 font-medium text-slate-100">{division.name}</td>
                    <td className="py-3 px-4 text-slate-400">{division.location}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center rounded bg-[#151B28] px-2 py-0.5 text-[10px] font-mono text-slate-300 border border-[#232C42]">
                        {division.supervisionLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        {division.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t border-[#1E2638] bg-[#0B0E14]/40 text-[11px] text-slate-500">
            Phase 2 will bind authorized sales teams, team leaders, and agents directly to these supervised operational divisions.
          </div>
        </CardContent>
      </Card>

      {/* Two Columns: Tenant Isolation Model & RBAC Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Multi-Tenant Isolation Model */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C5A880]" />
                <CardTitle>Multi-Tenant Isolation Architecture</CardTitle>
              </div>
              <Badge variant="success">Enforced</Badge>
            </div>
            <CardDescription>
              Every database entity and API endpoint enforces strict organization boundary scoping.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-[#0B0E14] p-3.5 border border-[#1E2638] space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Active Tenant ID:</span>
                <span className="font-mono text-slate-200">{currentOrg.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Session User ID:</span>
                <span className="font-mono text-slate-200">{user.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Operating Currency:</span>
                <span className="font-semibold text-[#C5A880]">{currentOrg.currency} (AED)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Regulatory Anchor:</span>
                <span className="font-mono text-slate-300">Dubai DLD / RERA Compliance</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Timezone Anchor:</span>
                <span className="font-mono text-slate-300">{currentOrg.timezone} (UTC+4)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Workspace Member Since:</span>
                <span className="text-slate-300">{formatDate(currentOrg.createdAt)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              When switching organizations, users receive an independently signed JWT with verified database membership. Cross-tenant leakage is stopped at both the Next.js edge middleware and server route guards with <code>TENANT_ACCESS_DENIED</code>.
            </p>
          </CardContent>
        </Card>

        {/* Right: Active Role Capabilities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <CardTitle>Active Role Capabilities</CardTitle>
              </div>
              <Link href="/settings/roles" className="text-xs text-[#C5A880] hover:underline inline-flex items-center gap-1">
                <span>Full Matrix</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <CardDescription>
              Permissions currently granted under the <strong className="text-slate-200">{currentRole.name}</strong> role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {currentRole.permissions.map((perm) => (
                <span
                  key={perm}
                  className="rounded bg-[#0B0E14] border border-[#1E2638] px-2 py-1 text-[11px] font-mono text-slate-300"
                >
                  {perm}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#1E2638] flex items-center justify-between text-xs text-slate-400">
              <span>Extensible RBAC System</span>
              <span className="text-[#C5A880] font-medium">Ready for Phase 2 Teams</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Roadmap Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Development Roadmap & Architecture Stages</CardTitle>
          <CardDescription>
            Strict phased execution ensuring robust architecture, full multi-tenant isolation, and zero premature code bloat.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 rounded-lg border border-emerald-500/40 bg-emerald-950/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-emerald-400">Phase 1 (Current)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="font-semibold text-slate-200">Foundation & Architecture</p>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                App Shell, Design Tokens, Prisma DB, Auth, Multi-Tenancy, RBAC, Validation & Error Handling.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#1E2638] bg-[#0B0E14]/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-400">Phase 2</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Scheduled</span>
              </div>
              <p className="font-medium text-slate-300">Users & Teams</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                User management, sales team hierarchies, team leaders, user profiles.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#1E2638] bg-[#0B0E14]/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-400">Phase 3</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Scheduled</span>
              </div>
              <p className="font-medium text-slate-300">Lead Management</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Lead sources, broker assignments, buyer pipelines, activity timeline.
              </p>
            </div>

            <div className="p-3.5 rounded-lg border border-[#1E2638] bg-[#0B0E14]/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-slate-400">Phases 4 - 11</span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">Roadmap</span>
              </div>
              <p className="font-medium text-slate-300">Supervision Modules</p>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Tasks, Projects, Units, Inventory, Bookings, Supervision Reports, Integrations & Hardening.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

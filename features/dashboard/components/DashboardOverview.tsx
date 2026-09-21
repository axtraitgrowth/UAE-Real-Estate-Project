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
} from "lucide-react";
import { formatDate } from "@/utils/format";

export function DashboardOverview() {
  const { user } = useAuth();

  if (!user) return null;

  const currentOrg = user.currentOrganization;
  const currentRole = user.currentRole;

  return (
    <div className="space-y-6">
      {/* Top Header & Breadcrumbs */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Breadcrumbs items={[{ label: "Supervision Overview", current: true }]} />
          <h1 className="text-xl font-bold tracking-tight text-white mt-1">
            Supervision Overview & Architecture
          </h1>
          <p className="text-xs text-slate-400">
            Phase 1 Foundation: Multi-Tenant Workspace, Role-Based Access Control & Application Shell.
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
              variant="gold"
              size="sm"
              leftIcon={<Shield className="w-3.5 h-3.5" />}
            >
              RBAC Explorer
            </Button>
          </Link>
        </div>
      </div>

      {/* Tenant Context Banner */}
      <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/20 via-[#0F1420] to-[#0F1420] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{currentOrg.name}</h2>
                <Badge variant="gold">Active Tenant</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Workspace Slug: <span className="font-mono text-slate-300">{currentOrg.slug}</span> • Currency:{" "}
                <span className="font-semibold text-amber-400">{currentOrg.currency}</span> • Jurisdiction:{" "}
                <span className="text-slate-300">Dubai, United Arab Emirates</span>
              </p>
              {currentOrg.taxNumber ? (
                <p className="text-xs text-slate-400">
                  UAE TRN: <span className="font-mono text-slate-300">{currentOrg.taxNumber}</span>
                </p>
              ) : (
                <p className="text-xs text-amber-400/80">
                  ⚠️ UAE TRN not configured in workspace settings
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto border-t md:border-t-0 border-slate-800 pt-3 md:pt-0">
            <div className="text-right">
              <p className="text-xs font-medium text-slate-300">
                {user.firstName} {user.lastName}
              </p>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-semibold text-amber-400">{currentRole.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric / Foundation Status Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400">Active Tenant</p>
              <Building2 className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-white truncate">{currentOrg.name}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                ID: {currentOrg.id}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400">Granted Permissions</p>
              <Key className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-white">
                {currentRole.permissions.length} <span className="text-xs font-normal text-slate-400">capabilities</span>
              </p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                Role: {currentRole.slug}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400">Available Workspaces</p>
              <Users className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-white">
                {user.memberships.length} <span className="text-xs font-normal text-slate-400">organizations</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Multi-tenant isolated
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-400">Foundation Status</p>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <p className="text-lg font-bold text-emerald-400">Phase 1 Operational</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Session Active • Protected
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Columns: Tenant Isolation & RBAC Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Multi-Tenant Isolation Model */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <CardTitle>Multi-Tenant Isolation Architecture</CardTitle>
              </div>
              <Badge variant="success">Enforced</Badge>
            </div>
            <CardDescription>
              Every database entity and API endpoint enforces organization boundary isolation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-md bg-slate-900/60 p-3 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Tenant ID:</span>
                <span className="font-mono text-slate-200">{currentOrg.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Session User ID:</span>
                <span className="font-mono text-slate-200">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Default Currency:</span>
                <span className="font-semibold text-amber-400">{currentOrg.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timezone Anchor:</span>
                <span className="font-mono text-slate-300">{currentOrg.timezone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Workspace Member Since:</span>
                <span className="text-slate-300">{formatDate(currentOrg.createdAt)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Users switching organizations via the workspace switcher are issued freshly signed session tokens with verified database membership records. Unauthorized cross-tenant queries are blocked with <code>TENANT_ACCESS_DENIED</code>.
            </p>
          </CardContent>
        </Card>

        {/* Right: Active Role Capabilities */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <CardTitle>Active Role Capabilities</CardTitle>
              </div>
              <Link href="/settings/roles" className="text-xs text-amber-400 hover:underline inline-flex items-center gap-1">
                <span>View Full Matrix</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <CardDescription>
              Permissions currently granted under the <strong className="text-slate-200">{currentRole.name}</strong> role.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
              {currentRole.permissions.map((perm) => (
                <span
                  key={perm}
                  className="rounded bg-slate-900 border border-slate-800 px-2 py-1 text-[11px] font-mono text-slate-300"
                >
                  {perm}
                </span>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Extensible RBAC System</span>
              <span className="text-amber-400 font-medium">Ready for Phase 2 Teams</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Roadmap Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Development Roadmap & Architecture Stages</CardTitle>
          <CardDescription>
            Controlled phased execution ensuring strict separation of concerns, zero code duplication, and stable architecture.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-emerald-400">Phase 1 (Current)</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="font-medium text-slate-200">Foundation & Architecture</p>
              <p className="text-[11px] text-slate-400 mt-1">
                Shell, Design System, Database, Auth, Multi-Tenancy, RBAC, Validation, Error Handling.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 opacity-75">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-400">Phase 2</span>
                <span className="text-[10px] font-mono text-slate-500">Upcoming</span>
              </div>
              <p className="font-medium text-slate-300">Users & Teams</p>
              <p className="text-[11px] text-slate-500 mt-1">
                User management, sales team hierarchies, team leaders, user profiles.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 opacity-75">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-400">Phase 3</span>
                <span className="text-[10px] font-mono text-slate-500">Upcoming</span>
              </div>
              <p className="font-medium text-slate-300">Lead Management</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Lead sources, broker assignments, buyer pipelines, activity timeline.
              </p>
            </div>

            <div className="p-3 rounded-lg border border-slate-800 bg-slate-900/40 opacity-75">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-slate-400">Phases 4 - 11</span>
                <span className="text-[10px] font-mono text-slate-500">Scheduled</span>
              </div>
              <p className="font-medium text-slate-300">Complete Supervision OS</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Tasks, Projects, Units, Inventory, Bookings, Supervision Reports, Integrations & Hardening.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/Table";
import { Building2, Shield, User, Check, Minus } from "lucide-react";
import { SYSTEM_ROLES, SYSTEM_PERMISSIONS } from "@/config/permissions";
import { SystemPermissionCode } from "@/types/rbac";

export default function RolesSettingsPage() {
  const [selectedRole, setSelectedRole] = useState(SYSTEM_ROLES[0].slug);
  const [filterModule, setFilterModule] = useState<string>("all");

  const modules = Array.from(new Set(SYSTEM_PERMISSIONS.map((p) => p.module)));

  const filteredPermissions =
    filterModule === "all"
      ? SYSTEM_PERMISSIONS
      : SYSTEM_PERMISSIONS.filter((p) => p.module === filterModule);

  const activeRoleDefinition = SYSTEM_ROLES.find((r) => r.slug === selectedRole) || SYSTEM_ROLES[0];

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Settings", href: "/settings" },
            { label: "Roles & Permissions", current: true },
          ]}
        />
        <h1 className="text-xl font-bold tracking-tight text-white mt-1">
          Role-Based Access Control (RBAC) Architecture
        </h1>
        <p className="text-xs text-slate-400">
          Inspect role hierarchies, security clearance levels, and granular system permission scopes.
        </p>
      </div>

      {/* Settings Subnavigation */}
      <div className="flex border-b border-[#1E2638] space-x-6">
        <Link
          href="/settings"
          className="flex items-center gap-2 border-b-2 border-transparent py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Organization Profile</span>
        </Link>
        <Link
          href="/settings/roles"
          className="flex items-center gap-2 border-b-2 border-[#B39266] py-2.5 text-xs font-semibold text-[#C5A880]"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Roles & Permissions</span>
        </Link>
        <Link
          href="/settings/profile"
          className="flex items-center gap-2 border-b-2 border-transparent py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200"
        >
          <User className="w-3.5 h-3.5" />
          <span>My User Profile</span>
        </Link>
      </div>

      {/* Role Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SYSTEM_ROLES.map((role) => {
          const isSelected = role.slug === selectedRole;
          return (
            <button
              key={role.slug}
              onClick={() => setSelectedRole(role.slug)}
              className={`flex flex-col items-start rounded-md border p-3 text-left transition-colors ${
                isSelected
                  ? "border-[#B39266] bg-[#B39266]/15 text-white shadow-sm"
                  : "border-[#1E2638] bg-[#10141E] text-slate-400 hover:border-[#28334A] hover:text-slate-200"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <span className="text-xs font-bold truncate">{role.name.split("/")[0]}</span>
                {role.isSystem && (
                  <span className="text-[9px] font-mono uppercase text-slate-500">SYS</span>
                )}
              </div>
              <span className="text-[10px] text-[#C5A880] font-mono mt-1">
                {role.permissions.length} perms
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Role Detail Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>{activeRoleDefinition.name}</CardTitle>
                <Badge variant="brass">System Role</Badge>
              </div>
              <CardDescription className="mt-1">
                {activeRoleDefinition.description}
              </CardDescription>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-[#C5A880] tabular-nums">
                {activeRoleDefinition.permissions.length} of {SYSTEM_PERMISSIONS.length} Permissions
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Module Filter Pills */}
          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-semibold text-slate-400 mr-2 uppercase tracking-wider font-mono">
              Filter Module:
            </span>
            <button
              onClick={() => setFilterModule("all")}
              className={`rounded px-2.5 py-1 text-xs font-medium transition-colors ${
                filterModule === "all"
                  ? "bg-[#B39266] text-[#0B0E14] font-semibold"
                  : "bg-[#151B28] text-slate-400 border border-[#232C42] hover:bg-[#1B2233] hover:text-slate-200"
              }`}
            >
              All ({SYSTEM_PERMISSIONS.length})
            </button>
            {modules.map((mod) => {
              const count = SYSTEM_PERMISSIONS.filter((p) => p.module === mod).length;
              return (
                <button
                  key={mod}
                  onClick={() => setFilterModule(mod)}
                  className={`rounded px-2.5 py-1 text-xs font-medium uppercase font-mono transition-colors ${
                    filterModule === mod
                      ? "bg-[#B39266] text-[#0B0E14] font-semibold"
                      : "bg-[#151B28] text-slate-400 border border-[#232C42] hover:bg-[#1B2233] hover:text-slate-200"
                  }`}
                >
                  {mod} ({count})
                </button>
              );
            })}
          </div>

          {/* Permissions Matrix Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16 text-center">Status</TableHead>
                <TableHead className="w-48">Permission Code</TableHead>
                <TableHead className="w-28">Module</TableHead>
                <TableHead>Capability Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPermissions.map((perm) => {
                const isGranted = activeRoleDefinition.permissions.includes(
                  perm.code as SystemPermissionCode
                );
                return (
                  <TableRow key={perm.code}>
                    <TableCell className="text-center">
                      {isGranted ? (
                        <div className="inline-flex h-5 w-5 items-center justify-center rounded bg-emerald-950/40 text-emerald-300 border border-emerald-700/40">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="inline-flex h-5 w-5 items-center justify-center rounded bg-[#151B28] text-slate-600 border border-[#232C42]">
                          <Minus className="w-3 h-3" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-[#C5A880] font-medium">
                      {perm.code}
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-[#151B28] border border-[#232C42] px-2 py-0.5 text-[10px] font-mono uppercase text-slate-300">
                        {perm.module}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="text-xs text-slate-200 font-medium">{perm.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{perm.description}</p>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

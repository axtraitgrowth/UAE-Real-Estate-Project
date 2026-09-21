"use client";

import React from "react";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { OrgSettingsForm } from "@/features/organization/components/OrgSettingsForm";
import { Building2, Shield, User } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Settings", href: "/settings" },
            { label: "Organization Profile", current: true },
          ]}
        />
        <h1 className="text-xl font-bold tracking-tight text-white mt-1">
          Settings & Workspace Administration
        </h1>
        <p className="text-xs text-slate-400">
          Configure organization identity, tax registration, and multi-tenant policies.
        </p>
      </div>

      {/* Settings Subnavigation */}
      <div className="flex border-b border-[#1E2638] space-x-6">
        <Link
          href="/settings"
          className="flex items-center gap-2 border-b-2 border-[#B39266] py-2.5 text-xs font-semibold text-[#C5A880]"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Organization Profile</span>
        </Link>
        <Link
          href="/settings/roles"
          className="flex items-center gap-2 border-b-2 border-transparent py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200"
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

      <OrgSettingsForm />
    </div>
  );
}

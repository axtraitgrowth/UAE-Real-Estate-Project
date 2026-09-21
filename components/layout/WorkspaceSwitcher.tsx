"use client";

import React, { useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Dropdown } from "@/components/ui/Dropdown";
import { Building2, Check, ChevronsUpDown, ShieldCheck } from "lucide-react";

export function WorkspaceSwitcher() {
  const { user, switchOrganization } = useAuth();
  const [isSwitching, setIsSwitching] = useState(false);

  if (!user) return null;

  const currentOrg = user.currentOrganization;
  const memberships = user.memberships;

  const handleSelect = async (orgId: string) => {
    if (orgId === currentOrg.id || isSwitching) return;
    try {
      setIsSwitching(true);
      await switchOrganization(orgId);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <Dropdown
      align="left"
      trigger={
        <button
          type="button"
          disabled={isSwitching}
          className="flex items-center gap-2.5 rounded-md border border-[#1E2638] bg-[#10141E] px-3 py-1.5 text-left text-xs transition-colors hover:border-[#28334A] focus:outline-none focus:ring-1 focus:ring-[#B39266]/40"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded bg-[#151B28] text-[#C5A880] border border-[#232C42] shrink-0">
            <Building2 className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0 max-w-[140px] sm:max-w-[180px]">
            <span className="truncate font-semibold text-slate-100">{currentOrg.name}</span>
            <span className="truncate text-[10px] text-[#C5A880] flex items-center gap-1">
              <ShieldCheck className="w-2.5 h-2.5" />
              {user.currentRole.name}
            </span>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
        </button>
      }
    >
      <div className="p-2">
        <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Your Organizations
        </p>
        <div className="mt-1 space-y-1">
          {memberships.map((membership) => {
            const isSelected = membership.organizationId === currentOrg.id;
            return (
              <button
                key={membership.id}
                onClick={() => handleSelect(membership.organizationId)}
                className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-2 text-xs transition-colors hover:bg-[#151B28] text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <div className="truncate">
                    <p className="font-medium text-slate-200 truncate">{membership.organizationName}</p>
                    <p className="text-[10px] text-slate-500">{membership.roleName}</p>
                  </div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#C5A880] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
    </Dropdown>
  );
}

"use client";

import React, { useState } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { Building2, Save, ShieldAlert } from "lucide-react";
import { ApiResponse } from "@/types/api";
import { OrganizationSummary } from "@/types/organization";

export function OrgSettingsForm() {
  const { user, can, refreshUser } = useAuth();

  const currentOrg = user?.currentOrganization;
  const canManage = can("org.manage");

  const [name, setName] = useState(currentOrg?.name || "");
  const [phone, setPhone] = useState(currentOrg?.phone || "");
  const [address, setAddress] = useState(currentOrg?.address || "");
  const [taxNumber, setTaxNumber] = useState(currentOrg?.taxNumber || "");
  const [currency] = useState(currentOrg?.currency || "AED");
  const [timezone] = useState(currentOrg?.timezone || "Asia/Dubai");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!currentOrg) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;

    try {
      setIsLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const res = await fetch(`/api/organizations/${currentOrg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone: phone || null,
          address: address || null,
          taxNumber: taxNumber || null,
          currency,
          timezone,
        }),
      });

      const json: ApiResponse<OrganizationSummary> = await res.json();

      if (!json.success) {
        setErrorMessage(json.error.message);
        return;
      }

      setSuccessMessage("Organization settings saved successfully.");
      await refreshUser();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update organization");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#151B28] text-[#C5A880] border border-[#232C42]">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <CardTitle>Organization Workspace Profile</CardTitle>
              <CardDescription>
                Supervise company identity, UAE Tax Registration Number (TRN), and localization.
              </CardDescription>
            </div>
          </div>
          <Badge variant={canManage ? "brass" : "neutral"}>
            {canManage ? "Editor" : "Read-Only"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        {successMessage && (
          <div className="mb-4">
            <Alert variant="success" onDismiss={() => setSuccessMessage(null)}>
              {successMessage}
            </Alert>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4">
            <Alert variant="destructive" onDismiss={() => setErrorMessage(null)}>
              {errorMessage}
            </Alert>
          </div>
        )}

        {!canManage && (
          <div className="mb-4">
            <Alert variant="info">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>You have read-only access to organization settings. Managing requires the <code>org.manage</code> permission.</span>
              </div>
            </Alert>
          </div>
        )}

        <form id="org-settings-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Legal Organization Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!canManage || isLoading}
              required
            />

            <Input
              label="UAE Tax Registration Number (15-digit TRN)"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              placeholder="100XXXXXXXXX003"
              disabled={!canManage || isLoading}
              helperText="Required on official UAE booking tokens and tax invoices"
            />

            <Input
              label="Corporate Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+971 4 XXX XXXX"
              disabled={!canManage || isLoading}
            />

            <Input
              label="Headquarters Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Downtown Dubai, UAE"
              disabled={!canManage || isLoading}
            />

            <Input
              label="Default Currency"
              value={currency}
              disabled={true}
              helperText="Locked to UAE Dirham (AED)"
            />

            <Input
              label="Operational Timezone"
              value={timezone}
              disabled={true}
              helperText="Locked to Gulf Standard Time (Asia/Dubai)"
            />
          </div>
        </form>
      </CardContent>

      {canManage && (
        <CardFooter className="justify-end">
          <Button
            type="submit"
            form="org-settings-form"
            variant="primary"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Changes
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

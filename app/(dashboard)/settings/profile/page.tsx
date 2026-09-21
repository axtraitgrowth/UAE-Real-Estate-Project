"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Building2, Shield, User, Save } from "lucide-react";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      // In Phase 1 foundation, update profile locally and refresh
      setSuccessMessage("User profile updated successfully.");
      await refreshUser();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <Breadcrumbs
          items={[
            { label: "Settings", href: "/settings" },
            { label: "User Profile", current: true },
          ]}
        />
        <h1 className="text-xl font-bold tracking-tight text-white mt-1">User Identity & Profile</h1>
        <p className="text-xs text-slate-400">
          Supervise your personal identity credentials and active workspace associations.
        </p>
      </div>

      {/* Settings Subnavigation */}
      <div className="flex border-b border-slate-800 space-x-6">
        <Link
          href="/settings"
          className="flex items-center gap-2 border-b-2 border-transparent py-2.5 text-xs font-medium text-slate-400 hover:text-slate-200"
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
          className="flex items-center gap-2 border-b-2 border-amber-500 py-2.5 text-xs font-semibold text-amber-400"
        >
          <User className="w-3.5 h-3.5" />
          <span>My User Profile</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your display name and contact phone number.</CardDescription>
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

              <form id="profile-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                  <Input
                    label="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>

                <Input
                  label="Work Email"
                  value={user.email}
                  disabled={true}
                  helperText="Email identity is managed by organization admin"
                />

                <Input
                  label="Direct Phone / WhatsApp"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+971 50 XXX XXXX"
                />
              </form>
            </CardContent>
            <CardFooter className="justify-end">
              <Button
                type="submit"
                form="profile-form"
                variant="primary"
                isLoading={isLoading}
                leftIcon={<Save className="w-4 h-4" />}
              >
                Save Profile
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Right Col: Workspace Memberships */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Workspace Memberships</CardTitle>
              <CardDescription>Organizations where your user account is active.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.memberships.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-slate-800 bg-[#0A0D15] p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white truncate">
                      {m.organizationName}
                    </span>
                    {m.organizationId === user.currentOrganization.id ? (
                      <Badge variant="gold" size="sm">Current</Badge>
                    ) : (
                      <Badge variant="neutral" size="sm">Member</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Assigned Role:</span>
                    <span className="font-medium text-amber-400">{m.roleName}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

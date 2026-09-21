"use client";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { SystemPermissionCode } from "@/types/rbac";

export interface CanProps {
  permission: SystemPermissionCode;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const { can, isLoading } = useAuth();

  if (isLoading) return null;

  if (can(permission)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

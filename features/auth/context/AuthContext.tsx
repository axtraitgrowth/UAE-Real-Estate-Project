"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthenticatedUser } from "@/types/auth";
import { SystemPermissionCode } from "@/types/rbac";
import { hasPermission as checkPermission } from "@/lib/rbac/permissions";
import { ApiResponse } from "@/types/api";

interface AuthContextType {
  user: AuthenticatedUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  switchOrganization: (organizationId: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
  can: (permission: SystemPermissionCode) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/me", { cache: "no-store" });
      const json: ApiResponse<AuthenticatedUser> = await res.json();

      if (json.success) {
        setUser(json.data);
        setError(null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json: ApiResponse<AuthenticatedUser> = await res.json();

      if (!json.success) {
        setError(json.error.message);
        return false;
      }

      setUser(json.data);
      router.push("/dashboard");
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const switchOrganization = async (organizationId: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/switch-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });

      const json: ApiResponse<AuthenticatedUser> = await res.json();

      if (!json.success) {
        setError(json.error.message);
        return false;
      }

      setUser(json.data);
      router.refresh();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to switch organization");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const can = (permission: SystemPermissionCode): boolean => {
    if (!user) return false;
    if (user.isSuperAdmin) return true;
    return checkPermission(user.currentRole.permissions, permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        error,
        login,
        logout,
        switchOrganization,
        refreshUser,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

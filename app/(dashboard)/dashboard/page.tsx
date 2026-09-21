import { DashboardOverview } from "@/features/dashboard/components/DashboardOverview";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supervision Overview",
  description: "Phase 1 Foundation: Multi-Tenant Workspace, Role-Based Access Control & Application Shell",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}

import { ProspectsDirectory } from "@/features/prospects/components/ProspectsDirectory";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prospect Engine | UAE Real Estate Outbound",
  description: "Targeted outreach engine for UAE Real Estate Developers, Brokerages, and Agencies",
};

export default function ProspectsPage() {
  return <ProspectsDirectory />;
}

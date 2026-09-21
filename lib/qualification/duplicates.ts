/**
 * AXTRAIT — Phase 3 Step 2
 * Duplicate Detection Engine
 * Advisory-only: returns potential duplicates, never silently merges
 */

import { prisma } from "@/lib/db/client";

export interface DuplicateCheckInput {
  companyName: string;
  website?: string | null;
  linkedinCompanyUrl?: string | null;
  businessEmail?: string | null;
}

export interface ProspectDuplicate {
  id: string;
  companyName: string;
  location: string | null;
  companyType: string;
  leadStatus: string;
  matchReason: string;
}

/** Extract root domain from a URL string, returns null if invalid */
function extractDomain(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const raw = url.startsWith("http") ? url : `https://${url}`;
    const hostname = new URL(raw).hostname.replace(/^www\./, "");
    return hostname.toLowerCase();
  } catch {
    return null;
  }
}

/** Extract email domain from an email string */
function extractEmailDomain(email: string | null | undefined): string | null {
  if (!email || !email.includes("@")) return null;
  return email.split("@")[1].toLowerCase();
}

export async function findPotentialDuplicates(
  organizationId: string,
  input: DuplicateCheckInput
): Promise<ProspectDuplicate[]> {
  const duplicates: ProspectDuplicate[] = [];
  const seenIds = new Set<string>();

  const addIfNew = (record: { id: string; companyName: string; location: string | null; companyType: string; leadStatus: string }, reason: string) => {
    if (!seenIds.has(record.id)) {
      seenIds.add(record.id);
      duplicates.push({ ...record, matchReason: reason });
    }
  };

  // 1. Company name similarity (case-insensitive contains)
  const nameMatches = await prisma.prospect.findMany({
    where: {
      organizationId,
      companyName: { contains: input.companyName.slice(0, 20) },
    },
    select: { id: true, companyName: true, location: true, companyType: true, leadStatus: true },
    take: 5,
  });
  nameMatches.forEach((m) => addIfNew(m, `Similar company name: "${m.companyName}"`));

  // 2. Website domain match
  const websiteDomain = extractDomain(input.website);
  if (websiteDomain) {
    const allProspects = await prisma.prospect.findMany({
      where: { organizationId, website: { not: null } },
      select: { id: true, companyName: true, location: true, companyType: true, leadStatus: true, website: true },
      take: 200,
    });
    allProspects.forEach((p) => {
      if (extractDomain(p.website) === websiteDomain) {
        addIfNew(p, `Same website domain: ${websiteDomain}`);
      }
    });
  }

  // 3. LinkedIn company URL exact match
  if (input.linkedinCompanyUrl) {
    const linkedinMatches = await prisma.prospect.findMany({
      where: { organizationId, linkedinCompanyUrl: input.linkedinCompanyUrl },
      select: { id: true, companyName: true, location: true, companyType: true, leadStatus: true },
      take: 5,
    });
    linkedinMatches.forEach((m) => addIfNew(m, "Identical LinkedIn company URL"));
  }

  // 4. Business email domain match
  const emailDomain = extractEmailDomain(input.businessEmail);
  if (emailDomain && !isGenericEmailProvider(emailDomain)) {
    const allWithEmails = await prisma.prospect.findMany({
      where: { organizationId, businessEmail: { not: null } },
      select: { id: true, companyName: true, location: true, companyType: true, leadStatus: true, businessEmail: true },
      take: 200,
    });
    allWithEmails.forEach((p) => {
      if (extractEmailDomain(p.businessEmail) === emailDomain) {
        addIfNew(p, `Same business email domain: @${emailDomain}`);
      }
    });
  }

  return duplicates;
}

const GENERIC_PROVIDERS = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "protonmail.com"];
function isGenericEmailProvider(domain: string): boolean {
  return GENERIC_PROVIDERS.includes(domain.toLowerCase());
}

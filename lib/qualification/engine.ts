/**
 * AXTRAIT — Phase 3 Step 2
 * UAE Real Estate ICP Qualification Engine
 * 100-point scoring system — pure functions, no DB access
 */

export interface ScoringInput {
  companyType?: string | null;
  companySize?: string | null;
  location?: string | null;
  website?: string | null;
  activeProjects?: string | null;
  jobTitle?: string | null;
  linkedinProfile?: string | null;
  businessEmail?: string | null;
  decisionMakerLevel?: string | null;
  websiteQuality?: string | null;
  leadFunnelQuality?: string | null;
  hasLandingPage?: boolean | null;
  hasLeadForm?: boolean | null;
  hasWhatsappCta?: boolean | null;
  visibleAdActivity?: string | null;
  crmVisibility?: string | null;
  positiveSignals?: string | null;
  disqualificationReason?: string | null;
}

export interface ScoreBreakdown {
  icpFit: number;
  marketFit: number;
  leadDependency: number;
  digitalOpportunity: number;
  salesOperation: number;
  decisionMakerAccess: number;
  total: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  reasons: string[];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function hasText(val: string | null | undefined): boolean {
  return typeof val === "string" && val.trim().length > 0;
}

function locContains(location: string | null | undefined, keyword: string): boolean {
  if (!location) return false;
  return location.toLowerCase().includes(keyword.toLowerCase());
}

export function parseSignals(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function calculateIcpFitScore(input: ScoringInput): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  switch (input.companyType) {
    case "DEVELOPER":
      reasons.push("Primary ICP: Real estate developer (30/30)");
      return { score: 30, reasons };
    case "BROKERAGE":
      reasons.push("Strong ICP: Real estate brokerage (26/30)");
      return { score: 26, reasons };
    case "AGENCY":
      reasons.push("Valid ICP: Real estate agency (22/30)");
      return { score: 22, reasons };
    default:
      reasons.push("Company segment not identified — ICP fit unverifiable (0/30)");
      return { score: 0, reasons };
  }
}

export function calculateMarketFitScore(input: ScoringInput): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  if (!hasText(input.location)) {
    reasons.push("No location recorded — geographic fit unverifiable (0/15)");
    return { score: 0, reasons };
  }
  if (locContains(input.location, "dubai")) {
    reasons.push("Located in Dubai — Priority 1 market (15/15)");
    return { score: 15, reasons };
  }
  if (locContains(input.location, "abu dhabi")) {
    reasons.push("Located in Abu Dhabi — Priority 2 UAE market (10/15)");
    return { score: 10, reasons };
  }
  if (locContains(input.location, "sharjah")) {
    reasons.push("Located in Sharjah — Priority 2 UAE market (10/15)");
    return { score: 10, reasons };
  }
  const uaeKw = ["uae", "united arab emirates", "ajman", "ras al khaimah", "fujairah", "umm al quwain"];
  if (uaeKw.some((k) => locContains(input.location, k))) {
    reasons.push("Located in UAE (non-primary market) — Priority 3 (6/15)");
    return { score: 6, reasons };
  }
  reasons.push("Location appears outside primary UAE markets (3/15)");
  return { score: 3, reasons };
}

export function calculateLeadDependencyScore(input: ScoringInput): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  if (input.visibleAdActivity === "META_AND_GOOGLE") {
    score += 5;
    reasons.push("Active on Meta + Google Ads — strong lead acquisition (5 pts)");
  } else if (input.visibleAdActivity === "META_ONLY" || input.visibleAdActivity === "GOOGLE_ONLY") {
    score += 3;
    reasons.push("Single-channel paid advertising detected (3 pts)");
  }
  if (input.hasLeadForm) { score += 4; reasons.push("Lead form present — active inbound capture (4 pts)"); }
  if (input.hasLandingPage) { score += 3; reasons.push("Dedicated landing page found (3 pts)"); }
  if (input.hasWhatsappCta) { score += 3; reasons.push("WhatsApp CTA present — direct intake channel (3 pts)"); }
  if (score === 0) reasons.push("No visible lead dependency signals identified (0 pts)");
  return { score: clamp(score, 0, 15), reasons };
}

export function calculateDigitalOpportunityScore(input: ScoringInput): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  if (hasText(input.website)) { score += 3; reasons.push("Website present (3 pts)"); }
  switch (input.websiteQuality) {
    case "POOR": score += 5; reasons.push("Website POOR — high improvement opportunity (5 pts)"); break;
    case "AVERAGE": score += 3; reasons.push("Website AVERAGE — clear improvement gap (3 pts)"); break;
    case "EXCELLENT": score += 1; reasons.push("Website EXCELLENT — limited redesign opportunity (1 pt)"); break;
    default: score += 2; reasons.push("Website quality unverified (2 pts)"); break;
  }
  switch (input.leadFunnelQuality) {
    case "FRAGMENTED": score += 7; reasons.push("Lead funnel FRAGMENTED — largest AXTRAIT opportunity (7 pts)"); break;
    case "BASIC": score += 5; reasons.push("Lead funnel BASIC — significant optimization opportunity (5 pts)"); break;
    case "NOT_VERIFIED": score += 3; reasons.push("Lead funnel unverified (3 pts)"); break;
    case "ADVANCED": score += 1; reasons.push("Lead funnel ADVANCED — lower gap (1 pt)"); break;
  }
  if (input.visibleAdActivity === "META_AND_GOOGLE") { score += 5; reasons.push("Active Meta+Google spend — high optimization potential (5 pts)"); }
  else if (input.visibleAdActivity === "META_ONLY" || input.visibleAdActivity === "GOOGLE_ONLY") { score += 3; reasons.push("Single-channel ads — expansion opportunity (3 pts)"); }
  return { score: clamp(score, 0, 20), reasons };
}

export function calculateSalesOperationScore(input: ScoringInput): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  if (input.companySize === "200+") { score += 4; reasons.push("Large company 200+ employees (4 pts)"); }
  else if (input.companySize === "51-200") { score += 4; reasons.push("Mid-market 51-200 employees (4 pts)"); }
  else if (input.companySize === "11-50") { score += 3; reasons.push("Growing company 11-50 employees (3 pts)"); }
  else if (input.companySize === "1-10") { score += 1; reasons.push("Small team 1-10 employees (1 pt)"); }
  if (hasText(input.activeProjects)) { score += 4; reasons.push("Active projects documented — live sales cycle (4 pts)"); }
  if (input.crmVisibility === "UNKNOWN" || input.crmVisibility === "NOT_PUBLICLY_VISIBLE") {
    score += 2;
    reasons.push("CRM gap identified — setup/migration opportunity (2 pts)");
  }
  return { score: clamp(score, 0, 10), reasons };
}

export function calculateDecisionMakerScore(input: ScoringInput): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;
  switch (input.decisionMakerLevel) {
    case "TIER_1": score = 8; reasons.push("Tier 1 DM: Founder/CEO/MD — direct authority (8 pts)"); break;
    case "TIER_2": score = 6; reasons.push("Tier 2 DM: Head of Marketing/Sales — strong influence (6 pts)"); break;
    case "TIER_3": score = 3; reasons.push("Tier 3 DM: Manager — approval path likely needed (3 pts)"); break;
    case "LOWER": score = 1; reasons.push("Lower level: Coordinator/Assistant — escalation required (1 pt)"); break;
    default:
      if (hasText(input.jobTitle)) { score = 2; reasons.push("Contact identified but tier unclassified (2 pts)"); }
      else { reasons.push("No decision maker identified (0 pts)"); }
  }
  let bonus = 0;
  if (score > 0 && hasText(input.linkedinProfile)) { bonus += 1; reasons.push("LinkedIn profile available (+1)"); }
  if (score > 0 && hasText(input.businessEmail)) { bonus += 1; reasons.push("Business email available (+1)"); }
  return { score: clamp(score + bonus, 0, 10), reasons };
}

export function calculateFullScore(input: ScoringInput): ScoreBreakdown {
  const icp = calculateIcpFitScore(input);
  const market = calculateMarketFitScore(input);
  const leadDep = calculateLeadDependencyScore(input);
  const digital = calculateDigitalOpportunityScore(input);
  const salesOp = calculateSalesOperationScore(input);
  const dm = calculateDecisionMakerScore(input);
  const total = clamp(icp.score + market.score + leadDep.score + digital.score + salesOp.score + dm.score, 0, 100);
  const priority: "HIGH" | "MEDIUM" | "LOW" = total >= 80 ? "HIGH" : total >= 55 ? "MEDIUM" : "LOW";
  return {
    icpFit: icp.score,
    marketFit: market.score,
    leadDependency: leadDep.score,
    digitalOpportunity: digital.score,
    salesOperation: salesOp.score,
    decisionMakerAccess: dm.score,
    total,
    priority,
    reasons: [...icp.reasons, ...market.reasons, ...leadDep.reasons, ...digital.reasons, ...salesOp.reasons, ...dm.reasons],
  };
}

export function deriveOutreachReadiness(input: ScoringInput & { leadFitTotal?: number }): string {
  if (hasText(input.disqualificationReason)) return "DO_NOT_CONTACT";
  const signals = parseSignals(input.positiveSignals);
  const dncCodes = ["NOT_REAL_ESTATE", "OUTSIDE_UAE", "IRRELEVANT_BUSINESS_MODEL", "DO_NOT_CONTACT", "UNSUITABLE_TARGET"];
  if (signals.some((s) => dncCodes.includes(s))) return "DO_NOT_CONTACT";
  const hasCompany = hasText(input.companyType) && hasText(input.location);
  const hasContact = hasText(input.jobTitle) || hasText(input.businessEmail) || hasText(input.linkedinProfile);
  if (!hasCompany || !hasContact) return "NEEDS_RESEARCH";
  const score = input.leadFitTotal || 0;
  if (score >= 55) return "READY";
  if (score >= 40 && hasContact) return "READY";
  return "NEEDS_RESEARCH";
}

export function deriveDecisionMakerLevel(jobTitle: string | null | undefined): string {
  if (!hasText(jobTitle)) return "UNKNOWN";
  const title = jobTitle!.toLowerCase();
  const tier1 = ["founder", "co-founder", "owner", "ceo", "chief executive", "managing director", "chairman", "chairwoman", "president", "principal", "proprietor"];
  if (tier1.some((kw) => title.includes(kw))) return "TIER_1";
  const tier2 = ["head of marketing", "head of sales", "head of business development", "head of digital", "head of growth", "marketing director", "sales director", "commercial director", "vp marketing", "vp sales", "vice president", "director of marketing", "director of sales", "chief marketing", "cmo", "chief sales", "cso", "head of", "director"];
  if (tier2.some((kw) => title.includes(kw))) return "TIER_2";
  const tier3 = ["marketing manager", "sales manager", "digital manager", "campaign manager", "brand manager", "property manager", "account manager", "business development manager", "crm manager", "manager"];
  if (tier3.some((kw) => title.includes(kw))) return "TIER_3";
  const lower = ["coordinator", "assistant", "executive", "specialist", "analyst", "associate", "officer", "consultant"];
  if (lower.some((kw) => title.includes(kw))) return "LOWER";
  return "UNKNOWN";
}

export function deriveGeographicPriority(location: string | null | undefined): string {
  if (!hasText(location)) return "PRIORITY_1";
  const loc = location!.toLowerCase();
  if (loc.includes("dubai")) return "PRIORITY_1";
  if (loc.includes("abu dhabi") || loc.includes("sharjah")) return "PRIORITY_2";
  return "PRIORITY_3";
}

export function detectPositiveSignals(input: ScoringInput): string[] {
  const signals: string[] = [];
  if (hasText(input.activeProjects)) signals.push("ACTIVE_PROJECT");
  if (["META_AND_GOOGLE", "META_ONLY", "GOOGLE_ONLY"].includes(input.visibleAdActivity || "")) signals.push("ACTIVE_ADVERTISING");
  if (input.hasLandingPage) signals.push("DEDICATED_LANDING_PAGE");
  if (input.hasLeadForm) signals.push("LEAD_FORM");
  if (input.hasWhatsappCta) signals.push("WHATSAPP_CTA");
  if (input.companySize === "51-200" || input.companySize === "200+") signals.push("LARGE_SALES_TEAM");
  if (["TIER_1", "TIER_2"].includes(input.decisionMakerLevel || "")) signals.push("SENIOR_DECISION_MAKER_FOUND");
  if (input.visibleAdActivity === "META_AND_GOOGLE") signals.push("STRONG_LEAD_DEPENDENCY");
  return signals;
}

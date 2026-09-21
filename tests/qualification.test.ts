import assert from "node:assert/strict";
import {
  calculateIcpFitScore,
  calculateMarketFitScore,
  calculateLeadDependencyScore,
  calculateDigitalOpportunityScore,
  calculateSalesOperationScore,
  calculateDecisionMakerScore,
  calculateFullScore,
  deriveDecisionMakerLevel,
  deriveGeographicPriority,
  deriveOutreachReadiness,
  detectPositiveSignals,
} from "../lib/qualification/engine";

export async function testQualification() {
  console.log("\n▶ Running Suite: Phase 3 Step 2 — Qualification & Scoring Engine Unit Tests");

  // 1. Dimension 1: ICP Segment Fit (Max 30)
  {
    const dev = calculateIcpFitScore({ companyType: "DEVELOPER" });
    assert.equal(dev.score, 30, "Developer should receive 30 ICP fit points");
    assert.match(dev.reasons[0], /developer/i);

    const bro = calculateIcpFitScore({ companyType: "BROKERAGE" });
    assert.equal(bro.score, 26, "Brokerage should receive 26 ICP fit points");

    const agy = calculateIcpFitScore({ companyType: "AGENCY" });
    assert.equal(agy.score, 22, "Agency should receive 22 ICP fit points");

    const unk = calculateIcpFitScore({ companyType: "OTHER" });
    assert.equal(unk.score, 0, "Unclassified company should receive 0 ICP points");
    console.log("  ✔ Dimension 1: ICP Segment Fit points verified (Developer: 30, Brokerage: 26, Agency: 22)");
  }

  // 2. Dimension 2: Market Fit & Geography (Max 15)
  {
    const dubai = calculateMarketFitScore({ location: "Downtown Dubai, UAE" });
    assert.equal(dubai.score, 15, "Dubai location must score 15 market points (P1)");

    const ad = calculateMarketFitScore({ location: "Al Reem Island, Abu Dhabi" });
    assert.equal(ad.score, 10, "Abu Dhabi location must score 10 market points (P2)");

    const shj = calculateMarketFitScore({ location: "Al Majaz, Sharjah" });
    assert.equal(shj.score, 10, "Sharjah location must score 10 market points (P2)");

    const rak = calculateMarketFitScore({ location: "Ras Al Khaimah, UAE" });
    assert.equal(rak.score, 6, "Other UAE emirates must score 6 market points (P3)");

    const empty = calculateMarketFitScore({ location: "" });
    assert.equal(empty.score, 0, "Empty location must score 0 market points");
    console.log("  ✔ Dimension 2: Market Fit points verified (Dubai P1: 15, Abu Dhabi/Sharjah P2: 10, UAE P3: 6)");
  }

  // 3. Dimension 3: Lead Dependency (Max 15)
  {
    const fullLead = calculateLeadDependencyScore({
      visibleAdActivity: "META_AND_GOOGLE",
      hasLeadForm: true,
      hasLandingPage: true,
      hasWhatsappCta: true,
    });
    // 5 + 4 + 3 + 3 = 15
    assert.equal(fullLead.score, 15, "Complete lead funnel signals must score max 15 points");

    const metaOnly = calculateLeadDependencyScore({
      visibleAdActivity: "META_ONLY",
      hasWhatsappCta: true,
    });
    // 3 + 3 = 6
    assert.equal(metaOnly.score, 6, "Meta only + WhatsApp CTA must score 6 points");

    const noSignals = calculateLeadDependencyScore({});
    assert.equal(noSignals.score, 0, "No lead signals must score 0 points");
    console.log("  ✔ Dimension 3: Lead Dependency signals verified (Meta+Google: +5, Form: +4, LP: +3, WA: +3)");
  }

  // 4. Dimension 4: Digital Opportunity (Max 20)
  // Spec rule: Fragmented/Basic funnels represent GREATER AXTRAIT opportunity than Advanced
  {
    const highOpportunity = calculateDigitalOpportunityScore({
      website: "https://example.ae",
      websiteQuality: "POOR", // +5
      leadFunnelQuality: "FRAGMENTED", // +7
      visibleAdActivity: "META_AND_GOOGLE", // +5
    });
    // 3 + 5 + 7 + 5 = 20
    assert.equal(highOpportunity.score, 20, "Fragmented funnel with high ad spend = max 20 opportunity points");

    const lowOpportunity = calculateDigitalOpportunityScore({
      website: "https://example.ae",
      websiteQuality: "EXCELLENT", // +1
      leadFunnelQuality: "ADVANCED", // +1
      visibleAdActivity: "NONE",
    });
    // 3 + 1 + 1 = 5
    assert.equal(lowOpportunity.score, 5, "Advanced funnel = lower AXTRAIT conversion gap (5 points)");
    assert(highOpportunity.score > lowOpportunity.score, "Fragmented funnels must score higher opportunity than Advanced");
    console.log("  ✔ Dimension 4: Digital Opportunity verified (Fragmented funnel represents greater opportunity than Advanced)");
  }

  // 5. Dimension 5: Sales Operation Scale (Max 10)
  {
    const enterprise = calculateSalesOperationScore({
      companySize: "51-200",
      activeProjects: "Marasi Bay Waterfront, Luxury Palm Residences",
      crmVisibility: "NOT_PUBLICLY_VISIBLE",
    });
    // 4 + 4 + 2 = 10
    assert.equal(enterprise.score, 10, "Mid-market developer with active launches & CRM gap = 10 points");

    const lean = calculateSalesOperationScore({
      companySize: "1-10",
      crmVisibility: "DETECTED",
    });
    // 1 + 0 = 1
    assert.equal(lean.score, 1, "Small team with detected CRM = 1 point");
    console.log("  ✔ Dimension 5: Sales Operation scale verified (Company size + launches + CRM gap)");
  }

  // 6. Dimension 6: Decision Maker Access (Max 10)
  {
    const tier1 = calculateDecisionMakerScore({
      decisionMakerLevel: "TIER_1",
      linkedinProfile: "https://linkedin.com/in/ceo",
      businessEmail: "ceo@developer.ae",
    });
    // 8 + 1 + 1 = 10
    assert.equal(tier1.score, 10, "Tier 1 DM with verified channels = max 10 points");

    const tier2 = calculateDecisionMakerScore({
      decisionMakerLevel: "TIER_2",
      businessEmail: "marketing.dir@brokerage.ae",
    });
    // 6 + 1 = 7
    assert.equal(tier2.score, 7, "Tier 2 DM with email = 7 points");

    const none = calculateDecisionMakerScore({});
    assert.equal(none.score, 0, "No decision maker identified = 0 points");
    console.log("  ✔ Dimension 6: Decision Maker access verified (Tier 1: 8+bonus, Tier 2: 6+bonus, Unidentified: 0)");
  }

  // 7. Full 100-Point Score & Boundary Conditions
  {
    // High Priority Prospect: Developer in Dubai, launches, ads, DM
    const highProspect = calculateFullScore({
      companyType: "DEVELOPER", // 30
      location: "Business Bay, Dubai, UAE", // 15
      visibleAdActivity: "META_AND_GOOGLE", // 5
      hasLeadForm: true, // 4
      hasWhatsappCta: true, // 3
      website: "https://omniyat.ae", // 3
      websiteQuality: "AVERAGE", // 3
      leadFunnelQuality: "FRAGMENTED", // 7
      companySize: "51-200", // 4
      activeProjects: "The Lana Residences", // 4
      crmVisibility: "NOT_PUBLICLY_VISIBLE", // 2
      decisionMakerLevel: "TIER_1", // 8
      linkedinProfile: "https://linkedin.com/in/exec", // 1
      businessEmail: "m.amjad@omniyat.ae", // 1
    });

    assert(highProspect.total >= 80, `Expected high priority score >= 80, got ${highProspect.total}`);
    assert.equal(highProspect.priority, "HIGH", "Score >= 80 must yield HIGH priority");
    assert(highProspect.reasons.length > 5, "High prospect must yield comprehensive rationale list");

    // Medium Priority Boundary (Score between 55 and 79)
    const medProspect = calculateFullScore({
      companyType: "BROKERAGE", // 26
      location: "Dubai Marina, Dubai", // 15
      visibleAdActivity: "META_ONLY", // 3
      hasLeadForm: true, // 4
      website: "https://brokerage.ae", // 3
      websiteQuality: "AVERAGE", // 3
      leadFunnelQuality: "BASIC", // 5
      companySize: "11-50", // 3
      decisionMakerLevel: "TIER_3", // 3
    });
    // 26 + 15 + 7 + 11 + 3 + 3 = 65
    assert(medProspect.total >= 55 && medProspect.total < 80, `Expected medium score 55-79, got ${medProspect.total}`);
    assert.equal(medProspect.priority, "MEDIUM", "Score 55-79 must yield MEDIUM priority");

    // Low Priority Boundary (Score < 54)
    const lowProspect = calculateFullScore({
      companyType: "AGENCY", // 22
      location: "Ajman, UAE", // 6
      websiteQuality: "POOR", // 5
      leadFunnelQuality: "NOT_VERIFIED", // 3
      companySize: "1-10", // 1
    });
    // 22 + 6 + 0 + 8 + 1 + 0 = 37
    assert(lowProspect.total <= 54, `Expected low score <= 54, got ${lowProspect.total}`);
    assert.equal(lowProspect.priority, "LOW", "Score <= 54 must yield LOW priority");
    console.log("  ✔ 100-Point Score & Boundary values verified (HIGH: >=80, MEDIUM: 55-79, LOW: <=54)");
  }

  // 8. Decision Maker Title Classification
  {
    assert.equal(deriveDecisionMakerLevel("Managing Director & Founder"), "TIER_1");
    assert.equal(deriveDecisionMakerLevel("Chief Executive Officer (CEO)"), "TIER_1");
    assert.equal(deriveDecisionMakerLevel("Head of Sales & Marketing"), "TIER_2");
    assert.equal(deriveDecisionMakerLevel("Commercial Director"), "TIER_2");
    assert.equal(deriveDecisionMakerLevel("Sales Operations Manager"), "TIER_3");
    assert.equal(deriveDecisionMakerLevel("Marketing Coordinator"), "LOWER");
    assert.equal(deriveDecisionMakerLevel("Administrative Assistant"), "LOWER");
    assert.equal(deriveDecisionMakerLevel("Specialist Legal Advisor"), "LOWER");
    assert.equal(deriveDecisionMakerLevel("Office Receptionist"), "UNKNOWN");
    console.log("  ✔ Decision maker title classification verified across Tiers 1, 2, 3, Lower, and Unknown");
  }

  // 9. Geographic Priority Derivation
  {
    assert.equal(deriveGeographicPriority("Business Bay, Dubai"), "PRIORITY_1");
    assert.equal(deriveGeographicPriority("Al Maryah Island, Abu Dhabi"), "PRIORITY_2");
    assert.equal(deriveGeographicPriority("Al Nahda, Sharjah"), "PRIORITY_2");
    assert.equal(deriveGeographicPriority("Al Hamra, Ras Al Khaimah"), "PRIORITY_3");
    console.log("  ✔ Geographic priority derivation verified (Dubai: P1, Abu Dhabi/Sharjah: P2, Other: P3)");
  }

  // 10. Outreach Readiness Gate Derivation
  {
    const ready = deriveOutreachReadiness({
      companyType: "DEVELOPER",
      location: "Dubai",
      jobTitle: "Managing Director",
      websiteQuality: "AVERAGE",
      leadFitTotal: 75,
    });
    assert.equal(ready, "READY", "Researched prospect with DM and score >= 55 must be READY");

    const needsResearch = deriveOutreachReadiness({
      companyType: "DEVELOPER",
      location: "Dubai",
      // No contact identified
      leadFitTotal: 30,
    });
    assert.equal(needsResearch, "NEEDS_RESEARCH", "Prospect missing contact must be NEEDS_RESEARCH");

    const doNotContact = deriveOutreachReadiness({
      companyType: "DEVELOPER",
      location: "Dubai",
      disqualificationReason: "OUTSIDE_UAE",
      leadFitTotal: 85,
    });
    assert.equal(doNotContact, "DO_NOT_CONTACT", "Disqualified prospect must always be DO_NOT_CONTACT");
    console.log("  ✔ Outreach readiness gate verified (READY, NEEDS_RESEARCH, DO_NOT_CONTACT)");
  }

  // 11. Positive Signal Detection
  {
    const signals = detectPositiveSignals({
      activeProjects: "One Canal, Safa Two",
      visibleAdActivity: "META_AND_GOOGLE",
      hasLandingPage: true,
      hasLeadForm: true,
      hasWhatsappCta: true,
      companySize: "51-200",
      decisionMakerLevel: "TIER_1",
    });

    assert(signals.includes("ACTIVE_PROJECT"), "Should detect ACTIVE_PROJECT");
    assert(signals.includes("ACTIVE_ADVERTISING"), "Should detect ACTIVE_ADVERTISING");
    assert(signals.includes("DEDICATED_LANDING_PAGE"), "Should detect DEDICATED_LANDING_PAGE");
    assert(signals.includes("LEAD_FORM"), "Should detect LEAD_FORM");
    assert(signals.includes("WHATSAPP_CTA"), "Should detect WHATSAPP_CTA");
    assert(signals.includes("LARGE_SALES_TEAM"), "Should detect LARGE_SALES_TEAM");
    assert(signals.includes("SENIOR_DECISION_MAKER_FOUND"), "Should detect SENIOR_DECISION_MAKER_FOUND");
    assert(signals.includes("STRONG_LEAD_DEPENDENCY"), "Should detect STRONG_LEAD_DEPENDENCY");
    console.log("  ✔ Positive signals detection verified with all 8 operational tags");
  }

  console.log("All Phase 3 Step 2 qualification unit tests passed!\n");
}

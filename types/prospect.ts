/**
 * AXTRAIT Real Estate Sales Management Platform
 * Phase 3 — Prospect Database Architecture Types & Enums
 */

export type DigitalMaturity = "LOW" | "DEVELOPING" | "ADVANCED" | "UNKNOWN";
export type DecisionMakerLevel = "TIER_1" | "TIER_2" | "TIER_3" | "LOWER" | "UNKNOWN";
export type GeographicPriority = "PRIORITY_1" | "PRIORITY_2" | "PRIORITY_3";
export type EvidenceConfidence = "VERIFIED" | "PARTIALLY_VERIFIED" | "UNKNOWN";
export type OutreachReadiness = "READY" | "NEEDS_RESEARCH" | "DO_NOT_CONTACT";
export type PropertySegment =
  | "OFF_PLAN"
  | "LUXURY"
  | "RESIDENTIAL"
  | "COMMERCIAL"
  | "INVESTMENT"
  | "SECONDARY_MARKET"
  | "PROPERTY_MANAGEMENT"
  | "HOLIDAY_HOMES"
  | "MIXED";
export type PositiveSignal =
  | "ACTIVE_PROJECT"
  | "MULTIPLE_LISTINGS"
  | "ACTIVE_ADVERTISING"
  | "DEDICATED_LANDING_PAGE"
  | "LEAD_FORM"
  | "WHATSAPP_CTA"
  | "LARGE_SALES_TEAM"
  | "MULTIPLE_AGENTS"
  | "PROJECT_LAUNCH"
  | "DIGITAL_MARKETING_ACTIVITY"
  | "SENIOR_DECISION_MAKER_FOUND"
  | "STRONG_LEAD_DEPENDENCY";
export type DisqualificationReason =
  | "NOT_REAL_ESTATE"
  | "OUTSIDE_UAE"
  | "IRRELEVANT_BUSINESS_MODEL"
  | "NO_IDENTIFIABLE_BUSINESS_ACTIVITY"
  | "DUPLICATE_COMPANY"
  | "PERSONAL_CONTACT_ONLY"
  | "UNSUITABLE_TARGET"
  | "DO_NOT_CONTACT";

export type CompanyType = "DEVELOPER" | "BROKERAGE" | "AGENCY";

export type CompanySize = "1-10" | "11-50" | "51-200" | "200+";

export type PreferredContactChannel = "LINKEDIN" | "EMAIL" | "PHONE_WHATSAPP";

export type WebsiteQuality = "EXCELLENT" | "AVERAGE" | "POOR" | "NOT_VERIFIED";

export type LeadFunnelQuality = "ADVANCED" | "BASIC" | "FRAGMENTED" | "NOT_VERIFIED";

export type VisibleAdActivity =
  | "META_AND_GOOGLE"
  | "META_ONLY"
  | "GOOGLE_ONLY"
  | "NONE"
  | "NOT_VERIFIED";

export type CrmVisibility = "DETECTED" | "UNKNOWN" | "NOT_PUBLICLY_VISIBLE";

export type LeadScore = "LOW" | "MEDIUM" | "HIGH";

export type LeadStatus =
  | "NEW_PROSPECT"
  | "RESEARCHED"
  | "CONTACTED"
  | "REPLIED"
  | "QUALIFIED"
  | "MEETING_BOOKED"
  | "MEETING_COMPLETED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST"
  | "NOT_NOW"
  | "DISQUALIFIED"
  | "DO_NOT_CONTACT";

export type OutreachChannel = "EMAIL" | "LINKEDIN" | "WHATSAPP" | "PHONE";

export type ReplyStatus =
  | "NO_REPLY"
  | "POSITIVE"
  | "MEETING_REQUEST"
  | "INFO_REQUEST"
  | "NOT_NOW"
  | "NOT_INTERESTED"
  | "WRONG_PERSON"
  | "UNSUBSCRIBE";

export type MeetingStatus =
  | "NONE"
  | "REQUESTED"
  | "BOOKED"
  | "COMPLETED"
  | "NO_SHOW"
  | "RESCHEDULED";

export type ProposalStatus = "NONE" | "DRAFTING" | "SENT" | "ACCEPTED" | "REJECTED";

export type DealStatus = "PIPELINE" | "WON" | "LOST" | "DISQUALIFIED";

/**
 * Full Prospect Record matching the Prisma Model
 */
export interface ProspectRecord {
  id: string;
  organizationId: string;
  assignedToUserId: string | null;

  // 1. Company Information
  companyName: string;
  companyType: CompanyType;
  website: string | null;
  location: string | null;
  linkedinCompanyUrl: string | null;
  instagramUrl: string | null;
  companySize: CompanySize | string | null;
  primaryMarket: string | null;
  propertySegment: string | null;
  activeProjects: string | null;
  companyNotes: string | null;

  // 2. Contact Information
  contactName: string | null;
  jobTitle: string | null;
  businessEmail: string | null;
  businessPhone: string | null;
  linkedinProfile: string | null;
  preferredContactChannel: PreferredContactChannel | string | null;
  contactSource: string | null;

  // 3. Sales Research (Evidence-Grounded)
  websiteQuality: WebsiteQuality | string;
  leadFunnelQuality: LeadFunnelQuality | string;
  hasLandingPage: boolean;
  hasLeadForm: boolean;
  hasWhatsappCta: boolean;
  visibleAdActivity: VisibleAdActivity | string;
  crmVisibility: CrmVisibility | string;
  leadManagementObservation: string | null;
  marketingObservation: string | null;
  personalizedOpportunity: string | null;

  // 4. Sales Status & Pipeline Telemetry
  leadScore: LeadScore | string;
  leadScorePoints: number;
  leadStatus: LeadStatus | string;
  outreachChannel: OutreachChannel | string | null;
  firstContactDate: Date | string | null;
  lastContactDate: Date | string | null;
  nextFollowUpDate: Date | string | null;
  replyStatus: ReplyStatus | string;
  meetingStatus: MeetingStatus | string;
  proposalStatus: ProposalStatus | string;
  dealStatus: DealStatus | string;
  dealValue: number | null;
  salesNotes: string | null;

  // Qualification Intelligence Layer (Phase 3 Step 2)
  digitalMaturity: DigitalMaturity | string;
  decisionMakerLevel: DecisionMakerLevel | string;
  propertySegments: string | null; // JSON array string
  geographicPriority: GeographicPriority | string;
  icpFitScore: number;
  marketFitScore: number;
  leadDependencyScore: number;
  digitalOpportunityScore: number;
  salesOperationScore: number;
  decisionMakerAccessScore: number;
  evidenceConfidence: EvidenceConfidence | string;
  outreachReadiness: OutreachReadiness | string;
  positiveSignals: string | null; // JSON array string
  disqualificationReason: DisqualificationReason | string | null;
  qualificationSummary: string | null;

  createdAt: Date | string;
  updatedAt: Date | string;

  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

/**
 * High-density directory table view item
 */
export interface ProspectSummary {
  id: string;
  companyName: string;
  companyType: CompanyType;
  location: string | null;
  primaryMarket: string | null;
  propertySegment: string | null;
  contactName: string | null;
  jobTitle: string | null;
  businessEmail: string | null;
  businessPhone: string | null;
  leadScore: LeadScore;
  leadScorePoints: number;
  leadStatus: LeadStatus;
  outreachChannel: OutreachChannel | null;
  dealValue: number | null;
  nextFollowUpDate: string | null;
  assignedToName: string | null;
  createdAt: string;
}

/**
 * Creation DTO
 */
export interface CreateProspectDTO {
  // 1. Company Information (companyName & companyType required)
  companyName: string;
  companyType: CompanyType;
  website?: string | null;
  location?: string | null;
  linkedinCompanyUrl?: string | null;
  instagramUrl?: string | null;
  companySize?: CompanySize | null;
  primaryMarket?: string | null;
  propertySegment?: string | null;
  activeProjects?: string | null;
  companyNotes?: string | null;

  // 2. Contact Information
  contactName?: string | null;
  jobTitle?: string | null;
  businessEmail?: string | null;
  businessPhone?: string | null;
  linkedinProfile?: string | null;
  preferredContactChannel?: PreferredContactChannel | null;
  contactSource?: string | null;

  // 3. Sales Research
  websiteQuality?: WebsiteQuality;
  leadFunnelQuality?: LeadFunnelQuality;
  hasLandingPage?: boolean;
  hasLeadForm?: boolean;
  hasWhatsappCta?: boolean;
  visibleAdActivity?: VisibleAdActivity;
  crmVisibility?: CrmVisibility;
  leadManagementObservation?: string | null;
  marketingObservation?: string | null;
  personalizedOpportunity?: string | null;

  // 4. Sales Status
  leadScore?: LeadScore;
  leadScorePoints?: number;
  leadStatus?: LeadStatus;
  outreachChannel?: OutreachChannel | null;
  firstContactDate?: string | Date | null;
  lastContactDate?: string | Date | null;
  nextFollowUpDate?: string | Date | null;
  replyStatus?: ReplyStatus;
  meetingStatus?: MeetingStatus;
  proposalStatus?: ProposalStatus;
  dealStatus?: DealStatus;
  dealValue?: number | null;
  salesNotes?: string | null;
  assignedToUserId?: string | null;

  // 5. Qualification Intelligence (Phase 3 Step 2)
  digitalMaturity?: DigitalMaturity;
  decisionMakerLevel?: DecisionMakerLevel;
  propertySegments?: string | null;
  geographicPriority?: GeographicPriority;
  evidenceConfidence?: EvidenceConfidence;
  outreachReadiness?: OutreachReadiness;
  positiveSignals?: string | null;
  disqualificationReason?: DisqualificationReason | null;
  qualificationSummary?: string | null;
}

/**
 * Update DTO
 */
export type UpdateProspectDTO = Partial<CreateProspectDTO>;

/**
 * Query & Filter Parameters
 */
export interface ProspectFilterParams {
  search?: string;
  companyType?: CompanyType | "ALL";
  leadStatus?: LeadStatus | "ALL";
  leadScore?: LeadScore | "ALL";
  assignedToUserId?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof ProspectRecord | "createdAt";
  sortOrder?: "asc" | "desc";
  digitalMaturity?: DigitalMaturity | "ALL";
  decisionMakerLevel?: DecisionMakerLevel | "ALL";
  outreachReadiness?: OutreachReadiness | "ALL";
  evidenceConfidence?: EvidenceConfidence | "ALL";
  geographicPriority?: GeographicPriority | "ALL";
  hasLandingPage?: boolean;
  hasLeadForm?: boolean;
  hasWhatsappCta?: boolean;
}

/**
 * High-Level Tenant Overview Statistics
 */
export interface ProspectOverviewStats {
  totalProspects: number;
  developersCount: number;
  brokeragesCount: number;
  agenciesCount: number;
  hotLeadsCount: number;
  meetingsBookedCount: number;
  proposalsSentCount: number;
  totalPipelineValueAed: number;
}

export interface QualificationScoreBreakdown {
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

export interface ProspectDuplicate {
  id: string;
  companyName: string;
  location: string | null;
  companyType: string;
  leadStatus: string;
  matchReason: string;
}

import { z } from "zod";

export const companyTypeEnum = z.enum(["DEVELOPER", "BROKERAGE", "AGENCY"]);
export const companySizeEnum = z.enum(["1-10", "11-50", "51-200", "200+"]);
export const contactChannelEnum = z.enum(["LINKEDIN", "EMAIL", "PHONE_WHATSAPP"]);
export const websiteQualityEnum = z.enum(["EXCELLENT", "AVERAGE", "POOR", "NOT_VERIFIED"]);
export const leadFunnelQualityEnum = z.enum(["ADVANCED", "BASIC", "FRAGMENTED", "NOT_VERIFIED"]);
export const visibleAdActivityEnum = z.enum([
  "META_AND_GOOGLE",
  "META_ONLY",
  "GOOGLE_ONLY",
  "NONE",
  "NOT_VERIFIED",
]);
export const crmVisibilityEnum = z.enum(["DETECTED", "UNKNOWN", "NOT_PUBLICLY_VISIBLE"]);
export const leadScoreEnum = z.enum(["LOW", "MEDIUM", "HIGH"]);
export const leadStatusEnum = z.enum([
  "NEW_PROSPECT",
  "RESEARCHED",
  "CONTACTED",
  "REPLIED",
  "QUALIFIED",
  "MEETING_BOOKED",
  "MEETING_COMPLETED",
  "PROPOSAL_SENT",
  "NEGOTIATION",
  "WON",
  "LOST",
  "NOT_NOW",
  "DISQUALIFIED",
  "DO_NOT_CONTACT",
]);
export const outreachChannelEnum = z.enum(["EMAIL", "LINKEDIN", "WHATSAPP", "PHONE"]);
export const replyStatusEnum = z.enum([
  "NO_REPLY",
  "POSITIVE",
  "MEETING_REQUEST",
  "INFO_REQUEST",
  "NOT_NOW",
  "NOT_INTERESTED",
  "WRONG_PERSON",
  "UNSUBSCRIBE",
]);
export const meetingStatusEnum = z.enum([
  "NONE",
  "REQUESTED",
  "BOOKED",
  "COMPLETED",
  "NO_SHOW",
  "RESCHEDULED",
]);
export const proposalStatusEnum = z.enum(["NONE", "DRAFTING", "SENT", "ACCEPTED", "REJECTED"]);
export const dealStatusEnum = z.enum(["PIPELINE", "WON", "LOST", "DISQUALIFIED"]);

export const digitalMaturityEnum = z.enum(["LOW", "DEVELOPING", "ADVANCED", "UNKNOWN"]);
export const decisionMakerLevelEnum = z.enum(["TIER_1", "TIER_2", "TIER_3", "LOWER", "UNKNOWN"]);
export const geographicPriorityEnum = z.enum(["PRIORITY_1", "PRIORITY_2", "PRIORITY_3"]);
export const evidenceConfidenceEnum = z.enum(["VERIFIED", "PARTIALLY_VERIFIED", "UNKNOWN"]);
export const outreachReadinessEnum = z.enum(["READY", "NEEDS_RESEARCH", "DO_NOT_CONTACT"]);
export const propertySegmentEnum = z.enum([
  "OFF_PLAN", "LUXURY", "RESIDENTIAL", "COMMERCIAL", "INVESTMENT",
  "SECONDARY_MARKET", "PROPERTY_MANAGEMENT", "HOLIDAY_HOMES", "MIXED",
]);
export const disqualificationReasonEnum = z.enum([
  "NOT_REAL_ESTATE", "OUTSIDE_UAE", "IRRELEVANT_BUSINESS_MODEL",
  "NO_IDENTIFIABLE_BUSINESS_ACTIVITY", "DUPLICATE_COMPANY",
  "PERSONAL_CONTACT_ONLY", "UNSUITABLE_TARGET", "DO_NOT_CONTACT",
]);

export const createProspectSchema = z.object({
  // 1. Company Information
  companyName: z
    .string({ required_error: "Company name is required" })
    .trim()
    .min(2, "Company name must be at least 2 characters")
    .max(120, "Company name cannot exceed 120 characters"),
  companyType: companyTypeEnum,
  website: z.string().trim().url("Please provide a valid website URL").or(z.literal("")).nullish(),
  location: z.string().trim().max(100).nullish(),
  linkedinCompanyUrl: z.string().trim().url("Invalid LinkedIn company URL").or(z.literal("")).nullish(),
  instagramUrl: z.string().trim().nullish(),
  companySize: companySizeEnum.nullish(),
  primaryMarket: z.string().trim().max(100).nullish(),
  propertySegment: z.string().trim().max(100).nullish(),
  activeProjects: z.string().trim().max(1000).nullish(),
  companyNotes: z.string().trim().max(2000).nullish(),

  // 2. Contact Information
  contactName: z.string().trim().max(100).nullish(),
  jobTitle: z.string().trim().max(100).nullish(),
  businessEmail: z.string().trim().email("Invalid business email").or(z.literal("")).nullish(),
  businessPhone: z.string().trim().max(50).nullish(),
  linkedinProfile: z.string().trim().url("Invalid personal LinkedIn URL").or(z.literal("")).nullish(),
  preferredContactChannel: contactChannelEnum.nullish(),
  contactSource: z.string().trim().max(100).nullish(),

  // 3. Sales Research
  websiteQuality: websiteQualityEnum.default("NOT_VERIFIED"),
  leadFunnelQuality: leadFunnelQualityEnum.default("NOT_VERIFIED"),
  hasLandingPage: z.boolean().default(false),
  hasLeadForm: z.boolean().default(false),
  hasWhatsappCta: z.boolean().default(false),
  visibleAdActivity: visibleAdActivityEnum.default("NOT_VERIFIED"),
  crmVisibility: crmVisibilityEnum.default("NOT_PUBLICLY_VISIBLE"),
  leadManagementObservation: z.string().trim().max(1000).nullish(),
  marketingObservation: z.string().trim().max(1000).nullish(),
  personalizedOpportunity: z.string().trim().max(1500).nullish(),

  // 4. Sales Status & Pipeline Telemetry
  leadScore: leadScoreEnum.default("MEDIUM"),
  leadScorePoints: z.coerce.number().min(0).max(100).default(50),
  leadStatus: leadStatusEnum.default("NEW_PROSPECT"),
  outreachChannel: outreachChannelEnum.nullish(),
  firstContactDate: z.coerce.date().nullish(),
  lastContactDate: z.coerce.date().nullish(),
  nextFollowUpDate: z.coerce.date().nullish(),
  replyStatus: replyStatusEnum.default("NO_REPLY"),
  meetingStatus: meetingStatusEnum.default("NONE"),
  proposalStatus: proposalStatusEnum.default("NONE"),
  dealStatus: dealStatusEnum.default("PIPELINE"),
  dealValue: z.coerce.number().min(0).nullish(),
  salesNotes: z.string().trim().max(5000).nullish(),
  assignedToUserId: z.string().cuid().nullish(),
  // Qualification Intelligence (Phase 3 Step 2)
  digitalMaturity: digitalMaturityEnum.default("UNKNOWN"),
  decisionMakerLevel: decisionMakerLevelEnum.default("UNKNOWN"),
  propertySegments: z.string().nullish(), // JSON array string
  geographicPriority: geographicPriorityEnum.default("PRIORITY_1"),
  evidenceConfidence: evidenceConfidenceEnum.default("UNKNOWN"),
  outreachReadiness: outreachReadinessEnum.default("NEEDS_RESEARCH"),
  positiveSignals: z.string().nullish(), // JSON array string
  disqualificationReason: disqualificationReasonEnum.nullish(),
  qualificationSummary: z.string().trim().max(3000).nullish(),
});

export const updateProspectSchema = createProspectSchema.partial();

export const prospectFilterSchema = z.object({
  search: z.string().trim().optional(),
  companyType: z.enum(["DEVELOPER", "BROKERAGE", "AGENCY", "ALL"]).optional(),
  leadStatus: z.string().trim().optional(),
  leadScore: z.enum(["LOW", "MEDIUM", "HIGH", "ALL"]).optional(),
  assignedToUserId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(25),
  sortBy: z.string().default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  digitalMaturity: z.enum(["LOW", "DEVELOPING", "ADVANCED", "UNKNOWN", "ALL"]).optional(),
  decisionMakerLevel: z.enum(["TIER_1", "TIER_2", "TIER_3", "LOWER", "UNKNOWN", "ALL"]).optional(),
  outreachReadiness: z.enum(["READY", "NEEDS_RESEARCH", "DO_NOT_CONTACT", "ALL"]).optional(),
  evidenceConfidence: z.enum(["VERIFIED", "PARTIALLY_VERIFIED", "UNKNOWN", "ALL"]).optional(),
  geographicPriority: z.enum(["PRIORITY_1", "PRIORITY_2", "PRIORITY_3", "ALL"]).optional(),
  hasLandingPage: z.coerce.boolean().optional(),
  hasLeadForm: z.coerce.boolean().optional(),
  hasWhatsappCta: z.coerce.boolean().optional(),
});

export type CreateProspectInput = z.input<typeof createProspectSchema>;
export type UpdateProspectInput = z.input<typeof updateProspectSchema>;
export type ProspectFilterInput = z.input<typeof prospectFilterSchema>;

export type CreateProspectOutput = z.output<typeof createProspectSchema>;
export type UpdateProspectOutput = z.output<typeof updateProspectSchema>;
export type ProspectFilterOutput = z.output<typeof prospectFilterSchema>;

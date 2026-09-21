import { prisma } from "@/lib/db/client";
import { NotFoundError } from "@/lib/errors/app-error";
import {
  CreateProspectInput,
  UpdateProspectInput,
  ProspectFilterInput,
} from "@/lib/validation/prospect";
import {
  ProspectOverviewStats,
  ProspectRecord,
  CompanyType,
  LeadScore,
  LeadStatus,
} from "@/types/prospect";
import { Prisma } from "@prisma/client";
import {
  calculateFullScore,
  deriveOutreachReadiness,
  deriveDecisionMakerLevel,
  deriveGeographicPriority,
  detectPositiveSignals,
} from "@/lib/qualification/engine";
import { findPotentialDuplicates, DuplicateCheckInput, ProspectDuplicate } from "@/lib/qualification/duplicates";

export class ProspectService {
  /**
   * Lists prospects with tenant isolation, search, filtering, and pagination
   */
  static async listProspects(
    organizationId: string,
    filters?: ProspectFilterInput
  ): Promise<{
    prospects: ProspectRecord[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = Math.max(1, filters?.page || 1);
    const limit = Math.min(100, Math.max(1, filters?.limit || 25));
    const skip = (page - 1) * limit;

    const where: Prisma.ProspectWhereInput = {
      organizationId,
    };

    if (filters?.companyType && filters.companyType !== "ALL") {
      where.companyType = filters.companyType;
    }

    if (filters?.leadStatus && filters.leadStatus !== "ALL") {
      where.leadStatus = filters.leadStatus;
    }

    if (filters?.leadScore && filters.leadScore !== "ALL") {
      where.leadScore = filters.leadScore;
    }

    if (filters?.assignedToUserId) {
      where.assignedToUserId = filters.assignedToUserId;
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const query = filters.search.trim();
      where.OR = [
        { companyName: { contains: query } },
        { contactName: { contains: query } },
        { businessEmail: { contains: query } },
        { location: { contains: query } },
        { primaryMarket: { contains: query } },
        { activeProjects: { contains: query } },
      ];
    }

    if (filters?.outreachReadiness && filters.outreachReadiness !== "ALL") {
      where.outreachReadiness = filters.outreachReadiness;
    }
    if (filters?.digitalMaturity && filters.digitalMaturity !== "ALL") {
      where.digitalMaturity = filters.digitalMaturity;
    }
    if (filters?.decisionMakerLevel && filters.decisionMakerLevel !== "ALL") {
      where.decisionMakerLevel = filters.decisionMakerLevel;
    }
    if (filters?.evidenceConfidence && filters.evidenceConfidence !== "ALL") {
      where.evidenceConfidence = filters.evidenceConfidence;
    }
    if (filters?.geographicPriority && filters.geographicPriority !== "ALL") {
      where.geographicPriority = filters.geographicPriority;
    }
    if (filters?.hasLandingPage !== undefined) {
      where.hasLandingPage = filters.hasLandingPage;
    }
    if (filters?.hasLeadForm !== undefined) {
      where.hasLeadForm = filters.hasLeadForm;
    }
    if (filters?.hasWhatsappCta !== undefined) {
      where.hasWhatsappCta = filters.hasWhatsappCta;
    }

    const sortField = filters?.sortBy || "createdAt";
    const sortOrder = filters?.sortOrder || "desc";

    const [total, records] = await Promise.all([
      prisma.prospect.count({ where }),
      prisma.prospect.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortField]: sortOrder,
        },
        include: {
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    const prospects: ProspectRecord[] = records.map((p) => ({
      ...p,
      companyType: p.companyType as CompanyType,
      leadScore: p.leadScore as LeadScore,
      leadStatus: p.leadStatus as LeadStatus,
    }));

    return {
      prospects,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  /**
   * Retrieves single prospect by ID with strict tenant boundary enforcement
   */
  static async getProspectById(
    organizationId: string,
    id: string
  ): Promise<ProspectRecord> {
    const prospect = await prisma.prospect.findFirst({
      where: {
        id,
        organizationId,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!prospect) {
      throw new NotFoundError("Prospect");
    }

    return {
      ...prospect,
      companyType: prospect.companyType as CompanyType,
      leadScore: prospect.leadScore as LeadScore,
      leadStatus: prospect.leadStatus as LeadStatus,
    };
  }

  /**
   * Creates a new prospect under the tenant organization
   */
  static async createProspect(
    organizationId: string,
    input: CreateProspectInput
  ): Promise<ProspectRecord> {
    // Auto-derive decision maker level from job title if not explicitly set
    const dmLevel = input.decisionMakerLevel && input.decisionMakerLevel !== "UNKNOWN"
      ? input.decisionMakerLevel
      : deriveDecisionMakerLevel(input.jobTitle);

    // Auto-derive geographic priority from location
    const geoPriority = deriveGeographicPriority(input.location);

    // Run qualification scoring engine
    const scoringInput = { ...input, decisionMakerLevel: dmLevel };
    const scoreResult = calculateFullScore(scoringInput);

    // Detect positive signals
    const detectedSignals = detectPositiveSignals({ ...input, decisionMakerLevel: dmLevel });
    const existingSignals: string[] = input.positiveSignals ? (() => { try { return JSON.parse(input.positiveSignals); } catch { return []; } })() : [];
    const mergedSignals = [...new Set([...existingSignals, ...detectedSignals])];
    const positiveSignalsJson = JSON.stringify(mergedSignals);

    // Derive outreach readiness
    const readiness = input.outreachReadiness && input.outreachReadiness !== "NEEDS_RESEARCH"
      ? input.outreachReadiness
      : deriveOutreachReadiness({ ...input, decisionMakerLevel: dmLevel, leadFitTotal: scoreResult.total });

    const prospect = await prisma.prospect.create({
      data: {
        organizationId,
        companyName: input.companyName,
        companyType: input.companyType,
        website: input.website || null,
        location: input.location || null,
        linkedinCompanyUrl: input.linkedinCompanyUrl || null,
        instagramUrl: input.instagramUrl || null,
        companySize: input.companySize || null,
        primaryMarket: input.primaryMarket || null,
        propertySegment: input.propertySegment || null,
        activeProjects: input.activeProjects || null,
        companyNotes: input.companyNotes || null,

        contactName: input.contactName || null,
        jobTitle: input.jobTitle || null,
        businessEmail: input.businessEmail || null,
        businessPhone: input.businessPhone || null,
        linkedinProfile: input.linkedinProfile || null,
        preferredContactChannel: input.preferredContactChannel || null,
        contactSource: input.contactSource || null,

        websiteQuality: input.websiteQuality || "NOT_VERIFIED",
        leadFunnelQuality: input.leadFunnelQuality || "NOT_VERIFIED",
        hasLandingPage: input.hasLandingPage ?? false,
        hasLeadForm: input.hasLeadForm ?? false,
        hasWhatsappCta: input.hasWhatsappCta ?? false,
        visibleAdActivity: input.visibleAdActivity || "NOT_VERIFIED",
        crmVisibility: input.crmVisibility || "NOT_PUBLICLY_VISIBLE",
        leadManagementObservation: input.leadManagementObservation || null,
        marketingObservation: input.marketingObservation || null,
        personalizedOpportunity: input.personalizedOpportunity || null,

        leadScore: scoreResult.priority,
        leadScorePoints: scoreResult.total,
        leadStatus: input.leadStatus || "NEW_PROSPECT",
        outreachChannel: input.outreachChannel || null,
        firstContactDate: input.firstContactDate ? new Date(input.firstContactDate) : null,
        lastContactDate: input.lastContactDate ? new Date(input.lastContactDate) : null,
        nextFollowUpDate: input.nextFollowUpDate ? new Date(input.nextFollowUpDate) : null,
        replyStatus: input.replyStatus || "NO_REPLY",
        meetingStatus: input.meetingStatus || "NONE",
        proposalStatus: input.proposalStatus || "NONE",
        dealStatus: input.dealStatus || "PIPELINE",
        dealValue: input.dealValue ?? null,
        salesNotes: input.salesNotes || null,
        assignedToUserId: input.assignedToUserId || null,

        // Qualification Intelligence (Phase 3 Step 2)
        decisionMakerLevel: dmLevel,
        geographicPriority: geoPriority,
        icpFitScore: scoreResult.icpFit,
        marketFitScore: scoreResult.marketFit,
        leadDependencyScore: scoreResult.leadDependency,
        digitalOpportunityScore: scoreResult.digitalOpportunity,
        salesOperationScore: scoreResult.salesOperation,
        decisionMakerAccessScore: scoreResult.decisionMakerAccess,
        positiveSignals: positiveSignalsJson,
        outreachReadiness: readiness,
        digitalMaturity: input.digitalMaturity || "UNKNOWN",
        propertySegments: input.propertySegments || null,
        evidenceConfidence: input.evidenceConfidence || "UNKNOWN",
        disqualificationReason: input.disqualificationReason || null,
        qualificationSummary: input.qualificationSummary || null,
      },
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return {
      ...prospect,
      companyType: prospect.companyType as CompanyType,
      leadScore: prospect.leadScore as LeadScore,
      leadStatus: prospect.leadStatus as LeadStatus,
    };
  }

  /**
   * Updates existing prospect with strict tenant boundary enforcement
   */
  static async updateProspect(
    organizationId: string,
    id: string,
    input: UpdateProspectInput
  ): Promise<ProspectRecord> {
    // Verify existence & tenant ownership
    await this.getProspectById(organizationId, id);

    const data: Prisma.ProspectUpdateInput = {};

    if (input.companyName !== undefined) data.companyName = input.companyName;
    if (input.companyType !== undefined) data.companyType = input.companyType;
    if (input.website !== undefined) data.website = input.website || null;
    if (input.location !== undefined) data.location = input.location || null;
    if (input.linkedinCompanyUrl !== undefined)
      data.linkedinCompanyUrl = input.linkedinCompanyUrl || null;
    if (input.instagramUrl !== undefined) data.instagramUrl = input.instagramUrl || null;
    if (input.companySize !== undefined) data.companySize = input.companySize || null;
    if (input.primaryMarket !== undefined) data.primaryMarket = input.primaryMarket || null;
    if (input.propertySegment !== undefined) data.propertySegment = input.propertySegment || null;
    if (input.activeProjects !== undefined) data.activeProjects = input.activeProjects || null;
    if (input.companyNotes !== undefined) data.companyNotes = input.companyNotes || null;

    if (input.contactName !== undefined) data.contactName = input.contactName || null;
    if (input.jobTitle !== undefined) data.jobTitle = input.jobTitle || null;
    if (input.businessEmail !== undefined) data.businessEmail = input.businessEmail || null;
    if (input.businessPhone !== undefined) data.businessPhone = input.businessPhone || null;
    if (input.linkedinProfile !== undefined) data.linkedinProfile = input.linkedinProfile || null;
    if (input.preferredContactChannel !== undefined)
      data.preferredContactChannel = input.preferredContactChannel || null;
    if (input.contactSource !== undefined) data.contactSource = input.contactSource || null;

    if (input.websiteQuality !== undefined) data.websiteQuality = input.websiteQuality;
    if (input.leadFunnelQuality !== undefined) data.leadFunnelQuality = input.leadFunnelQuality;
    if (input.hasLandingPage !== undefined) data.hasLandingPage = input.hasLandingPage;
    if (input.hasLeadForm !== undefined) data.hasLeadForm = input.hasLeadForm;
    if (input.hasWhatsappCta !== undefined) data.hasWhatsappCta = input.hasWhatsappCta;
    if (input.visibleAdActivity !== undefined) data.visibleAdActivity = input.visibleAdActivity;
    if (input.crmVisibility !== undefined) data.crmVisibility = input.crmVisibility;
    if (input.leadManagementObservation !== undefined)
      data.leadManagementObservation = input.leadManagementObservation || null;
    if (input.marketingObservation !== undefined)
      data.marketingObservation = input.marketingObservation || null;
    if (input.personalizedOpportunity !== undefined)
      data.personalizedOpportunity = input.personalizedOpportunity || null;

    if (input.leadScore !== undefined) data.leadScore = input.leadScore;
    if (input.leadScorePoints !== undefined) data.leadScorePoints = input.leadScorePoints;
    if (input.leadStatus !== undefined) data.leadStatus = input.leadStatus;
    if (input.outreachChannel !== undefined) data.outreachChannel = input.outreachChannel || null;
    if (input.firstContactDate !== undefined)
      data.firstContactDate = input.firstContactDate ? new Date(input.firstContactDate) : null;
    if (input.lastContactDate !== undefined)
      data.lastContactDate = input.lastContactDate ? new Date(input.lastContactDate) : null;
    if (input.nextFollowUpDate !== undefined)
      data.nextFollowUpDate = input.nextFollowUpDate ? new Date(input.nextFollowUpDate) : null;
    if (input.replyStatus !== undefined) data.replyStatus = input.replyStatus;
    if (input.meetingStatus !== undefined) data.meetingStatus = input.meetingStatus;
    if (input.proposalStatus !== undefined) data.proposalStatus = input.proposalStatus;
    if (input.dealStatus !== undefined) data.dealStatus = input.dealStatus;
    if (input.dealValue !== undefined) data.dealValue = input.dealValue ?? null;
    if (input.salesNotes !== undefined) data.salesNotes = input.salesNotes || null;
    if (input.assignedToUserId !== undefined) {
      if (input.assignedToUserId) {
        data.assignedTo = { connect: { id: input.assignedToUserId } };
      } else {
        data.assignedTo = { disconnect: true };
      }
    }

    // Qualification Intelligence (Phase 3 Step 2) — re-score on update
    const existingProspect = await this.getProspectById(organizationId, id);
    const mergedForScoring = { ...existingProspect, ...input };
    const dmLevel = mergedForScoring.decisionMakerLevel && mergedForScoring.decisionMakerLevel !== "UNKNOWN"
      ? mergedForScoring.decisionMakerLevel
      : deriveDecisionMakerLevel(mergedForScoring.jobTitle);
    const geoPriority = deriveGeographicPriority(mergedForScoring.location);
    const scoreResult = calculateFullScore({ ...mergedForScoring, decisionMakerLevel: dmLevel });
    const detectedSignals = detectPositiveSignals({ ...mergedForScoring, decisionMakerLevel: dmLevel });
    const existingSignals: string[] = mergedForScoring.positiveSignals ? (() => { try { return JSON.parse(mergedForScoring.positiveSignals as string); } catch { return []; } })() : [];
    const mergedSignals = [...new Set([...existingSignals, ...detectedSignals])];
    const readiness = input.outreachReadiness && input.outreachReadiness !== "NEEDS_RESEARCH"
      ? input.outreachReadiness
      : deriveOutreachReadiness({ ...mergedForScoring, decisionMakerLevel: dmLevel, leadFitTotal: scoreResult.total });

    data.decisionMakerLevel = dmLevel;
    data.geographicPriority = geoPriority;
    data.icpFitScore = scoreResult.icpFit;
    data.marketFitScore = scoreResult.marketFit;
    data.leadDependencyScore = scoreResult.leadDependency;
    data.digitalOpportunityScore = scoreResult.digitalOpportunity;
    data.salesOperationScore = scoreResult.salesOperation;
    data.decisionMakerAccessScore = scoreResult.decisionMakerAccess;
    data.leadScore = scoreResult.priority;
    data.leadScorePoints = scoreResult.total;
    data.positiveSignals = JSON.stringify(mergedSignals);
    data.outreachReadiness = readiness;
    if (input.digitalMaturity !== undefined) data.digitalMaturity = input.digitalMaturity;
    if (input.propertySegments !== undefined) data.propertySegments = input.propertySegments || null;
    if (input.evidenceConfidence !== undefined) data.evidenceConfidence = input.evidenceConfidence;
    if (input.disqualificationReason !== undefined) data.disqualificationReason = input.disqualificationReason || null;
    if (input.qualificationSummary !== undefined) data.qualificationSummary = input.qualificationSummary || null;

    const updated = await prisma.prospect.update({
      where: { id },
      data,
      include: {
        assignedTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return {
      ...updated,
      companyType: updated.companyType as CompanyType,
      leadScore: updated.leadScore as LeadScore,
      leadStatus: updated.leadStatus as LeadStatus,
    };
  }

  /**
   * Deletes prospect with strict tenant boundary enforcement
   */
  static async deleteProspect(organizationId: string, id: string): Promise<boolean> {
    await this.getProspectById(organizationId, id);

    await prisma.prospect.delete({
      where: { id },
    });

    return true;
  }

  /**
   * Aggregates tenant overview statistics
   */
  static async getProspectStats(organizationId: string): Promise<ProspectOverviewStats> {
    const [
      totalProspects,
      developersCount,
      brokeragesCount,
      agenciesCount,
      hotLeadsCount,
      meetingsBookedCount,
      proposalsSentCount,
      dealsWithValues,
    ] = await Promise.all([
      prisma.prospect.count({ where: { organizationId } }),
      prisma.prospect.count({ where: { organizationId, companyType: "DEVELOPER" } }),
      prisma.prospect.count({ where: { organizationId, companyType: "BROKERAGE" } }),
      prisma.prospect.count({ where: { organizationId, companyType: "AGENCY" } }),
      prisma.prospect.count({ where: { organizationId, leadScore: "HIGH" } }),
      prisma.prospect.count({
        where: {
          organizationId,
          OR: [{ meetingStatus: "BOOKED" }, { leadStatus: "MEETING_BOOKED" }],
        },
      }),
      prisma.prospect.count({
        where: {
          organizationId,
          OR: [{ proposalStatus: "SENT" }, { leadStatus: "PROPOSAL_SENT" }],
        },
      }),
      prisma.prospect.findMany({
        where: {
          organizationId,
          dealValue: { not: null },
        },
        select: { dealValue: true },
      }),
    ]);

    const totalPipelineValueAed = dealsWithValues.reduce(
      (sum, item) => sum + (item.dealValue || 0),
      0
    );

    return {
      totalProspects,
      developersCount,
      brokeragesCount,
      agenciesCount,
      hotLeadsCount,
      meetingsBookedCount,
      proposalsSentCount,
      totalPipelineValueAed,
    };
  }

  /**
   * Recalculates and persists qualification score for an existing prospect
   */
  static async recalculateScore(organizationId: string, id: string) {
    const prospect = await this.getProspectById(organizationId, id);
    const dmLevel = deriveDecisionMakerLevel(prospect.jobTitle);
    const geoPriority = deriveGeographicPriority(prospect.location);
    const scoreResult = calculateFullScore({ ...prospect, decisionMakerLevel: dmLevel });
    const detectedSignals = detectPositiveSignals({ ...prospect, decisionMakerLevel: dmLevel });
    const readiness = deriveOutreachReadiness({ ...prospect, decisionMakerLevel: dmLevel, leadFitTotal: scoreResult.total });

    const updated = await prisma.prospect.update({
      where: { id },
      data: {
        decisionMakerLevel: dmLevel,
        geographicPriority: geoPriority,
        icpFitScore: scoreResult.icpFit,
        marketFitScore: scoreResult.marketFit,
        leadDependencyScore: scoreResult.leadDependency,
        digitalOpportunityScore: scoreResult.digitalOpportunity,
        salesOperationScore: scoreResult.salesOperation,
        decisionMakerAccessScore: scoreResult.decisionMakerAccess,
        leadScore: scoreResult.priority,
        leadScorePoints: scoreResult.total,
        positiveSignals: JSON.stringify(detectedSignals),
        outreachReadiness: readiness,
      },
    });
    return { prospect: updated, breakdown: scoreResult };
  }

  /**
   * Advisory duplicate check — never silently merges
   */
  static async checkDuplicates(
    organizationId: string,
    input: DuplicateCheckInput
  ): Promise<ProspectDuplicate[]> {
    return findPotentialDuplicates(organizationId, input);
  }

  /**
   * Returns score breakdown for a prospect-shaped object (no DB access)
   */
  static getScoreBreakdown(prospect: Parameters<typeof calculateFullScore>[0]) {
    return calculateFullScore(prospect);
  }
}

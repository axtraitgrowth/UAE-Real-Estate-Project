/**
 * AXTRAIT — UAE Real Estate Offer Configuration & System Architecture
 * Defines the core 8-stage Lead-to-CRM System, target segments, and commercial parameters.
 */

export interface SystemStage {
  step: number;
  id: string;
  name: string;
  category: "acquisition" | "conversion" | "management" | "optimization";
  shortDescription: string;
  fullDescription: string;
  deliverables: string[];
  keyMetric: string;
}

export interface TargetSegment {
  id: "developer" | "brokerage" | "agency";
  title: string;
  subtitle: string;
  primaryPains: string[];
  solutionFocus: string[];
  positioningHook: string;
}

export const AXTRAIT_OFFER = {
  company: {
    name: "AXTRAIT",
    legalName: "AXTRAIT Digital Growth & Technology FZ-LLC",
    tagline: "UAE Real Estate Sales Infrastructure & Growth Engineering",
    positioningStatement:
      "AXTRAIT helps UAE real-estate companies generate, capture and manage qualified leads through landing pages, paid acquisition and CRM systems.",
    primaryMarket: "United Arab Emirates (Dubai, Abu Dhabi, Sharjah)",
    baseCurrency: "AED",
  },

  offerName: "Real Estate Lead Generation & CRM System",
  offerCategory: "Enterprise B2B Growth System",

  coreStages: [
    {
      step: 1,
      id: "paid_ads",
      name: "Paid Acquisition (Meta & Google)",
      category: "acquisition",
      shortDescription: "High-intent buyer & investor acquisition across Meta and Google Search.",
      fullDescription:
        "Engineered ad campaigns targeting verified high-net-worth investors in the UAE, GCC, UK, Europe, and CIS with project-specific messaging and budget qualification.",
      deliverables: [
        "Meta Ads account & pixel setup with Conversion API (CAPI)",
        "High-converting video & carousel ad creatives showcasing Dubai project renders",
        "Google Search campaign structure targeting high-intent real estate search keywords",
        "Negative keyword filtering to block portal scrapers and low-budget renters",
      ],
      keyMetric: "Cost Per Qualified Lead (CPQL)",
    },
    {
      step: 2,
      id: "landing_page",
      name: "Custom Project Landing Pages",
      category: "conversion",
      shortDescription: "Sub-second mobile landing pages designed for high-value property conversions.",
      fullDescription:
        "Bespoke, project-specific digital experiences emphasizing starting prices, payment plans, unit types, and architectural exclusivity without portal distractions.",
      deliverables: [
        "Custom responsive landing page built for speed (< 1s load time)",
        "Clear value proposition: Starting prices in AED, payment schedules, completion dates",
        "Interactive floor plans, location amenities map, and project brochure download",
        "DLD & RERA compliance disclosures and developer legal attribution",
      ],
      keyMetric: "Landing Page Conversion Rate (Visitor → Lead)",
    },
    {
      step: 3,
      id: "lead_capture",
      name: "Frictionless Multi-Step Lead Capture",
      category: "conversion",
      shortDescription: "Smart qualification forms & direct verified WhatsApp integration.",
      fullDescription:
        "Filters out casual browsers through multi-step buyer questions (budget tier, investment horizon, end-user vs. investor) before capturing verified phone credentials.",
      deliverables: [
        "Multi-step qualification forms with automated phone formatting (+971 & international)",
        "Pre-filled WhatsApp click-to-chat deep links tied directly to campaign source",
        "Immediate automated email confirmation with project investment brief",
        "Form bot protection and disposable phone number prevention",
      ],
      keyMetric: "Form Completion Rate & Lead Validity %",
    },
    {
      step: 4,
      id: "crm_setup",
      name: "Real Estate CRM & Pipeline Architecture",
      category: "management",
      shortDescription: "Structured sales pipeline built specifically for Dubai real estate sales cycles.",
      fullDescription:
        "Complete CRM setup with multi-stage buyer pipelines, developer inventory links, and agent permission boundaries preventing unauthorized lead export or leak.",
      deliverables: [
        "Custom real estate pipeline: New Inbound → Contacted → Qualified → Viewing → EOI → SPA Closed",
        "Custom property fields: Preferred Community, Unit Type, Budget Range (AED), Financing Type",
        "Multi-tenant agent permission matrix (Agents view only assigned leads; Directors view full portfolio)",
        "Centralized conversation history: WhatsApp, calls, email, and property viewing logs",
      ],
      keyMetric: "Pipeline Velocity (Days from Lead to Deal)",
    },
    {
      step: 5,
      id: "lead_assignment",
      name: "Instant Automated Lead Routing",
      category: "management",
      shortDescription: "Under-60-second lead distribution to active property consultants.",
      fullDescription:
        "Round-robin, territory-based, or agent-performance lead assignment ensuring inbound buyer enquiries are handed to available agents in seconds, not hours.",
      deliverables: [
        "Automated instant lead distribution engine with round-robin or territory weighting",
        "Real-time WhatsApp & SMS push alerts to assigned property brokers with full lead profile",
        "Fallback re-routing if an agent fails to acknowledge receipt within 10 minutes",
        "Lead assignment audit log for management supervision",
      ],
      keyMetric: "Lead Assignment Speed (< 60 Seconds)",
    },
    {
      step: 6,
      id: "sales_followup",
      name: "Agent Follow-Up & Supervision",
      category: "management",
      shortDescription: "Strict follow-up SLAs and sales activity tracking.",
      fullDescription:
        "Ensures every generated lead receives mandatory, structured follow-ups with manager oversight and automated reminders for scheduled viewing appointments.",
      deliverables: [
        "Follow-up SLA monitor enforcing first contact within 15 minutes of lead capture",
        "Task scheduler for scheduled site visits, developer showroom tours, and contract reviews",
        "Manager escalation dashboard for stalled or neglected buyer leads",
        "Call outcome logging and appointment confirmation templates",
      ],
      keyMetric: "First Response Time & Follow-up Compliance %",
    },
    {
      step: 7,
      id: "reporting",
      name: "Real-Time Marketing-to-Sales Attribution",
      category: "optimization",
      shortDescription: "Transparent ROI reporting linking ad spend directly to signed SPAs.",
      fullDescription:
        "Clear executive dashboards revealing exactly which ad campaigns, creatives, and platforms produced booked site viewings and signed sale contracts.",
      deliverables: [
        "Executive dashboard tracking Total Ad Spend, Total Leads, Qualified Leads, and Booked Viewings",
        "Cost-per-viewing and cost-per-acquisition (CPA) analytics in AED",
        "Agent conversion leaderboard showing closing rates by sales consultant",
        "Weekly automated PDF summary sent to Developer Principles and Sales Directors",
      ],
      keyMetric: "Return On Ad Spend (ROAS) & Cost Per SPA",
    },
    {
      step: 8,
      id: "optimization",
      name: "Continuous Conversion Rate Optimization (CRO)",
      category: "optimization",
      shortDescription: "Weekly iterative testing of creatives, landing pages, and budgets.",
      fullDescription:
        "Systematic A/B testing of marketing hooks, landing page layouts, and targeting parameters to drive down acquisition costs and scale volume.",
      deliverables: [
        "Weekly creative refreshment to prevent ad fatigue in competitive Dubai real estate feeds",
        "Landing page split testing (headline, payment plan prominence, call-to-action layout)",
        "Budget reallocation toward top-performing nationalities and high-yield buyer segments",
        "Bi-weekly strategy call with AXTRAIT growth engineers",
      ],
      keyMetric: "Month-Over-Month CPQL Reduction Rate",
    },
  ] as SystemStage[],

  optionalAddons: [
    {
      id: "ai_qualification",
      name: "AI WhatsApp Concierge & Qualification",
      tier: "Advanced Capability (Optional Upsell)",
      shortDescription:
        "Autonomous 24/7 multilingual conversational qualification via official WhatsApp Business API.",
      capabilities: [
        "Instant sub-30-second conversational qualification in English, Arabic, Russian, and French",
        "Budget verification and timeline qualification prior to human broker handoff",
        "Automated brochure and floor plan document dispatch directly inside WhatsApp chat",
        "Automatic CRM lead record enrichment with conversation summary and transcript",
      ],
    },
  ],

  targetSegments: [
    {
      id: "developer",
      title: "Real Estate Developers",
      subtitle: "Master developers, private builders & off-plan project developers in the UAE",
      primaryPains: [
        "Massive upfront launch marketing budgets wasted on generic portal listings",
        "Lack of direct investor ownership — relying on external brokers who promote competing projects",
        "Inability to track which international ad campaigns produce actual off-plan buyers",
        "Slow speed-to-lead across international time zones (UK, Europe, Asia)",
      ],
      solutionFocus: [
        "Dedicated project launch landing pages with custom payment plan calculators",
        "Direct international investor acquisition campaigns driving proprietary buyer databases",
        "Real-time pipeline visibility for the Developer Head of Sales",
      ],
      positioningHook:
        "Launch your next master development with a direct buyer acquisition engine that builds your own proprietary investor database.",
    },
    {
      id: "brokerage",
      title: "Real Estate Brokerages",
      subtitle: "Multi-agent real estate firms managing 10 to 100+ property consultants",
      primaryPains: [
        "High cost of portal subscription fees with decreasing lead exclusivity",
        "Agents failing to follow up with leads quickly, losing buyers to rival brokerages",
        "Zero transparency into agent activity, call logs, or pipeline stage status",
        "Leads leaking or being mishandled without manager accountability",
      ],
      solutionFocus: [
        "Under-60-second automated lead routing directly to top-performing agents",
        "Strict follow-up SLA monitoring with managerial alerts for neglected leads",
        "High-converting landing pages tailored to high-commission luxury communities",
      ],
      positioningHook:
        "Equip your sales team with exclusive high-intent buyer leads and a disciplined CRM follow-up system that enforces agent accountability.",
    },
    {
      id: "agency",
      title: "Boutique Real Estate Agencies",
      subtitle: "Independent agencies and specialized luxury property advisory firms",
      primaryPains: [
        "Unpredictable monthly revenue driven primarily by sporadic personal referrals",
        "Limited technical bandwidth to configure tracking pixels, landing pages, and CRM systems",
        "Wasting time fielding unqualified inquiries from renters or casual window-shoppers",
      ],
      solutionFocus: [
        "Turnkey, fully-managed lead acquisition with pre-qualified budget filters",
        "Clear, clean CRM pipelines that require zero technical expertise to manage",
        "Predictable month-over-month qualified buyer volume",
      ],
      positioningHook:
        "Replace unpredictable referral cycles with an automated, predictable pipeline of qualified Dubai property buyers.",
    },
  ] as TargetSegment[],
};

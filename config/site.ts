/**
 * Global Platform Site & Company Configuration
 * Supports both the AXTRAIT Growth Engineering company and the Apex UAE software system.
 */

export const siteConfig = {
  // Application brand
  name: "Apex UAE",
  fullName: "Apex UAE - Real Estate Sales Management & Supervision OS",
  description: "Enterprise multi-tenant supervision and sales management platform designed for Dubai real estate developers, agencies, and sales leaders.",
  
  // Parent / Provider company
  parentCompany: {
    name: "AXTRAIT",
    legalName: "AXTRAIT Digital Growth & Technology FZ-LLC",
    tagline: "UAE Real Estate Sales Infrastructure & Growth Engineering",
    positioning: "AXTRAIT helps UAE real-estate companies generate, capture and manage qualified leads through landing pages, paid acquisition and CRM systems.",
    website: "https://axtrait.com",
    contactEmail: "sales@axtrait.com",
  },

  locale: "en-AE",
  defaultCurrency: "AED",
  defaultTimezone: "Asia/Dubai",
  links: {
    docs: "/docs/ARCHITECTURE.md",
    salesOffer: "/docs/sales/01_UAE_REAL_ESTATE_OFFER.md",
    solutionPage: "/real-estate",
  },
  company: {
    jurisdiction: "Dubai, United Arab Emirates",
    defaultVatRate: 0.05, // 5% UAE VAT
  },
};

import { z } from "zod";

/**
 * Authentication Schemas
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Switch Organization Schema
 */
export const switchOrgSchema = z.object({
  organizationId: z.string({ required_error: "Organization ID is required" }).min(1),
});

export type SwitchOrgInput = z.infer<typeof switchOrgSchema>;

/**
 * Organization Update Schema (Dubai / UAE specific validation)
 */
export const updateOrganizationSchema = z.object({
  name: z.string().min(2, "Company name must be at least 2 characters").max(120),
  phone: z.string().optional().nullable(),
  address: z.string().max(255).optional().nullable(),
  taxNumber: z
    .string()
    .regex(/^(\d{15})?$/, "UAE TRN must be exactly 15 digits when provided")
    .optional()
    .nullable(),
  currency: z.string().min(3).max(3).default("AED"),
  timezone: z.string().default("Asia/Dubai"),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

/**
 * User Profile Update Schema
 */
export const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(60),
  lastName: z.string().min(1, "Last name is required").max(60),
  phone: z.string().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

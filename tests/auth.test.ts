import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../lib/auth/passwords";
import { createSessionToken, verifySessionToken } from "../lib/auth/session";
import { loginSchema } from "../lib/validation/schemas";

export async function testAuth() {
  console.log("\n▶ Running Suite: Authentication Foundation Tests");

  // 1. Password Hashing & Verification
  const rawPassword = "ApexDubaiPassword2026!";
  const hash = await hashPassword(rawPassword);
  assert.ok(hash.startsWith("$2"), "Password hash should be standard bcrypt format");

  const isMatch = await verifyPassword(rawPassword, hash);
  assert.equal(isMatch, true, "Valid password should verify successfully");

  const isWrong = await verifyPassword("WrongPassword123", hash);
  assert.equal(isWrong, false, "Invalid password should fail verification");
  console.log("  ✓ Password hashing and bcrypt comparison verified");

  // 2. JWT Session Generation & Verification
  const sessionData = {
    userId: "usr_test_123",
    email: "test@emaar.ae",
    currentOrgId: "org_emaar_123",
    roleId: "role_owner",
    roleSlug: "owner",
  };

  const token = await createSessionToken(sessionData);
  assert.ok(typeof token === "string" && token.length > 20, "Token should be a valid JWT string");

  const verified = await verifySessionToken(token);
  assert.ok(verified !== null, "Verified token payload should not be null");
  assert.equal(verified?.userId, sessionData.userId, "Payload userId matches");
  assert.equal(verified?.currentOrgId, sessionData.currentOrgId, "Payload orgId matches");
  assert.equal(verified?.roleSlug, "owner", "Payload roleSlug matches");
  console.log("  ✓ JWT session token creation and verification verified");

  // 3. Login Validation Schema
  const validLogin = loginSchema.safeParse({
    email: "agent@emaar.ae",
    password: "Password123!",
  });
  assert.equal(validLogin.success, true, "Valid login input should pass schema");

  const invalidEmail = loginSchema.safeParse({
    email: "invalid-email-format",
    password: "Password123!",
  });
  assert.equal(invalidEmail.success, false, "Invalid email should fail schema");

  const shortPassword = loginSchema.safeParse({
    email: "agent@emaar.ae",
    password: "123",
  });
  assert.equal(shortPassword.success, false, "Short password should fail schema");
  console.log("  ✓ Zod login credential validation rules verified");
}

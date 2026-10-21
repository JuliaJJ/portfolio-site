import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE_NAME = "site-auth";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// Cookie value. Derived from the password so changing it signs everyone out.
// Returns null when misconfigured in production → nobody gets in (fail closed).
export function getAuthToken(): string | null {
  const password = process.env["SITE_PASSWORD"];
  const secret =
    process.env["SITE_AUTH_SECRET"] ?? (import.meta.env.DEV ? "dev-insecure" : undefined);
  if (!password || !secret) return null;
  return createHmac("sha256", secret).update(password).digest("hex");
}

// Constant-time string comparison
export function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function safeRedirect(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

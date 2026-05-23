export const COOKIE_NAME = "site-auth";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getAuthToken(): string {
  return import.meta.env.SITE_AUTH_SECRET ?? "dev-insecure";
}

export function safeRedirect(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

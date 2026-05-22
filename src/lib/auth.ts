export const COOKIE_NAME = "site-auth";
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function getAuthToken(): Promise<string> {
  const password = import.meta.env.SITE_PASSWORD ?? "";
  const secret = import.meta.env.SITE_AUTH_SECRET ?? "dev-insecure";

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(password));
  return Array.from(new Uint8Array(sig), (b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
}

export function safeRedirect(from: string | null): string {
  if (!from || !from.startsWith("/") || from.startsWith("//")) return "/";
  return from;
}

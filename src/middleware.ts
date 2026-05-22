import { defineMiddleware } from "astro:middleware";
import { COOKIE_NAME, getAuthToken } from "./lib/auth";

// Routes that never require auth
const PUBLIC_PREFIXES = ["/api/auth", "/keystatic", "/api/keystatic"];
const PUBLIC_EXACT = new Set(["/login"]);

export const onRequest = defineMiddleware(async (context, next) => {
  // No password configured → open (local dev without env set)
  if (!import.meta.env.SITE_PASSWORD) return next();

  const { pathname } = context.url;

  if (
    PUBLIC_EXACT.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return next();
  }

  const token = context.cookies.get(COOKIE_NAME)?.value;
  const expected = await getAuthToken();

  if (token === expected) return next();

  const from = pathname !== "/" ? `?from=${encodeURIComponent(pathname)}` : "";
  return context.redirect(`/login${from}`);
});

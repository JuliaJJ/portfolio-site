import { defineMiddleware } from "astro:middleware";
import { COOKIE_NAME, getAuthToken } from "./lib/auth";

// Routes that never require auth
const PUBLIC_PREFIXES = ["/api/auth", "/keystatic", "/api/keystatic"];
const PUBLIC_EXACT = new Set(["/login"]);

export const onRequest = defineMiddleware((context, next) => {
  // No password configured → open (local dev without env set)
  if (!process.env["SITE_PASSWORD"]) return next();

  const { pathname } = context.url;

  if (
    PUBLIC_EXACT.has(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  ) {
    return next();
  }

  const cookieHeader = context.request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${COOKIE_NAME}=`))
    ?.slice(COOKIE_NAME.length + 1);

  if (token === getAuthToken()) return next();

  const from = pathname !== "/" ? `?from=${encodeURIComponent(pathname)}` : "";
  return context.redirect(`/login${from}`);
});

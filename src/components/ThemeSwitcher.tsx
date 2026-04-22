// src/components/ThemeSwitcher.tsx
// Reads/writes data-theme on <html> and persists to localStorage.

import { useState, useEffect } from "react";

type ThemeId = "default" | "pixel" | "editorial";

const THEMES: { id: ThemeId; label: string; bg: string; accent: string }[] = [
  { id: "default",   label: "Default",   bg: "#0e0f14", accent: "#22d3ee" },
  { id: "pixel",     label: "Pixel",     bg: "#070a07", accent: "#00ff41" },
  { id: "editorial", label: "Editorial", bg: "#f8f4ed", accent: "#c8102e" },
];

function getInitialTheme(): ThemeId {
  if (typeof window === "undefined") return "default";
  return (localStorage.getItem("theme") as ThemeId) ?? "default";
}

export default function ThemeSwitcher() {
  const [active, setActive] = useState<ThemeId>(getInitialTheme);

  useEffect(() => {
    const html = document.documentElement;
    if (active === "default") {
      html.removeAttribute("data-theme");
    } else {
      html.setAttribute("data-theme", active);
    }
    localStorage.setItem("theme", active);
  }, [active]);

  return (
    <div
      role="radiogroup"
      aria-label="Site theme"
      style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}
    >
      {THEMES.map(({ id, label, bg, accent }) => (
        <button
          key={id}
          role="radio"
          aria-checked={active === id}
          aria-label={`${label} theme`}
          title={label}
          onClick={() => setActive(id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "3px 8px 3px 5px",
            border: active === id
              ? `1px solid ${accent}`
              : "1px solid transparent",
            borderRadius: "var(--radius-sm, 4px)",
            background: active === id ? "transparent" : "transparent",
            cursor: "pointer",
            transition: "border-color var(--duration-fast, 120ms) var(--ease-out, ease)",
          }}
        >
          {/* Swatch */}
          <span
            aria-hidden="true"
            style={{
              display: "block",
              width: "10px",
              height: "10px",
              borderRadius: "var(--radius-sm, 2px)",
              background: `linear-gradient(135deg, ${bg} 50%, ${accent} 50%)`,
              border: "1px solid rgba(128,128,128,0.3)",
              flexShrink: 0,
            }}
          />
          {/* Label */}
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-xs, 11px)",
              fontWeight: "var(--weight-medium, 500)",
              letterSpacing: "var(--tracking-widest, 0.14em)",
              textTransform: "uppercase",
              color: active === id
                ? "var(--accent)"
                : "var(--text-3)",
              transition: "color var(--duration-fast, 120ms)",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

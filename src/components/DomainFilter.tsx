// src/components/DomainFilter.tsx
// React island: renders interactive filter pills and controls card visibility
// via data attributes on the pre-rendered Astro card list.
//
// Architecture:
//   Astro renders all cards with data-card-domain / data-card-types attrs.
//   This island owns the filter state and shows/hides those <li> elements
//   directly via style.display. URL params are kept in sync via replaceState
//   so filter state is shareable without triggering a page reload.

import { useState, useEffect } from "react";

interface Props {
  domains: string[];
  types: string[];
}

export default function DomainFilter({ domains, types }: Props) {
  // Lazy-initialize from URL so the correct filter applies on first render.
  // Safe to access window here because this component is client-only.
  const [activeDomain, setActiveDomain] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return new URLSearchParams(window.location.search).get("domain") ?? "all";
  });

  const [activeType, setActiveType] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return new URLSearchParams(window.location.search).get("type") ?? "all";
  });

  // null = first render hasn't applied yet; avoids flash of "no results"
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-card-domain]");
    let count = 0;

    items.forEach((el) => {
      const domain = el.dataset.cardDomain ?? "";
      const cardTypes = el.dataset.cardTypes?.split(",") ?? [];
      const domainMatch = activeDomain === "all" || domain === activeDomain;
      const typeMatch = activeType === "all" || cardTypes.includes(activeType);
      const visible = domainMatch && typeMatch;
      el.style.display = visible ? "" : "none";
      if (visible) count++;
    });

    setVisibleCount(count);

    // Keep URL in sync for shareability — replaceState avoids cluttering
    // browser history with every filter tap.
    const params = new URLSearchParams();
    if (activeDomain !== "all") params.set("domain", activeDomain);
    if (activeType !== "all") params.set("type", activeType);
    const search = params.toString();
    window.history.replaceState(
      {},
      "",
      search
        ? `${window.location.pathname}?${search}`
        : window.location.pathname
    );
  }, [activeDomain, activeType]);

  function selectDomain(d: string) {
    // Clicking the active filter toggles it off
    setActiveDomain((prev) => (prev === d ? "all" : d));
  }

  function selectType(t: string) {
    setActiveType((prev) => (prev === t ? "all" : t));
  }

  function reset() {
    setActiveDomain("all");
    setActiveType("all");
  }

  return (
    <>
      <nav className="filter-bar" aria-label="Filter case studies">
        <div className="filter-group">
          <span className="filter-label">Domain</span>
          {domains.map((d) => (
            <button
              key={d}
              className={`filter-pill${activeDomain === d ? " active" : ""}`}
              onClick={() => selectDomain(d)}
              aria-pressed={activeDomain === d}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="filter-group">
          <span className="filter-label">Type</span>
          {types.map((t) => (
            <button
              key={t}
              className={`filter-pill${activeType === t ? " active" : ""}`}
              onClick={() => selectType(t)}
              aria-pressed={activeType === t}
            >
              {t}
            </button>
          ))}
        </div>
      </nav>

      {visibleCount === 0 && (
        <p className="no-results">
          No case studies match that filter.{" "}
          <button className="reset-btn" onClick={reset}>
            Show all work
          </button>
        </p>
      )}
    </>
  );
}

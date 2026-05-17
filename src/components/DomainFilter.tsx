// src/components/DomainFilter.tsx
// React island: renders interactive filter pills and controls card visibility
// via data attributes on the pre-rendered Astro card list.
//
// Architecture:
//   Astro renders all cards with data-card-types attrs.
//   This island owns the filter state and shows/hides those <li> elements
//   directly via style.display. URL params are kept in sync via replaceState
//   so filter state is shareable without triggering a page reload.

import { useState, useEffect } from "react";

interface Props {
  types: string[];
}

export default function DomainFilter({ types }: Props) {
  // Lazy-initialize from URL so the correct filter applies on first render.
  // Safe to access window here because this component is client-only.
  const [activeType, setActiveType] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return new URLSearchParams(window.location.search).get("type") ?? "all";
  });

  // null = first render hasn't applied yet; avoids flash of "no results"
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-card-types]");
    let count = 0;

    items.forEach((el) => {
      const cardTypes = el.dataset.cardTypes?.split(",") ?? [];
      const typeMatch = activeType === "all" || cardTypes.includes(activeType);
      el.style.display = typeMatch ? "" : "none";
      if (typeMatch) count++;
    });

    setVisibleCount(count);

    // Keep URL in sync for shareability — replaceState avoids cluttering
    // browser history with every filter tap.
    const params = new URLSearchParams();
    if (activeType !== "all") params.set("type", activeType);
    const search = params.toString();
    window.history.replaceState(
      {},
      "",
      search
        ? `${window.location.pathname}?${search}`
        : window.location.pathname
    );
  }, [activeType]);

  function selectType(t: string) {
    setActiveType((prev) => (prev === t ? "all" : t));
  }

  function reset() {
    setActiveType("all");
  }

  return (
    <>
      <nav className="filter-bar" aria-label="Filter case studies">
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

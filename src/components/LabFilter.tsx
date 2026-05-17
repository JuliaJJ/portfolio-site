// src/components/LabFilter.tsx
// React island: filter lab cards by type and freeform tags.
// Architecture mirrors DomainFilter — cards have data-lab-type / data-lab-tags
// attributes set by Astro at build time; this island controls visibility.

import { useState, useEffect } from "react";

interface Props {
  types: string[];
  tags: string[];
}

export default function LabFilter({ types, tags }: Props) {
  const [activeType, setActiveType] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return new URLSearchParams(window.location.search).get("type") ?? "all";
  });

  const [activeTag, setActiveTag] = useState<string>(() => {
    if (typeof window === "undefined") return "all";
    return new URLSearchParams(window.location.search).get("tag") ?? "all";
  });

  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-lab-type]");
    let count = 0;

    items.forEach((el) => {
      const type = el.dataset.labType ?? "";
      const cardTags = el.dataset.labTags?.split(",").filter(Boolean) ?? [];
      const typeMatch = activeType === "all" || type === activeType;
      const tagMatch = activeTag === "all" || cardTags.includes(activeTag);
      const visible = typeMatch && tagMatch;
      el.style.display = visible ? "" : "none";
      if (visible) count++;
    });

    setVisibleCount(count);

    const params = new URLSearchParams();
    if (activeType !== "all") params.set("type", activeType);
    if (activeTag !== "all") params.set("tag", activeTag);
    const search = params.toString();
    window.history.replaceState(
      {},
      "",
      search
        ? `${window.location.pathname}?${search}`
        : window.location.pathname
    );
  }, [activeType, activeTag]);

  function reset() {
    setActiveType("all");
    setActiveTag("all");
  }

  return (
    <>
      <nav className="filter-bar" aria-label="Filter lab projects">
        {types.length > 1 && (
          <div className="filter-group">
            <span className="filter-label">Type</span>
            {types.map((t) => (
              <button
                key={t}
                className={`filter-pill${activeType === t ? " active" : ""}`}
                onClick={() => setActiveType((prev) => (prev === t ? "all" : t))}
                aria-pressed={activeType === t}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {tags.length > 0 && (
          <div className="filter-group">
            <span className="filter-label">Tags</span>
            {tags.map((tag) => (
              <button
                key={tag}
                className={`filter-pill${activeTag === tag ? " active" : ""}`}
                onClick={() => setActiveTag((prev) => (prev === tag ? "all" : tag))}
                aria-pressed={activeTag === tag}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </nav>

      {visibleCount === 0 && (
        <p className="no-results">
          No lab entries match that filter.{" "}
          <button className="reset-btn" onClick={reset}>
            Show all
          </button>
        </p>
      )}
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { PoliticalGraph3DDynamic } from "@/components/PoliticalGraph3DDynamic";
import { PersonalityPanel } from "@/components/PersonalityPanel";
import {
  publishedFigures,
  searchPersonalities,
  type Personality,
} from "@/data/personalities";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "politician", label: "Politicians" },
  { id: "business", label: "Business" },
  { id: "intellectual", label: "Intellectuals" },
  { id: "activist", label: "Activists" },
  { id: "religious", label: "Religious" },
] as const;

function matchesFilter(p: Personality, filter: string) {
  if (filter === "all") return true;
  const blob = `${p.roles.join(" ")} ${p.tags.join(" ")}`.toLowerCase();
  if (filter === "politician") {
    return /president|prime minister|chancellor|representative|senator|opposition|minister|congress/.test(
      blob,
    );
  }
  if (filter === "business") return /ceo|investor|technologist|business|philanthropist/.test(blob);
  if (filter === "activist") return /activist|climate|education activist/.test(blob);
  if (filter === "religious") return /pope|monk|swami|catholic|hindu|religious|vedanta/.test(blob);
  if (filter === "intellectual") {
    return /economist|psychologist|philosopher|author|intellectual|theorist/.test(blob);
  }
  return true;
}

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const [selected, setSelected] = useState<Personality | null>(
    publishedFigures().find((p) => p.id === "elon-musk") ?? publishedFigures()[0],
  );

  const filtered = useMemo(() => {
    return searchPersonalities(query).filter((p) => matchesFilter(p, filter));
  }, [query, filter]);

  const highlightIds = selected ? [selected.id] : filtered.map((p) => p.id);

  return (
    <div className="map-layout">
      <div className="graph-panel">
        <div className="graph-toolbar">
          <input
            type="search"
            placeholder="Search Modi, Musk, Sen, Milei…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search public figures"
          />
          <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
            {filtered.length} / {publishedFigures().length} figures
          </span>
        </div>
        <div className="filter-row">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              className={`filter-chip ${filter === f.id ? "is-on" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <PoliticalGraph3DDynamic
          personalities={query || filter !== "all" ? filtered : publishedFigures()}
          selectedId={selected?.id}
          highlightIds={query || filter !== "all" ? highlightIds : undefined}
          onSelect={(p) => setSelected(p)}
        />
      </div>

      <div className="side-stack">
        <div className="results-hero">
          <p className="eyebrow">Explore</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", margin: "0.25rem 0" }}>
            Public figures in the constellation
          </h1>
          <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "0.95rem" }}>
            Hand-scored interpretive placements with confidence tags. Human
            approval required before any AI-drafted score can publish.
          </p>
          <ul className="neighbor-list" style={{ marginTop: "1rem", maxHeight: 320, overflow: "auto" }}>
            {filtered.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  className={selected?.id === p.id ? "is-active" : ""}
                  onClick={() => setSelected(p)}
                >
                  <span>
                    {p.name}
                    <span style={{ display: "block", fontSize: "0.75rem", color: "var(--ink-soft)" }}>
                      {p.roles[0]}
                    </span>
                  </span>
                  <span style={{ fontSize: "0.8rem", textTransform: "capitalize" }}>
                    {p.confidence}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {selected && (
          <PersonalityPanel person={selected} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}

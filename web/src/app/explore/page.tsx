"use client";

import { useMemo, useState } from "react";
import { PoliticalGraph3DDynamic } from "@/components/PoliticalGraph3DDynamic";
import { PersonalityPanel } from "@/components/PersonalityPanel";
import {
  personalities,
  searchPersonalities,
  type Personality,
} from "@/data/personalities";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Personality | null>(
    personalities.find((p) => p.id === "elon-musk") ?? personalities[0],
  );

  const filtered = useMemo(() => searchPersonalities(query), [query]);
  const highlightIds = selected ? [selected.id] : filtered.map((p) => p.id);

  return (
    <div className="map-layout">
      <div className="graph-panel">
        <div className="graph-toolbar">
          <input
            type="search"
            placeholder="Search Modi, Musk, Soros, Xi…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search public figures"
          />
          <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
            {filtered.length} figures
          </span>
        </div>
        <PoliticalGraph3DDynamic
          personalities={query ? filtered : personalities}
          selectedId={selected?.id}
          highlightIds={query ? highlightIds : undefined}
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
            Placements are interpretive composites from public speeches,
            platforms, funding, and institutional roles — with confidence tags.
          </p>
          <ul className="neighbor-list" style={{ marginTop: "1rem", maxHeight: 280, overflow: "auto" }}>
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

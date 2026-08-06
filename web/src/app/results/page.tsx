"use client";

import Link from "next/link";
import { useMemo, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PoliticalGraph3DDynamic } from "@/components/PoliticalGraph3DDynamic";
import { PersonalityPanel } from "@/components/PersonalityPanel";
import { ShareMapButton } from "@/components/ShareMapButton";
import { ResearchPanelOptIn } from "@/components/ResearchPanelOptIn";
import type { Personality } from "@/data/personalities";
import { getPersonality } from "@/data/personalities";
import { useSurveyStore } from "@/store/survey";
import {
  axisLabels,
  decodeResultPayload,
  nearestClusters,
  nearestPersonalities,
  religiosityFromAnswers,
  similarityPercent,
  overallConfidence,
  type Answers,
} from "@/lib/scoring";
import { confidenceLabel } from "@/lib/adaptive";

function ResultsInner() {
  const search = useSearchParams();
  const store = useSurveyStore();
  const [selected, setSelected] = useState<Personality | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  const payload = useMemo(() => {
    const token = search.get("r");
    if (token) return decodeResultPayload(token);
    if (store.resultCoords) {
      return {
        coords: store.resultCoords,
        admired: store.admired,
        confidence: store.resultConfidence ?? undefined,
        questionsAnswered: store.questionsAnswered || undefined,
      };
    }
    return null;
  }, [
    search,
    store.resultCoords,
    store.admired,
    store.resultConfidence,
    store.questionsAnswered,
  ]);

  const coords = payload?.coords ?? null;
  const neighbors = useMemo(
    () => (coords ? nearestPersonalities(coords, 8) : []),
    [coords],
  );
  const clusterHits = useMemo(
    () => (coords ? nearestClusters(coords, 3) : []),
    [coords],
  );
  const labels = coords ? axisLabels(coords) : null;
  const religion = religiosityFromAnswers(
    (hydrated ? store.answers : {}) as Answers,
  );

  const highlightIds = neighbors.slice(0, 5).map((n) => n.personality.id);

  useEffect(() => {
    if (neighbors[0] && !selected) {
      setSelected(neighbors[0].personality);
    }
  }, [neighbors, selected]);

  if (!hydrated) {
    return (
      <div className="survey-shell">
        <p className="blurb">Loading your constellation…</p>
      </div>
    );
  }

  if (!coords || !payload) {
    return (
      <div className="survey-shell">
        <h1>No map yet</h1>
        <p className="blurb">Take the free survey to place yourself in idea-space.</p>
        <Link href="/survey" className="btn btn-primary">
          Take the map
        </Link>
      </div>
    );
  }

  const primary = clusterHits[0]?.cluster;
  const conf = payload.confidence;
  const overall = conf ? overallConfidence(conf) : null;

  return (
    <div className="map-layout">
      <div className="graph-panel">
        <div className="graph-toolbar">
          <strong>Your position in idea-space</strong>
          <div className="cta-row">
            <ShareMapButton
              coords={coords}
              clusterName={primary?.name ?? "your cluster"}
            />
            <Link href="/compare" className="btn btn-ghost" style={{ padding: "0.45rem 0.9rem" }}>
              Compare
            </Link>
            <Link href="/survey" className="btn btn-ghost" style={{ padding: "0.45rem 0.9rem" }}>
              Retake
            </Link>
          </div>
        </div>
        <PoliticalGraph3DDynamic
          userCoords={coords}
          selectedId={selected?.id}
          highlightIds={highlightIds}
          onSelect={setSelected}
        />
      </div>

      <div className="side-stack">
        <div className="results-hero">
          <p className="eyebrow">Thinking group</p>
          <h1>
            You sit nearest{" "}
            <span className="cluster-name">{primary?.name ?? "—"}</span>
          </h1>
          <p style={{ margin: 0, color: "var(--ink-soft)" }}>{primary?.blurb}</p>
          {clusterHits.length > 1 && (
            <p style={{ margin: "0.75rem 0 0", fontSize: "0.9rem", color: "var(--ink-soft)" }}>
              Also close to{" "}
              {clusterHits
                .slice(1)
                .map((c) => c.cluster.name)
                .join(" and ")}
              .
            </p>
          )}
          <div className="coord-inline">
            <span>
              Economic {coords.economic > 0 ? "+" : ""}
              {coords.economic} · {labels?.economic}
            </span>
            <span>
              Authority {coords.authority > 0 ? "+" : ""}
              {coords.authority} · {labels?.authority}
            </span>
            <span>
              Cultural {coords.cultural > 0 ? "+" : ""}
              {coords.cultural} · {labels?.cultural}
            </span>
            <span>Faith tag · {religion.label}</span>
          </div>
          {conf && overall != null && (
            <div className="confidence-strip" style={{ marginTop: "1rem" }}>
              <div className="confidence-strip-item" style={{ gridColumn: "1 / -1" }}>
                <span>Adaptive confidence</span>
                <div className="confidence-bar">
                  <i style={{ width: `${overall}%` }} />
                </div>
                <em>
                  {overall}% · {confidenceLabel(overall)}
                  {payload.questionsAnswered
                    ? ` · ${payload.questionsAnswered} Qs`
                    : ""}
                </em>
              </div>
              {(["economic", "authority", "cultural"] as const).map((axis) => (
                <div key={axis} className="confidence-strip-item">
                  <span>{axis}</span>
                  <div className="confidence-bar">
                    <i style={{ width: `${conf[axis]}%` }} />
                  </div>
                  <em>{conf[axis]}%</em>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="results-hero">
          <p className="eyebrow">Nearest public figures</p>
          <ul className="neighbor-list" style={{ marginTop: "0.75rem" }}>
            {neighbors.map((n) => (
              <li key={n.personality.id}>
                <button
                  type="button"
                  className={selected?.id === n.personality.id ? "is-active" : ""}
                  onClick={() => setSelected(n.personality)}
                >
                  <span>{n.personality.name}</span>
                  <span>{n.similarity}%</span>
                </button>
              </li>
            ))}
          </ul>
          {payload?.admired
            ?.filter((id) => id !== "none")
            .map((id) => {
              const p = getPersonality(id);
              if (!p) return null;
              const sim = similarityPercent(coords, p.coords);
              return (
                <p
                  key={id}
                  style={{ fontSize: "0.85rem", color: "var(--ink-soft)", marginTop: "0.75rem" }}
                >
                  You marked admiration for <strong>{p.name}</strong> — geometric
                  alignment {sim}%.
                </p>
              );
            })}
        </div>

        <ResearchPanelOptIn locale={store.locale} />

        {selected && (
          <PersonalityPanel
            person={selected}
            similarity={similarityPercent(coords, selected.coords)}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="survey-shell">
          <p className="blurb">Loading your constellation…</p>
        </div>
      }
    >
      <ResultsInner />
    </Suspense>
  );
}

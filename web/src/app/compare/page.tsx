"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PoliticalGraph3DDynamic } from "@/components/PoliticalGraph3DDynamic";
import {
  personalities,
  type Personality,
  type Coords,
} from "@/data/personalities";
import { axisLabels, similarityPercent, distance } from "@/lib/scoring";
import { useSurveyStore } from "@/store/survey";

function Bar({
  label,
  a,
  b,
  nameA,
  nameB,
}: {
  label: string;
  a: number;
  b: number;
  nameA: string;
  nameB: string;
}) {
  const toPct = (v: number) => ((v + 100) / 200) * 100;
  return (
    <div className="compare-bar">
      <div className="compare-bar-head">
        <span>{label}</span>
        <span className="compare-bar-vals">
          {nameA} {a > 0 ? "+" : ""}
          {a} · {nameB} {b > 0 ? "+" : ""}
          {b}
        </span>
      </div>
      <div className="compare-track" aria-hidden>
        <span className="compare-marker compare-marker--a" style={{ left: `${toPct(a)}%` }} />
        <span className="compare-marker compare-marker--b" style={{ left: `${toPct(b)}%` }} />
      </div>
      <div className="compare-poles">
        <span>−100</span>
        <span>0</span>
        <span>+100</span>
      </div>
    </div>
  );
}

function overlapCopy(a: Coords, b: Coords) {
  const deltas = [
    { key: "Economic", d: Math.abs(a.economic - b.economic) },
    { key: "Authority", d: Math.abs(a.authority - b.authority) },
    { key: "Cultural", d: Math.abs(a.cultural - b.cultural) },
  ].sort((x, y) => x.d - y.d);
  const closest = deltas[0];
  const farthest = deltas[deltas.length - 1];
  return {
    overlap: `Closest on ${closest.key} (Δ ${closest.d}).`,
    difference: `Largest gap on ${farthest.key} (Δ ${farthest.d}).`,
  };
}

export default function ComparePage() {
  const userCoords = useSurveyStore((s) => s.resultCoords);
  const [idA, setIdA] = useState("narendra-modi");
  const [idB, setIdB] = useState("donald-trump");
  const [includeYou, setIncludeYou] = useState(false);

  const a = personalities.find((p) => p.id === idA) ?? personalities[0];
  const b = personalities.find((p) => p.id === idB) ?? personalities[1];

  const sim = similarityPercent(a.coords, b.coords);
  const { overlap, difference } = overlapCopy(a.coords, b.coords);
  const labelsA = axisLabels(a.coords);
  const labelsB = axisLabels(b.coords);

  const highlightIds = useMemo(() => [a.id, b.id], [a.id, b.id]);

  const youVs = useMemo(() => {
    if (!userCoords || !includeYou) return null;
    return {
      toA: similarityPercent(userCoords, a.coords),
      toB: similarityPercent(userCoords, b.coords),
      distA: distance(userCoords, a.coords),
      distB: distance(userCoords, b.coords),
    };
  }, [userCoords, includeYou, a.coords, b.coords]);

  function onSelect(p: Personality | null) {
    if (!p) return;
    if (p.id === idA || p.id === idB) return;
    // replace the farther of the two from click? simpler: set B
    setIdB(p.id);
  }

  return (
    <div className="map-layout">
      <div className="graph-panel">
        <div className="graph-toolbar">
          <strong>Compare on the fixed 3D basis</strong>
          <span style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
            Same axes for every user and figure
          </span>
        </div>
        <PoliticalGraph3DDynamic
          selectedId={idA}
          highlightIds={highlightIds}
          userCoords={includeYou ? userCoords : null}
          onSelect={onSelect}
        />
      </div>

      <div className="side-stack">
        <div className="results-hero">
          <p className="eyebrow">Compare</p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.55rem", margin: "0.2rem 0 1rem" }}>
            {a.shortName} vs {b.shortName}
          </h1>

          <div className="compare-pickers">
            <label>
              Figure A
              <select value={idA} onChange={(e) => setIdA(e.target.value)}>
                {personalities.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === idB}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Figure B
              <select value={idB} onChange={(e) => setIdB(e.target.value)}>
                {personalities.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === idA}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p className="similarity-pill">{sim}% geometric alignment</p>
          <p style={{ color: "var(--ink-soft)", margin: "0.75rem 0 0.25rem" }}>{overlap}</p>
          <p style={{ color: "var(--ink-soft)", margin: 0 }}>{difference}</p>

          <label className="compare-you">
            <input
              type="checkbox"
              checked={includeYou}
              disabled={!userCoords}
              onChange={(e) => setIncludeYou(e.target.checked)}
            />
            Include your map position
            {!userCoords && (
              <span>
                {" "}
                — <Link href="/survey">take the survey</Link> first
              </span>
            )}
          </label>
          {youVs && (
            <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>
              You ↔ {a.shortName}: {youVs.toA}% · You ↔ {b.shortName}: {youVs.toB}%
            </p>
          )}
        </div>

        <div className="results-hero">
          <p className="eyebrow">Fixed axes</p>
          <Bar label="Economic" a={a.coords.economic} b={b.coords.economic} nameA={a.shortName} nameB={b.shortName} />
          <Bar label="Authority" a={a.coords.authority} b={b.coords.authority} nameA={a.shortName} nameB={b.shortName} />
          <Bar label="Cultural identity" a={a.coords.cultural} b={b.coords.cultural} nameA={a.shortName} nameB={b.shortName} />
          <div className="coord-inline" style={{ marginTop: "1rem" }}>
            <span>
              {a.shortName}: {labelsA.economic} · {labelsA.authority} · {labelsA.cultural}
            </span>
            <span>
              {b.shortName}: {labelsB.economic} · {labelsB.authority} · {labelsB.cultural}
            </span>
          </div>
        </div>

        <div className="results-hero">
          <p className="eyebrow">Evidence posture</p>
          <p style={{ margin: "0.35rem 0 0", color: "var(--ink-soft)", fontSize: "0.95rem" }}>
            {a.name}: confidence <strong>{a.confidence}</strong> · {a.sources.length} source themes
          </p>
          <p style={{ margin: "0.35rem 0 0", color: "var(--ink-soft)", fontSize: "0.95rem" }}>
            {b.name}: confidence <strong>{b.confidence}</strong> · {b.sources.length} source themes
          </p>
          <p style={{ margin: "0.85rem 0 0", fontSize: "0.85rem", color: "var(--ink-soft)" }}>
            Stage 2 adds per-dimension evidence rows and a human approval gate before
            any AI-drafted score can publish.
          </p>
        </div>
      </div>
    </div>
  );
}

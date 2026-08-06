"use client";

import { useEffect, useMemo, useState } from "react";
import type { Confidence, Personality } from "@/data/personalities";
import {
  AXIS_KEYS,
  AXIS_LABELS,
  canPublish,
  missingEvidenceAxes,
  type EvidenceRow,
  type PublishStatus,
} from "@/lib/publishGate";
import {
  EDITOR_PASS,
  EDITOR_UNLOCK_KEY,
  allSeedFigures,
  loadEditorOverlay,
  mergeEditorOverlay,
  newDraftFigure,
  saveEditorOverlay,
} from "@/lib/figuresCatalog";

const STATUSES: PublishStatus[] = [
  "draft",
  "in_review",
  "published",
  "rejected",
];

export default function EditorPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pass, setPass] = useState("");
  const [overlay, setOverlay] = useState<Record<string, Personality>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | PublishStatus>("all");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setUnlocked(sessionStorage.getItem(EDITOR_UNLOCK_KEY) === "1");
    const loaded = loadEditorOverlay();
    setOverlay(loaded);
  }, []);

  const catalog = useMemo(
    () => mergeEditorOverlay(allSeedFigures(), overlay),
    [overlay],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return catalog;
    return catalog.filter((p) => p.status === filter);
  }, [catalog, filter]);

  const selected =
    catalog.find((p) => p.id === selectedId) ?? filtered[0] ?? null;

  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (pass === EDITOR_PASS) {
      sessionStorage.setItem(EDITOR_UNLOCK_KEY, "1");
      setUnlocked(true);
      setMessage(null);
    } else {
      setMessage("Wrong passphrase.");
    }
  }

  function persist(next: Record<string, Personality>) {
    setOverlay(next);
    saveEditorOverlay(next);
  }

  function updateSelected(patch: Partial<Personality>) {
    if (!selected) return;
    const updated = { ...selected, ...patch };
    persist({ ...overlay, [updated.id]: updated });
    setSelectedId(updated.id);
  }

  function updateEvidence(rows: EvidenceRow[]) {
    updateSelected({ evidence: rows });
  }

  function tryPublish() {
    if (!selected) return;
    if (!canPublish(selected.evidence)) {
      setMessage(
        `Need approved evidence on: ${missingEvidenceAxes(selected.evidence).join(", ")}`,
      );
      return;
    }
    updateSelected({
      status: "published",
      approvedBy: "editor",
      approvedAt: new Date().toISOString(),
    });
    setMessage(`Published ${selected.name} (local overlay — export to commit).`);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "poligraph-figures-export.json";
    a.click();
    URL.revokeObjectURL(url);
    setMessage("Exported catalog JSON.");
  }

  if (!unlocked) {
    return (
      <div className="survey-shell">
        <p className="survey-section-label">Stage 2 · Trust editor</p>
        <h1>Figure approval gate</h1>
        <p className="blurb">
          Draft → evidence per axis → human approve → publish. Public atlas only
          shows published figures. Passphrase unlocks this unlisted tool.
        </p>
        <form onSubmit={unlock} className="editor-unlock">
          <label>
            Passphrase
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn btn-primary">
            Unlock editor
          </button>
        </form>
        {message && <p role="alert">{message}</p>}
      </div>
    );
  }

  return (
    <div className="editor-layout">
      <aside className="editor-list">
        <div className="editor-list-head">
          <div>
            <p className="eyebrow">Trust backend</p>
            <h1>Figure editor</h1>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              const draft = newDraftFigure();
              persist({ ...overlay, [draft.id]: draft });
              setSelectedId(draft.id);
            }}
          >
            New draft
          </button>
        </div>
        <div className="filter-row">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              className={`filter-chip ${filter === s ? "is-on" : ""}`}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <ul className="neighbor-list">
          {filtered.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                className={selected?.id === p.id ? "is-active" : ""}
                onClick={() => setSelectedId(p.id)}
              >
                <span>
                  {p.name}
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.75rem",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {p.status}
                    {!canPublish(p.evidence) ? " · missing evidence" : ""}
                  </span>
                </span>
                <span style={{ fontSize: "0.75rem" }}>{p.confidence}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className="cta-row" style={{ marginTop: "1rem" }}>
          <button type="button" className="btn btn-ghost" onClick={exportJson}>
            Export JSON
          </button>
        </div>
      </aside>

      {selected && (
        <section className="editor-detail">
          <p className="survey-section-label">
            Editing · {selected.id}
          </p>
          <div className="editor-grid">
            <label>
              Name
              <input
                value={selected.name}
                onChange={(e) =>
                  updateSelected({
                    name: e.target.value,
                    shortName: e.target.value.split(" ").slice(-1)[0] ?? e.target.value,
                  })
                }
              />
            </label>
            <label>
              Country
              <input
                value={selected.country}
                onChange={(e) => updateSelected({ country: e.target.value })}
              />
            </label>
            <label>
              Status
              <select
                value={selected.status}
                onChange={(e) =>
                  updateSelected({ status: e.target.value as PublishStatus })
                }
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Confidence
              <select
                value={selected.confidence}
                onChange={(e) =>
                  updateSelected({
                    confidence: e.target.value as Confidence,
                  })
                }
              >
                {(["high", "medium", "low"] as Confidence[]).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="editor-block">
            Summary
            <textarea
              rows={3}
              value={selected.summary}
              onChange={(e) => updateSelected({ summary: e.target.value })}
            />
          </label>
          <label className="editor-block">
            Rationale
            <textarea
              rows={4}
              value={selected.rationale}
              onChange={(e) => updateSelected({ rationale: e.target.value })}
            />
          </label>

          <h2>Coordinates (−100…+100)</h2>
          <div className="editor-grid">
            {AXIS_KEYS.map((axis) => (
              <label key={axis}>
                {AXIS_LABELS[axis]} ({selected.coords[axis]})
                <input
                  type="range"
                  min={-100}
                  max={100}
                  value={selected.coords[axis]}
                  onChange={(e) =>
                    updateSelected({
                      coords: {
                        ...selected.coords,
                        [axis]: Number(e.target.value),
                      },
                    })
                  }
                />
              </label>
            ))}
          </div>

          <h2>Evidence (required to publish)</h2>
          <p className="blurb" style={{ marginTop: 0 }}>
            Each axis needs ≥1 approved evidence row before publish.
          </p>
          {selected.evidence.map((row, idx) => (
            <div key={row.id} className="evidence-editor-row">
              <div className="editor-grid">
                <label>
                  Axis
                  <select
                    value={row.axis}
                    onChange={(e) => {
                      const next = [...selected.evidence];
                      next[idx] = {
                        ...row,
                        axis: e.target.value as EvidenceRow["axis"],
                      };
                      updateEvidence(next);
                    }}
                  >
                    {AXIS_KEYS.map((a) => (
                      <option key={a} value={a}>
                        {AXIS_LABELS[a]}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="editor-check">
                  <input
                    type="checkbox"
                    checked={row.approved}
                    onChange={(e) => {
                      const next = [...selected.evidence];
                      next[idx] = { ...row, approved: e.target.checked };
                      updateEvidence(next);
                    }}
                  />
                  Approved
                </label>
              </div>
              <label className="editor-block">
                Claim
                <textarea
                  rows={2}
                  value={row.claim}
                  onChange={(e) => {
                    const next = [...selected.evidence];
                    next[idx] = { ...row, claim: e.target.value };
                    updateEvidence(next);
                  }}
                />
              </label>
              <label className="editor-block">
                Source title
                <input
                  value={row.sourceTitle}
                  onChange={(e) => {
                    const next = [...selected.evidence];
                    next[idx] = { ...row, sourceTitle: e.target.value };
                    updateEvidence(next);
                  }}
                />
              </label>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() =>
              updateEvidence([
                ...selected.evidence,
                {
                  id: `${selected.id}-ev-${Date.now().toString(36)}`,
                  axis: "economic",
                  claim: "",
                  sourceTitle: "",
                  approved: false,
                },
              ])
            }
          >
            Add evidence row
          </button>

          <div className="cta-row" style={{ marginTop: "1.5rem" }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => updateSelected({ status: "in_review" })}
            >
              Submit for review
            </button>
            <button type="button" className="btn btn-primary" onClick={tryPublish}>
              Approve &amp; publish
            </button>
          </div>
          {message && (
            <p style={{ marginTop: "1rem" }} role="status">
              {message}
            </p>
          )}
        </section>
      )}
    </div>
  );
}

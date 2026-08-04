"use client";

import { useEffect, useState } from "react";

const KEY = "poligraph-panel-opt-in-v1";

/**
 * Explicit opt-in only. Stage 1 stores preference locally.
 * No ideology vector is uploaded until Stage 2 Insights backend exists.
 */
export function ResearchPanelOptIn({ locale }: { locale?: string | null }) {
  const [joined, setJoined] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setJoined(Boolean(parsed?.joined));
      }
    } catch {
      /* ignore */
    }
  }, []);

  function join() {
    const record = {
      joined: true,
      at: new Date().toISOString(),
      locale: locale ?? null,
      // Intent only — no coords/PII uploaded in Stage 1
      note: "local_intent_only_until_insights_backend",
    };
    localStorage.setItem(KEY, JSON.stringify(record));
    setJoined(true);
    setOpen(false);
  }

  function leave() {
    localStorage.removeItem(KEY);
    setJoined(false);
  }

  return (
    <div className="results-hero panel-card">
      <p className="eyebrow">Optional research panel</p>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", margin: "0.25rem 0" }}>
        Help improve public understanding — on your terms
      </h2>
      {joined ? (
        <>
          <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "0.92rem" }}>
            You’re marked interested locally. When Poligraph Insights launches,
            we’ll only use anonymized aggregates from people who complete a
            separate consent step — never silent dossier resale.
          </p>
          <button
            type="button"
            className="btn btn-ghost"
            style={{ marginTop: "0.85rem", padding: "0.5rem 0.9rem" }}
            onClick={leave}
          >
            Withdraw interest
          </button>
        </>
      ) : (
        <>
          <p style={{ margin: 0, color: "var(--ink-soft)", fontSize: "0.92rem" }}>
            Poligraph is a public atlas (product A). A future Insights panel may
            publish <strong>k-anonymous heatmaps</strong> and message tests.
            This button only stores your interest on this device for now.
          </p>
          {!open ? (
            <button
              type="button"
              className="btn btn-primary"
              style={{ marginTop: "0.85rem", padding: "0.55rem 1rem" }}
              onClick={() => setOpen(true)}
            >
              I’m interested
            </button>
          ) : (
            <div className="panel-consent">
              <p>
                I understand this is <strong>not</strong> required for using
                Poligraph, that no individual targeting file will be built from
                guest surveys, and that any later data use needs a fresh, explicit
                consent form.
              </p>
              <div className="cta-row">
                <button type="button" className="btn btn-primary" onClick={join}>
                  Confirm interest
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

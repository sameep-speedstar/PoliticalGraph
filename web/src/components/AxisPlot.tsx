"use client";

import { useMemo, useState } from "react";
import type { EvidenceItem, HandleScoreResult } from "@/lib/types";

type Props = {
  coords: HandleScoreResult["coords"];
  handle: string;
  evidence: EvidenceItem[];
};

function truncate(text: string, n = 96): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length <= n ? t : `${t.slice(0, n - 1)}…`;
}

function calloutSide(
  index: number,
  xPct: number,
): { left: string; top: string; align: "left" | "right" } {
  // Fan callouts around the point without covering the axes labels
  const layouts = [
    { dx: 10, dy: -18 },
    { dx: -42, dy: 8 },
    { dx: 8, dy: 16 },
  ];
  const L = layouts[index % layouts.length];
  let left = xPct + L.dx;
  left = Math.max(2, Math.min(58, left));
  const top = Math.max(8, Math.min(78, ((100 - 0) + L.dy + (index === 0 ? 0 : 0))));
  // Recompute top from point y in parent — parent passes via style; here use relative slots
  return {
    left: `${left}%`,
    top: `${12 + index * 28}%`,
    align: xPct > 55 ? "right" : "left",
  };
}

/** 2D plot with evidence callouts tied to the mapped point. */
export function AxisPlot({ coords, handle, evidence }: Props) {
  const x = ((coords.leftRight + 100) / 200) * 100;
  const y = ((100 - coords.nationalInterest) / 200) * 100;
  const [active, setActive] = useState(0);

  const topEvidence = useMemo(() => {
    return [...evidence]
      .sort(
        (a, b) =>
          Math.abs(b.contributionLeftRight) +
          Math.abs(b.contributionNational) -
          (Math.abs(a.contributionLeftRight) + Math.abs(a.contributionNational)),
      )
      .slice(0, 3);
  }, [evidence]);

  const activeItem = topEvidence[active] ?? topEvidence[0];

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative aspect-square w-full">
        <div className="absolute inset-0 overflow-hidden rounded-lg border border-[var(--line)] bg-gradient-to-br from-black/50 via-[#0c1824] to-black/30 shadow-[inset_0_0_60px_rgba(210,168,92,0.06)]">
          {/* subtle radial map rings */}
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--line)] opacity-40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[40%] w-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--line)] opacity-30"
            aria-hidden
          />

          <div className="absolute left-0 top-0 h-1/2 w-1/2 bg-[var(--left)]/[0.05]" />
          <div className="absolute right-0 top-0 h-1/2 w-1/2 bg-[var(--right)]/[0.06]" />
          <div className="absolute bottom-0 left-0 h-1/2 w-1/2 bg-[var(--adversary)]/[0.04]" />
          <div className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-[var(--national)]/[0.05]" />

          <div className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 bg-[var(--line)]" />
          <div className="absolute top-1/2 left-3 right-3 h-px -translate-y-1/2 bg-[var(--line)]" />

          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-[var(--left)]">
            Left
          </span>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] uppercase tracking-widest text-[var(--right)]">
            Right
          </span>
          <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[10px] uppercase tracking-widest text-[var(--national)]">
            National
          </span>
          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-[var(--adversary)]">
            Adversary-Aligned
          </span>

          {/* leader lines + mini callouts */}
          {topEvidence.map((e, i) => {
            const slot = calloutSide(i, x);
            const isOn = i === active;
            const cy = Math.max(10, Math.min(82, y + (i - 1) * 14));
            const cx = Math.max(4, Math.min(62, x + (x > 50 ? -36 : 8)));
            return (
              <button
                key={e.activityId}
                type="button"
                onClick={() => setActive(i)}
                className={`absolute z-10 max-w-[42%] rounded border px-2 py-1.5 text-left transition ${
                  isOn
                    ? "border-[var(--brass)] bg-black/75 text-[var(--ink)]"
                    : "border-[var(--line)] bg-black/45 text-[var(--muted)] hover:border-[var(--brass)]/60"
                }`}
                style={{
                  left: `${cx}%`,
                  top: `${cy}%`,
                  transform: "translateY(-50%)",
                }}
                title={e.text}
              >
                <span className="block text-[9px] uppercase tracking-wider opacity-70">
                  {e.kind} · {e.topics[0]?.replaceAll("_", " ") ?? "signal"}
                </span>
                <span className="mt-0.5 block text-[10px] leading-snug">
                  “{truncate(e.text, isOn ? 110 : 72)}”
                </span>
              </button>
            );
          })}

          {/* SVG leaders from callouts toward dot */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
            {topEvidence.map((e, i) => {
              const cy = Math.max(10, Math.min(82, y + (i - 1) * 14));
              const cx = Math.max(4, Math.min(62, x + (x > 50 ? -36 : 8)));
              const x1 = cx + (x > 50 ? 40 : 0);
              return (
                <line
                  key={`line-${e.activityId}`}
                  x1={`${x1}%`}
                  y1={`${cy}%`}
                  x2={`${x}%`}
                  y2={`${y}%`}
                  stroke={i === active ? "rgba(210,168,92,0.55)" : "rgba(232,238,244,0.18)"}
                  strokeWidth={i === active ? 1.5 : 1}
                  strokeDasharray={i === active ? "0" : "3 3"}
                />
              );
            })}
          </svg>

          <div
            className="plot-dot absolute z-20 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#0b1520] bg-[var(--brass)]"
            style={{ left: `${x}%`, top: `${y}%` }}
            title={`@${handle}`}
          />
          <div
            className="absolute z-20 -translate-x-1/2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-[var(--brass)]"
            style={{
              left: `${x}%`,
              top: `calc(${y}% + 14px)`,
            }}
          >
            @{handle}
          </div>
        </div>
      </div>

      {activeItem ? (
        <div className="mt-4 rounded-md border border-[var(--line)] bg-black/30 p-3 animate-rise">
          <p className="text-[10px] uppercase tracking-wider text-[var(--muted)]">
            Evidence at the point · {activeItem.kind} ·{" "}
            {activeItem.createdAt.slice(0, 10)}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[var(--ink)]">
            “{activeItem.text}”
          </p>
          <p className="mt-2 text-xs text-[var(--muted)]">
            LR {activeItem.contributionLeftRight >= 0 ? "+" : ""}
            {activeItem.contributionLeftRight}
            {" · "}
            NI {activeItem.contributionNational >= 0 ? "+" : ""}
            {activeItem.contributionNational}
            {activeItem.permalink ? (
              <>
                {" · "}
                <a
                  href={activeItem.permalink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--brass)] hover:underline"
                >
                  permalink
                </a>
              </>
            ) : null}
          </p>
        </div>
      ) : null}
    </div>
  );
}

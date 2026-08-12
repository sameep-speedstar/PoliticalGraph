"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AxisPlot } from "@/components/AxisPlot";
import { EvidenceList } from "@/components/EvidenceList";
import { HandleForm } from "@/components/HandleForm";
import { ShareCard } from "@/components/ShareCard";
import { findDemoHandle } from "@/data/demo-handles";
import { SHORT_DISCLAIMER } from "@/data/disclaimers";
import { findFigureHandle } from "@/data/public-figures";
import { scoreHandleActivities } from "@/lib/score";
import type { HandleScoreResult } from "@/lib/types";

function normalizeHandle(raw: string | null | undefined): string {
  if (!raw) return "";
  return decodeURIComponent(raw).replace(/^@/, "").trim().toLowerCase();
}

function handleFromPath(pathname: string): string {
  // Matches /map/:handle or /stance/map/:handle (basePath stripped by Next router)
  const parts = pathname.split("/").filter(Boolean);
  const mapIdx = parts.lastIndexOf("map");
  if (mapIdx >= 0 && parts[mapIdx + 1] && parts[mapIdx + 1] !== "index") {
    return normalizeHandle(parts[mapIdx + 1]);
  }
  return "";
}

function Unavailable({ handle }: { handle: string }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        Live map
      </p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
        @{handle || "handle"}
      </h1>
      <p className="mt-4 max-w-xl text-[var(--muted)]">
        This handle is not in the precomputed demo set, and live X timeline
        ingest is not connected yet — so we cannot score @{handle || "it"} from
        real posts in this build.
      </p>
      <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">
        Try a public-figure or calibration demo below. {SHORT_DISCLAIMER}
      </p>
      <div className="mt-8">
        <HandleForm initial={handle} />
      </div>
      <p className="mt-6 text-sm">
        <Link href="/methodology" className="text-[var(--brass)] hover:underline">
          Methodology
        </Link>
        {" · "}
        <Link href="/disclaimers" className="text-[var(--brass)] hover:underline">
          Disclaimers
        </Link>
      </p>
    </div>
  );
}

function ResultView({
  result,
  figureNote,
  domain,
}: {
  result: HandleScoreResult;
  figureNote?: string;
  domain?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-4 sm:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Mapped handle
            {domain ? ` · ${domain}` : ""}
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            @{result.handle}
          </h1>
          {result.displayName ? (
            <p className="mt-1 text-[var(--muted)]">{result.displayName}</p>
          ) : null}
        </div>
        <div className="text-sm text-[var(--muted)]">
          as of {result.asOf} · {result.lexiconPack} · confidence{" "}
          <span className="text-[var(--brass)]">{result.confidence.label}</span>{" "}
          ({result.confidence.overall})
        </div>
      </div>

      {figureNote ? (
        <p className="mt-4 max-w-2xl rounded border border-[var(--line)] bg-black/20 px-3 py-2 text-xs text-[var(--muted)]">
          {figureNote}
        </p>
      ) : null}

      <p className="mt-6 max-w-2xl text-[var(--ink)]">{result.summary}</p>
      <p className="mt-2 text-sm text-[var(--brass)]">{result.quadrant}</p>
      <p className="mt-3 max-w-2xl text-xs text-[var(--muted)]">
        {SHORT_DISCLAIMER}{" "}
        <Link href="/methodology" className="text-[var(--brass)] hover:underline">
          Methodology
        </Link>
        {" · "}
        <Link href="/disclaimers" className="text-[var(--brass)] hover:underline">
          Disclaimers
        </Link>
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <AxisPlot
            coords={result.coords}
            handle={result.handle}
            evidence={result.evidence}
          />
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                Left ↔ Right
              </p>
              <p className="font-display text-3xl font-bold">
                {result.coords.leftRight > 0 ? "+" : ""}
                {result.coords.leftRight}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {result.axes.leftRight.nItems} scored items
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                National ↔ Adversary-Aligned
              </p>
              <p className="font-display text-3xl font-bold">
                {result.coords.nationalInterest > 0 ? "+" : ""}
                {result.coords.nationalInterest}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {result.axes.nationalInterest.nItems} scored items
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold">Evidence</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Top weighted contributions from {result.scoredCount} of{" "}
            {result.activityCount} activities ({result.source}). Click callouts on
            the map to highlight a contributing post.
          </p>
          <div className="mt-6">
            <EvidenceList items={result.evidence} />
          </div>
        </div>
      </div>

      <section className="mt-12 border-t border-[var(--line)] pt-8">
        <h2 className="font-display text-2xl font-semibold">Share on X</h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
          Download a screenshot card, then share on X with evidence, methodology,
          and disclaimer links. Do not use results as a personal attack.
        </p>
        <div className="mt-6 max-w-md">
          <ShareCard result={result} />
        </div>
      </section>

      <div className="mt-12 border-t border-[var(--line)] pt-8">
        <h3 className="text-sm font-medium text-[var(--ink)]">Confidence notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          {result.confidence.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>

      <div className="mt-10">
        <HandleForm />
      </div>
    </div>
  );
}

/** Client map shell — works for any handle URL after Worker SPA rewrite. */
export function MapExplorer({
  initialHandle = "",
}: {
  initialHandle?: string;
}) {
  const pathname = usePathname();
  const search = useSearchParams();

  const handle = useMemo(() => {
    const fromQuery = normalizeHandle(search.get("handle") || search.get("h"));
    if (fromQuery) return fromQuery;
    const fromPath = handleFromPath(pathname || "");
    if (fromPath) return fromPath;
    return normalizeHandle(initialHandle);
  }, [pathname, search, initialHandle]);

  if (!handle) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <h1 className="font-display text-3xl font-bold">Map a handle</h1>
        <p className="mt-3 text-[var(--muted)]">{SHORT_DISCLAIMER}</p>
        <div className="mt-8">
          <HandleForm />
        </div>
      </div>
    );
  }

  const demo = findDemoHandle(handle);
  if (!demo) {
    return <Unavailable handle={handle} />;
  }

  const figure = findFigureHandle(handle);
  const result = scoreHandleActivities({
    handle: demo.handle,
    displayName: demo.displayName,
    activities: demo.activities,
    source: "demo",
  });

  return (
    <ResultView
      result={result}
      figureNote={figure?.note}
      domain={figure?.domain}
    />
  );
}

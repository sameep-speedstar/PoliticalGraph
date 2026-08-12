"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AxisPlot } from "@/components/AxisPlot";
import { EvidenceList } from "@/components/EvidenceList";
import { HandleForm } from "@/components/HandleForm";
import { ShareCard } from "@/components/ShareCard";
import { SHORT_DISCLAIMER } from "@/data/disclaimers";
import { findDemoHandle } from "@/data/demo-handles";
import { findFigureHandle } from "@/data/public-figures";
import { scoreHandleActivities } from "@/lib/score";
import type { HandleScoreResult } from "@/lib/types";

function normalizeHandle(raw: string | null | undefined): string {
  if (!raw) return "";
  return decodeURIComponent(raw).replace(/^@/, "").trim().toLowerCase();
}

function handleFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  const mapIdx = parts.lastIndexOf("map");
  if (mapIdx >= 0 && parts[mapIdx + 1] && parts[mapIdx + 1] !== "index") {
    return normalizeHandle(parts[mapIdx + 1]);
  }
  return "";
}

function apiAnalyzeUrl(handle: string, refresh = false): string {
  const base =
    typeof window !== "undefined" && window.location.pathname.startsWith("/stance")
      ? "/stance"
      : "";
  const q = new URLSearchParams({ handle });
  if (refresh) q.set("refresh", "1");
  return `${base}/api/analyze?${q.toString()}`;
}

type AnalyzeResponse = {
  result: HandleScoreResult;
  measuredAt: string;
  searchCount: number;
  fromCache: boolean;
  figureNote?: string;
  domain?: string;
  warning?: string;
  error?: string;
  hint?: string;
};

function ErrorPanel({
  handle,
  message,
  hint,
}: {
  handle: string;
  message: string;
  hint?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Live map</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight">
        @{handle}
      </h1>
      <p className="mt-4 max-w-xl text-[var(--muted)]">{message}</p>
      {hint ? (
        <p className="mt-2 max-w-xl text-sm text-[var(--brass)]">{hint}</p>
      ) : null}
      <p className="mt-3 max-w-xl text-sm text-[var(--muted)]">{SHORT_DISCLAIMER}</p>
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
  measuredAt,
  searchCount,
  fromCache,
  warning,
  onRefresh,
  refreshing,
}: {
  result: HandleScoreResult;
  figureNote?: string;
  domain?: string;
  measuredAt: string;
  searchCount: number;
  fromCache: boolean;
  warning?: string;
  onRefresh: () => void;
  refreshing: boolean;
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
          last measured{" "}
          <span className="text-[var(--ink)]">
            {measuredAt.replace("T", " ").slice(0, 19)} UTC
          </span>
          {fromCache ? " · cached" : " · freshly measured"}
          {" · "}
          searched <span className="text-[var(--brass)]">{searchCount}</span>× ·
          confidence{" "}
          <span className="text-[var(--brass)]">{result.confidence.label}</span>
        </div>
      </div>

      {warning ? (
        <p className="mt-4 max-w-2xl rounded border border-[var(--brass)]/40 bg-black/20 px-3 py-2 text-xs text-[var(--brass)]">
          {warning}
        </p>
      ) : null}

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
        {" · "}
        <button
          type="button"
          onClick={onRefresh}
          disabled={refreshing}
          className="text-[var(--brass)] hover:underline disabled:opacity-50"
        >
          {refreshing ? "Re-measuring…" : "Re-measure now"}
        </button>
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
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                National ↔ Adversary-Aligned
              </p>
              <p className="font-display text-3xl font-bold">
                {result.coords.nationalInterest > 0 ? "+" : ""}
                {result.coords.nationalInterest}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold">Evidence</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Top weighted contributions from {result.scoredCount} of{" "}
            {result.activityCount} activities ({result.source}).
          </p>
          <div className="mt-6">
            <EvidenceList items={result.evidence} />
          </div>
        </div>
      </div>

      <section className="mt-12 border-t border-[var(--line)] pt-8">
        <h2 className="font-display text-2xl font-semibold">Share on X</h2>
        <div className="mt-6 max-w-md">
          <ShareCard result={result} />
        </div>
      </section>

      <div className="mt-10">
        <HandleForm />
      </div>
    </div>
  );
}

export function MapExplorer({
  initialHandle = "",
}: {
  initialHandle?: string;
}) {
  const pathname = usePathname();
  const search = useSearchParams();
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [error, setError] = useState<{ message: string; hint?: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handle = useMemo(() => {
    const fromQuery = normalizeHandle(search.get("handle") || search.get("h"));
    if (fromQuery) return fromQuery;
    const fromPath = handleFromPath(pathname || "");
    if (fromPath) return fromPath;
    return normalizeHandle(initialHandle);
  }, [pathname, search, initialHandle]);

  async function load(h: string, refresh = false) {
    if (!h) return;
    if (refresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiAnalyzeUrl(h, refresh));
      const body = (await res.json()) as AnalyzeResponse;
      if (!res.ok) {
        // Local/static fallback: score bundled demo corpora client-side
        const demo = findDemoHandle(h);
        if (demo) {
          const figure = findFigureHandle(h);
          const result = scoreHandleActivities({
            handle: demo.handle,
            displayName: demo.displayName,
            activities: demo.activities,
            source: "demo",
          });
          setData({
            result,
            measuredAt: new Date().toISOString(),
            searchCount: result.searchCount ?? 1,
            fromCache: false,
            figureNote: figure?.note,
            domain: figure?.domain,
            warning:
              body.hint ||
              body.error ||
              "API unavailable — showing local demo corpus.",
          });
          return;
        }
        setData(null);
        setError({
          message: body.error || `Could not map @${h}`,
          hint: body.hint,
        });
        return;
      }
      setData(body);
    } catch {
      const demo = findDemoHandle(h);
      if (demo) {
        const figure = findFigureHandle(h);
        const result = scoreHandleActivities({
          handle: demo.handle,
          displayName: demo.displayName,
          activities: demo.activities,
          source: "demo",
        });
        setData({
          result,
          measuredAt: new Date().toISOString(),
          searchCount: 1,
          fromCache: false,
          figureNote: figure?.note,
          domain: figure?.domain,
          warning: "API unreachable — showing local demo corpus.",
        });
      } else {
        setData(null);
        setError({
          message: `Network error while mapping @${h}`,
          hint: "Retry in a moment, or try a demo handle.",
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (!handle) {
      setData(null);
      setError(null);
      return;
    }
    void load(handle, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handle]);

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

  if (loading && !data) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-12 text-[var(--muted)]">
        Measuring @{handle}…
      </div>
    );
  }

  if (error && !data) {
    return (
      <ErrorPanel handle={handle} message={error.message} hint={error.hint} />
    );
  }

  if (!data) return null;

  return (
    <ResultView
      result={data.result}
      figureNote={data.figureNote}
      domain={data.domain}
      measuredAt={data.measuredAt}
      searchCount={data.searchCount}
      fromCache={data.fromCache}
      warning={data.warning}
      refreshing={refreshing}
      onRefresh={() => void load(handle, true)}
    />
  );
}

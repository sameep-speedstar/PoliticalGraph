"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { stanceApiUrl } from "@/lib/site";

type TrendingItem = {
  handle: string;
  displayName?: string | null;
  leftRight: number;
  nationalInterest: number;
  quadrant?: string | null;
  measuredAt: string;
  searchCount: number;
  source: string;
};

function apiTrendingUrl(): string {
  return stanceApiUrl("/api/trending?limit=10");
}

export function TrendingHandles() {
  const [items, setItems] = useState<TrendingItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiTrendingUrl());
        if (!res.ok) return;
        const body = (await res.json()) as { items?: TrendingItem[] };
        if (!cancelled) setItems(body.items || []);
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded || !items.length) return null;

  return (
    <section className="mt-16 max-w-3xl border-t border-[var(--line)] pt-10">
      <h2 className="font-display text-2xl font-semibold">Most mapped</h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Handles ranked by search count. Scores show last measured alignment.
      </p>
      <ol className="mt-5 space-y-3">
        {items.map((it, i) => (
          <li key={it.handle}>
            <Link
              href={`/map/${encodeURIComponent(it.handle)}`}
              className="flex flex-wrap items-baseline justify-between gap-2 border-b border-[var(--line)] pb-3 text-sm transition hover:text-[var(--brass)]"
            >
              <span>
                <span className="mr-2 text-[var(--muted)]">{i + 1}.</span>
                <span className="font-medium text-[var(--ink)]">@{it.handle}</span>
                {it.quadrant ? (
                  <span className="ml-2 text-xs text-[var(--muted)]">
                    {it.quadrant}
                  </span>
                ) : null}
              </span>
              <span className="text-xs text-[var(--muted)]">
                LR {it.leftRight > 0 ? "+" : ""}
                {it.leftRight} · NI {it.nationalInterest > 0 ? "+" : ""}
                {it.nationalInterest} · {it.searchCount}× ·{" "}
                {it.measuredAt.slice(0, 10)}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}

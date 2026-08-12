/**
 * Cloudflare Worker entry: static assets + Stance API (analyze / trending) + SPA map fallback.
 */
import { findDemoHandle } from "../src/data/demo-handles";
import { findFigureHandle } from "../src/data/public-figures";
import { scoreHandleActivities } from "../src/lib/score";
import type { HandleScoreResult } from "../src/lib/types";
import { ingestUserTimeline } from "./ingest";

export interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  X_BEARER_TOKEN?: string;
  /** Hours before a cached score is considered stale for auto-refresh (default 168 = 7d) */
  STANCE_CACHE_TTL_HOURS?: string;
}

type CachedRow = {
  handle: string;
  display_name: string | null;
  left_right: number;
  national_interest: number;
  quadrant: string | null;
  result_json: string;
  measured_at: string;
  search_count: number;
  source: string;
  updated_at: string;
};

type AnalyzePayload = {
  result: HandleScoreResult;
  measuredAt: string;
  searchCount: number;
  fromCache: boolean;
  figureNote?: string;
  domain?: string;
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  });

function normalizeHandle(raw: string): string {
  return raw.replace(/^@/, "").trim().toLowerCase();
}

function ttlHours(env: Env): number {
  const n = Number(env.STANCE_CACHE_TTL_HOURS ?? "168");
  return Number.isFinite(n) && n > 0 ? n : 168;
}

function isStale(measuredAt: string, ttlH: number): boolean {
  const t = Date.parse(measuredAt);
  if (!Number.isFinite(t)) return true;
  return Date.now() - t > ttlH * 3600_000;
}

async function getCached(db: D1Database, handle: string): Promise<CachedRow | null> {
  return db
    .prepare("SELECT * FROM handle_scores WHERE handle = ?")
    .bind(handle)
    .first<CachedRow>();
}

async function bumpSearch(db: D1Database, handle: string): Promise<number> {
  await db
    .prepare(
      "UPDATE handle_scores SET search_count = search_count + 1, updated_at = ? WHERE handle = ?",
    )
    .bind(new Date().toISOString(), handle)
    .run();
  const row = await db
    .prepare("SELECT search_count FROM handle_scores WHERE handle = ?")
    .bind(handle)
    .first<{ search_count: number }>();
  return row?.search_count ?? 1;
}

async function upsertScore(
  db: D1Database,
  result: HandleScoreResult,
  prevCount = 0,
): Promise<void> {
  const now = new Date().toISOString();
  result.asOf = now.slice(0, 10);
  result.measuredAt = now;
  result.searchCount = prevCount + 1;
  result.fromCache = false;

  await db
    .prepare(
      `INSERT INTO handle_scores
        (handle, display_name, left_right, national_interest, quadrant, result_json, measured_at, search_count, source, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(handle) DO UPDATE SET
         display_name = excluded.display_name,
         left_right = excluded.left_right,
         national_interest = excluded.national_interest,
         quadrant = excluded.quadrant,
         result_json = excluded.result_json,
         measured_at = excluded.measured_at,
         search_count = handle_scores.search_count + 1,
         source = excluded.source,
         updated_at = excluded.updated_at`,
    )
    .bind(
      result.handle,
      result.displayName ?? null,
      result.coords.leftRight,
      result.coords.nationalInterest,
      result.quadrant,
      JSON.stringify(result),
      now,
      Math.max(1, prevCount + 1),
      result.source,
      now,
    )
    .run();
}

async function scoreLive(handle: string, env: Env): Promise<HandleScoreResult> {
  if (!env.X_BEARER_TOKEN) {
    throw Object.assign(new Error("X_BEARER_TOKEN not configured"), { status: 503 });
  }
  const ingested = await ingestUserTimeline(handle, env.X_BEARER_TOKEN, {
    maxResults: 100,
    pages: 2,
  });
  if (!ingested.activities.length) {
    throw Object.assign(new Error("No public posts found in the recent window"), {
      status: 422,
    });
  }
  return scoreHandleActivities({
    handle: ingested.handle,
    displayName: ingested.displayName,
    activities: ingested.activities,
    source: "live",
  });
}

function scoreDemo(handle: string): HandleScoreResult | null {
  const demo = findDemoHandle(handle);
  if (!demo) return null;
  return scoreHandleActivities({
    handle: demo.handle,
    displayName: demo.displayName,
    activities: demo.activities,
    source: "demo",
  });
}

async function analyze(handleRaw: string, env: Env, refresh: boolean): Promise<Response> {
  const handle = normalizeHandle(handleRaw);
  if (!/^[a-z0-9_]{1,15}$/i.test(handle)) {
    return json({ error: "Invalid handle" }, 400);
  }

  const figure = findFigureHandle(handle);
  const cached = await getCached(env.DB, handle);
  const ttl = ttlHours(env);

  if (cached && !refresh && !isStale(cached.measured_at, ttl)) {
    const searchCount = await bumpSearch(env.DB, handle);
    const result = JSON.parse(cached.result_json) as HandleScoreResult;
    result.measuredAt = cached.measured_at;
    result.searchCount = searchCount;
    result.fromCache = true;
    const payload: AnalyzePayload = {
      result,
      measuredAt: cached.measured_at,
      searchCount,
      fromCache: true,
      figureNote: figure?.note,
      domain: figure?.domain,
    };
    return json(payload);
  }

  let result: HandleScoreResult | null = null;
  let errLive: string | null = null;

  try {
    result = await scoreLive(handle, env);
  } catch (e) {
    const err = e as Error & { status?: number };
    errLive = err.message;
    result = scoreDemo(handle);
    if (!result) {
      const status = err.status && err.status >= 400 ? err.status : 502;
      const hint =
        status === 402
          ? "Add X API credits or upgrade the plan at developer.x.com, then retry."
          : status === 403 && /verified/i.test(errLive || "")
            ? "Stance maps verified X accounts only (blue / business / government) to limit abuse."
            : env.X_BEARER_TOKEN
              ? "X API error, protected account, unverified handle, or empty recent timeline"
              : "Set Worker secret X_BEARER_TOKEN for live ingest";
      return json(
        {
          error: errLive || "Failed to ingest handle",
          hint,
        },
        status === 503 ? 503 : status,
      );
    }
  }

  const prev = cached?.search_count ?? 0;
  await upsertScore(env.DB, result, prev);
  const row = await getCached(env.DB, handle);
  result.measuredAt = row?.measured_at;
  result.searchCount = row?.search_count;
  result.fromCache = false;

  const payload: AnalyzePayload = {
    result,
    measuredAt: row?.measured_at || new Date().toISOString(),
    searchCount: row?.search_count || 1,
    fromCache: false,
    figureNote: figure?.note,
    domain: figure?.domain,
  };
  if (errLive && result.source === "demo") {
    (payload as AnalyzePayload & { warning?: string }).warning =
      `Live ingest unavailable (${errLive}); served interpretive demo corpus.`;
  }
  return json(payload);
}

async function trending(env: Env, limit: number): Promise<Response> {
  const rows = await env.DB.prepare(
    `SELECT handle, display_name, left_right, national_interest, quadrant,
            measured_at, search_count, source
     FROM handle_scores
     ORDER BY search_count DESC, measured_at DESC
     LIMIT ?`,
  )
    .bind(limit)
    .all();

  return json({
    items: (rows.results || []).map((r) => ({
      handle: r.handle,
      displayName: r.display_name,
      leftRight: r.left_right,
      nationalInterest: r.national_interest,
      quadrant: r.quadrant,
      measuredAt: r.measured_at,
      searchCount: r.search_count,
      source: r.source,
    })),
  });
}

async function spaMapFallback(request: Request, env: Env, handle: string): Promise<Response> {
  const url = new URL(request.url);
  const assetRes = await env.ASSETS.fetch(request);
  if (assetRes.status !== 404) return assetRes;
  const shellUrl = new URL("/stance/map/", url);
  shellUrl.searchParams.set("handle", handle);
  const shell = await env.ASSETS.fetch(
    new Request(shellUrl.toString(), { method: "GET", headers: request.headers }),
  );
  const headers = new Headers(shell.headers);
  headers.set("cache-control", "public, max-age=0, must-revalidate");
  return new Response(shell.body, { status: 200, headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS" && path.startsWith("/stance/api/")) {
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": "*",
          "access-control-allow-methods": "GET,POST,OPTIONS",
          "access-control-allow-headers": "content-type",
        },
      });
    }

    if (path === "/stance/api/analyze" || path === "/stance/api/analyze/") {
      if (request.method !== "GET" && request.method !== "POST") {
        return json({ error: "Method not allowed" }, 405);
      }
      let handle = url.searchParams.get("handle") || url.searchParams.get("h") || "";
      let refresh = url.searchParams.get("refresh") === "1";
      if (request.method === "POST") {
        try {
          const body = (await request.json()) as { handle?: string; refresh?: boolean };
          handle = body.handle || handle;
          refresh = Boolean(body.refresh) || refresh;
        } catch {
          /* ignore */
        }
      }
      try {
        return await analyze(handle, env, refresh);
      } catch (e) {
        const err = e as Error;
        return json({ error: err.message || "Analyze failed" }, 500);
      }
    }

    if (path === "/stance/api/trending" || path === "/stance/api/trending/") {
      const limit = Math.min(
        Math.max(Number(url.searchParams.get("limit") || "12"), 1),
        50,
      );
      try {
        return await trending(env, limit);
      } catch (e) {
        const err = e as Error;
        return json({ error: err.message || "Trending failed" }, 500);
      }
    }

    const mapMatch = path.match(/^\/stance\/map\/([^/]+)\/?$/);
    if (mapMatch && !mapMatch[1].includes(".")) {
      return spaMapFallback(request, env, mapMatch[1]);
    }

    return env.ASSETS.fetch(request);
  },
};

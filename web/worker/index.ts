/**
 * Cloudflare Worker entry: static assets + Stance API (analyze / trending) + SPA map fallback.
 */
import { SCORE_ENGINE_VERSION } from "../src/data/definitions";
import { findDemoHandle } from "../src/data/demo-handles";
import { findFigureHandle } from "../src/data/public-figures";
import { scoreHandleActivities } from "../src/lib/score";
import type { HandleScoreResult, XActivity } from "../src/lib/types";
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

/** Persisted blob — activities kept for offline re-score when classifier upgrades. */
type StoredScore = {
  result: HandleScoreResult;
  activities?: XActivity[];
};

type AnalyzePayload = {
  result: HandleScoreResult;
  measuredAt: string;
  searchCount: number;
  fromCache: boolean;
  figureNote?: string;
  domain?: string;
  warning?: string;
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

function parseStored(raw: string): StoredScore {
  const parsed = JSON.parse(raw) as HandleScoreResult & {
    activities?: XActivity[];
    _activities?: XActivity[];
  };
  const activities = parsed.activities || parsed._activities;
  const result = { ...parsed };
  delete (result as { activities?: XActivity[] }).activities;
  delete (result as { _activities?: XActivity[] })._activities;
  return { result, activities };
}

function needsEngineRescore(result: HandleScoreResult): boolean {
  return (result.scoreEngineVersion || "") !== SCORE_ENGINE_VERSION;
}

function publicResult(result: HandleScoreResult): HandleScoreResult {
  const copy = { ...result };
  delete (copy as { activities?: unknown }).activities;
  return copy;
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
  activities: XActivity[] | undefined,
  prevCount = 0,
): Promise<void> {
  const now = new Date().toISOString();
  result.asOf = now.slice(0, 10);
  result.measuredAt = now;
  result.searchCount = prevCount + 1;
  result.fromCache = false;
  result.scoreEngineVersion = SCORE_ENGINE_VERSION;

  const stored: StoredScore = {
    result,
    activities: activities?.length ? activities : undefined,
  };
  // Flatten for backward-compatible readers: result fields + activities alongside
  const blob = {
    ...result,
    ...(activities?.length ? { activities } : {}),
  };

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
      JSON.stringify(blob),
      now,
      Math.max(1, prevCount + 1),
      result.source,
      now,
    )
    .run();
  void stored;
}

async function scoreLive(
  handle: string,
  env: Env,
): Promise<{ result: HandleScoreResult; activities: XActivity[] }> {
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
  const result = scoreHandleActivities({
    handle: ingested.handle,
    displayName: ingested.displayName,
    activities: ingested.activities,
    source: "live",
  });
  return { result, activities: ingested.activities };
}

function scoreDemo(
  handle: string,
): { result: HandleScoreResult; activities: XActivity[] } | null {
  const demo = findDemoHandle(handle);
  if (!demo) return null;
  const result = scoreHandleActivities({
    handle: demo.handle,
    displayName: demo.displayName,
    activities: demo.activities,
    source: "demo",
  });
  return { result, activities: demo.activities };
}

function thinEvidenceWarning(result: HandleScoreResult): string | undefined {
  if (result.activityCount >= 20 && result.scoredCount <= 2) {
    return `Only ${result.scoredCount} of ${result.activityCount} posts matched the stance lexicon — point is provisional. Re-measure after lexicon upgrades.`;
  }
  return undefined;
}

async function analyze(handleRaw: string, env: Env, refresh: boolean): Promise<Response> {
  const handle = normalizeHandle(handleRaw);
  if (!/^[a-z0-9_]{1,15}$/i.test(handle)) {
    return json({ error: "Invalid handle" }, 400);
  }

  const figure = findFigureHandle(handle);
  const cached = await getCached(env.DB, handle);
  const ttl = ttlHours(env);
  const stored = cached ? parseStored(cached.result_json) : null;

  // Offline re-score when classifier upgraded and we still have activities
  if (stored?.activities?.length && needsEngineRescore(stored.result)) {
    const rescored = scoreHandleActivities({
      handle: stored.result.handle,
      displayName: stored.result.displayName,
      activities: stored.activities,
      source: stored.result.source,
    });
    const prev = cached?.search_count ?? 0;
    await upsertScore(env.DB, rescored, stored.activities, prev);
    const row = await getCached(env.DB, handle);
    rescored.measuredAt = row?.measured_at;
    rescored.searchCount = row?.search_count;
    rescored.fromCache = false;
    return json({
      result: publicResult(rescored),
      measuredAt: row?.measured_at || new Date().toISOString(),
      searchCount: row?.search_count || 1,
      fromCache: false,
      figureNote: figure?.note,
      domain: figure?.domain,
      warning: "Re-scored from cached timeline after lexicon upgrade (no new X fetch).",
    } satisfies AnalyzePayload);
  }

  // Fresh-enough cache: serve it (even if lexicon outdated, unless refresh/stale)
  if (cached && stored && !refresh && !isStale(cached.measured_at, ttl)) {
    const searchCount = await bumpSearch(env.DB, handle);
    const result = publicResult(stored.result);
    result.measuredAt = cached.measured_at;
    result.searchCount = searchCount;
    result.fromCache = true;
    const warnings = [
      thinEvidenceWarning(result),
      needsEngineRescore(stored.result)
        ? "Score predates the latest lexicon — click Re-measure when X API credits are available."
        : null,
    ].filter(Boolean);
    return json({
      result,
      measuredAt: cached.measured_at,
      searchCount,
      fromCache: true,
      figureNote: figure?.note,
      domain: figure?.domain,
      warning: warnings.length ? warnings.join(" ") : undefined,
    } satisfies AnalyzePayload);
  }

  let result: HandleScoreResult | null = null;
  let activities: XActivity[] | undefined;
  let errLive: string | null = null;
  let errStatus = 502;

  try {
    const live = await scoreLive(handle, env);
    result = live.result;
    activities = live.activities;
  } catch (e) {
    const err = e as Error & { status?: number };
    errLive = err.message;
    errStatus = err.status && err.status >= 400 ? err.status : 502;
    const demo = scoreDemo(handle);
    if (demo) {
      result = demo.result;
      activities = demo.activities;
    } else if (stored) {
      // Keep serving prior map when live ingest is down (e.g. credits)
      const searchCount = await bumpSearch(env.DB, handle);
      const resultOut = publicResult(stored.result);
      resultOut.measuredAt = cached!.measured_at;
      resultOut.searchCount = searchCount;
      resultOut.fromCache = true;
      return json({
        result: resultOut,
        measuredAt: cached!.measured_at,
        searchCount,
        fromCache: true,
        figureNote: figure?.note,
        domain: figure?.domain,
        warning: [
          `Live re-measure unavailable (${errLive}).`,
          thinEvidenceWarning(resultOut),
          needsEngineRescore(stored.result)
            ? "Cached score predates the latest lexicon — add X API credits and re-measure."
            : null,
        ]
          .filter(Boolean)
          .join(" "),
      } satisfies AnalyzePayload);
    } else {
      const hint =
        errStatus === 402
          ? "Add X API credits or upgrade the plan at developer.x.com, then retry."
          : errStatus === 403 && /verified/i.test(errLive || "")
            ? "Stance maps verified X accounts only (blue / business / government) to limit abuse."
            : env.X_BEARER_TOKEN
              ? "X API error, protected account, unverified handle, or empty recent timeline"
              : "Set Worker secret X_BEARER_TOKEN for live ingest";
      return json(
        {
          error: errLive || "Failed to ingest handle",
          hint,
        },
        errStatus === 503 ? 503 : errStatus,
      );
    }
  }

  const prev = cached?.search_count ?? 0;
  await upsertScore(env.DB, result, activities, prev);
  const row = await getCached(env.DB, handle);
  result.measuredAt = row?.measured_at;
  result.searchCount = row?.search_count;
  result.fromCache = false;

  const payload: AnalyzePayload = {
    result: publicResult(result),
    measuredAt: row?.measured_at || new Date().toISOString(),
    searchCount: row?.search_count || 1,
    fromCache: false,
    figureNote: figure?.note,
    domain: figure?.domain,
    warning:
      (errLive && result.source === "demo"
        ? `Live ingest unavailable (${errLive}); served interpretive demo corpus.`
        : undefined) || thinEvidenceWarning(result),
  };
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

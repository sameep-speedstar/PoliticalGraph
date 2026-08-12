/**
 * Fetch recent public posts for an X username via API v2.
 * Requires env.X_BEARER_TOKEN (App-only Bearer).
 * Only verified accounts are accepted (abuse control).
 */
import type { XActivity } from "../src/lib/types";

const X_API = "https://api.x.com/2";

type XUser = {
  id: string;
  name?: string;
  username?: string;
  protected?: boolean;
  verified?: boolean;
  verified_type?: string | null;
};

type XTweet = {
  id: string;
  text: string;
  created_at?: string;
  public_metrics?: {
    like_count?: number;
    retweet_count?: number;
    reply_count?: number;
    quote_count?: number;
  };
  referenced_tweets?: { type: string; id: string }[];
};

export type IngestResult = {
  handle: string;
  displayName?: string;
  verified: boolean;
  verifiedType?: string | null;
  activities: XActivity[];
};

function authHeaders(bearer: string): HeadersInit {
  return {
    Authorization: `Bearer ${bearer}`,
    "User-Agent": "StanceBot/1.0 (kniq.ai/stance)",
  };
}

async function xGet<T>(
  path: string,
  bearer: string,
): Promise<{ ok: true; data: T } | { ok: false; status: number; detail: string }> {
  const res = await fetch(`${X_API}${path}`, { headers: authHeaders(bearer) });
  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    const detail =
      (json as { detail?: string; title?: string; reason?: string })?.detail ||
      (json as { title?: string })?.title ||
      (json as { reason?: string })?.reason ||
      text.slice(0, 240) ||
      res.statusText;
    if (res.status === 402 || /credit|payment|billing|UsageCapExceeded/i.test(detail)) {
      return {
        ok: false,
        status: 402,
        detail:
          "X API credits depleted or plan cap reached — add credits / upgrade at developer.x.com",
      };
    }
    return { ok: false, status: res.status, detail };
  }
  return { ok: true, data: json as T };
}

export function isVerifiedUser(user: XUser): boolean {
  if (user.verified === true) return true;
  const t = (user.verified_type || "").toLowerCase();
  return t === "blue" || t === "business" || t === "government";
}

function tweetToActivity(t: XTweet, handle: string): XActivity {
  const refs = t.referenced_tweets || [];
  const isRt = refs.some((r) => r.type === "retweeted");
  const isQuote = refs.some((r) => r.type === "quoted");
  const isReply = refs.some((r) => r.type === "replied_to");
  let kind: XActivity["kind"] = "tweet";
  if (isRt) kind = "retweet";
  else if (isQuote) kind = "quote";
  else if (isReply) kind = "reply";

  return {
    id: t.id,
    kind,
    text: t.text,
    createdAt: t.created_at || new Date().toISOString(),
    likes: t.public_metrics?.like_count ?? 0,
    retweets: t.public_metrics?.retweet_count ?? 0,
    permalink: `https://x.com/${handle}/status/${t.id}`,
  };
}

async function fetchTweetPage(
  userId: string,
  bearer: string,
  maxResults: number,
  paginationToken?: string,
): Promise<{ tweets: XTweet[]; next?: string }> {
  const tweetFields = [
    "created_at",
    "public_metrics",
    "referenced_tweets",
    "lang",
  ].join(",");
  // Include replies + quotes; still exclude pure retweets noise optionally via client filter
  let path =
    `/users/${userId}/tweets?max_results=${maxResults}` +
    `&tweet.fields=${tweetFields}` +
    `&exclude=retweets`;
  if (paginationToken) {
    path += `&pagination_token=${encodeURIComponent(paginationToken)}`;
  }
  let res = await xGet<{
    data?: XTweet[];
    meta?: { next_token?: string; result_count?: number };
  }>(path, bearer);

  // Some tiers reject exclude=retweets — retry bare
  if (!res.ok) {
    path =
      `/users/${userId}/tweets?max_results=${maxResults}` +
      `&tweet.fields=${tweetFields}`;
    if (paginationToken) {
      path += `&pagination_token=${encodeURIComponent(paginationToken)}`;
    }
    res = await xGet(path, bearer);
  }
  if (!res.ok) {
    throw Object.assign(new Error(res.detail || "Timeline fetch failed"), {
      status: res.status,
    });
  }
  return {
    tweets: res.data.data || [],
    next: res.data.meta?.next_token,
  };
}

export async function ingestUserTimeline(
  rawHandle: string,
  bearer: string,
  opts?: { maxResults?: number; pages?: number },
): Promise<IngestResult> {
  const handle = rawHandle.replace(/^@/, "").toLowerCase();
  if (!/^[a-z0-9_]{1,15}$/i.test(handle)) {
    throw Object.assign(new Error("Invalid X handle"), { status: 400 });
  }

  const userRes = await xGet<{ data?: XUser }>(
    `/users/by/username/${encodeURIComponent(handle)}?user.fields=protected,name,verified,verified_type`,
    bearer,
  );
  if (!userRes.ok) {
    throw Object.assign(new Error(userRes.detail || "User lookup failed"), {
      status: userRes.status,
    });
  }
  const user = userRes.data.data;
  if (!user?.id) {
    throw Object.assign(new Error("User not found"), { status: 404 });
  }
  if (user.protected) {
    throw Object.assign(new Error("Account is protected — public posts only"), {
      status: 403,
    });
  }
  if (!isVerifiedUser(user)) {
    throw Object.assign(
      new Error(
        "Only verified X accounts can be mapped (blue / business / government check required)",
      ),
      { status: 403 },
    );
  }

  const perPage = Math.min(Math.max(opts?.maxResults ?? 100, 10), 100);
  const pages = Math.min(Math.max(opts?.pages ?? 2, 1), 3);
  const tweets: XTweet[] = [];
  let token: string | undefined;
  for (let i = 0; i < pages; i++) {
    const page = await fetchTweetPage(user.id, bearer, perPage, token);
    tweets.push(...page.tweets);
    token = page.next;
    if (!token) break;
  }

  const activities = tweets.map((t) => tweetToActivity(t, handle));
  return {
    handle,
    displayName: user.name,
    verified: true,
    verifiedType: user.verified_type ?? (user.verified ? "legacy" : null),
    activities,
  };
}

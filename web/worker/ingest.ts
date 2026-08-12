/**
 * Fetch recent public posts for an X username via API v2.
 * Requires env.X_BEARER_TOKEN (App-only Bearer).
 */
import type { XActivity } from "../src/lib/types";

const X_API = "https://api.x.com/2";

type XUser = {
  id: string;
  name?: string;
  username?: string;
  protected?: boolean;
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
    // Normalize common X billing errors
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

export async function ingestUserTimeline(
  rawHandle: string,
  bearer: string,
  opts?: { maxResults?: number },
): Promise<IngestResult> {
  const handle = rawHandle.replace(/^@/, "").toLowerCase();
  if (!/^[a-z0-9_]{1,15}$/i.test(handle)) {
    throw Object.assign(new Error("Invalid X handle"), { status: 400 });
  }

  const userRes = await xGet<{ data?: XUser }>(
    `/users/by/username/${encodeURIComponent(handle)}?user.fields=protected,name`,
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

  const maxResults = Math.min(Math.max(opts?.maxResults ?? 100, 5), 100);
  const tweetFields = [
    "created_at",
    "public_metrics",
    "referenced_tweets",
    "lang",
  ].join(",");
  const tweetsRes = await xGet<{ data?: XTweet[]; meta?: { result_count?: number } }>(
    `/users/${user.id}/tweets?max_results=${maxResults}&tweet.fields=${tweetFields}&exclude=replies`,
    bearer,
  );

  // If exclude=replies fails on some tiers, retry without exclude
  let tweets: XTweet[] = [];
  if (!tweetsRes.ok) {
    const retry = await xGet<{ data?: XTweet[] }>(
      `/users/${user.id}/tweets?max_results=${maxResults}&tweet.fields=${tweetFields}`,
      bearer,
    );
    if (!retry.ok) {
      throw Object.assign(new Error(retry.detail || "Timeline fetch failed"), {
        status: retry.status,
      });
    }
    tweets = retry.data.data || [];
  } else {
    tweets = tweetsRes.data.data || [];
  }

  const activities = tweets.map((t) => tweetToActivity(t, handle));
  return {
    handle,
    displayName: user.name,
    activities,
  };
}

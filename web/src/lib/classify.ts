import type { AxisId } from "@/data/definitions";
import {
  FALSE_FRIENDS,
  STANCE_CUES,
  TOPIC_CUES,
  matchesPattern,
  normalizeText,
} from "@/data/lexicon/india-v1";
import {
  TOPIC_ROUTES,
  authorshipWeight,
  engagementMultiplier,
  type TopicBucket,
} from "@/data/signals";
import type { ScoredActivity, XActivity } from "@/lib/types";

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function detectTopics(text: string): TopicBucket[] {
  const norm = normalizeText(text);
  const found = new Set<TopicBucket>();
  for (const cue of TOPIC_CUES) {
    if (matchesPattern(norm, cue.pattern)) found.add(cue.topic);
  }
  return [...found];
}

export function detectFalseFriends(text: string): {
  blocked: AxisId[];
  reasons: string[];
  forceTopics: TopicBucket[];
} {
  const norm = normalizeText(text);
  const blocked = new Set<AxisId>();
  const reasons: string[] = [];
  const forceTopics: TopicBucket[] = [];
  for (const ff of FALSE_FRIENDS) {
    if (matchesPattern(norm, ff.pattern)) {
      blocked.add(ff.blockAxis);
      reasons.push(ff.reason);
      if (ff.forceTopic) forceTopics.push(ff.forceTopic);
    }
  }
  return { blocked: [...blocked], reasons, forceTopics };
}

export function stanceFromText(text: string): {
  leftRight: number;
  national: number;
  tags: string[];
} {
  const norm = normalizeText(text);
  let lrSum = 0;
  let lrN = 0;
  let niSum = 0;
  let niN = 0;
  const tags = new Set<string>();

  for (const cue of STANCE_CUES) {
    if (!matchesPattern(norm, cue.pattern)) continue;
    for (const t of cue.tags) tags.add(t);
    if (cue.axis === "leftRight") {
      lrSum += cue.stance;
      lrN += 1;
    } else {
      niSum += cue.stance;
      niN += 1;
    }
  }

  return {
    leftRight: lrN ? clamp(lrSum / lrN, -1, 1) : 0,
    national: niN ? clamp(niSum / niN, -1, 1) : 0,
    tags: [...tags],
  };
}

/**
 * Classify one activity into weighted stance contributions per axis.
 * Adversary-Aligned stance is suppressed when only false-friend / dissent patterns match.
 */
export function classifyActivity(activity: XActivity): ScoredActivity | null {
  const combined = [activity.text, activity.contextText ?? ""]
    .filter(Boolean)
    .join(" ");
  const normCheck = normalizeText(combined);
  if (!normCheck) return null;

  const ff = detectFalseFriends(combined);
  let topics = detectTopics(combined);
  for (const t of ff.forceTopics) {
    if (!topics.includes(t)) topics.push(t);
  }

  const stance = stanceFromText(combined);

  // If no topic and no stance, skip
  if (!topics.length && stance.leftRight === 0 && stance.national === 0) {
    return null;
  }

  // Party tribal alone with no stance → skip (noise)
  if (
    topics.length === 1 &&
    topics[0] === "party_tribal" &&
    stance.leftRight === 0 &&
    stance.national === 0
  ) {
    return null;
  }

  let stanceLR = stance.leftRight;
  let stanceNI = stance.national;

  // False friends: zero out blocked axis stance unless other hard codes present
  if (ff.blocked.includes("nationalInterest")) {
    const hardAnti =
      stance.tags.some((t) =>
        [
          "territory_denial",
          "secession",
          "adversary_echo",
          "enemy_preference",
          "constitutional_rupture",
          "security_sabotage",
          "lawfare",
        ].includes(t),
      ) && stanceNI < 0;
    const hardNat =
      stance.tags.some((t) =>
        [
          "sovereignty",
          "defense",
          "adversary_realism",
          "favorable_alignment",
          "constitutional_order",
          "internal_security",
        ].includes(t),
      ) && stanceNI > 0;
    if (!hardAnti && !hardNat) {
      stanceNI = 0;
    }
  }

  const baseAuth = authorshipWeight(activity.kind);
  const engMul =
    activity.kind === "tweet" || activity.kind === "quote"
      ? engagementMultiplier(activity.likes, activity.retweets)
      : 1;

  let wLR = 0;
  let wNI = 0;

  for (const topic of topics) {
    const route = TOPIC_ROUTES[topic];
    const rw = route.routeWeight * baseAuth * engMul;
    if (route.primaryAxis === "leftRight") wLR += rw;
    if (route.primaryAxis === "nationalInterest") wNI += rw;
    if (route.secondaryAxis === "leftRight") {
      wLR += rw * (route.secondaryFactor ?? 0);
    }
    if (route.secondaryAxis === "nationalInterest") {
      // Only apply secondary National if sovereignty-ish tags present
      const sovereigntyLinked = stance.tags.some((t) =>
        [
          "sovereignty",
          "secession",
          "territory_denial",
          "adversary_echo",
          "constitutional_order",
          "constitutional_rupture",
        ].includes(t),
      );
      if (sovereigntyLinked) {
        wNI += rw * (route.secondaryFactor ?? 0);
      }
    }
  }

  // Stance-only posts (matched cues but weak topics): give base weight
  if (stanceLR !== 0 && wLR === 0) wLR = 0.6 * baseAuth * engMul;
  if (stanceNI !== 0 && wNI === 0) wNI = 0.7 * baseAuth * engMul;

  // If stance is zero on an axis, zero its weight
  if (stanceLR === 0) wLR = 0;
  if (stanceNI === 0) wNI = 0;

  if (wLR === 0 && wNI === 0) return null;

  return {
    activityId: activity.id,
    kind: activity.kind,
    text: activity.text,
    createdAt: activity.createdAt,
    permalink: activity.permalink,
    topics,
    tags: stance.tags,
    stanceLeftRight: stanceLR,
    stanceNational: stanceNI,
    weightLeftRight: wLR,
    weightNational: wNI,
    falseFriendsApplied: ff.reasons,
  };
}

import {
  LEXICON_PACK,
  METHODOLOGY_VERSION,
  REFERENCE_NATION,
  SCORE_ENGINE_VERSION,
} from "@/data/definitions";
import { classifyActivity } from "@/lib/classify";
import type {
  AxisScore,
  ConfidenceBreakdown,
  EvidenceItem,
  HandleScoreResult,
  ScoredActivity,
  XActivity,
} from "@/lib/types";

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function axisAggregate(
  items: ScoredActivity[],
  axis: "leftRight" | "nationalInterest",
): AxisScore {
  let num = 0;
  let den = 0;
  let n = 0;
  for (const it of items) {
    const w =
      axis === "leftRight" ? it.weightLeftRight : it.weightNational;
    const s =
      axis === "leftRight" ? it.stanceLeftRight : it.stanceNational;
    if (w <= 0 || s === 0) continue;
    num += w * s;
    den += Math.abs(w);
    n += 1;
  }
  const score = den > 0 ? clamp(100 * (num / den), -100, 100) : 0;
  return {
    axis,
    score: Math.round(score),
    nItems: n,
    absWeight: Math.round(den * 100) / 100,
  };
}

function daysBetween(a: string, b: string): number {
  const ms = Math.abs(new Date(a).getTime() - new Date(b).getTime());
  return ms / (1000 * 60 * 60 * 24);
}

/**
 * Heuristic bot risk from activity burstiness + identical text reuse.
 * 0 = human-like, 1 = high automation risk.
 */
export function estimateBotRisk(activities: XActivity[]): number {
  if (activities.length < 5) return 0.15;
  const sorted = [...activities].sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  let shortGaps = 0;
  for (let i = 1; i < sorted.length; i++) {
    const gap =
      new Date(sorted[i].createdAt).getTime() -
      new Date(sorted[i - 1].createdAt).getTime();
    if (gap < 30_000) shortGaps += 1;
  }
  const texts = activities.map((a) => a.text.trim().toLowerCase());
  const unique = new Set(texts).size;
  const dupRatio = 1 - unique / texts.length;
  const burst = shortGaps / Math.max(1, sorted.length - 1);
  return clamp(0.55 * burst + 0.45 * dupRatio, 0, 1);
}

export function computeConfidence(
  scored: ScoredActivity[],
  activities: XActivity[],
  botRisk: number,
): ConfidenceBreakdown {
  const nScored = scored.length;
  const topics = new Set(scored.flatMap((s) => s.topics));
  // 6 topic buckets max
  const topicCoverage = topics.size / 6;

  let timeSpanDays = 0;
  if (activities.length >= 2) {
    const times = activities.map((a) => a.createdAt).sort();
    timeSpanDays = daysBetween(times[0], times[times.length - 1]);
  }

  const volumeScore = clamp(nScored / 40, 0, 1);
  const spanScore = clamp(timeSpanDays / 180, 0, 1);
  const raw =
    100 *
    (0.4 * volumeScore +
      0.3 * topicCoverage +
      0.2 * spanScore +
      0.1 * (1 - botRisk));

  const overall = Math.round(clamp(raw, 0, 100));
  const label: ConfidenceBreakdown["label"] =
    overall >= 70 ? "high" : overall >= 40 ? "medium" : "low";

  const notes: string[] = [];
  if (nScored < 8) notes.push("Few on-topic posts scored — point is provisional.");
  if (topicCoverage < 0.34) notes.push("Narrow topic coverage across axes.");
  if (botRisk >= 0.45) notes.push("Elevated coordination/automation risk dampens confidence.");
  if (timeSpanDays < 14) notes.push("Short time window — may not reflect durable stance.");
  if (!notes.length) notes.push("Adequate volume and topic spread for a stable estimate.");

  return {
    overall,
    label,
    nScored,
    topicCoverage: Math.round(topicCoverage * 100) / 100,
    timeSpanDays: Math.round(timeSpanDays),
    botRisk: Math.round(botRisk * 100) / 100,
    notes,
  };
}

function quadrantLabel(lr: number, ni: number): string {
  const h = lr < -15 ? "Left" : lr > 15 ? "Right" : "Center";
  const v =
    ni > 15
      ? "National"
      : ni < -15
        ? "Adversary-Aligned"
        : "Mixed national-interest";
  if (h === "Center" && v === "Mixed national-interest") return "Centrist / Mixed";
  return `${h} · ${v}`;
}

function summaryText(lr: number, ni: number, conf: ConfidenceBreakdown): string {
  const lrWord =
    lr <= -40
      ? "clearly Left"
      : lr <= -15
        ? "Left-leaning"
        : lr >= 40
          ? "clearly Right"
          : lr >= 15
            ? "Right-leaning"
            : "mixed on Left–Right";
  const niWord =
    ni >= 40
      ? "strongly National-interest first"
      : ni >= 15
        ? "National-leaning"
        : ni <= -40
          ? "strongly Adversary-Aligned on national-interest codes"
          : ni <= -15
            ? "Adversary-Aligned-leaning by national-interest codes"
            : "mixed on national interest";
  return `Public X activity reads as ${lrWord} and ${niWord} (confidence ${conf.label}). Experimental estimate — not a personal attack. Party criticism alone does not define the National axis.`;
}

function buildEvidence(scored: ScoredActivity[], limit = 20): EvidenceItem[] {
  const ranked = [...scored].sort((a, b) => {
    const ca =
      Math.abs(a.weightLeftRight * a.stanceLeftRight) +
      Math.abs(a.weightNational * a.stanceNational);
    const cb =
      Math.abs(b.weightLeftRight * b.stanceLeftRight) +
      Math.abs(b.weightNational * b.stanceNational);
    return cb - ca;
  });

  return ranked.slice(0, limit).map((s) => ({
    activityId: s.activityId,
    kind: s.kind,
    text: s.text,
    createdAt: s.createdAt,
    permalink: s.permalink,
    topics: s.topics,
    tags: s.tags,
    contributionLeftRight: Math.round(s.weightLeftRight * s.stanceLeftRight * 100) / 100,
    contributionNational: Math.round(s.weightNational * s.stanceNational * 100) / 100,
    weight: Math.round((s.weightLeftRight + s.weightNational) * 100) / 100,
  }));
}

export function scoreHandleActivities(opts: {
  handle: string;
  displayName?: string;
  activities: XActivity[];
  source: "demo" | "live";
}): HandleScoreResult {
  const handle = opts.handle.replace(/^@/, "").toLowerCase();
  const scored: ScoredActivity[] = [];
  for (const a of opts.activities) {
    const c = classifyActivity(a);
    if (c) scored.push(c);
  }

  const leftRight = axisAggregate(scored, "leftRight");
  const nationalInterest = axisAggregate(scored, "nationalInterest");
  const botRisk = estimateBotRisk(opts.activities);
  const confidence = computeConfidence(scored, opts.activities, botRisk);

  return {
    handle,
    displayName: opts.displayName,
    asOf: new Date().toISOString().slice(0, 10),
    methodologyVersion: METHODOLOGY_VERSION,
    lexiconPack: LEXICON_PACK,
    scoreEngineVersion: SCORE_ENGINE_VERSION,
    referenceNation: REFERENCE_NATION,
    coords: {
      leftRight: leftRight.score,
      nationalInterest: nationalInterest.score,
    },
    axes: { leftRight, nationalInterest },
    confidence,
    evidence: buildEvidence(scored),
    quadrant: quadrantLabel(leftRight.score, nationalInterest.score),
    summary: summaryText(leftRight.score, nationalInterest.score, confidence),
    source: opts.source,
    activityCount: opts.activities.length,
    scoredCount: scored.length,
  };
}

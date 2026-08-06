import type { Coords } from "@/data/personalities";
import {
  questions,
  type Axis,
  type Question,
} from "@/data/questions";
import type { Answers } from "@/lib/scoring";

export const AXIS_KEYS: Axis[] = ["economic", "authority", "cultural"];

/** Express path: 2 balanced, high-weight items per axis. */
export const EXPRESS_IDS = [
  "e2", // markets +
  "e1", // redistribute −
  "a3", // crisis authority +
  "a2", // free speech −
  "c1", // nation first +
  "c2", // diversity −
] as const;

export const ADAPTIVE = {
  /** Per-axis confidence to stop refining that axis */
  stopConfidence: 72,
  /** Minimum items before an axis may stop */
  minItemsPerAxis: 2,
  /** Hard cap on core adaptive items (excludes admire) */
  maxCoreItems: 14,
} as const;

export type AxisConfidence = Record<Axis, number>; // 0..100

export type AdaptiveEstimate = {
  coords: Coords;
  confidence: AxisConfidence;
  counts: Record<Axis, number>;
  /** Axes that still need items */
  openAxes: Axis[];
  done: boolean;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/** Unit signal ∈ [−1, +1] for one Likert answer. */
export function itemSignal(q: Question, value: number): number {
  return ((value - 3) / 2) * q.direction;
}

/**
 * Score using only answered items (adaptive-safe).
 * Unanswered bank items do not inflate the denominator.
 */
export function scoreAnswered(
  answers: Answers,
  bank: Question[],
): Coords {
  const raw: Coords = { economic: 0, authority: 0, cultural: 0 };
  const maxAbs: Coords = { economic: 0, authority: 0, cultural: 0 };

  for (const q of bank) {
    const value = answers[q.id];
    if (value == null) continue;
    maxAbs[q.axis] += 2 * q.weight;
    const centered = value - 3;
    raw[q.axis] += centered * q.weight * q.direction;
  }

  const coords: Coords = { economic: 0, authority: 0, cultural: 0 };
  for (const axis of AXIS_KEYS) {
    if (maxAbs[axis] === 0) {
      coords[axis] = 0;
      continue;
    }
    coords[axis] = clamp(Math.round((100 * raw[axis]) / maxAbs[axis]), -100, 100);
  }
  return coords;
}

export function confidenceForAxis(
  answers: Answers,
  bank: Question[],
  axis: Axis,
): { confidence: number; count: number } {
  const items = bank.filter((q) => q.axis === axis && answers[q.id] != null);
  const n = items.length;
  if (n === 0) return { confidence: 0, count: 0 };

  const signals = items.map((q) => itemSignal(q, answers[q.id]!));
  const mean = signals.reduce((a, b) => a + b, 0) / n;
  const variance =
    signals.reduce((a, s) => a + (s - mean) * (s - mean), 0) / n;
  // High variance ⇒ inconsistent answers on this axis
  const consistency = 1 - Math.min(1, variance / 0.55);
  // 3 solid items ≈ full coverage for our short instrument
  const coverage = Math.min(1, n / 3);
  // Bonus if we have both agree-push and reverse-coded items
  const dirs = new Set(items.map((q) => q.direction));
  const balance = dirs.size > 1 ? 1 : 0.85;

  const confidence = clamp(
    Math.round(100 * (0.5 * coverage + 0.4 * consistency + 0.1) * balance),
    0,
    100,
  );
  return { confidence, count: n };
}

export function estimateAdaptive(
  answers: Answers,
  bank: Question[],
): AdaptiveEstimate {
  const coords = scoreAnswered(answers, bank);
  const confidence = { economic: 0, authority: 0, cultural: 0 } as AxisConfidence;
  const counts = { economic: 0, authority: 0, cultural: 0 } as Record<Axis, number>;

  for (const axis of AXIS_KEYS) {
    const { confidence: c, count } = confidenceForAxis(answers, bank, axis);
    confidence[axis] = c;
    counts[axis] = count;
  }

  const answeredCount = bank.filter((q) => answers[q.id] != null).length;

  const openAxes = AXIS_KEYS.filter((axis) => {
    if (counts[axis] < ADAPTIVE.minItemsPerAxis) return true;
    return confidence[axis] < ADAPTIVE.stopConfidence;
  });

  const hitCap = answeredCount >= ADAPTIVE.maxCoreItems;
  // Full coverage on every axis but still muddy → accept plateau (don't grind to hard cap)
  const coveragePlateau = AXIS_KEYS.every((axis) => counts[axis] >= 3);
  const done = openAxes.length === 0 || hitCap || coveragePlateau;

  return { coords, confidence, counts, openAxes, done };
}

export function expressQuestions(bank: Question[] = questions): Question[] {
  const byId = new Map(bank.map((q) => [q.id, q]));
  return EXPRESS_IDS.map((id) => byId.get(id)).filter(Boolean) as Question[];
}

/**
 * Pick next refine question: lowest-confidence open axis, highest weight,
 * prefer direction that challenges current lean (information gain).
 */
export function pickNextQuestion(
  answers: Answers,
  bank: Question[],
  estimate: AdaptiveEstimate,
): Question | null {
  if (estimate.done) return null;

  const unanswered = bank.filter((q) => answers[q.id] == null);
  if (!unanswered.length) return null;

  // Prefer open axes; if somehow empty, pick globally weakest
  const targetAxes =
    estimate.openAxes.length > 0
      ? [...estimate.openAxes].sort(
          (a, b) => estimate.confidence[a] - estimate.confidence[b],
        )
      : [...AXIS_KEYS].sort(
          (a, b) => estimate.confidence[a] - estimate.confidence[b],
        );

  for (const axis of targetAxes) {
    const pool = unanswered.filter((q) => q.axis === axis);
    if (!pool.length) continue;

    const lean = estimate.coords[axis];
    // If lean is positive, prefer a − direction item (challenge); and vice versa
    const preferDir: 1 | -1 = lean >= 0 ? -1 : 1;
    const sorted = [...pool].sort((a, b) => {
      const dirScore =
        (a.direction === preferDir ? 0 : 1) - (b.direction === preferDir ? 0 : 1);
      if (dirScore !== 0) return dirScore;
      return b.weight - a.weight;
    });
    return sorted[0];
  }

  // Fallback: any unanswered by weight
  return [...unanswered].sort((a, b) => b.weight - a.weight)[0] ?? null;
}

/** Build ordered queue: express first (unanswered), then adaptive picks as needed. */
export function buildAdaptiveQueue(
  answers: Answers,
  bank: Question[],
): Question[] {
  const express = expressQuestions(bank).filter((q) => answers[q.id] == null);
  if (express.length) return express;

  const estimate = estimateAdaptive(answers, bank);
  const next = pickNextQuestion(answers, bank, estimate);
  return next ? [next] : [];
}

export function overallConfidence(confidence: AxisConfidence): number {
  return Math.round(
    (confidence.economic + confidence.authority + confidence.cultural) / 3,
  );
}

export function confidenceLabel(score: number): string {
  if (score >= 80) return "High";
  if (score >= 60) return "Solid";
  if (score >= 40) return "Moderate";
  return "Early";
}

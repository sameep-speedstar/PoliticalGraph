import { clusters, type ThinkingCluster } from "@/data/clusters";
import { personalities, type Coords, type Personality } from "@/data/personalities";
import { questions, type Question } from "@/data/questions";

export type Answers = Record<string, number>; // questionId -> 1..5

const AXIS_KEYS: (keyof Coords)[] = ["economic", "authority", "cultural"];

export function scoreAnswers(
  answers: Answers,
  itemBank: Question[] = questions,
): Coords {
  const raw: Coords = { economic: 0, authority: 0, cultural: 0 };
  const maxAbs: Coords = { economic: 0, authority: 0, cultural: 0 };

  for (const q of itemBank) {
    maxAbs[q.axis] += 2 * q.weight;
    const value = answers[q.id];
    if (value == null) continue;
    const centered = value - 3; // −2..+2
    raw[q.axis] += centered * q.weight * q.direction;
  }

  const coords: Coords = { economic: 0, authority: 0, cultural: 0 };
  for (const axis of AXIS_KEYS) {
    const denom = maxAbs[axis] || 1;
    coords[axis] = clamp(Math.round((100 * raw[axis]) / denom), -100, 100);
  }
  return coords;
}

/** Soft pull toward admired figures — capped so the survey still dominates. */
export function applyAdmirationPrior(
  coords: Coords,
  admiredIds: string[],
  alpha = 0.12,
): { coords: Coords; adjusted: boolean } {
  const figures = admiredIds
    .filter((id) => id !== "none")
    .map((id) => personalities.find((p) => p.id === id))
    .filter((p): p is Personality => Boolean(p));

  if (!figures.length) return { coords, adjusted: false };

  const mean: Coords = { economic: 0, authority: 0, cultural: 0 };
  for (const f of figures) {
    mean.economic += f.coords.economic;
    mean.authority += f.coords.authority;
    mean.cultural += f.coords.cultural;
  }
  mean.economic /= figures.length;
  mean.authority /= figures.length;
  mean.cultural /= figures.length;

  const blended: Coords = {
    economic: Math.round((1 - alpha) * coords.economic + alpha * mean.economic),
    authority: Math.round((1 - alpha) * coords.authority + alpha * mean.authority),
    cultural: Math.round((1 - alpha) * coords.cultural + alpha * mean.cultural),
  };
  return { coords: blended, adjusted: true };
}

export function distance(a: Coords, b: Coords): number {
  const dx = a.economic - b.economic;
  const dy = a.authority - b.authority;
  const dz = a.cultural - b.cultural;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/** Max theoretical distance in the cube ≈ 346. */
export function similarityPercent(a: Coords, b: Coords): number {
  const d = distance(a, b);
  return clamp(Math.round(100 * (1 - d / 346.4)), 0, 100);
}

export function nearestPersonalities(coords: Coords, n = 5) {
  return [...personalities]
    .map((p) => ({
      personality: p,
      distance: distance(coords, p.coords),
      similarity: similarityPercent(coords, p.coords),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n);
}

export function nearestClusters(coords: Coords, n = 3) {
  return [...clusters]
    .map((c) => ({
      cluster: c as ThinkingCluster,
      distance: distance(coords, c.centroid),
      similarity: similarityPercent(coords, c.centroid),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, n);
}

export function religiosityFromAnswers(answers: Answers): {
  label: string;
  score: number;
} {
  // c3 agree → religious public role; c6 agree → secular personal compass
  const c3 = answers.c3 ?? 3;
  const c6 = answers.c6 ?? 3;
  const score = clamp(Math.round(((c3 - 3) * 25 + (3 - c6) * 25) / 1), -100, 100);
  let label = "Plural / mixed";
  if (score >= 40) label = "Faith-forward";
  else if (score <= -40) label = "Secular";
  else if (score >= 15) label = "Tradition-leaning";
  else if (score <= -15) label = "Secular-leaning";
  return { label, score };
}

export function axisLabels(coords: Coords) {
  return {
    economic:
      coords.economic > 20
        ? "Market-leaning"
        : coords.economic < -20
          ? "Equality-leaning"
          : "Economically mixed",
    authority:
      coords.authority > 20
        ? "Order-leaning"
        : coords.authority < -20
          ? "Liberty-leaning"
          : "Authority-balanced",
    cultural:
      coords.cultural > 20
        ? "Particularist"
        : coords.cultural < -20
          ? "Cosmopolitan"
          : "Culturally mixed",
  };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function encodeResultPayload(payload: {
  coords: Coords;
  admired: string[];
}): string {
  if (typeof btoa === "undefined") {
    return Buffer.from(JSON.stringify(payload)).toString("base64url");
  }
  const json = JSON.stringify(payload);
  return btoa(unescape(encodeURIComponent(json)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeResultPayload(token: string): {
  coords: Coords;
  admired: string[];
} | null {
  try {
    const padded = token.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob !== "undefined"
        ? decodeURIComponent(escape(atob(padded)))
        : Buffer.from(token, "base64url").toString("utf8");
    const data = JSON.parse(json);
    if (
      typeof data?.coords?.economic !== "number" ||
      typeof data?.coords?.authority !== "number" ||
      typeof data?.coords?.cultural !== "number"
    ) {
      return null;
    }
    return {
      coords: data.coords,
      admired: Array.isArray(data.admired) ? data.admired : [],
    };
  } catch {
    return null;
  }
}

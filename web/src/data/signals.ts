/**
 * Locked X signal weights and topic → axis routing.
 */

import type { AxisId } from "@/data/definitions";

export type ActivityKind =
  | "tweet"
  | "quote"
  | "reply"
  | "retweet"
  | "like";

/** Authorship strength weights from the plan. */
export const AUTHORSHIP_WEIGHTS: Record<ActivityKind, number> = {
  tweet: 1.0,
  quote: 0.9,
  reply: 0.7,
  retweet: 0.45,
  like: 0.15,
};

/** Engagement received on own posts scales weight in [0.5, 1.5]. */
export const ENGAGEMENT_MULTIPLIER = {
  min: 0.5,
  max: 1.5,
  /** Soft reference: this many likes+RTs ≈ multiplier 1.0 */
  pivot: 50,
} as const;

export type TopicBucket =
  | "economy"
  | "identity_culture"
  | "borders_security"
  | "foreign_policy"
  | "constitutional_order"
  | "party_tribal";

export type TopicRoute = {
  id: TopicBucket;
  label: string;
  primaryAxis: AxisId | null;
  /** Secondary axis contribution factor 0..1 when keywords also hit that axis */
  secondaryAxis?: AxisId;
  secondaryFactor?: number;
  /** Base importance for aggregation before authorship weight */
  routeWeight: number;
  description: string;
};

export const TOPIC_ROUTES: Record<TopicBucket, TopicRoute> = {
  economy: {
    id: "economy",
    label: "Economy / welfare / markets",
    primaryAxis: "leftRight",
    routeWeight: 1.0,
    description: "Taxes, welfare, PSUs, privatization, freebies, unions",
  },
  identity_culture: {
    id: "identity_culture",
    label: "Caste / gender / religion-in-public-life",
    primaryAxis: "leftRight",
    secondaryAxis: "nationalInterest",
    secondaryFactor: 0.15,
    routeWeight: 0.95,
    description:
      "Identity equity vs traditionalism; secondary National only if sovereignty-framed",
  },
  borders_security: {
    id: "borders_security",
    label: "Borders / military / terror / China / Pakistan",
    primaryAxis: "nationalInterest",
    routeWeight: 1.15,
    description: "Territory, defense, terror, adversary states",
  },
  foreign_policy: {
    id: "foreign_policy",
    label: "Foreign policy / blocs / alignments",
    primaryAxis: "nationalInterest",
    secondaryAxis: "leftRight",
    secondaryFactor: 0.2,
    routeWeight: 1.05,
    description: "Quad, sanctions, favorable/unfavorable alignments",
  },
  constitutional_order: {
    id: "constitutional_order",
    label: "Constitution / federalism / secession / azadi",
    primaryAxis: "nationalInterest",
    routeWeight: 1.2,
    description: "Union integrity, parallel sovereignty, constitutional rupture",
  },
  party_tribal: {
    id: "party_tribal",
    label: "Party tribal (leader names only)",
    primaryAxis: null,
    routeWeight: 0.2,
    description:
      "Low weight unless co-tagged with a value topic; does not move National alone",
  },
};

export function engagementMultiplier(likes: number, retweets: number): number {
  const eng = Math.max(0, likes) + Math.max(0, retweets);
  const { min, max, pivot } = ENGAGEMENT_MULTIPLIER;
  // logistic-ish map around pivot
  const t = eng / (eng + pivot);
  return min + (max - min) * t;
}

export function authorshipWeight(kind: ActivityKind): number {
  return AUTHORSHIP_WEIGHTS[kind];
}

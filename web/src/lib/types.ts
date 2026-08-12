import type { ActivityKind, TopicBucket } from "@/data/signals";
import type { AxisId } from "@/data/definitions";

export type XActivity = {
  id: string;
  kind: ActivityKind;
  text: string;
  createdAt: string; // ISO
  likes: number;
  retweets: number;
  permalink?: string;
  /** Parent/context text for replies */
  contextText?: string;
};

export type ScoredActivity = {
  activityId: string;
  kind: ActivityKind;
  text: string;
  createdAt: string;
  permalink?: string;
  topics: TopicBucket[];
  tags: string[];
  stanceLeftRight: number; // −1…+1
  stanceNational: number; // −1…+1
  weightLeftRight: number;
  weightNational: number;
  falseFriendsApplied: string[];
};

export type AxisScore = {
  axis: AxisId;
  score: number; // −100…+100
  nItems: number;
  absWeight: number;
};

export type ConfidenceBreakdown = {
  overall: number; // 0…100
  label: "low" | "medium" | "high";
  nScored: number;
  topicCoverage: number; // 0…1
  timeSpanDays: number;
  botRisk: number; // 0…1
  notes: string[];
};

export type EvidenceItem = {
  activityId: string;
  kind: ActivityKind;
  text: string;
  createdAt: string;
  permalink?: string;
  topics: TopicBucket[];
  tags: string[];
  contributionLeftRight: number;
  contributionNational: number;
  weight: number;
};

export type HandleScoreResult = {
  handle: string;
  displayName?: string;
  asOf: string;
  methodologyVersion: string;
  lexiconPack: string;
  referenceNation: string;
  coords: {
    leftRight: number;
    nationalInterest: number;
  };
  axes: {
    leftRight: AxisScore;
    nationalInterest: AxisScore;
  };
  confidence: ConfidenceBreakdown;
  evidence: EvidenceItem[];
  quadrant: string;
  summary: string;
  source: "demo" | "live";
  activityCount: number;
  scoredCount: number;
};

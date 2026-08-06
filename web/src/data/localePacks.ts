import type { Axis, Question } from "./questions";

export type LocaleId = "global" | "IN" | "US" | "EU";

export type LocalePack = {
  id: LocaleId;
  label: string;
  blurb: string;
  affairsAsOf: string;
  questions: Question[];
};

/** Location + current-affairs items. Still value-framed; map onto fixed axes. */
export const localePacks: LocalePack[] = [
  {
    id: "global",
    label: "Global / prefer not to say",
    blurb: "Core values only — no regional current-affairs pack.",
    affairsAsOf: "2026-08",
    questions: [],
  },
  {
    id: "IN",
    label: "India",
    blurb: "Regional framing + Aug 2026 public debates, mapped to the same axes.",
    affairsAsOf: "2026-08",
    questions: [
      {
        id: "in-c1",
        text: "When national culture and minority practices conflict, the majority cultural framework should guide public institutions.",
        axis: "cultural" as Axis,
        direction: 1,
        weight: 1.1,
        section: "society",
      },
      {
        id: "in-e1",
        text: "The state should steer industrial policy and strategic sectors even if that reduces pure market competition.",
        axis: "economic" as Axis,
        direction: -1,
        weight: 1.0,
        section: "politics",
      },
      {
        id: "in-a1",
        text: "Strong central authority is justified when it delivers security and development faster than slow consensus.",
        axis: "authority" as Axis,
        direction: 1,
        weight: 1.1,
        section: "politics",
      },
      {
        id: "in-affairs-1",
        text: "In disputes over speech and religious sentiment, public order should outweigh absolute free expression.",
        axis: "authority" as Axis,
        direction: 1,
        weight: 1.0,
        section: "society",
      },
    ],
  },
  {
    id: "US",
    label: "United States",
    blurb: "Regional framing + Aug 2026 public debates, mapped to the same axes.",
    affairsAsOf: "2026-08",
    questions: [
      {
        id: "us-c1",
        text: "Immigration policy should prioritize cultural cohesion and border control over expanding legal inflows.",
        axis: "cultural" as Axis,
        direction: 1,
        weight: 1.1,
        section: "society",
      },
      {
        id: "us-e1",
        text: "Tariffs that protect domestic industry are worth higher consumer prices.",
        axis: "economic" as Axis,
        direction: -1,
        weight: 0.9,
        section: "politics",
      },
      {
        id: "us-a1",
        text: "Campuses and platforms should restrict speech that many people find harmful or demeaning.",
        axis: "authority" as Axis,
        direction: 1,
        weight: 1.1,
        section: "society",
      },
      {
        id: "us-affairs-1",
        text: "Federal agencies need broader emergency powers to manage technology, health, and security risks.",
        axis: "authority" as Axis,
        direction: 1,
        weight: 1.0,
        section: "politics",
      },
    ],
  },
  {
    id: "EU",
    label: "European Union / UK",
    blurb: "Regional framing + Aug 2026 public debates, mapped to the same axes.",
    affairsAsOf: "2026-08",
    questions: [
      {
        id: "eu-c1",
        text: "EU-level rules should override national preferences when they protect open borders and shared markets.",
        axis: "cultural" as Axis,
        direction: -1,
        weight: 1.0,
        section: "society",
      },
      {
        id: "eu-e1",
        text: "Aggressive climate regulation is worth slower short-term growth.",
        axis: "economic" as Axis,
        direction: -1,
        weight: 0.9,
        section: "politics",
      },
      {
        id: "eu-a1",
        text: "Hate-speech and disinformation laws are a legitimate use of state power.",
        axis: "authority" as Axis,
        direction: 1,
        weight: 1.1,
        section: "society",
      },
      {
        id: "eu-affairs-1",
        text: "National governments should regain freedom to set migration policy without continental constraints.",
        axis: "cultural" as Axis,
        direction: 1,
        weight: 1.1,
        section: "politics",
      },
    ],
  },
];

export function getLocalePack(id: LocaleId) {
  return localePacks.find((p) => p.id === id) ?? localePacks[0];
}

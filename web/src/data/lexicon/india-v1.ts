/**
 * India v1 lexicon: topic detectors, stance cues, adversary/national entities,
 * and false-friend filters.
 *
 * Patterns are case-insensitive substring / phrase matchers (normalized text).
 * Stance: negative = Left or Anti-National; positive = Right or National.
 */

import type { TopicBucket } from "@/data/signals";
import type { AxisId } from "@/data/definitions";

export const LEXICON_ID = "india-v1";
export const LEXICON_AS_OF = "2026-08-12";

export type StanceCue = {
  pattern: string;
  axis: AxisId;
  /** −1 … +1 contribution when matched */
  stance: number;
  tags: string[];
};

export type TopicCue = {
  pattern: string;
  topic: TopicBucket;
};

/** Adversary / hostile entities (topic + National axis context). */
export const ADVERSARY_ENTITIES: string[] = [
  "pla",
  "ccp",
  "chinese communist",
  "prc",
  "beijing's claim",
  "isi",
  "pakistani army",
  "pak army",
  "rawalpindi",
  "lashkar",
  "let ",
  "jaish",
  "jem ",
  "hizbul",
  "hm ",
  "terrorist from pakistan",
  "cross-border terror",
  "gtf",
  "cpec",
];

/** National institutions / integrity markers. */
export const NATIONAL_INSTITUTIONS: string[] = [
  "indian army",
  "indian navy",
  "indian air force",
  "iaf",
  "bharat",
  "armed forces",
  "border security force",
  "bsf",
  "itbp",
  "drdo",
  "constitution of india",
  "supreme court of india",
  "territorial integrity",
  "union of india",
  "article 370",
];

export const TOPIC_CUES: TopicCue[] = [
  // economy
  { pattern: "wealth tax", topic: "economy" },
  { pattern: "freebie", topic: "economy" },
  { pattern: "freebies", topic: "economy" },
  { pattern: "subsidy", topic: "economy" },
  { pattern: "privatisation", topic: "economy" },
  { pattern: "privatization", topic: "economy" },
  { pattern: "nationalisation", topic: "economy" },
  { pattern: "nationalization", topic: "economy" },
  { pattern: "psu", topic: "economy" },
  { pattern: "public sector", topic: "economy" },
  { pattern: "minimum wage", topic: "economy" },
  { pattern: "labour union", topic: "economy" },
  { pattern: "labor union", topic: "economy" },
  { pattern: "trade union", topic: "economy" },
  { pattern: "billionaire", topic: "economy" },
  { pattern: "inequality", topic: "economy" },
  { pattern: "gst", topic: "economy" },
  { pattern: "corporate tax", topic: "economy" },
  { pattern: "atmanirbhar", topic: "economy" },
  { pattern: "make in india", topic: "economy" },
  { pattern: "disinvestment", topic: "economy" },
  { pattern: "farmers' protest", topic: "economy" },
  { pattern: "msp ", topic: "economy" },
  { pattern: "guaranteed msp", topic: "economy" },

  // identity / culture
  { pattern: "caste census", topic: "identity_culture" },
  { pattern: "reservation", topic: "identity_culture" },
  { pattern: "quota", topic: "identity_culture" },
  { pattern: "hindutva", topic: "identity_culture" },
  { pattern: "secular", topic: "identity_culture" },
  { pattern: "majoritarian", topic: "identity_culture" },
  { pattern: "minority rights", topic: "identity_culture" },
  { pattern: "ucc", topic: "identity_culture" },
  { pattern: "uniform civil code", topic: "identity_culture" },
  { pattern: "caa", topic: "identity_culture" },
  { pattern: "nrc", topic: "identity_culture" },
  { pattern: "love jihad", topic: "identity_culture" },
  { pattern: "woke", topic: "identity_culture" },
  { pattern: "gender justice", topic: "identity_culture" },
  { pattern: "patriarchy", topic: "identity_culture" },
  { pattern: "temple", topic: "identity_culture" },
  { pattern: "ram mandir", topic: "identity_culture" },

  // borders / security
  { pattern: "line of actual control", topic: "borders_security" },
  { pattern: "lac ", topic: "borders_security" },
  { pattern: "loc ", topic: "borders_security" },
  { pattern: "galwan", topic: "borders_security" },
  { pattern: "arunachal", topic: "borders_security" },
  { pattern: "aksai chin", topic: "borders_security" },
  { pattern: "pok ", topic: "borders_security" },
  { pattern: "pakistan occupied", topic: "borders_security" },
  { pattern: "chinese incursion", topic: "borders_security" },
  { pattern: "pla ", topic: "borders_security" },
  { pattern: "terrorism", topic: "borders_security" },
  { pattern: "terrorist", topic: "borders_security" },
  { pattern: "pulwama", topic: "borders_security" },
  { pattern: "balakot", topic: "borders_security" },
  { pattern: "surgical strike", topic: "borders_security" },
  { pattern: "indian army", topic: "borders_security" },
  { pattern: "defence production", topic: "borders_security" },
  { pattern: "defense production", topic: "borders_security" },
  { pattern: "theater command", topic: "borders_security" },
  { pattern: "infiltration", topic: "borders_security" },
  { pattern: "isi ", topic: "borders_security" },

  // foreign policy
  { pattern: "quad ", topic: "foreign_policy" },
  { pattern: "the quad", topic: "foreign_policy" },
  { pattern: "indo-pacific", topic: "foreign_policy" },
  { pattern: "brics", topic: "foreign_policy" },
  { pattern: "russia oil", topic: "foreign_policy" },
  { pattern: "israel", topic: "foreign_policy" },
  { pattern: "iran deal", topic: "foreign_policy" },
  { pattern: "sanctions on india", topic: "foreign_policy" },
  { pattern: "strategic autonomy", topic: "foreign_policy" },
  { pattern: "two-front", topic: "foreign_policy" },
  { pattern: "cpec", topic: "foreign_policy" },
  { pattern: "belt and road", topic: "foreign_policy" },

  // constitutional / secession
  { pattern: "azadi", topic: "constitutional_order" },
  { pattern: "occupied kashmir", topic: "constitutional_order" },
  { pattern: "plebiscite", topic: "constitutional_order" },
  { pattern: "self-determination for kashmir", topic: "constitutional_order" },
  { pattern: "secession", topic: "constitutional_order" },
  { pattern: "break india", topic: "constitutional_order" },
  { pattern: "tukde tukde", topic: "constitutional_order" },
  { pattern: "article 370", topic: "constitutional_order" },
  { pattern: "constitutional overthrow", topic: "constitutional_order" },
  { pattern: "foreign trusteeship", topic: "constitutional_order" },
  { pattern: "integrity of the union", topic: "constitutional_order" },
  { pattern: "federalism", topic: "constitutional_order" },

  // party tribal (low weight alone)
  { pattern: "modi", topic: "party_tribal" },
  { pattern: "rahul gandhi", topic: "party_tribal" },
  { pattern: "bjp", topic: "party_tribal" },
  { pattern: "congress party", topic: "party_tribal" },
  { pattern: "pappu", topic: "party_tribal" },
  { pattern: "godi media", topic: "party_tribal" },
];

/** Stance cues — applied after topic detection. */
export const STANCE_CUES: StanceCue[] = [
  // Left / Right economy
  {
    pattern: "tax the rich",
    axis: "leftRight",
    stance: -0.85,
    tags: ["redistribution"],
  },
  {
    pattern: "wealth tax",
    axis: "leftRight",
    stance: -0.8,
    tags: ["redistribution"],
  },
  {
    pattern: "inequality is the real",
    axis: "leftRight",
    stance: -0.7,
    tags: ["redistribution"],
  },
  {
    pattern: "freebies destroy",
    axis: "leftRight",
    stance: 0.75,
    tags: ["anti_redistribution"],
  },
  {
    pattern: "revadi",
    axis: "leftRight",
    stance: 0.7,
    tags: ["anti_redistribution"],
  },
  {
    pattern: "privatise",
    axis: "leftRight",
    stance: 0.55,
    tags: ["markets"],
  },
  {
    pattern: "privatize",
    axis: "leftRight",
    stance: 0.55,
    tags: ["markets"],
  },
  {
    pattern: "stop privatisation",
    axis: "leftRight",
    stance: -0.7,
    tags: ["state_economy"],
  },
  {
    pattern: "stop privatization",
    axis: "leftRight",
    stance: -0.7,
    tags: ["state_economy"],
  },
  {
    pattern: "strengthen psu",
    axis: "leftRight",
    stance: -0.65,
    tags: ["state_economy"],
  },
  {
    pattern: "nationalise",
    axis: "leftRight",
    stance: -0.7,
    tags: ["state_economy"],
  },
  {
    pattern: "nationalize",
    axis: "leftRight",
    stance: -0.7,
    tags: ["state_economy"],
  },
  {
    pattern: "lower corporate tax",
    axis: "leftRight",
    stance: 0.6,
    tags: ["markets"],
  },
  {
    pattern: "ease of doing business",
    axis: "leftRight",
    stance: 0.55,
    tags: ["markets"],
  },
  {
    pattern: "union power",
    axis: "leftRight",
    stance: -0.55,
    tags: ["labor"],
  },
  {
    pattern: "unions hurt growth",
    axis: "leftRight",
    stance: 0.6,
    tags: ["labor"],
  },

  // Left / Right identity
  {
    pattern: "caste census now",
    axis: "leftRight",
    stance: -0.65,
    tags: ["identity_equity"],
  },
  {
    pattern: "expand reservation",
    axis: "leftRight",
    stance: -0.7,
    tags: ["identity_equity"],
  },
  {
    pattern: "reservation is vote bank",
    axis: "leftRight",
    stance: 0.7,
    tags: ["anti_redistribution"],
  },
  {
    pattern: "merit alone",
    axis: "leftRight",
    stance: 0.55,
    tags: ["merit"],
  },
  {
    pattern: "uniform civil code",
    axis: "leftRight",
    stance: 0.5,
    tags: ["cultural_traditional"],
  },
  {
    pattern: "ucc will unite",
    axis: "leftRight",
    stance: 0.55,
    tags: ["cultural_traditional"],
  },
  {
    pattern: "secularism is under attack",
    axis: "leftRight",
    stance: -0.6,
    tags: ["secular_progressive"],
  },
  {
    pattern: "hindutva agenda",
    axis: "leftRight",
    stance: -0.55,
    tags: ["secular_progressive"],
  },
  {
    pattern: "proud hindutva",
    axis: "leftRight",
    stance: 0.7,
    tags: ["cultural_traditional"],
  },
  {
    pattern: "ram mandir is civilisational",
    axis: "leftRight",
    stance: 0.65,
    tags: ["cultural_traditional"],
  },
  {
    pattern: "woke nonsense",
    axis: "leftRight",
    stance: 0.6,
    tags: ["cultural_traditional"],
  },
  {
    pattern: "smash the patriarchy",
    axis: "leftRight",
    stance: -0.55,
    tags: ["identity_equity"],
  },
  {
    pattern: "law and order first",
    axis: "leftRight",
    stance: 0.65,
    tags: ["order"],
  },
  {
    pattern: "police brutality",
    axis: "leftRight",
    stance: -0.5,
    tags: ["civil_liberties"],
  },
  {
    pattern: "right to protest",
    axis: "leftRight",
    stance: -0.45,
    tags: ["civil_liberties"],
  },

  // National (+)
  {
    pattern: "arunachal is india",
    axis: "nationalInterest",
    stance: 0.9,
    tags: ["sovereignty"],
  },
  {
    pattern: "pok is india",
    axis: "nationalInterest",
    stance: 0.85,
    tags: ["sovereignty"],
  },
  {
    pattern: "kashmir is an integral",
    axis: "nationalInterest",
    stance: 0.9,
    tags: ["sovereignty"],
  },
  {
    pattern: "integral part of india",
    axis: "nationalInterest",
    stance: 0.8,
    tags: ["sovereignty"],
  },
  {
    pattern: "stand with indian army",
    axis: "nationalInterest",
    stance: 0.75,
    tags: ["defense"],
  },
  {
    pattern: "strengthen our borders",
    axis: "nationalInterest",
    stance: 0.8,
    tags: ["defense"],
  },
  {
    pattern: "indigenous defence",
    axis: "nationalInterest",
    stance: 0.7,
    tags: ["defense"],
  },
  {
    pattern: "indigenous defense",
    axis: "nationalInterest",
    stance: 0.7,
    tags: ["defense"],
  },
  {
    pattern: "china is the real threat",
    axis: "nationalInterest",
    stance: 0.85,
    tags: ["adversary_realism"],
  },
  {
    pattern: "pakistan sponsors terror",
    axis: "nationalInterest",
    stance: 0.85,
    tags: ["adversary_realism"],
  },
  {
    pattern: "no reciprocity no peace",
    axis: "nationalInterest",
    stance: 0.7,
    tags: ["adversary_realism"],
  },
  {
    pattern: "quad strengthens india",
    axis: "nationalInterest",
    stance: 0.7,
    tags: ["favorable_alignment"],
  },
  {
    pattern: "atmanirbhar in critical minerals",
    axis: "nationalInterest",
    stance: 0.65,
    tags: ["economic_nation_first"],
  },
  {
    pattern: "data localisation for security",
    axis: "nationalInterest",
    stance: 0.6,
    tags: ["economic_nation_first"],
  },
  {
    pattern: "data localization for security",
    axis: "nationalInterest",
    stance: 0.6,
    tags: ["economic_nation_first"],
  },
  {
    pattern: "reject secession",
    axis: "nationalInterest",
    stance: 0.9,
    tags: ["constitutional_order"],
  },
  {
    pattern: "integrity of the union",
    axis: "nationalInterest",
    stance: 0.85,
    tags: ["constitutional_order"],
  },
  {
    pattern: "zero tolerance for terror",
    axis: "nationalInterest",
    stance: 0.8,
    tags: ["internal_security"],
  },
  {
    pattern: "infiltrators must go",
    axis: "nationalInterest",
    stance: 0.7,
    tags: ["internal_security"],
  },

  // Anti-National (−) — adversary alignment / sovereignty weakening only
  {
    pattern: "occupied kashmir",
    axis: "nationalInterest",
    stance: -0.95,
    tags: ["territory_denial"],
  },
  {
    pattern: "india occupies kashmir",
    axis: "nationalInterest",
    stance: -0.95,
    tags: ["territory_denial"],
  },
  {
    pattern: "azadi for kashmir",
    axis: "nationalInterest",
    stance: -0.95,
    tags: ["secession"],
  },
  {
    pattern: "kashmir needs plebiscite under un",
    axis: "nationalInterest",
    stance: -0.85,
    tags: ["secession"],
  },
  {
    pattern: "india is the aggressor at lac",
    axis: "nationalInterest",
    stance: -0.9,
    tags: ["adversary_echo"],
  },
  {
    pattern: "pla was provoked",
    axis: "nationalInterest",
    stance: -0.9,
    tags: ["adversary_echo"],
  },
  {
    pattern: "china is peaceful at the border",
    axis: "nationalInterest",
    stance: -0.75,
    tags: ["adversary_echo"],
  },
  {
    pattern: "resistance fighters not terrorists",
    axis: "nationalInterest",
    stance: -0.9,
    tags: ["security_sabotage"],
  },
  {
    pattern: "celebrate indian army defeat",
    axis: "nationalInterest",
    stance: -1.0,
    tags: ["enemy_preference"],
  },
  {
    pattern: "india should lose",
    axis: "nationalInterest",
    stance: -1.0,
    tags: ["enemy_preference"],
  },
  {
    pattern: "root for pakistan against india",
    axis: "nationalInterest",
    stance: -1.0,
    tags: ["enemy_preference"],
  },
  {
    pattern: "foreign trusteeship for india",
    axis: "nationalInterest",
    stance: -0.9,
    tags: ["constitutional_rupture"],
  },
  {
    pattern: "overthrow the indian constitution",
    axis: "nationalInterest",
    stance: -0.95,
    tags: ["constitutional_rupture"],
  },
  {
    pattern: "disarm india unilaterally",
    axis: "nationalInterest",
    stance: -0.85,
    tags: ["security_sabotage"],
  },
  {
    pattern: "isolate india at the un ignore pakistan",
    axis: "nationalInterest",
    stance: -0.8,
    tags: ["lawfare"],
  },
];

/**
 * False friends: phrases that look National/Anti-National but must not
 * move that axis (or must route elsewhere).
 */
export type FalseFriend = {
  pattern: string;
  /** Axis that must NOT be moved by this pattern alone */
  blockAxis: AxisId;
  reason: string;
  /** Optional forced topic if present */
  forceTopic?: TopicBucket;
};

export const FALSE_FRIENDS: FalseFriend[] = [
  {
    pattern: "nationalisation",
    blockAxis: "nationalInterest",
    reason: "Industry nationalization is Left/Right economic, not National axis",
    forceTopic: "economy",
  },
  {
    pattern: "nationalization",
    blockAxis: "nationalInterest",
    reason: "Industry nationalization is Left/Right economic, not National axis",
    forceTopic: "economy",
  },
  {
    pattern: "nationalize the banks",
    blockAxis: "nationalInterest",
    reason: "Bank nationalization ≠ national interest axis",
    forceTopic: "economy",
  },
  {
    pattern: "human rights",
    blockAxis: "nationalInterest",
    reason:
      "Human rights alone is not Anti-National; needs adversary/secession codes",
  },
  {
    pattern: "civil liberties",
    blockAxis: "nationalInterest",
    reason: "Civil liberties alone routes to Left/Right, not Anti-National",
  },
  {
    pattern: "modi must resign",
    blockAxis: "nationalInterest",
    reason: "Party/leader criticism ≠ Anti-National",
    forceTopic: "party_tribal",
  },
  {
    pattern: "corrupt ministry",
    blockAxis: "nationalInterest",
    reason: "Corruption critique ≠ Anti-National",
  },
  {
    pattern: "defence procurement scam",
    blockAxis: "nationalInterest",
    reason: "Procurement critique ≠ opposing readiness as a principle",
  },
  {
    pattern: "defense procurement scam",
    blockAxis: "nationalInterest",
    reason: "Procurement critique ≠ opposing readiness as a principle",
  },
  {
    pattern: "cut wasteful defence spending",
    blockAxis: "nationalInterest",
    reason: "Budget efficiency critique without readiness-as-principle denial",
  },
  {
    pattern: "cut wasteful defense spending",
    blockAxis: "nationalInterest",
    reason: "Budget efficiency critique without readiness-as-principle denial",
  },
];

/** Normalize for matching. */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[#@]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function matchesPattern(haystack: string, pattern: string): boolean {
  return haystack.includes(pattern.toLowerCase());
}

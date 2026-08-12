/**
 * Soft lexicon for live timelines — weaker weights than hard STANCE_CUES,
 * but catches far more on-topic political / national posts.
 */
import type { TopicBucket } from "@/data/signals";
import { matchesPattern, normalizeText } from "@/data/lexicon/india-v1";

export type SoftHit = {
  topics: TopicBucket[];
  leftRight: number;
  national: number;
  tags: string[];
};

type SoftCue = {
  pattern: string;
  topic: TopicBucket;
  /** soft stance contribution −1..+1 */
  leftRight?: number;
  national?: number;
  tag?: string;
  /** If set, party cues flip with praise/criticism heuristics */
  partyPolarity?: boolean;
};

const SOFT_CUES: SoftCue[] = [
  // economy / welfare
  { pattern: "freebie", topic: "economy", leftRight: 0.45, tag: "soft_econ" },
  { pattern: "revdi", topic: "economy", leftRight: 0.45, tag: "soft_econ" },
  { pattern: "guarantee", topic: "economy", leftRight: -0.25, tag: "soft_econ" },
  { pattern: "msp", topic: "economy", leftRight: -0.3, tag: "soft_econ" },
  { pattern: "farmers", topic: "economy", leftRight: -0.2, tag: "soft_econ" },
  { pattern: "privatisation", topic: "economy", leftRight: 0.35, tag: "soft_econ" },
  { pattern: "privatization", topic: "economy", leftRight: 0.35, tag: "soft_econ" },
  { pattern: "disinvestment", topic: "economy", leftRight: 0.35, tag: "soft_econ" },
  { pattern: "psu", topic: "economy", leftRight: -0.25, tag: "soft_econ" },
  { pattern: "inflation", topic: "economy", leftRight: -0.15, tag: "soft_econ" },
  { pattern: "unemployment", topic: "economy", leftRight: -0.2, tag: "soft_econ" },
  { pattern: "gdp", topic: "economy", leftRight: 0.1, tag: "soft_econ" },
  { pattern: "startup", topic: "economy", leftRight: 0.25, tag: "soft_econ" },
  { pattern: "atmanirbhar", topic: "economy", leftRight: 0.2, national: 0.35, tag: "soft_econ" },
  { pattern: "make in india", topic: "economy", leftRight: 0.2, national: 0.35, tag: "soft_econ" },
  { pattern: "neet", topic: "economy", leftRight: -0.25, tag: "soft_econ" },
  { pattern: "paper leak", topic: "economy", leftRight: -0.3, tag: "soft_econ" },

  // identity / culture
  { pattern: "hindutva", topic: "identity_culture", leftRight: 0.4, tag: "soft_id" },
  { pattern: "sanatan", topic: "identity_culture", leftRight: 0.35, tag: "soft_id" },
  { pattern: "secular", topic: "identity_culture", leftRight: -0.3, tag: "soft_id" },
  { pattern: "reservation", topic: "identity_culture", leftRight: -0.25, tag: "soft_id" },
  { pattern: "caste", topic: "identity_culture", leftRight: -0.2, tag: "soft_id" },
  { pattern: "ucc", topic: "identity_culture", leftRight: 0.3, tag: "soft_id" },
  { pattern: "caa", topic: "identity_culture", leftRight: 0.25, national: 0.2, tag: "soft_id" },
  { pattern: "nrc", topic: "identity_culture", leftRight: 0.25, national: 0.25, tag: "soft_id" },
  { pattern: "woke", topic: "identity_culture", leftRight: 0.35, tag: "soft_id" },
  { pattern: "temple", topic: "identity_culture", leftRight: 0.2, tag: "soft_id" },
  { pattern: "hijab", topic: "identity_culture", leftRight: 0.15, tag: "soft_id" },
  { pattern: "muslim", topic: "identity_culture", leftRight: -0.2, tag: "soft_id" },
  { pattern: "islamophobia", topic: "identity_culture", leftRight: -0.5, tag: "soft_id" },
  { pattern: "lynching", topic: "identity_culture", leftRight: -0.5, tag: "soft_id" },
  { pattern: "hate speech", topic: "identity_culture", leftRight: -0.4, tag: "soft_id" },
  { pattern: "communal", topic: "identity_culture", leftRight: -0.25, tag: "soft_id" },
  { pattern: "minorit", topic: "identity_culture", leftRight: -0.3, tag: "soft_id" },

  // civil liberties / protest / journalism (Left-leaning soft)
  { pattern: "protest", topic: "constitutional_order", leftRight: -0.35, tag: "soft_liberty" },
  { pattern: "protesters", topic: "constitutional_order", leftRight: -0.35, tag: "soft_liberty" },
  { pattern: "demonstration", topic: "constitutional_order", leftRight: -0.3, tag: "soft_liberty" },
  { pattern: "police", topic: "constitutional_order", leftRight: -0.2, tag: "soft_liberty" },
  { pattern: "brutality", topic: "constitutional_order", leftRight: -0.5, tag: "soft_liberty" },
  { pattern: "crackdown", topic: "constitutional_order", leftRight: -0.45, tag: "soft_liberty" },
  { pattern: "arrest", topic: "constitutional_order", leftRight: -0.25, tag: "soft_liberty" },
  { pattern: "detained", topic: "constitutional_order", leftRight: -0.3, tag: "soft_liberty" },
  { pattern: "lathi", topic: "constitutional_order", leftRight: -0.45, tag: "soft_liberty" },
  { pattern: "tear gas", topic: "constitutional_order", leftRight: -0.4, tag: "soft_liberty" },
  { pattern: "water cannon", topic: "constitutional_order", leftRight: -0.4, tag: "soft_liberty" },
  { pattern: "dissent", topic: "constitutional_order", leftRight: -0.35, tag: "soft_liberty" },
  { pattern: "authoritarian", topic: "constitutional_order", leftRight: -0.5, tag: "soft_liberty" },
  { pattern: "fascist", topic: "constitutional_order", leftRight: -0.55, tag: "soft_liberty" },
  { pattern: "fascism", topic: "constitutional_order", leftRight: -0.55, tag: "soft_liberty" },
  { pattern: "dictatorship", topic: "constitutional_order", leftRight: -0.5, tag: "soft_liberty" },
  { pattern: "censorship", topic: "constitutional_order", leftRight: -0.4, tag: "soft_liberty" },
  { pattern: "press freedom", topic: "constitutional_order", leftRight: -0.45, tag: "soft_liberty" },
  { pattern: "journalist", topic: "constitutional_order", leftRight: -0.25, tag: "soft_liberty" },
  { pattern: "journalism", topic: "constitutional_order", leftRight: -0.25, tag: "soft_liberty" },
  { pattern: "media freedom", topic: "constitutional_order", leftRight: -0.4, tag: "soft_liberty" },
  { pattern: "human rights", topic: "constitutional_order", leftRight: -0.35, tag: "soft_liberty" },
  { pattern: "civil liberties", topic: "constitutional_order", leftRight: -0.4, tag: "soft_liberty" },
  { pattern: "bulldozer", topic: "constitutional_order", leftRight: -0.35, tag: "soft_liberty" },
  { pattern: "uia", topic: "constitutional_order", leftRight: -0.35, tag: "soft_liberty" },
  { pattern: "uapa", topic: "constitutional_order", leftRight: -0.4, tag: "soft_liberty" },
  { pattern: "sedition", topic: "constitutional_order", leftRight: -0.35, tag: "soft_liberty" },
  { pattern: "student", topic: "constitutional_order", leftRight: -0.15, tag: "soft_liberty" },
  { pattern: "university", topic: "constitutional_order", leftRight: -0.15, tag: "soft_liberty" },
  { pattern: "gen z", topic: "constitutional_order", leftRight: -0.25, tag: "soft_liberty" },
  { pattern: "cockroach", topic: "constitutional_order", leftRight: -0.3, tag: "soft_liberty" },
  { pattern: "accountability", topic: "constitutional_order", leftRight: -0.2, tag: "soft_liberty" },

  // borders / security
  { pattern: "indian army", topic: "borders_security", national: 0.55, tag: "soft_nat" },
  { pattern: "jawan", topic: "borders_security", national: 0.45, tag: "soft_nat" },
  { pattern: "border", topic: "borders_security", national: 0.35, tag: "soft_nat" },
  { pattern: "galwan", topic: "borders_security", national: 0.5, tag: "soft_nat" },
  { pattern: "lac", topic: "borders_security", national: 0.4, tag: "soft_nat" },
  { pattern: "loc", topic: "borders_security", national: 0.4, tag: "soft_nat" },
  { pattern: "china", topic: "borders_security", national: 0.35, tag: "soft_nat" },
  { pattern: "pakistan", topic: "borders_security", national: 0.35, tag: "soft_nat" },
  { pattern: "terror", topic: "borders_security", national: 0.4, tag: "soft_nat" },
  { pattern: "pulwama", topic: "borders_security", national: 0.45, tag: "soft_nat" },
  { pattern: "balakot", topic: "borders_security", national: 0.45, tag: "soft_nat" },
  { pattern: "defence", topic: "borders_security", national: 0.35, tag: "soft_nat" },
  { pattern: "defense", topic: "borders_security", national: 0.35, tag: "soft_nat" },
  { pattern: "infiltration", topic: "borders_security", national: 0.4, tag: "soft_nat" },
  { pattern: "motherland", topic: "borders_security", national: 0.4, tag: "soft_nat" },
  { pattern: "martyr", topic: "borders_security", national: 0.45, tag: "soft_nat" },
  { pattern: "shaheed", topic: "borders_security", national: 0.45, tag: "soft_nat" },
  { pattern: "naxal", topic: "borders_security", national: 0.35, tag: "soft_nat" },
  { pattern: "maoist", topic: "borders_security", national: 0.35, tag: "soft_nat" },

  // foreign policy
  { pattern: "quad", topic: "foreign_policy", national: 0.35, tag: "soft_fp" },
  { pattern: "indo-pacific", topic: "foreign_policy", national: 0.3, tag: "soft_fp" },
  { pattern: "foreign policy", topic: "foreign_policy", national: 0.2, tag: "soft_fp" },
  { pattern: "unga", topic: "foreign_policy", national: 0.15, tag: "soft_fp" },
  { pattern: "g20", topic: "foreign_policy", national: 0.2, tag: "soft_fp" },
  { pattern: "brics", topic: "foreign_policy", national: 0.15, tag: "soft_fp" },
  { pattern: "israel", topic: "foreign_policy", national: 0.15, leftRight: 0.1, tag: "soft_fp" },
  { pattern: "palestine", topic: "foreign_policy", leftRight: -0.25, national: -0.1, tag: "soft_fp" },
  { pattern: "gaza", topic: "foreign_policy", leftRight: -0.25, national: -0.1, tag: "soft_fp" },

  // constitutional / kashmir
  { pattern: "kashmir", topic: "constitutional_order", national: 0.2, tag: "soft_const" },
  { pattern: "article 370", topic: "constitutional_order", national: 0.25, tag: "soft_const" },
  { pattern: "azadi", topic: "constitutional_order", national: -0.6, tag: "soft_anti" },
  { pattern: "constitution", topic: "constitutional_order", leftRight: -0.1, tag: "soft_const" },
  { pattern: "democracy", topic: "constitutional_order", leftRight: -0.15, tag: "soft_const" },

  // governance / schemes (common on official timelines)
  { pattern: "viksit bharat", topic: "economy", leftRight: 0.2, national: 0.35, tag: "soft_gov" },
  { pattern: "digital india", topic: "economy", leftRight: 0.15, national: 0.25, tag: "soft_gov" },
  { pattern: "jan dhan", topic: "economy", leftRight: 0.1, national: 0.2, tag: "soft_gov" },
  { pattern: "ayushman", topic: "economy", leftRight: -0.05, national: 0.2, tag: "soft_gov" },
  { pattern: "swachh bharat", topic: "economy", leftRight: 0.1, national: 0.25, tag: "soft_gov" },
  { pattern: "parliament", topic: "constitutional_order", leftRight: -0.05, tag: "soft_gov" },
  { pattern: "lok sabha", topic: "constitutional_order", leftRight: -0.05, tag: "soft_gov" },
  { pattern: "bharat", topic: "borders_security", national: 0.2, tag: "soft_nat" },

  // party tribal — polarity depends on praise vs criticism
  {
    pattern: "modi",
    topic: "party_tribal",
    leftRight: 0.15,
    tag: "soft_party",
    partyPolarity: true,
  },
  {
    pattern: "bjp",
    topic: "party_tribal",
    leftRight: 0.15,
    tag: "soft_party",
    partyPolarity: true,
  },
  { pattern: "congress", topic: "party_tribal", leftRight: -0.15, tag: "soft_party" },
  { pattern: "rahul", topic: "party_tribal", leftRight: -0.15, tag: "soft_party" },
  { pattern: "indi alliance", topic: "party_tribal", leftRight: -0.2, tag: "soft_party" },
  { pattern: "aam aadmi", topic: "party_tribal", leftRight: -0.15, tag: "soft_party" },
];

const CRITICISM_RE =
  /\b(brutality|crackdown|arrest|arrested|fascist|fascism|authoritarian|dictatorship|hate|corrupt|corruption|failed|failure|suppress|suppression|censor|censorship|lynch|lathi|riot police|dissent|expose|exposing|accuse|accused|condemn|condemns|violence|violent|injustice|oppress|tyranny|intimidation|harass|harassment|threaten|threatened)\b/;

const PRAISE_RE =
  /\b(visionary|historic|proud|salute|grateful|thanks|thank you|strong leadership|ji\b|modiji|victory|wins|landslide|brilliant|outstanding)\b/;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function polarityAdjust(norm: string, base: number, partyPolarity?: boolean): number {
  if (!base) return 0;
  if (partyPolarity) {
    if (CRITICISM_RE.test(norm)) return clamp(-Math.abs(base) - 0.2, -1, 1);
    if (PRAISE_RE.test(norm)) return clamp(Math.abs(base) + 0.1, -1, 1);
    // Bare name-drop: tiny stance so party-only posts still count, direction from base
    return clamp(base * 0.5, -1, 1);
  }
  if (CRITICISM_RE.test(norm) && base > 0) return clamp(base * -0.5, -1, 1);
  if (/\b(not|never|against|oppose|opposes)\b/.test(norm)) {
    return clamp(base * -0.5, -1, 1);
  }
  return base;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Prefer word-boundary matches so "nation" ≠ "imagination". */
function softMatch(norm: string, pattern: string): boolean {
  const p = pattern.toLowerCase().trim();
  if (!p) return false;
  if (p.includes(" ")) return matchesPattern(norm, p);
  // Allow prefix stems like "minorit" → minority/minorities
  if (p.endsWith("t") && p.length >= 6) {
    const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(p)}[a-z]*`, "i");
    return re.test(norm);
  }
  const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(p)}(?:[^a-z0-9]|$)`, "i");
  return re.test(norm);
}

export function softClassify(text: string): SoftHit | null {
  const norm = normalizeText(text);
  if (norm.length < 12) return null;

  const topics = new Set<TopicBucket>();
  const tags = new Set<string>();
  let lr = 0;
  let lrN = 0;
  let ni = 0;
  let niN = 0;

  for (const cue of SOFT_CUES) {
    if (!softMatch(norm, cue.pattern)) continue;
    topics.add(cue.topic);
    if (cue.tag) tags.add(cue.tag);
    if (cue.leftRight != null && cue.leftRight !== 0) {
      lr += polarityAdjust(norm, cue.leftRight, cue.partyPolarity);
      lrN += 1;
    }
    if (cue.national != null && cue.national !== 0) {
      ni += polarityAdjust(norm, cue.national);
      niN += 1;
    }
  }

  if (!topics.size) return null;

  // Party-only soft hits need at least a mild stance to count
  if (topics.size === 1 && topics.has("party_tribal") && lrN === 0 && niN === 0) {
    return null;
  }

  return {
    topics: [...topics],
    leftRight: lrN ? clamp(lr / lrN, -1, 1) : 0,
    national: niN ? clamp(ni / niN, -1, 1) : 0,
    tags: [...tags],
  };
}

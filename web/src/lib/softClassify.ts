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
  { pattern: "tax", topic: "economy", leftRight: 0, tag: "soft_econ" },
  { pattern: "inflation", topic: "economy", leftRight: -0.15, tag: "soft_econ" },
  { pattern: "unemployment", topic: "economy", leftRight: -0.2, tag: "soft_econ" },
  { pattern: "gdp", topic: "economy", leftRight: 0.1, tag: "soft_econ" },
  { pattern: "startup", topic: "economy", leftRight: 0.25, tag: "soft_econ" },
  { pattern: "atmanirbhar", topic: "economy", leftRight: 0.2, national: 0.35, tag: "soft_econ" },
  { pattern: "make in india", topic: "economy", leftRight: 0.2, national: 0.35, tag: "soft_econ" },

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
  { pattern: "agni", topic: "borders_security", national: 0.3, tag: "soft_nat" },
  { pattern: "infiltration", topic: "borders_security", national: 0.4, tag: "soft_nat" },

  // foreign policy
  { pattern: "quad", topic: "foreign_policy", national: 0.35, tag: "soft_fp" },
  { pattern: "indo-pacific", topic: "foreign_policy", national: 0.3, tag: "soft_fp" },
  { pattern: "foreign policy", topic: "foreign_policy", national: 0.2, tag: "soft_fp" },
  { pattern: "unga", topic: "foreign_policy", national: 0.15, tag: "soft_fp" },
  { pattern: "g20", topic: "foreign_policy", national: 0.2, tag: "soft_fp" },
  { pattern: "brics", topic: "foreign_policy", national: 0.15, tag: "soft_fp" },
  { pattern: "israel", topic: "foreign_policy", national: 0.15, leftRight: 0.1, tag: "soft_fp" },

  // constitutional / kashmir
  { pattern: "kashmir", topic: "constitutional_order", national: 0.35, tag: "soft_const" },
  { pattern: "article 370", topic: "constitutional_order", national: 0.4, tag: "soft_const" },
  { pattern: "azadi", topic: "constitutional_order", national: -0.6, tag: "soft_anti" },
  { pattern: "constitution", topic: "constitutional_order", national: 0.15, tag: "soft_const" },
  { pattern: "democracy", topic: "constitutional_order", leftRight: -0.1, tag: "soft_const" },

  // governance / schemes (common on official timelines)
  { pattern: "viksit bharat", topic: "economy", leftRight: 0.2, national: 0.35, tag: "soft_gov" },
  { pattern: "digital india", topic: "economy", leftRight: 0.15, national: 0.25, tag: "soft_gov" },
  { pattern: "jan dhan", topic: "economy", leftRight: 0.1, national: 0.2, tag: "soft_gov" },
  { pattern: "ayushman", topic: "economy", leftRight: -0.05, national: 0.2, tag: "soft_gov" },
  { pattern: "pmjay", topic: "economy", leftRight: -0.05, national: 0.2, tag: "soft_gov" },
  { pattern: "ujjwala", topic: "economy", leftRight: 0.1, national: 0.2, tag: "soft_gov" },
  { pattern: "swachh bharat", topic: "economy", leftRight: 0.1, national: 0.25, tag: "soft_gov" },
  { pattern: "parliament", topic: "constitutional_order", leftRight: 0, tag: "soft_gov" },
  { pattern: "lok sabha", topic: "constitutional_order", leftRight: 0, tag: "soft_gov" },
  { pattern: "rajya sabha", topic: "constitutional_order", leftRight: 0, tag: "soft_gov" },
  { pattern: "election", topic: "party_tribal", leftRight: 0, tag: "soft_party" },
  { pattern: "manifesto", topic: "party_tribal", leftRight: 0, tag: "soft_party" },
  { pattern: "cabinet", topic: "party_tribal", leftRight: 0.05, tag: "soft_gov" },
  { pattern: "prime minister", topic: "party_tribal", leftRight: 0.1, national: 0.15, tag: "soft_gov" },
  { pattern: "nation", topic: "borders_security", national: 0.2, tag: "soft_nat" },
  { pattern: "bharat", topic: "borders_security", national: 0.25, tag: "soft_nat" },
  { pattern: "motherland", topic: "borders_security", national: 0.4, tag: "soft_nat" },
  { pattern: "martyr", topic: "borders_security", national: 0.45, tag: "soft_nat" },
  { pattern: "shaheed", topic: "borders_security", national: 0.45, tag: "soft_nat" },
  { pattern: "naxal", topic: "borders_security", national: 0.35, tag: "soft_nat" },
  { pattern: "maoist", topic: "borders_security", national: 0.35, tag: "soft_nat" },
  { pattern: "isi", topic: "borders_security", national: 0.4, tag: "soft_nat" },
  { pattern: "pla", topic: "borders_security", national: 0.35, tag: "soft_nat" },

  // party tribal (low)
  { pattern: "modi", topic: "party_tribal", leftRight: 0.15, tag: "soft_party" },
  { pattern: "bjp", topic: "party_tribal", leftRight: 0.15, tag: "soft_party" },
  { pattern: "congress", topic: "party_tribal", leftRight: -0.15, tag: "soft_party" },
  { pattern: "rahul", topic: "party_tribal", leftRight: -0.15, tag: "soft_party" },
  { pattern: "indi alliance", topic: "party_tribal", leftRight: -0.2, tag: "soft_party" },
  { pattern: "aam aadmi", topic: "party_tribal", leftRight: -0.15, tag: "soft_party" },
  { pattern: "tmc", topic: "party_tribal", leftRight: -0.1, tag: "soft_party" },
  { pattern: "dmk", topic: "party_tribal", leftRight: -0.1, tag: "soft_party" },
];

/** Soft polarity flips from surrounding words */
function polarityAdjust(norm: string, base: number): number {
  if (!base) return 0;
  const neg =
    /\b(not|never|against|oppose|opposes|failed|failure|destroy|ruined|corrupt)\b/.test(
      norm,
    );
  // crude: if negation near political praise, dampen rather than full flip
  if (neg) return clamp(base * -0.5, -1, 1);
  return base;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
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
    if (!matchesPattern(norm, cue.pattern)) continue;
    topics.add(cue.topic);
    if (cue.tag) tags.add(cue.tag);
    if (cue.leftRight != null && cue.leftRight !== 0) {
      lr += polarityAdjust(norm, cue.leftRight);
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

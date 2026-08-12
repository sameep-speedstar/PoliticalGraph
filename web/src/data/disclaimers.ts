/**
 * Product disclaimers — show on landing, results, methodology, and share cards.
 * Not legal advice; interpretive experimental tool only.
 */

export const SHORT_DISCLAIMER =
  "Experimental estimate from public X posts only — not a personal attack, loyalty verdict, or legal finding.";

export const SHARE_DISCLAIMER =
  "Experimental · public data · evidence-backed estimate · not a personal attack";

export const DISCLAIMERS: { id: string; title: string; body: string }[] = [
  {
    id: "experimental",
    title: "Experimental purpose only",
    body: "Stance is an experimental research tool from KNIQ. Outputs are provisional model estimates for exploration and discussion — not official assessments, intelligence findings, or certified scores.",
  },
  {
    id: "not_attack",
    title: "Not a personal attack",
    body: "A mapped point is not an accusation, insult, or judgment of character. Do not use Stance to harass, defame, threaten, or pile onto any person. Misuse violates our intended use.",
  },
  {
    id: "not_loyalty",
    title: "Not a loyalty or legal verdict",
    body: "“National” and “Adversary-Aligned” are operational labels for patterns in public posts about sovereignty, security, and strategic alignment. They are not findings of patriotism, criminality, or disloyalty under any law.",
  },
  {
    id: "public_data",
    title: "Public data only",
    body: "Scoring uses publicly visible X posts from the handle (tweets, quote-tweets, replies in the analysis window). Engagement received (likes/reposts on those posts) scales weight. Posts the account liked, and pure retweets, are not ingested in the live path. Private, deleted, or protected content is out of scope.",
  },
  {
    id: "evidence",
    title: "Evidence-backed calculations",
    body: "Each score aggregates weighted stance contributions from on-topic posts. Results pages list evidence items with topic tags and contribution weights so you can inspect what moved the point.",
  },
  {
    id: "methodology",
    title: "Methodology on this site",
    body: "Pole definitions, exclusions (dissent ≠ adversary-aligned), signal weights, topic routing, and the composite formula are published on the Methodology page. Lexicon pack and version appear with every result.",
  },
  {
    id: "confidence",
    title: "Confidence and uncertainty",
    body: "Low volume, narrow topics, short time windows, or automation risk reduce confidence. Treat low-confidence placements as especially provisional.",
  },
  {
    id: "axes_independent",
    title: "Axes are independent",
    body: "Left/Right is not the same as National / Adversary-Aligned. Party criticism alone does not move the national-interest axis.",
  },
  {
    id: "no_endorsement",
    title: "No endorsement",
    body: "Nearest labels, quadrants, or share cards are geometric summaries — not endorsements by KNIQ, Speedstar AI Labs, or any government.",
  },
  {
    id: "verified_only",
    title: "Verified handles only",
    body: "Live mapping accepts verified X accounts only (blue check, business, or government). This reduces casual abuse and mass-mapping of private individuals. Demo handles on this site still work without live ingest.",
  },
  {
    id: "corrections",
    title: "Corrections and opt-out",
    body: "Living persons may request correction notes or opt-out from featured demos via KNIQ contact channels. Interpretive models can be wrong; evidence review is encouraged.",
  },
];

export const FOOTER_DISCLAIMER =
  "Stance · experimental · public X data · evidence-backed · not a personal attack or loyalty verdict · methodology on this site";

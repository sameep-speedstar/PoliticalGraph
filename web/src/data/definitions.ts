/**
 * Frozen pole definitions for Stance (India v1).
 * Public axis label: National ↔ Adversary-Aligned (not a loyalty verdict).
 */

export const PRODUCT_NAME = "Stance";
export const PRODUCT_PATH = "/stance";
export const METHODOLOGY_VERSION = "2026-08-12.2";
/** Bumped when classifier/lexicon changes — Worker re-scores cached activities. */
export const SCORE_ENGINE_VERSION = "2026-08-12.2";
export const LEXICON_PACK = "india-v1";
export const REFERENCE_NATION = "India";

export type AxisId = "leftRight" | "nationalInterest";

export type PoleDefinition = {
  id: string;
  axis: AxisId;
  score: -100 | 100;
  label: string;
  internalCode: string;
  summary: string;
  parameters: { name: string; signals: string }[];
};

export const leftPole: PoleDefinition = {
  id: "left",
  axis: "leftRight",
  score: -100,
  label: "Left",
  internalCode: "left",
  summary:
    "Redistribution, state-led economy, identity equity, civil liberties over order, secular-progressive culture.",
  parameters: [
    {
      name: "Redistribution",
      signals:
        "Favor wealth taxes, welfare expansion, free/cheap public services; criticize billionaires & inequality",
    },
    {
      name: "State in economy",
      signals:
        "Support PSU strength, regulation, price controls, labor protections, union power",
    },
    {
      name: "Identity / equity",
      signals:
        "Emphasize caste/gender/minority justice, affirmative action, structural discrimination frames",
    },
    {
      name: "Civil liberties over order",
      signals:
        "Prioritize protest rights, skepticism of police/army exceptionalism, decriminalize speech",
    },
    {
      name: "Secular-progressive culture",
      signals:
        "Critique majoritarian religion-in-state; progressive social norms",
    },
    {
      name: "Global left alignment",
      signals:
        "Praise progressive international movements; criticize right-coded governments abroad",
    },
  ],
};

export const rightPole: PoleDefinition = {
  id: "right",
  axis: "leftRight",
  score: 100,
  label: "Right",
  internalCode: "right",
  summary:
    "Markets/merit, law-and-order, cultural traditionalism, skepticism of expansive welfare and quota expansion.",
  parameters: [
    {
      name: "Markets / merit",
      signals:
        "Favor deregulation, entrepreneurship, lower taxes; criticize freebies / subsidy politics",
    },
    {
      name: "Order & hierarchy",
      signals:
        "Prioritize law-and-order, strong policing, respect for traditional authority",
    },
    {
      name: "Cultural traditionalism",
      signals:
        "Defend majority cultural/religious symbols in public life; critique woke / western liberalism",
    },
    {
      name: "National capitalism",
      signals:
        "Prefer domestic capital, tariffs, Atmanirbhar-style industrial policy (may co-occur with National axis)",
    },
    {
      name: "Anti-redistribution",
      signals:
        "Oppose caste-based quota expansion; frame welfare as vote-bank",
    },
    {
      name: "Conservative foreign affinity",
      signals: "Align with right-coded foreign leaders/movements",
    },
  ],
};

export const nationalPole: PoleDefinition = {
  id: "national",
  axis: "nationalInterest",
  score: 100,
  label: "National",
  internalCode: "national_interest",
  summary:
    "Treats India’s security, sovereignty, territorial integrity, constitutional continuity, and strategic advantage as primary.",
  parameters: [
    {
      name: "Sovereignty & territory",
      signals:
        "Affirm J&K/Ladakh/Arunachal as integral; reject secessionist frames; support border infrastructure",
    },
    {
      name: "Defense posture",
      signals:
        "Support strong military, theater commands, indigenous defense production, retaliatory capability",
    },
    {
      name: "Adversary realism",
      signals:
        "Treat China/Pakistan (and listed adversaries) as strategic competitors; skepticism of adversary peace narratives without reciprocity",
    },
    {
      name: "Favorable alignments",
      signals:
        "Support partnerships that counter adversaries (Quad, Indo-Pacific ties, Israel/defense tech — configurable)",
    },
    {
      name: "Unfavorable alignments",
      signals:
        "Oppose deepening dependence on adversary-linked supply chains/blocs when framed as security risk",
    },
    {
      name: "Economic nation-first",
      signals:
        "Prefer domestic industry, critical-minerals security, data localization, energy security",
    },
    {
      name: "Constitutional order",
      signals:
        "Defend integrity of the Union, elected constitutional process; reject violent overthrow / parallel sovereignty",
    },
    {
      name: "Internal security",
      signals:
        "Support lawful action against terrorism, infiltrators, and anti-state armed groups; reject glorification of such groups",
    },
    {
      name: "Diaspora / soft power",
      signals: "Frame diaspora lobbying and cultural projection as national asset",
    },
  ],
};

/** Public label: Adversary-Aligned (internal code remains adversary_aligned). */
export const adversaryAlignedPole: PoleDefinition = {
  id: "adversary_aligned",
  axis: "nationalInterest",
  score: -100,
  label: "Adversary-Aligned",
  internalCode: "adversary_aligned",
  summary:
    "Systematically amplifies adversary narratives, denies territorial/constitutional integrity, or prefers rival strategic wins over India’s.",
  parameters: [
    {
      name: "Adversary narrative echo",
      signals:
        "Repeats CCP/ISI/hostile-media talking points on India with little counter-evidence",
    },
    {
      name: "Territory / integrity denial",
      signals:
        "Normalizes separatist claims, occupied Kashmir framing, or foreign maps that erase Indian territory",
    },
    {
      name: "Security sabotage framing",
      signals:
        "Opposes defense readiness as a principle; celebrates Indian military setbacks; excuses cross-border terror",
    },
    {
      name: "Constitutional rupture",
      signals:
        "Advocates extra-constitutional overthrow, parallel azadi sovereignty, or foreign trusteeship",
    },
    {
      name: "Enemy preference",
      signals:
        "Explicit preference for adversary strategic wins; India should lose / root-for-rival patterns",
    },
    {
      name: "Lawfare for rivals",
      signals:
        "Amplifies campaigns whose primary effect is diplomatic isolation of India while ignoring rival conduct",
    },
    {
      name: "Info-op participation",
      signals:
        "Coordinated amplification of adversary outlets (confidence signal, not sole proof)",
    },
  ],
};

/** @deprecated Use adversaryAlignedPole — kept alias for older imports */
export const antiNationalPole = adversaryAlignedPole;

/** Explicit exclusions: these alone must not move the National axis negative. */
export const notAdversaryAlignedExclusions: string[] = [
  "Criticism of a party, PM, ministry, or coalition",
  "Critique of policy failure, corruption, or specific military procurement waste",
  "Budget disagreement on defense cost/efficiency without opposing readiness as a principle",
  "Human-rights or civil-liberties advocacy unless paired with adversary, secession, or sovereignty-denial codes",
  "Calls for nationalization of industry (routes to Left/Right, not National axis)",
  "Anti-establishment or anti-BJP framing without adversary-alignment codes",
];

/** @deprecated Use notAdversaryAlignedExclusions */
export const notAntiNationalExclusions = notAdversaryAlignedExclusions;

export const axisLabels = {
  leftRight: {
    id: "leftRight" as const,
    negative: "Left",
    positive: "Right",
    title: "Left ↔ Right",
  },
  nationalInterest: {
    id: "nationalInterest" as const,
    negative: "Adversary-Aligned",
    positive: "National",
    title: "National ↔ Adversary-Aligned",
    negativeInternal: "adversary_aligned",
    positiveInternal: "national_interest",
  },
};

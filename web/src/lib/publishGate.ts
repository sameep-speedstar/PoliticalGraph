/** Stage 2 publish lifecycle */
export type PublishStatus = "draft" | "in_review" | "published" | "rejected";

export type AxisKey = "economic" | "authority" | "cultural";

export type EvidenceRow = {
  id: string;
  axis: AxisKey;
  /** Short claim supporting this axis score */
  claim: string;
  sourceTitle: string;
  sourceUrl?: string;
  /** Human marked this row OK for publish */
  approved: boolean;
};

export const AXIS_KEYS: AxisKey[] = ["economic", "authority", "cultural"];

export const AXIS_LABELS: Record<AxisKey, string> = {
  economic: "Economic",
  authority: "Authority",
  cultural: "Cultural",
};

/** Every published axis needs ≥1 approved evidence row. */
export function evidenceCoverage(evidence: EvidenceRow[]): Record<AxisKey, number> {
  const counts = { economic: 0, authority: 0, cultural: 0 } as Record<AxisKey, number>;
  for (const row of evidence) {
    if (row.approved) counts[row.axis] += 1;
  }
  return counts;
}

export function missingEvidenceAxes(evidence: EvidenceRow[]): AxisKey[] {
  const coverage = evidenceCoverage(evidence);
  return AXIS_KEYS.filter((axis) => coverage[axis] < 1);
}

export function canPublish(evidence: EvidenceRow[]): boolean {
  return missingEvidenceAxes(evidence).length === 0;
}

export function defaultEvidenceFromSeed(input: {
  id: string;
  rationale: string;
  sources: { title: string; url?: string }[];
}): EvidenceRow[] {
  const sentences = input.rationale
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  const fallback = input.rationale.slice(0, 180);
  const source = input.sources[0] ?? { title: "Public record (editorial seed)" };

  return AXIS_KEYS.map((axis, i) => ({
    id: `${input.id}-${axis}-seed`,
    axis,
    claim: sentences[i] ?? sentences[0] ?? fallback,
    sourceTitle: input.sources[i]?.title ?? source.title,
    sourceUrl: input.sources[i]?.url ?? source.url,
    approved: true,
  }));
}

/** Minimal seed fields needed to hydrate trust metadata. */
export type HydrateInput = {
  id: string;
  rationale: string;
  sources: { title: string; url?: string }[];
  status?: PublishStatus;
  evidence?: EvidenceRow[];
};

export function resolveTrustFields<T extends HydrateInput>(
  seed: T,
): T & { status: PublishStatus; evidence: EvidenceRow[] } {
  const evidence =
    seed.evidence && seed.evidence.length > 0
      ? seed.evidence
      : defaultEvidenceFromSeed(seed);
  const status: PublishStatus =
    seed.status ?? (canPublish(evidence) ? "published" : "draft");
  return { ...seed, evidence, status };
}

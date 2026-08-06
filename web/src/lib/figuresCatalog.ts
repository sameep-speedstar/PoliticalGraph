/**
 * Stage 2 figure catalog helpers for the editor.
 * Seed JSON remains source of truth until D1/Postgres is wired;
 * drafts overlay in localStorage; export JSON to commit.
 */

import {
  hydratePersonality,
  personalitiesHydrated,
  publishedFigures,
  type Personality,
  type PersonalitySeed,
} from "@/data/personalities";

export { hydratePersonality, publishedFigures, personalitiesHydrated };

export const EDITOR_STORAGE_KEY = "poligraph-editor-drafts-v1";
export const EDITOR_UNLOCK_KEY = "poligraph-editor-unlocked";

/** Change via NEXT_PUBLIC_EDITOR_PASS or keep internal-only URL. */
export const EDITOR_PASS =
  process.env.NEXT_PUBLIC_EDITOR_PASS ?? "poligraph-edit";

export function allSeedFigures(): Personality[] {
  return personalitiesHydrated;
}

export function mergeEditorOverlay(
  base: Personality[],
  overlay: Record<string, Personality>,
): Personality[] {
  const map = new Map(base.map((p) => [p.id, p]));
  for (const fig of Object.values(overlay)) {
    map.set(fig.id, hydratePersonality(fig));
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export function loadEditorOverlay(): Record<string, Personality> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(EDITOR_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, Personality>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveEditorOverlay(overlay: Record<string, Personality>) {
  localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(overlay));
}

export function newDraftFigure(partial?: Partial<Personality>): Personality {
  const id =
    partial?.id ??
    `draft-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const seed: PersonalitySeed = {
    id,
    name: partial?.name ?? "New figure",
    shortName: partial?.shortName ?? "New",
    roles: partial?.roles ?? ["Public figure"],
    country: partial?.country ?? "Unknown",
    coords: partial?.coords ?? { economic: 0, authority: 0, cultural: 0 },
    confidence: partial?.confidence ?? "low",
    tags: partial?.tags ?? ["draft"],
    summary: partial?.summary ?? "",
    rationale: partial?.rationale ?? "",
    sources: partial?.sources ?? [{ title: "Pending source" }],
    asOf: partial?.asOf ?? new Date().toISOString().slice(0, 10),
    status: "draft",
    evidence: [
      {
        id: `${id}-economic-draft`,
        axis: "economic",
        claim: "",
        sourceTitle: "",
        approved: false,
      },
      {
        id: `${id}-authority-draft`,
        axis: "authority",
        claim: "",
        sourceTitle: "",
        approved: false,
      },
      {
        id: `${id}-cultural-draft`,
        axis: "cultural",
        claim: "",
        sourceTitle: "",
        approved: false,
      },
    ],
  };
  return hydratePersonality(seed);
}

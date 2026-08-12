import type { EvidenceItem } from "@/lib/types";

export function EvidenceList({ items }: { items: EvidenceItem[] }) {
  if (!items.length) {
    return (
      <p className="text-sm text-[var(--muted)]">
        No on-topic posts scored in this window.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {items.map((e) => (
        <li
          key={e.activityId}
          className="border-b border-[var(--line)] pb-4 last:border-0"
        >
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-wider text-[var(--muted)]">
            <span>{e.kind}</span>
            <span>·</span>
            <span>{e.createdAt.slice(0, 10)}</span>
            {e.topics.map((t) => (
              <span
                key={t}
                className="rounded border border-[var(--line)] px-1.5 py-0.5 normal-case tracking-normal"
              >
                {t.replaceAll("_", " ")}
              </span>
            ))}
          </div>
          <p className="text-sm leading-relaxed text-[var(--ink)]">{e.text}</p>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
            <span>
              LR contrib{" "}
              <strong className="text-[var(--ink)]">
                {e.contributionLeftRight >= 0 ? "+" : ""}
                {e.contributionLeftRight}
              </strong>
            </span>
            <span>
              NI contrib{" "}
              <strong className="text-[var(--ink)]">
                {e.contributionNational >= 0 ? "+" : ""}
                {e.contributionNational}
              </strong>
            </span>
            {e.permalink ? (
              <a
                href={e.permalink}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--brass)] hover:underline"
              >
                permalink
              </a>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  );
}

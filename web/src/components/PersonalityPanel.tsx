"use client";

import type { Personality } from "@/data/personalities";
import { axisLabels } from "@/lib/scoring";

export function PersonalityPanel({
  person,
  similarity,
  onClose,
}: {
  person: Personality;
  similarity?: number;
  onClose?: () => void;
}) {
  const labels = axisLabels(person.coords);
  return (
    <aside className="dossier">
      <div className="dossier-top">
        <div>
          <p className="eyebrow">{person.country}</p>
          <h2>{person.name}</h2>
          <p className="roles">{person.roles.join(" · ")}</p>
        </div>
        {onClose && (
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        )}
      </div>

      {similarity != null && (
        <p className="similarity-pill">{similarity}% alignment with you</p>
      )}

      <p className="summary">{person.summary}</p>

      <dl className="coord-grid">
        <div>
          <dt>Economic</dt>
          <dd>
            {person.coords.economic > 0 ? "+" : ""}
            {person.coords.economic}
            <span>{labels.economic}</span>
          </dd>
        </div>
        <div>
          <dt>Authority</dt>
          <dd>
            {person.coords.authority > 0 ? "+" : ""}
            {person.coords.authority}
            <span>{labels.authority}</span>
          </dd>
        </div>
        <div>
          <dt>Cultural</dt>
          <dd>
            {person.coords.cultural > 0 ? "+" : ""}
            {person.coords.cultural}
            <span>{labels.cultural}</span>
          </dd>
        </div>
      </dl>

      <p className="confidence">
        Confidence: <strong>{person.confidence}</strong> · Updated {person.asOf}
      </p>

      <div className="tag-row">
        {person.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>

      <h3>Why here</h3>
      <p className="rationale">{person.rationale}</p>

      <h3>Public signals</h3>
      <ul className="sources">
        {person.sources.map((s) => (
          <li key={s.title}>
            {s.url ? (
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
            ) : (
              s.title
            )}
          </li>
        ))}
      </ul>
    </aside>
  );
}

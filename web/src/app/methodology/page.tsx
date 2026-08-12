import Link from "next/link";
import {
  adversaryAlignedPole,
  axisLabels,
  leftPole,
  nationalPole,
  notAdversaryAlignedExclusions,
  rightPole,
  LEXICON_PACK,
  METHODOLOGY_VERSION,
  PRODUCT_NAME,
  REFERENCE_NATION,
} from "@/data/definitions";
import { DISCLAIMERS, SHORT_DISCLAIMER } from "@/data/disclaimers";
import { AUTHORSHIP_WEIGHTS, TOPIC_ROUTES } from "@/data/signals";
import { FALSE_FRIENDS, LEXICON_AS_OF } from "@/data/lexicon/india-v1";

function PoleBlock({
  title,
  summary,
  parameters,
}: {
  title: string;
  summary: string;
  parameters: { name: string; signals: string }[];
}) {
  return (
    <section className="mt-8">
      <h3 className="font-display text-xl font-semibold text-[var(--brass)]">
        {title}
      </h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{summary}</p>
      <ul className="mt-4 space-y-3">
        {parameters.map((p) => (
          <li key={p.name}>
            <p className="text-sm font-medium text-[var(--ink)]">{p.name}</p>
            <p className="text-sm text-[var(--muted)]">{p.signals}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function MethodologyPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-20 pt-4 sm:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        Methodology · {METHODOLOGY_VERSION} · {LEXICON_PACK} · {REFERENCE_NATION}
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
        How {PRODUCT_NAME} scores a handle
      </h1>
      <p className="mt-4 text-[var(--muted)]">
        No survey. Public X activity is classified into topics, stance-scored on
        two axes, weighted by authorship strength, then aggregated with
        confidence and evidence.
      </p>
      <p className="mt-3 text-sm text-[var(--muted)]">{SHORT_DISCLAIMER}</p>
      <p className="mt-2 text-sm">
        <Link href="/disclaimers" className="text-[var(--brass)] hover:underline">
          Full disclaimers
        </Link>
      </p>

      <section className="mt-10 rounded-md border border-[var(--line)] bg-black/20 p-5">
        <h2 className="font-display text-xl font-semibold">Key disclaimers</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
          {DISCLAIMERS.slice(0, 6).map((d) => (
            <li key={d.id}>
              <strong className="text-[var(--ink)]">{d.title}.</strong> {d.body}
            </li>
          ))}
        </ul>
      </section>

      <h2 className="mt-12 font-display text-2xl font-semibold">
        {axisLabels.leftRight.title}
      </h2>
      <PoleBlock
        title={`${leftPole.label} (−100)`}
        summary={leftPole.summary}
        parameters={leftPole.parameters}
      />
      <PoleBlock
        title={`${rightPole.label} (+100)`}
        summary={rightPole.summary}
        parameters={rightPole.parameters}
      />

      <h2 className="mt-12 font-display text-2xl font-semibold">
        {axisLabels.nationalInterest.title}
      </h2>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Internal codes:{" "}
        <code className="text-[var(--ink)]">national_interest</code> ↔{" "}
        <code className="text-[var(--ink)]">adversary_aligned</code>. Lexicon as
        of {LEXICON_AS_OF}. These are operational pattern labels — not loyalty
        verdicts.
      </p>
      <PoleBlock
        title={`${nationalPole.label} (+100)`}
        summary={nationalPole.summary}
        parameters={nationalPole.parameters}
      />
      <PoleBlock
        title={`${adversaryAlignedPole.label} (−100)`}
        summary={adversaryAlignedPole.summary}
        parameters={adversaryAlignedPole.parameters}
      />

      <section className="mt-10">
        <h3 className="font-display text-xl font-semibold">
          Not Adversary-Aligned by itself
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
          {notAdversaryAlignedExclusions.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Signal weights</h2>
        <table className="mt-4 w-full text-left text-sm">
          <thead>
            <tr className="text-[var(--muted)]">
              <th className="py-2 font-medium">Activity</th>
              <th className="py-2 font-medium">Weight</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(AUTHORSHIP_WEIGHTS).map(([k, v]) => (
              <tr key={k} className="border-t border-[var(--line)]">
                <td className="py-2 capitalize">{k}</td>
                <td className="py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Own-post engagement scales weight by a 0.5–1.5 multiplier.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Topic routing</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {Object.values(TOPIC_ROUTES).map((r) => (
            <li key={r.id} className="border-t border-[var(--line)] pt-3">
              <p className="font-medium text-[var(--ink)]">{r.label}</p>
              <p className="text-[var(--muted)]">
                Primary: {r.primaryAxis ?? "none (low weight)"} · route weight{" "}
                {r.routeWeight}
              </p>
              <p className="text-[var(--muted)]">{r.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">False friends</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          These patterns alone do not move the blocked axis.
        </p>
        <ul className="mt-4 space-y-3 text-sm">
          {FALSE_FRIENDS.map((f) => (
            <li key={f.pattern} className="border-t border-[var(--line)] pt-3">
              <p className="font-medium text-[var(--ink)]">“{f.pattern}”</p>
              <p className="text-[var(--muted)]">
                Blocks {f.blockAxis}: {f.reason}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Composite</h2>
        <pre className="mt-4 overflow-x-auto rounded-md border border-[var(--line)] bg-black/30 p-4 text-xs text-[var(--ink)]">
{`LR = clamp(100 × Σ(wᵢ × stance_LRᵢ) / Σ|wᵢ|, −100, 100)
NI = clamp(100 × Σ(wᵢ × stance_NIᵢ) / Σ|wᵢ|, −100, 100)
confidence = f(n_scored, topic_coverage, time_span, bot_risk)`}
        </pre>
      </section>

      <p className="mt-12 text-sm">
        <Link href="/" className="text-[var(--brass)] hover:underline">
          ← Back to measure
        </Link>
      </p>
    </article>
  );
}

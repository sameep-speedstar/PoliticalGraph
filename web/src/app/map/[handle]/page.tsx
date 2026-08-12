import Link from "next/link";
import { AxisPlot } from "@/components/AxisPlot";
import { EvidenceList } from "@/components/EvidenceList";
import { HandleForm } from "@/components/HandleForm";
import { ShareCard } from "@/components/ShareCard";
import { DEMO_HANDLES, findDemoHandle } from "@/data/demo-handles";
import { SHORT_DISCLAIMER } from "@/data/disclaimers";
import { scoreHandleActivities } from "@/lib/score";

type Props = {
  params: Promise<{ handle: string }>;
};

export function generateStaticParams() {
  return DEMO_HANDLES.map((d) => ({ handle: d.handle }));
}

/** Only prebuilt demo handles in static export; others show fallback via client nav rare. */
export const dynamicParams = false;

export default async function MapPage({ params }: Props) {
  const { handle: raw } = await params;
  const handle = decodeURIComponent(raw).replace(/^@/, "").toLowerCase();
  const demo = findDemoHandle(handle);

  if (!demo) {
    return (
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8">
        <h1 className="font-display text-3xl font-bold">@{handle}</h1>
        <p className="mt-4 max-w-xl text-[var(--muted)]">
          Live X ingest is not configured in this build. Use a demo handle, or
          add an ingest adapter later.
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">{SHORT_DISCLAIMER}</p>
        <div className="mt-8">
          <HandleForm initial={handle} />
        </div>
        <p className="mt-6 text-sm">
          <Link href="/methodology" className="text-[var(--brass)] hover:underline">
            Read methodology
          </Link>
          {" · "}
          <Link href="/disclaimers" className="text-[var(--brass)] hover:underline">
            Disclaimers
          </Link>
        </p>
      </div>
    );
  }

  const result = scoreHandleActivities({
    handle: demo.handle,
    displayName: demo.displayName,
    activities: demo.activities,
    source: "demo",
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 pb-16 pt-4 sm:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Mapped handle
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight">
            @{result.handle}
          </h1>
          {result.displayName ? (
            <p className="mt-1 text-[var(--muted)]">{result.displayName}</p>
          ) : null}
        </div>
        <div className="text-sm text-[var(--muted)]">
          as of {result.asOf} · {result.lexiconPack} · confidence{" "}
          <span className="text-[var(--brass)]">{result.confidence.label}</span>{" "}
          ({result.confidence.overall})
        </div>
      </div>

      <p className="mt-6 max-w-2xl text-[var(--ink)]">{result.summary}</p>
      <p className="mt-2 text-sm text-[var(--brass)]">{result.quadrant}</p>
      <p className="mt-3 max-w-2xl text-xs text-[var(--muted)]">
        {SHORT_DISCLAIMER}{" "}
        <Link href="/methodology" className="text-[var(--brass)] hover:underline">
          Methodology
        </Link>
        {" · "}
        <Link href="/disclaimers" className="text-[var(--brass)] hover:underline">
          Disclaimers
        </Link>
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <AxisPlot coords={result.coords} handle={result.handle} />
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                Left ↔ Right
              </p>
              <p className="font-display text-3xl font-bold">
                {result.coords.leftRight > 0 ? "+" : ""}
                {result.coords.leftRight}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {result.axes.leftRight.nItems} scored items
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">
                National ↔ Adversary-Aligned
              </p>
              <p className="font-display text-3xl font-bold">
                {result.coords.nationalInterest > 0 ? "+" : ""}
                {result.coords.nationalInterest}
              </p>
              <p className="text-xs text-[var(--muted)]">
                {result.axes.nationalInterest.nItems} scored items
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-display text-2xl font-semibold">Evidence</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Top weighted contributions from {result.scoredCount} of{" "}
            {result.activityCount} activities ({result.source}). Calculations are
            evidence-backed — inspect items below.
          </p>
          <div className="mt-6">
            <EvidenceList items={result.evidence} />
          </div>
        </div>
      </div>

      <section className="mt-12 border-t border-[var(--line)] pt-8">
        <h2 className="font-display text-2xl font-semibold">Share on X</h2>
        <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
          Download a screenshot card, then share on X with the evidence link.
          Sharing is optional; do not use results as a personal attack.
        </p>
        <div className="mt-6 max-w-md">
          <ShareCard result={result} />
        </div>
      </section>

      <div className="mt-12 border-t border-[var(--line)] pt-8">
        <h3 className="text-sm font-medium text-[var(--ink)]">Confidence notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-[var(--muted)]">
          {result.confidence.notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-[var(--muted)]">
          Bot risk {result.confidence.botRisk} · topic coverage{" "}
          {result.confidence.topicCoverage} · span {result.confidence.timeSpanDays}{" "}
          days · methodology {result.methodologyVersion}
        </p>
      </div>

      <div className="mt-10">
        <HandleForm />
      </div>
    </div>
  );
}

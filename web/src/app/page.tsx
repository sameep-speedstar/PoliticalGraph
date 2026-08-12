import Link from "next/link";
import { DISCLAIMERS, SHORT_DISCLAIMER } from "@/data/disclaimers";
import { HandleForm } from "@/components/HandleForm";
import { TrendingHandles } from "@/components/TrendingHandles";

export default function HomePage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col px-5 pb-20 pt-8 sm:px-8">
      <div className="flex min-h-[60vh] flex-col justify-center">
        <div className="max-w-3xl">
          <p className="animate-rise font-display text-5xl font-bold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-7xl">
            Stance
          </p>
          <h1 className="animate-rise-delay mt-5 max-w-2xl text-xl leading-snug text-[var(--ink)] sm:text-2xl">
            Drop an X handle. See Left↔Right and National↔Adversary-Aligned from
            public posts — evidence-backed, not a questionnaire.
          </h1>
          <p className="animate-rise-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            {SHORT_DISCLAIMER} Full method and exclusions are on the{" "}
            <Link href="/methodology" className="text-[var(--brass)] hover:underline">
              Methodology
            </Link>{" "}
            page. Results are cached with a last-measured timestamp.
          </p>
        </div>
        <div className="animate-rise-delay-2 mt-10">
          <HandleForm />
        </div>
      </div>

      <TrendingHandles />

      <section className="mt-16 max-w-3xl border-t border-[var(--line)] pt-10">
        <h2 className="font-display text-2xl font-semibold">Before you map</h2>
        <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
          {DISCLAIMERS.slice(0, 5).map((d) => (
            <li key={d.id}>
              <span className="font-medium text-[var(--ink)]">{d.title}.</span>{" "}
              {d.body}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <Link href="/disclaimers" className="text-[var(--brass)] hover:underline">
            All disclaimers →
          </Link>
        </p>
      </section>
    </div>
  );
}

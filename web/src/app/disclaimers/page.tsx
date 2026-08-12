import Link from "next/link";
import { PRODUCT_NAME } from "@/data/definitions";
import { DISCLAIMERS, SHORT_DISCLAIMER } from "@/data/disclaimers";

export default function DisclaimersPage() {
  return (
    <article className="mx-auto w-full max-w-3xl px-5 pb-20 pt-4 sm:px-8">
      <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
        Disclaimers
      </p>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">
        {PRODUCT_NAME} disclaimers
      </h1>
      <p className="mt-4 text-[var(--muted)]">{SHORT_DISCLAIMER}</p>

      <ol className="mt-10 space-y-8">
        {DISCLAIMERS.map((d, i) => (
          <li key={d.id}>
            <h2 className="font-display text-xl font-semibold">
              {i + 1}. {d.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
              {d.body}
            </p>
          </li>
        ))}
      </ol>

      <p className="mt-12 text-sm text-[var(--muted)]">
        By using Stance you acknowledge these limits. For method detail see{" "}
        <Link href="/methodology" className="text-[var(--brass)] hover:underline">
          Methodology
        </Link>
        .
      </p>
      <p className="mt-6 text-sm">
        <Link href="/" className="text-[var(--brass)] hover:underline">
          ← Back to measure
        </Link>
      </p>
    </article>
  );
}

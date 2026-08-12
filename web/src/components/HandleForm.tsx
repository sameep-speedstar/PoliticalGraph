"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";

const FIGURE_DEMOS = [
  { handle: "narendramodi", label: "Political · Right · National" },
  { handle: "rahulgandhi", label: "Political · Left · National" },
  { handle: "nsitharaman", label: "Economic · Right · National" },
  { handle: "rajnathsingh", label: "Political · Defence · National" },
  { handle: "anandmahindra", label: "Business · Markets · National" },
  { handle: "nandannilekani", label: "Business · Tech · National" },
];

const CALIBRATION = [
  { handle: "kabir_frontier", label: "Left · Adversary-Aligned" },
  { handle: "priya_audit", label: "Critic ≠ Adversary-Aligned" },
];

export function HandleForm({ initial }: { initial?: string }) {
  const router = useRouter();
  const [handle, setHandle] = useState(initial ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(raw: string) {
    const cleaned = raw.replace(/^@/, "").trim();
    if (!cleaned) {
      setError("Drop an X handle to measure.");
      return;
    }
    setError(null);
    startTransition(() => {
      router.push(`/map/${encodeURIComponent(cleaned)}`);
    });
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    submit(handle);
  }

  return (
    <div className="w-full max-w-2xl">
      <form
        id="measure"
        onSubmit={onSubmit}
        className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
      >
        <label className="sr-only" htmlFor="handle">
          X handle
        </label>
        <div className="flex flex-1 items-center rounded-md border border-[var(--line)] bg-black/25 px-3 focus-within:border-[var(--brass)]">
          <span className="select-none text-[var(--brass)]">@</span>
          <input
            id="handle"
            name="handle"
            autoComplete="off"
            spellCheck={false}
            placeholder="username"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full bg-transparent px-2 py-3 text-[var(--ink)] outline-none placeholder:text-[var(--muted)]"
          />
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-[var(--brass)] px-6 py-3 text-sm font-semibold text-[#1a1206] transition hover:brightness-110 disabled:opacity-60"
        >
          {pending ? "Mapping…" : "Map handle"}
        </button>
      </form>
      {error ? (
        <p className="mt-3 text-sm text-[var(--adversary)]">{error}</p>
      ) : null}

      <div className="mt-5">
        <span className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Public figures (interpretive demos)
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {FIGURE_DEMOS.map((d) => (
            <button
              key={d.handle}
              type="button"
              onClick={() => {
                setHandle(d.handle);
                submit(d.handle);
              }}
              className="rounded border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--brass)] hover:text-[var(--ink)]"
            >
              @{d.handle}
              <span className="ml-1 opacity-60">· {d.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <span className="text-xs uppercase tracking-wider text-[var(--muted)]">
          Calibration
        </span>
        <div className="mt-2 flex flex-wrap gap-2">
          {CALIBRATION.map((d) => (
            <button
              key={d.handle}
              type="button"
              onClick={() => {
                setHandle(d.handle);
                submit(d.handle);
              }}
              className="rounded border border-[var(--line)] px-2.5 py-1 text-xs text-[var(--muted)] transition hover:border-[var(--brass)] hover:text-[var(--ink)]"
            >
              @{d.handle}
              <span className="ml-1 opacity-60">· {d.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

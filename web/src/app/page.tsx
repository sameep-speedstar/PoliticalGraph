import { HandleForm } from "@/components/HandleForm";

export default function HomePage() {
  return (
    <div className="mx-auto flex min-h-[75vh] w-full max-w-6xl flex-col justify-center px-5 pb-20 pt-8 sm:px-8">
      <div className="max-w-3xl">
        <p className="animate-rise font-display text-5xl font-bold leading-[1.05] tracking-tight text-[var(--ink)] sm:text-7xl">
          XAxis
        </p>
        <h1 className="animate-rise-delay mt-5 max-w-2xl text-xl leading-snug text-[var(--ink)] sm:text-2xl">
          Drop an X handle. See Left↔Right and National↔Anti-National from
          public tweets — not a questionnaire.
        </h1>
        <p className="animate-rise-delay-2 mt-4 max-w-xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
          National means India-first on sovereignty, defense, and strategic
          alignments. Anti-National means adversary-aligned or
          sovereignty-weakening patterns — not ordinary dissent.
        </p>
      </div>
      <div className="animate-rise-delay-2 mt-10">
        <HandleForm />
      </div>
    </div>
  );
}

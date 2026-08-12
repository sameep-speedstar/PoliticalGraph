import { Suspense } from "react";
import { DEMO_HANDLES } from "@/data/demo-handles";
import { MapExplorer } from "@/components/MapExplorer";

type Props = {
  params: Promise<{ handle: string }>;
};

export function generateStaticParams() {
  return DEMO_HANDLES.map((d) => ({ handle: d.handle }));
}

/** Prebuilt demo routes; unknown handles are handled by Worker → /map/ shell. */
export const dynamicParams = false;

export default async function MapHandlePage({ params }: Props) {
  const { handle: raw } = await params;
  const handle = decodeURIComponent(raw).replace(/^@/, "").toLowerCase();

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-5 py-12 text-[var(--muted)]">
          Loading map…
        </div>
      }
    >
      <MapExplorer initialHandle={handle} />
    </Suspense>
  );
}

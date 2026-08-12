import { Suspense } from "react";
import { MapExplorer } from "@/components/MapExplorer";

/**
 * SPA shell for arbitrary handles.
 * Cloudflare Worker rewrites unknown /stance/map/:handle → this page (200),
 * so users never see a bare browser 404.
 */
export default function MapIndexPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-5 py-12 text-[var(--muted)]">
          Loading map…
        </div>
      }
    >
      <MapExplorer />
    </Suspense>
  );
}

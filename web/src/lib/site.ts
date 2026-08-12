/** Base path for kniq.ai/stance production builds. */
export function siteBasePath(): string {
  return (process.env.NEXT_PUBLIC_STANCE_BASE_PATH || "").replace(/\/$/, "");
}

/** Canonical public origin — apex; www redirects to apex and can drop query strings. */
export function siteOrigin(): string {
  return "https://kniq.ai";
}

export function absoluteStanceUrl(path = "/"): string {
  const base = siteBasePath();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${base}${p === "/" ? "" : p}`;
}

/**
 * Resolve Stance API paths. On kniq hosts always use apex so query strings
 * survive the www→apex redirect.
 */
export function stanceApiUrl(pathAndQuery: string): string {
  const pq = pathAndQuery.startsWith("/") ? pathAndQuery : `/${pathAndQuery}`;
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "www.kniq.ai" || host === "kniq.ai") {
      return `${siteOrigin()}/stance${pq}`;
    }
    if (host.endsWith(".workers.dev") || window.location.pathname.startsWith("/stance")) {
      return `/stance${pq}`;
    }
  }
  const base = siteBasePath();
  return `${base}${pq}`;
}

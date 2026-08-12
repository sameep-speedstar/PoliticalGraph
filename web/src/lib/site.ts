/** Base path for kniq.ai/stance production builds. */
export function siteBasePath(): string {
  return (process.env.NEXT_PUBLIC_STANCE_BASE_PATH || "").replace(/\/$/, "");
}

export function absoluteStanceUrl(path = "/"): string {
  const base = siteBasePath();
  const p = path.startsWith("/") ? path : `/${path}`;
  return `https://www.kniq.ai${base}${p === "/" ? "" : p}`;
}

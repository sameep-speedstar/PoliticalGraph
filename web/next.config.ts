import type { NextConfig } from "next";

/**
 * Production on kniq.ai uses basePath `/poligraph`.
 * Local/dev: leave unset (routes at `/`).
 *
 *   POLIGRAPH_BASE_PATH=/poligraph npm run build
 *   POLIGRAPH_EXPORT=1 POLIGRAPH_BASE_PATH=/poligraph npm run build  # static out/
 *
 * Note: `/api/geo` is omitted from static export; survey still works with manual locale.
 */
const basePath = process.env.POLIGRAPH_BASE_PATH?.replace(/\/$/, "") || "";
const staticExport = process.env.POLIGRAPH_EXPORT === "1";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  ...(staticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;

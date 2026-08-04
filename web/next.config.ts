import type { NextConfig } from "next";

/**
 * Production on kniq.ai uses basePath `/poligraph`.
 * Local/dev: leave unset (routes at `/`).
 *
 *   POLIGRAPH_BASE_PATH=/poligraph npm run build
 */
const basePath = process.env.POLIGRAPH_BASE_PATH?.replace(/\/$/, "") || "";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

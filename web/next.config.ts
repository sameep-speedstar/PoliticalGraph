import type { NextConfig } from "next";

/**
 * Production on kniq.ai uses basePath `/stance`.
 *
 *   STANCE_BASE_PATH=/stance npm run build
 *   STANCE_EXPORT=1 STANCE_BASE_PATH=/stance npm run build  # static out/
 */
const basePath = process.env.STANCE_BASE_PATH?.replace(/\/$/, "") || "";
const staticExport = process.env.STANCE_EXPORT === "1";

const nextConfig: NextConfig = {
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_STANCE_BASE_PATH: basePath,
  },
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

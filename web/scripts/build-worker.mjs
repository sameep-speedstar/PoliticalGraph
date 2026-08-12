/**
 * Bundle Worker (scoring + ingest + API) for Cloudflare deploy.
 */
import * as esbuild from "esbuild";
import { mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outfile = join(__dirname, "kniq-worker.bundle.js");

mkdirSync(__dirname, { recursive: true });

await esbuild.build({
  entryPoints: [join(__dirname, "../worker/index.ts")],
  bundle: true,
  platform: "browser",
  format: "esm",
  target: "es2022",
  outfile,
  logLevel: "info",
  alias: {
    "@": join(__dirname, "../src"),
  },
  conditions: ["worker", "browser", "import"],
  mainFields: ["module", "main"],
});

console.log("Wrote", outfile);

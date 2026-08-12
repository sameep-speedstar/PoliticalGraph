#!/usr/bin/env bash
# Deploy Stance to www.kniq.ai/stance WITHOUT wiping Poligraph.
#
# 1) Mirror live marketing + full /poligraph tree into a temp site
# 2) Build Stance static (basePath /stance)
# 3) Overlay ONLY /stance
# 4) Deploy Worker assets "kniqnew"
#
# Requires: CLOUDFLARE_API_TOKEN
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-bc4f133b1a6341e56c3b7041374e64b3}"
SITE="${KNIQ_SITE_DIR:-/tmp/kniq-site-stance}"
CFG="${KNIQ_DEPLOY_CFG:-/tmp/kniq-deploy-cfg-stance}"
MIRROR="${KNIQ_MIRROR_DIR:-/tmp/kniq-live-mirror}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "ERROR: Set CLOUDFLARE_API_TOKEN (Workers Scripts Edit on account $ACCOUNT_ID)" >&2
  exit 1
fi

echo "==> Building Stance static (/stance)…"
cd "$ROOT"
npm ci --prefer-offline
npm run build:kniq:static
test -f "$ROOT/out/index.html"

echo "==> Mirroring live kniq.ai (poligraph + marketing)…"
rm -rf "$MIRROR" "$SITE"
mkdir -p "$MIRROR" "$SITE"

python3 - <<'PY'
import re, sys, urllib.request
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT_LIVE = "https://kniq.ai"
OUT = Path("/tmp/kniq-live-mirror")
OUT.mkdir(parents=True, exist_ok=True)

seed = [
    f"{ROOT_LIVE}/",
    f"{ROOT_LIVE}/privacy/",
    f"{ROOT_LIVE}/blog/",
    f"{ROOT_LIVE}/poligraph/",
    f"{ROOT_LIVE}/sitemap.xml",
    f"{ROOT_LIVE}/robots.txt",
    f"{ROOT_LIVE}/og-image.png",
]
blog = [
    "what-is-a-claude-implementation-partner",
    "claude-vs-chatgpt-business-automation",
    "cost-to-build-ai-agent-on-claude",
]
seed += [f"{ROOT_LIVE}/blog/{s}" for s in blog]

visited = set()
queue = list(seed)
asset_re = re.compile(r"""(?:href|src)=["']([^"']+)["']""")

def local_path(url: str) -> Path:
    p = urlparse(url)
    path = p.path
    if path.endswith("/"):
        path = path + "index.html"
    elif not path.split("/")[-1].count("."):
        path = path.rstrip("/") + "/index.html"
    return OUT / path.lstrip("/")

def same_host(url: str) -> bool:
    host = urlparse(url).netloc
    return host in ("kniq.ai", "www.kniq.ai", "")

while queue:
    url = queue.pop(0)
    if url in visited:
        continue
    visited.add(url)
    if not same_host(url):
        continue
    # Only pull marketing + poligraph (never touch other experiments except listing)
    path = urlparse(url).path
    if path.startswith("/stance"):
        continue
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "kniq-stance-deploy/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = r.read()
            ctype = r.headers.get("Content-Type", "")
            final = r.geturl()
    except Exception as e:
        print(f"skip {url}: {e}", file=sys.stderr)
        continue
    dest = local_path(final if "kniq.ai" in final else url)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    print(f"got {final} -> {dest}")
    if "text/html" not in ctype and not final.endswith((".html", "/")):
        continue
    try:
        text = data.decode("utf-8", errors="ignore")
    except Exception:
        continue
    base = final
    for m in asset_re.finditer(text):
        href = m.group(1)
        if href.startswith("#") or href.startswith("mailto:") or href.startswith("javascript:"):
            continue
        absurl = urljoin(base, href)
        if not same_host(absurl):
            continue
        pth = urlparse(absurl).path
        # Follow poligraph deeply; marketing lightly
        if pth.startswith("/poligraph") or pth.startswith("/_next") or pth in ("/", "/privacy/", "/blog/") or pth.startswith("/blog/"):
            if absurl not in visited:
                queue.append(absurl.split("#")[0].split("?")[0])

print(f"mirrored {len(visited)} urls")
# Ensure poligraph index exists
poli = OUT / "poligraph" / "index.html"
if not poli.exists():
    sys.exit("FATAL: failed to mirror https://kniq.ai/poligraph/ — aborting to protect Poligraph")
print("poligraph index OK")
PY

# Copy mirror -> site
cp -a "$MIRROR"/. "$SITE"/

echo "==> Overlaying Stance at /stance (only)…"
rm -rf "$SITE/stance"
mkdir -p "$SITE/stance"
cp -a "$ROOT/out/." "$SITE/stance/"
test -f "$SITE/stance/index.html"
test -f "$SITE/poligraph/index.html"

python3 - <<PY
from pathlib import Path
site = Path("$SITE")
html = (site / "index.html").read_text(errors="ignore")
if "/stance/" not in html:
    # Insert once after Poligraph nav if present
    needle = 'href="/poligraph/">Poligraph</a>'
    if needle in html:
        html = html.replace(needle, needle + '<a href="/stance/">Stance</a>', 1)
    else:
        html = html.replace("</nav>", '<a href="/stance/">Stance</a></nav>', 1)
    (site / "index.html").write_text(html)

sm_path = site / "sitemap.xml"
if sm_path.exists():
    sm = sm_path.read_text(errors="ignore")
    if "stance" not in sm:
        sm = sm.replace(
            "</urlset>",
            """  <url>
    <loc>https://www.kniq.ai/stance/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>""",
        )
        sm_path.write_text(sm)
print("assembled OK")
PY

mkdir -p "$CFG"
echo "==> Bundling Worker (scorer + X ingest + API)…"
cd "$ROOT"
npm run build:worker
cp "$ROOT/scripts/kniq-worker.bundle.js" "$CFG/worker.js"
cp "$ROOT/worker/schema.sql" "$CFG/schema.sql"

cat > "$CFG/wrangler.toml" <<EOF
name = "kniqnew"
main = "worker.js"
compatibility_date = "2026-07-17"
account_id = "$ACCOUNT_ID"

[[d1_databases]]
binding = "DB"
database_name = "stance-cache"
database_id = "61b2d0ab-cee3-4966-8a79-80637b7d5ed6"

[assets]
directory = "$SITE"
binding = "ASSETS"
html_handling = "auto-trailing-slash"
not_found_handling = "none"
run_worker_first = ["/stance/api/*", "/stance/map/*"]
EOF

echo "==> Applying D1 schema…"
cd "$CFG"
npx --yes wrangler d1 execute stance-cache --remote --file=./schema.sql

echo "==> Preflight: poligraph + stance + map shell present"
ls -la "$SITE/poligraph/index.html" "$SITE/stance/index.html" "$SITE/stance/map/index.html"

echo "==> Deploying Worker + assets kniqnew…"
npx --yes wrangler deploy

echo ""
echo "Live Stance:    https://www.kniq.ai/stance/"
echo "API analyze:    https://www.kniq.ai/stance/api/analyze?handle=narendramodi"
echo "API trending:   https://www.kniq.ai/stance/api/trending"
echo "Check Poligraph https://www.kniq.ai/poligraph/  (must still 200)"
echo ""
echo "If live X ingest is needed, set secret:"
echo "  npx wrangler secret put X_BEARER_TOKEN"

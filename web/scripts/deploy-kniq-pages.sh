#!/usr/bin/env bash
# Deploy kniq.ai (Worker "kniqnew" + static assets) including Poligraph at /poligraph/.
# Requires: CLOUDFLARE_API_TOKEN (Workers Scripts Edit + account access)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-bc4f133b1a6341e56c3b7041374e64b3}"
SITE="${KNIQ_SITE_DIR:-/tmp/kniq-site}"
CFG="${KNIQ_DEPLOY_CFG:-/tmp/kniq-deploy-cfg}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN first" >&2
  exit 1
fi

echo "Building Poligraph static (/poligraph)…"
cd "$ROOT"
npm run build:kniq:static

echo "Assembling site at $SITE …"
mkdir -p "$SITE"
# Refresh marketing pages from live (safe baseline)
curl -sL https://kniq.ai/ -o "$SITE/index.html"
mkdir -p "$SITE/privacy" "$SITE/blog"
curl -sL https://kniq.ai/privacy/ -o "$SITE/privacy/index.html"
curl -sL https://kniq.ai/blog/ -o "$SITE/blog/index.html"
for slug in what-is-a-claude-implementation-partner claude-vs-chatgpt-business-automation cost-to-build-ai-agent-on-claude; do
  mkdir -p "$SITE/blog/$slug"
  curl -sL "https://kniq.ai/blog/$slug" -o "$SITE/blog/$slug/index.html"
done
curl -sL https://kniq.ai/og-image.png -o "$SITE/og-image.png"
curl -sL https://kniq.ai/sitemap.xml -o "$SITE/sitemap.xml"
curl -sL https://kniq.ai/robots.txt -o "$SITE/robots.txt"

rm -rf "$SITE/poligraph"
mkdir -p "$SITE/poligraph"
cp -a "$ROOT/out/." "$SITE/poligraph/"

python3 - <<PY
from pathlib import Path
site = Path("$SITE")
html = (site / "index.html").read_text()
html = html.replace('href="/blog/">Blog</a>', 'href="/blog/">Blog</a><a href="/poligraph/">Poligraph</a>')
html = html.replace('<a href="/poligraph/">Poligraph</a><a href="/poligraph/">Poligraph</a>', '<a href="/poligraph/">Poligraph</a>')
if "<!-- poligraph-nav -->" not in html:
    html = html.replace("</head>", "<!-- poligraph-nav -->\n</head>", 1)
(site / "index.html").write_text(html)
sm = (site / "sitemap.xml").read_text()
if "poligraph" not in sm:
    sm = sm.replace("</urlset>", """  <url>
    <loc>https://kniq.ai/poligraph/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>""")
    (site / "sitemap.xml").write_text(sm)
print("site assembled")
PY

mkdir -p "$CFG"
cat > "$CFG/wrangler.toml" <<EOF
name = "kniqnew"
compatibility_date = "2026-07-17"
account_id = "$ACCOUNT_ID"

[assets]
directory = "$SITE"
html_handling = "auto-trailing-slash"
not_found_handling = "none"
EOF

echo "Deploying Worker assets kniqnew…"
cd "$CFG"
npx wrangler deploy
echo "Live: https://kniq.ai/poligraph/"

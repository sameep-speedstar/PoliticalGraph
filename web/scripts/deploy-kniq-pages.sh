#!/usr/bin/env bash
# Deploy merged kniq site + Poligraph to Cloudflare Pages project kniqnew.
# Requires: CLOUDFLARE_API_TOKEN without IP allowlist blocking this machine.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ACCOUNT_ID="${CLOUDFLARE_ACCOUNT_ID:-bc4f133b1a6341e56c3b7041374e64b3}"
PROJECT="${CLOUDFLARE_PAGES_PROJECT:-kniqnew}"
SITE="${KNIQ_SITE_DIR:-/tmp/kniq-site}"

if [[ -z "${CLOUDFLARE_API_TOKEN:-}" ]]; then
  echo "Set CLOUDFLARE_API_TOKEN first" >&2
  exit 1
fi

echo "Building Poligraph static (/poligraph)…"
cd "$ROOT"
npm run build:kniq:static

echo "Refreshing merge directory $SITE …"
mkdir -p "$SITE/poligraph"
rm -rf "$SITE/poligraph"
mkdir -p "$SITE/poligraph"
cp -a "$ROOT/out/." "$SITE/poligraph/"

echo "Deploying to Pages project: $PROJECT"
cd "$SITE"
npx wrangler pages deploy . \
  --project-name="$PROJECT" \
  --branch=main \
  --commit-dirty=true \
  --commit-message="Deploy Poligraph under /poligraph"

echo "Done. Check https://kniq.ai/poligraph/"

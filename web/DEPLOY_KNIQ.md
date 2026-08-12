# Deploy Stance on kniq.ai

Target: **https://www.kniq.ai/stance** (and `kniq.ai/stance`).

## Deploy Stance only (preserve Poligraph)

```bash
export CLOUDFLARE_API_TOKEN='…'   # Workers Scripts Edit; allow this IP if filtered
export CLOUDFLARE_ACCOUNT_ID='bc4f133b1a6341e56c3b7041374e64b3'  # optional
cd web
./scripts/deploy-stance-kniq.sh
```

The script mirrors live `kniq.ai` (including `/poligraph`), overlays **only** `/stance`, then deploys Worker `kniqnew`. It aborts if Poligraph cannot be mirrored.

## X API cost (important)

X bills **pay-per-use** (~$0.005 per post read). Stance defaults to **1 page × 50 tweets** per fresh map (~$0.25 + user lookup). Cached maps cost **$0**.

Optional Worker vars:

- `STANCE_TIMELINE_MAX` (default `50`, max `100`)
- `STANCE_TIMELINE_PAGES` (default `1`, max `2`)
- `STANCE_CACHE_TTL_HOURS` (default `168`)

Avoid `refresh=1` / Re-measure unless needed — each refresh re-bills.

Smoke after deploy:

- https://www.kniq.ai/stance/
- https://www.kniq.ai/poligraph/  (must remain 200)

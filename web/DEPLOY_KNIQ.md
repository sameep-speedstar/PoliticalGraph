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

X bills **pay-per-use** (~$0.005 per post read). Stance uses **adaptive ingest**:

1. Fetch **20** tweets
2. Score immediately
3. Stop early if enough signal (≥8 scored + medium confidence, or strong dual-axis signal)
4. Otherwise fetch another batch up to **60** tweets max

Typical political handles often stop at **20** posts (~$0.10). Thin timelines may use 40–60.

Cached maps cost **$0**.

Optional Worker vars:

- `STANCE_ADAPTIVE_BATCH` (default `20`)
- `STANCE_ADAPTIVE_MAX` (default `60`)
- `STANCE_MIN_SCORED` (default `8`)
- `STANCE_MIN_CONFIDENCE` (default `40`)
- `STANCE_CACHE_TTL_HOURS` (default `168`)

Avoid `refresh=1` / Re-measure unless needed — each refresh re-bills.

Smoke after deploy:

- https://www.kniq.ai/stance/
- https://www.kniq.ai/poligraph/  (must remain 200)

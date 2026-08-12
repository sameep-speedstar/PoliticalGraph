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

1. Fetch **10** tweets
2. Score immediately
3. Stop early if enough signal (≥6 scored / dense hit-rate / dual-axis coverage)
4. Otherwise fetch another batch up to **30** tweets max

Typical political handles often stop at **10** posts (~$0.05). Thin timelines may use 20–30.

Cached maps cost **$0**.

**Engagement:** likes + retweets *received* on their own tweets/quotes scale weight. We do **not** currently ingest posts they liked, and pure retweets are excluded from the timeline pull (cost/noise).

Optional Worker vars:

- `STANCE_ADAPTIVE_BATCH` (default `10`)
- `STANCE_ADAPTIVE_MAX` (default `30`)
- `STANCE_MIN_SCORED` (default `6`)
- `STANCE_MIN_CONFIDENCE` (default `40`)
- `STANCE_CACHE_TTL_HOURS` (default `168`)

Avoid `refresh=1` / Re-measure unless needed — each refresh re-bills.

Smoke after deploy:

- https://www.kniq.ai/stance/
- https://www.kniq.ai/poligraph/  (must remain 200)

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

Smoke after deploy:

- https://www.kniq.ai/stance/
- https://www.kniq.ai/poligraph/  (must remain 200)

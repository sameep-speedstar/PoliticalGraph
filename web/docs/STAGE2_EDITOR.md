# Stage 2 — Trust editor

## What shipped

- **Publish gate:** each axis needs ≥1 approved evidence row before `published`
- **Schema:** `web/db/schema.sql` (D1/Postgres-ready)
- **Editor:** `/editor` (passphrase-gated), localStorage overlay + JSON export
- **Public atlas:** explore / compare / nearest neighbors use `publishedFigures()` only
- **Dossiers:** show approved evidence by axis

## Workflow (until D1)

1. Open https://kniq.ai/poligraph/editor/ (or local `/editor`)
2. Unlock with passphrase (`poligraph-edit` or `NEXT_PUBLIC_EDITOR_PASS`)
3. Edit coords + evidence → **Approve & publish**
4. **Export JSON** → merge into `src/data/personalities.ts` → redeploy

## Next

- Cloudflare D1 binding + Worker write API
- Real editor auth (not shared passphrase)
- Grow catalog toward 100 figures
- Optional “save map” consumer auth

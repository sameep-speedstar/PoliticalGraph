# Deploy Stance on kniq.ai

Target: **https://www.kniq.ai/stance** (and `kniq.ai/stance`).

## Build

```bash
cd web
npm ci

# Static HTML for Cloudflare Pages / folder merge
npm run build:kniq:static
# → copy `out/` contents into kniq site under /stance/

# OR Node server with basePath
npm run build:kniq
npm run start:kniq
```

## Hosting (same pattern as Poligraph)

### Merge into existing Pages project

Copy `web/out/*` into the kniq Pages project as `/stance/*`, then redeploy.

Or use a Worker / Bulk Redirect:

```
/stance/*  →  https://<stance-pages>.pages.dev/stance/:splat  200
/stance    →  https://<stance-pages>.pages.dev/stance          200
```

### KNIQ site edits

1. Nav / products: **Stance** → `/stance`
2. sitemap: `https://www.kniq.ai/stance`
3. Confirm GA4 fires on `/stance` paths

## Smoke test

- [ ] `/stance` hero + handle form + disclaimers
- [ ] `/stance/map/arjun_bharat/` scores + evidence + share card
- [ ] `/stance/methodology/` poles + formula
- [ ] `/stance/disclaimers/` full list
- [ ] Download screenshot + Share on X intent
- [ ] KNIQ crumb returns to `https://www.kniq.ai/`

## Notes

- Static export prebuilds demo handles only; live X ingest needs a server adapter later.
- Axis public labels: **National ↔ Adversary-Aligned**.
- Every surface includes experimental / not-a-personal-attack disclaimers.

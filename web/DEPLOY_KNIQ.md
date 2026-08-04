# Deploy Poligraph on kniq.ai

Target: `https://kniq.ai/poligraph` (and `www.kniq.ai/poligraph`).

## 1. Build with base path

```bash
cd web
npm ci

# Node server / Cloudflare Pages with Next adapter
npm run build:kniq

# OR static HTML drop-in for kniq Pages folder (no server)
npm run build:kniq:static
# → copy `out/` contents into kniq site under /poligraph/
```

## 2. Hosting options

### A. Merge into existing Pages project `kniqnew` (chosen for Stage 1.5)

```bash
export CLOUDFLARE_API_TOKEN='…'  # must allow this machine's IP
export CLOUDFLARE_ACCOUNT_ID='bc4f133b1a6341e56c3b7041374e64b3'
export CLOUDFLARE_PAGES_PROJECT='kniqnew'
cd web && ./scripts/deploy-kniq-pages.sh
```

Builds Poligraph static under `/poligraph`, merges with mirrored kniq pages, deploys to **kniqnew**.

If the token has **Client IP Address Filtering**, add the agent egress IP or remove the filter — otherwise Cloudflare returns `9109` / auth errors.

### B. Second Cloudflare Pages project + path rewrite

1. Create Pages project from this repo (`web/` as root, or monorepo setting).  
2. Build command: `POLIGRAPH_BASE_PATH=/poligraph npm run build`  
3. On the **kniq.ai** zone, add a Cloudflare Worker or Pages `_redirects` / Bulk Redirect proxy:

```
/poligraph/*  →  https://<poligraph-pages>.pages.dev/poligraph/:splat  200
/poligraph    →  https://<poligraph-pages>.pages.dev/poligraph          200
```

(Exact Worker script depends on whether the origin already includes `/poligraph` in paths — with `basePath` set, it does.)

### C. Static folder inside existing kniq Pages project (manual)

1. `npm run build:kniq:static`  
2. Copy `out/` into kniq site as `/poligraph/`.  
3. Redeploy kniq static site.

## 3. KNIQ site edits (Stage 1.5)

On the kniq marketing HTML:

1. Nav or products strip: link **Poligraph** → `/poligraph`  
2. Optional card under “What we build”: worldview atlas experiment  
3. `sitemap.xml` add:

```xml
<url>
  <loc>https://kniq.ai/poligraph</loc>
  <changefreq>weekly</changefreq>
  <priority>0.7</priority>
</url>
```

(plus survey/explore/compare/methodology)

4. Confirm GA4 property already on kniq fires on `/poligraph` paths once proxied on same domain.

## 4. Smoke test

- [ ] `/poligraph` hero + 3D  
- [ ] `/poligraph/survey` locale → complete → `/poligraph/results?r=…`  
- [ ] `/poligraph/explore` search Modi  
- [ ] `/poligraph/compare` Modi vs Trump  
- [ ] Mobile orbit/scroll  
- [ ] “KNIQ /” crumb returns to `https://kniq.ai/`  

## 5. Rollback

Remove Cloudflare rewrite; kniq marketing site unaffected. Poligraph origin can stay up for staging.

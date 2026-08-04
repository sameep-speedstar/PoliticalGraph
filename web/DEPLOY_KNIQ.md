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

### A. Second Cloudflare Pages project + path rewrite (recommended)

1. Create Pages project from this repo (`web/` as root, or monorepo setting).  
2. Build command: `POLIGRAPH_BASE_PATH=/poligraph npm run build`  
3. On the **kniq.ai** zone, add a Cloudflare Worker or Pages `_redirects` / Bulk Redirect proxy:

```
/poligraph/*  →  https://<poligraph-pages>.pages.dev/poligraph/:splat  200
/poligraph    →  https://<poligraph-pages>.pages.dev/poligraph          200
```

(Exact Worker script depends on whether the origin already includes `/poligraph` in paths — with `basePath` set, it does.)

### B. Static folder inside existing kniq Pages project

1. Enable `output: 'export'` in `next.config.ts` for the prod profile.  
2. Build with `POLIGRAPH_BASE_PATH=/poligraph`.  
3. Copy export output into kniq repo as `/poligraph/`.  
4. Redeploy kniq static site.

### C. Vercel origin behind Cloudflare proxy

Same as A, origin = Vercel deployment with `POLIGRAPH_BASE_PATH=/poligraph`.

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

# Poligraph — Stage-wise Delivery Plan

**Product:** Poligraph  
**Product identity (LOCKED):** Poligraph is **A** — public worldview atlas + optional opt-in research panel. **Not** a political/corporate data broker.  
**Host:** additional pages on [www.kniq.ai](https://www.kniq.ai) (canonical: `https://kniq.ai/poligraph`)  
**Parent brand:** KNIQ · Speedstar AI Labs  

kniq.ai today is a **static Cloudflare site** (marketing + `/blog/` + `/privacy/`). Poligraph ships as a **path-mounted Next app** under `/poligraph/*`, not a subdomain, so it stays inside the KNIQ property and SEO graph.

---

## URL map (target)

| Path | Purpose |
|------|---------|
| `/poligraph` | Product home / constellation |
| `/poligraph/survey` | Location-aware worldview survey |
| `/poligraph/results` | Fixed-3D placement + nearest figures |
| `/poligraph/explore` | Search public figures + dossiers |
| `/poligraph/compare` | Side-by-side figure (and you) compare |
| `/poligraph/methodology` | Trust / scoring / approval policy |
| `/poligraph/mockup` | Design-lock gallery (can unpublish later) |

KNIQ site chrome: “KNIQ” → `https://kniq.ai/` · product mark “Poligraph”.

---

## Deployment architecture (chosen)

```
Browser
  → kniq.ai (Cloudflare)
       ├─ / , /blog/* , /privacy/*     → existing static Pages project
       └─ /poligraph/*                 → Poligraph Next deployment
              (rewrite / Worker route / second Pages project)
```

**Build flag:** `POLIGRAPH_BASE_PATH=/poligraph` so asset + router prefixes match production. Local default: no basePath (`/`).

**Options (pick in Stage 1.5):**

1. **Preferred:** Cloudflare Worker / Pages reverse-proxy `kniq.ai/poligraph*` → Poligraph Pages/Vercel origin.  
2. **Static drop-in:** `next export` into `poligraph/` folder of the kniq static project (simplest ops; fine for client-side MVP).  
3. **Later:** fold kniq marketing + Poligraph into one Next monorepo.

Do **not** block Stage 1 product work on full kniq monorepo migration.

---

## Stages

### Stage 0 — Design lock ✅

- Name, fixed 3D, dynamic survey, human approval  
- Mockups + `DESIGN_LOCKED.md`

### Stage 1 — Public MVP on `/poligraph` (NOW)

**Goal:** Anyone on kniq.ai can take the survey, see the map, explore figures, compare two people.

| Deliverable | Status |
|-------------|--------|
| Brand Poligraph + KNIQ parent link | In progress |
| `basePath=/poligraph` ready | In progress |
| Survey (locale + affairs packs) | Done → polish |
| Results + 3D + nearest figures | Done |
| Explore + dossiers | Done |
| **Compare page** | Building |
| Methodology | Done |
| Delivery plan + kniq integration notes | This doc |
| ~16–30 seed figures (human-scored) | 16 seeded; expand in 1.b |
| Client-side only (no backend) | OK for Stage 1 |

**Exit criteria**

- `https://kniq.ai/poligraph` loads (or staging URL with basePath)  
- Survey → results share link works  
- Compare Modi vs Trump works  
- No score claims without methodology / confidence on figures  

### Stage 1.5 — Wire into kniq.ai production

| Deliverable |
|-------------|
| Cloudflare route `/poligraph*` → Poligraph deploy |
| Link from kniq homepage “What we build” / products strip |
| Sitemap + robots entries for `/poligraph` paths |
| GA4 events: `poligraph_survey_start`, `poligraph_survey_complete`, `poligraph_compare` |
| Soft launch (no paid push) |

### Stage 2 — Trust backend

| Deliverable |
|-------------|
| Postgres (+ optional pgvector) for figures, evidence, approvals |
| Editor UI: draft → human approve → publish |
| Evidence rows required per published dimension |
| Expand to **100** public figures |
| **Optional** consumer auth (save map) — survey stays guest-first |
| Coarse IP→country hint only (confirm/override); no constituency-from-IP |

### Stage 2.5 — Poligraph Insights (B2B, opt-in only)

| Deliverable |
|-------------|
| Separate Insights surface (not hidden in consumer funnel) |
| Opt-in research panel consent (explicit, withdrawable) |
| k-anonymous segment heatmaps + message tests |
| **Ban:** raw individual vector + PII export for microtargeting |
| See `STRATEGY_ASSUMPTIONS.md` |

### Stage 3 — AI-assisted research (still human-gated)

| Deliverable |
|-------------|
| Source ingest → chunk → signal extract → dimension draft |
| Confidence + rationale always stored |
| Current-affairs pack CMS (rotate by locale/`asOf`) |
| Adaptive survey (shorter path, same information) |

### Stage 4 — Living graph

| Deliverable |
|-------------|
| Organizations (parties, NGOs, foundations) |
| Timeline / vector drift |
| Cohort heatmaps (privacy-preserving) |
| Public read API |

---

## Stage 1 engineering checklist

- [x] Next.js app with survey / explore / results / methodology  
- [x] Locale packs (IN / US / EU / global)  
- [x] Compare UI on fixed 3D + dimension bars  
- [x] `POLIGRAPH_BASE_PATH` + kniq parent chrome  
- [x] `DELIVERY_PLAN.md` (this file)  
- [x] Staging deploy instructions for Cloudflare (`web/DEPLOY_KNIQ.md`)  
- [x] Seed figure pass → 30+ with evidence notes  
- [x] Share map + privacy page + local research-panel interest (opt-in)  
- [x] Explore role filters  

## Stage 1.5 ops checklist

- [ ] Create Poligraph Cloudflare Pages (or Vercel) project from `web/`  
- [ ] Add rewrite on kniq zone: `/poligraph*` → origin  
- [ ] Add nav/product card on kniq index  
- [ ] Update `sitemap.xml`  
- [ ] Smoke test mobile + desktop 3D  

**CLI status (2026-08-04):** Local `build:kniq` + `next start` verified — all `/poligraph/*` routes HTTP 200; browser QA passed (survey→results→explore→compare). **Blocked on deploy wire-up:** this agent environment only has `sameep-speedstar/PoliticalGraph` — no kniq site repo / Cloudflare API token. Need kniq repo access or CF credentials to finish Stage 1.5.

Local smoke:
```bash
cd web && npm run build:kniq && POLIGRAPH_BASE_PATH=/poligraph npx next start -p 3000
./scripts/smoke.sh http://127.0.0.1:3000/poligraph
```  

---

## Risks specific to kniq mount

| Risk | Mitigation |
|------|------------|
| Path/asset 404s under `/poligraph` | Always build with `POLIGRAPH_BASE_PATH=/poligraph` for prod |
| Brand clash (KNIQ dark terracotta vs Poligraph cool atlas) | Keep Poligraph visual system; share only parent nav crumb |
| Political product on consulting site | Frame as **KNIQ experiment / worldview atlas**; ethics copy on every page footer |
| Static host + WebGL | Client-only Canvas; graceful “loading constellation” fallback |

---

## Immediate next build (this PR)

1. Delivery plan (here)  
2. basePath + KNIQ chrome  
3. Compare page  
4. Deploy notes for Stage 1.5  

Then: Stage 1.5 production wire-up on the kniq Cloudflare zone.

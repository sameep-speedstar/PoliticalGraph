# Poligraph

**Understand how people think.**

Worldview mapping product — ships as pages on **[kniq.ai/poligraph](https://kniq.ai/poligraph)** (KNIQ · Speedstar AI Labs).

## Docs

| Doc | Purpose |
|-----|---------|
| [`STRATEGY_ASSUMPTIONS.md`](./STRATEGY_ASSUMPTIONS.md) | Challenge: auth, IP, campaign data thesis |
| [`DELIVERY_PLAN.md`](./DELIVERY_PLAN.md) | Stage-wise delivery + kniq mount |
| [`DESIGN_LOCKED.md`](./DESIGN_LOCKED.md) | Locked product decisions |
| [`web/DEPLOY_KNIQ.md`](./web/DEPLOY_KNIQ.md) | Cloudflare / path deploy steps |
| [`DESIGN_RECONCILIATION.md`](./DESIGN_RECONCILIATION.md) | Master-prompt vs MVP |

## Quick start (local)

```bash
cd web
npm install
npm run dev
```

## Production build (kniq path prefix)

```bash
cd web
npm run build:kniq
npm run start:kniq
```

Serves under `/poligraph/*`.

## Stage overview

1. **Stage 1** — Public MVP (survey, map, explore, compare) ← current  
2. **Stage 1.5** — Wire Cloudflare route + kniq nav/sitemap  
3. **Stage 2** — Evidence DB + human approval editor  
4. **Stage 3** — AI draft research (still gated)  
5. **Stage 4** — Organizations, timeline, API  

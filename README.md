# Stance

**Drop a handle. See the stance.**

Map **Left ↔ Right** and **National ↔ Adversary-Aligned** from public X activity — no survey. Ships at **[www.kniq.ai/stance](https://www.kniq.ai/stance)** (KNIQ · Speedstar AI Labs).

Experimental · public data · evidence-backed · not a personal attack or loyalty verdict. Methodology and full disclaimers are on the site.

## Docs

| Doc | Purpose |
|-----|---------|
| [`docs/METHODOLOGY.md`](./docs/METHODOLOGY.md) | Pole definitions, weights, composite formula |
| [`web/DEPLOY_KNIQ.md`](./web/DEPLOY_KNIQ.md) | Deploy under `/stance` on kniq.ai |

## Quick start

```bash
cd web
npm install
npm run dev
```

### Demo handles

| Handle | Expected |
|--------|----------|
| `@arjun_bharat` | Right · National |
| `@neha_republic` | Left · National |
| `@kabir_frontier` | Left · Adversary-Aligned |
| `@priya_audit` | Critic (dissent ≠ Adversary-Aligned) |

## Kniq production build

```bash
cd web
npm run build:kniq:static
# deploy `out/` to www.kniq.ai/stance
```

## Scripts

```bash
cd web
npm run selftest
npm run build
npm run lint
```
